import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="brand-mark" aria-label="PE Labs home">
      <svg className="brand-symbol" viewBox="0 0 44 44" aria-hidden="true">
        <path d="M7 31.5c6.8-1.2 11.1-4.9 14.1-11.2 4.1 5.4 8.8 8.8 15.9 9.4" />
        <path d="M14.5 33.5c4.4-6.6 7.1-13.6 7.6-21 4.8 4.4 7.7 9.9 8.5 16.4" />
        <path d="M7 36h30" />
      </svg>
      <span className="brand-words">
        <strong>PE Labs</strong>
        <span>Applied AI for private equity</span>
      </span>
    </Link>
  );
}
