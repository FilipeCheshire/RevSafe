interface BrandLogoProps { className?: string; }

export function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-lg bg-white px-2.5 py-2 ${className}`}>
      <img src="/logoRev.png" alt="RevSafe" width={750} height={134} className="h-auto w-32 sm:w-36" />
    </span>
  );
}
