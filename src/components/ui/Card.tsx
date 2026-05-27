interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-[#121212]/90 border border-zinc-800 rounded-2xl p-5 backdrop-blur supports-[backdrop-filter]:bg-[#121212]/70 ${className}`}
    >
      {children}
    </div>
  );
}
