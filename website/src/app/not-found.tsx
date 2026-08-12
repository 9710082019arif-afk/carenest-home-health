import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section">
      <div className="container-cn max-w-2xl text-center">
        <p className="eyebrow">404</p>
        <h1 className="text-4xl md:text-5xl mt-2">Page not found</h1>
        <p className="prose-cn mt-4">
          The page you requested does not exist or may have moved. Try one of these links:
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-gold">
            Home
          </Link>
          <Link href="/services" className="btn btn-outline">
            Services
          </Link>
          <Link href="/contact" className="btn btn-outline">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
