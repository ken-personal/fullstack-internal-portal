"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded shadow-lg p-6 min-w-[300px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
