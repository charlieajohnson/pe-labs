import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell compact">
      <div className="draft-empty" style={{ minHeight: "60vh" }}>
        <div>
          <span className="eyebrow">404</span>
          <strong>This path has gone to seed.</strong>
          <p>
            The page does not exist, but the synthetic company universe is still
            intact.
          </p>
          <Link href="/" className="button secondary small">
            <ArrowLeft size={14} /> Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
