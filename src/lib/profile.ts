import { supabase } from "./supabase";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  target_role: string;
  current_skills: string;
  location: string;
  experience: string;
  employability_score: number;
  cv_score: number;
  profile_complete: number;
}

export async function getProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

export async function updateProfile(updates: Partial<Profile>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const upsertData = { id: user.id, ...updates };
  const { data, error } = await supabase
    .from("profiles")
    .upsert(upsertData, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return null;
  }

  return data;
}

export function calculateEmployabilityScore(profile: Partial<Profile>, cvScore: number): number {
  let score = 0;

  if (cvScore > 0) score += Math.round(cvScore * 0.4);
  if (profile.current_skills && profile.current_skills.length > 10) score += 20;
  if (profile.target_role) score += 10;
  if (profile.location) score += 5;
  if (profile.experience) score += 5;
  if (profile.full_name) score += 5;
  if (profile.email) score += 5;
  if (profile.current_skills && profile.current_skills.split(",").length >= 5) score += 10;

  return Math.min(score, 100);
}

export function calculateProfileComplete(profile: Partial<Profile>): number {
  const fields = [
    profile.full_name,
    profile.email,
    profile.target_role,
    profile.current_skills,
    profile.location,
    profile.experience,
  ];

  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}