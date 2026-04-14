"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: (e: any) => void | Promise<void>;
  className?: string;
};

export default function LoadingButton({
  children,
  href,
  onClick,
  className = "",
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: any) => {
    setLoading(true);
    try {
      await onClick?.(e);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const text = loading ? "..." : children;

  if (href) {
    return (
      <Link href={href} onClick={() => setLoading(true)} className={className}>
        {text}
      </Link>
    );
  }

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {text}
    </button>
  );
}
