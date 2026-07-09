type StatPillProps = {
  label: string;
  value: string;
};

export function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-full border border-amber-100 bg-white px-4 py-2 shadow-sm">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="ml-2 text-sm font-bold text-slate-800">{value}</span>
    </div>
  );
}
