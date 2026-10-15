/** The Brinhildr logo, painted with the brand pink-to-orange gradient. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 bg-gradient-to-br from-[#ff8866] via-[#f35177] to-[#e2346f] ${className}`}
      style={{
        aspectRatio: "531 / 560",
        mask: "url(/union.svg) center / contain no-repeat",
        WebkitMask: "url(/union.svg) center / contain no-repeat",
      }}
    />
  );
}
