interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
  loading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-[#c6f432] hover:bg-[#b5ea22] text-black font-semibold shadow-[0_0_0_1px_rgba(198,244,50,0.15)]',
    danger: 'bg-rose-500 hover:bg-rose-400 text-white font-semibold',
    ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-300 border border-zinc-700',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`px-4 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
