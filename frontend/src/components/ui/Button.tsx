"use client";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function Button({ children, onClick, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={`bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded transition ${className}`}
    >
      {children}
    </button>
  );
}
