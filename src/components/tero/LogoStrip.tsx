const logos = [
  "NETFLIX", "SAMSUNG", "NIKE", "TATA", "SWIGGY", "RAZORPAY",
  "ADIDAS", "FLIPKART", "ZOMATO", "MERCEDES", "UNILEVER", "ITC",
];

export function LogoStrip() {
  const list = [...logos, ...logos];
  return (
    <section className="border-y border-parchment bg-cream overflow-hidden">
      <div className="container-tero py-6 flex items-center gap-6">
        <p className="hidden md:block overline whitespace-nowrap">
          — Trusted by teams at
        </p>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex gap-14 animate-marquee whitespace-nowrap">
            {list.map((l, i) => (
              <span
                key={i}
                className="font-sans-display text-[18px] font-bold tracking-[0.15em] text-ink/40 hover:text-ink transition-colors"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
