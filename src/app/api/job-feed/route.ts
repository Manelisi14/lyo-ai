import { NextRequest, NextResponse } from "next/server";

function calculateMatchScore(
  job: { title: string; description: string; category: string },
  profile: Record<string, string>
): number {
  if (!profile || !profile.current_skills) return 60;

  const skills = (profile.current_skills || "").toLowerCase().split(",").map((s: string) => s.trim());
  const targetRole = (profile.target_role || "").toLowerCase();
  const jobText = `${job.title} ${job.description} ${job.category}`.toLowerCase();

  let score = 50;

  // Check skills match
  skills.forEach((skill: string) => {
    if (skill && jobText.includes(skill)) score += 5;
  });

  // Check target role match
  if (targetRole && jobText.includes(targetRole)) score += 15;

  // Check location match
  const preferredLocation = (profile.preferred_location || profile.location || "").toLowerCase();
  if (preferredLocation && jobText.includes(preferredLocation)) score += 10;

  return Math.min(score, 99);
}

export async function POST(req: NextRequest) {
  try {
    const { profile, hasProfile } = await req.json();

    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    // Build search queries based on profile
    const searches = hasProfile && profile?.current_skills
      ? [
          profile.target_role || profile.current_skills.split(",")[0].trim(),
          "learnership",
          "graduate programme",
          "internship",
        ]
      : [
          "junior",
          "learnership",
          "graduate",
          "internship",
          "entry level",
        ];

    // Fetch jobs from multiple searches in parallel
    const results = await Promise.all(
      searches.map(async (query: string) => {
        const location = hasProfile && profile?.preferred_location
          ? `&where=${encodeURIComponent(profile.preferred_location)}`
          : "";

        const url = `https://api.adzuna.com/v1/api/jobs/za/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=5&what=${encodeURIComponent(query)}${location}&content-type=application/json`;

        try {
          const res = await fetch(url);
          const data = await res.json();
          return data.results || [];
        } catch {
          return [];
        }
      })
    );

    // Flatten and deduplicate
    const allJobs = results.flat();
    const seen = new Set();
    const unique = allJobs.filter((job: Record<string, string>) => {
      if (seen.has(job.id)) return false;
      seen.add(job.id);
      return true;
    });

    // Transform to our format
    const jobs = unique.map((job: Record<string, unknown>) => {
      const category = (job.category as Record<string, string>)?.label || "General";
      const location = (job.location as Record<string, string>)?.display_name || "South Africa";
      const company = (job.company as Record<string, string>)?.display_name || "Company";
      const title = job.title as string || "";
      const description = job.description as string || "";

      // Determine job type from title and description
      const titleLower = title.toLowerCase();
      const descLower = description.toLowerCase();
      let type = "Job";
      if (titleLower.includes("learnership") || descLower.includes("learnership")) type = "Learnership";
      else if (titleLower.includes("internship") || descLower.includes("internship")) type = "Internship";
      else if (titleLower.includes("graduate") || descLower.includes("graduate programme")) type = "Graduate Programme";
      else if (titleLower.includes("bursary") || descLower.includes("bursary")) type = "Bursary";

      const matchScore = calculateMatchScore(
        { title, description, category },
        profile || {}
      );

      // Format salary
      const salaryMin = job.salary_min as number;
      const salaryMax = job.salary_max as number;
      let salary = "";
      if (salaryMin && salaryMax) {
        salary = `R${Math.round(salaryMin / 1000)}k - R${Math.round(salaryMax / 1000)}k/yr`;
      } else if (salaryMin) {
        salary = `From R${Math.round(salaryMin / 1000)}k/yr`;
      }

      // Created date
      const created = job.created as string;
      const daysAgo = created
        ? Math.floor((Date.now() - new Date(created).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        id: job.id,
        title,
        company,
        location,
        type,
        industry: category,
        salary,
        description: description.slice(0, 300) + (description.length > 300 ? "..." : ""),
        fullDescription: description,
        requirements: [],
        closing_date: "",
        matchScore,
        applyUrl: job.redirect_url,
        isNew: daysAgo <= 7,
        seta: type === "Learnership" ? "SETA Learnership" : null,
        postedDaysAgo: daysAgo,
      };
    });

    // Sort by match score
    jobs.sort((a: { matchScore: number }, b: { matchScore: number }) => b.matchScore - a.matchScore);

    return NextResponse.json({ jobs });

  } catch (err) {
    console.error("Job feed error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}