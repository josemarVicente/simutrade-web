interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'neutral';
}

export default function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    danger:  'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    neutral: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-md font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
