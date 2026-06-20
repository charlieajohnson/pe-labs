import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>PE Labs</strong>
          <p>Illustrative workflows. Synthetic data. Not investment advice.</p>
        </div>
        <div className="footer-links">
          <Link href="/companies">Company intelligence</Link>
          <Link href="/screening">Investment screening</Link>
          <Link href="/outreach">Email drafting</Link>
        </div>
      </div>
    </footer>
  );
}
