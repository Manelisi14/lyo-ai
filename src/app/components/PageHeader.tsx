interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-white/10 px-6 py-5">
      <h1 className="text-2xl font-black mb-1">{title}</h1>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}