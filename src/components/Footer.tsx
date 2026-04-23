export const Footer = () => (
  <footer className="relative pt-20 pb-32 md:pb-12">
    <div className="container">
      <div className="grid md:grid-cols-4 gap-10 pb-10 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2 font-display font-bold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-background text-xs">SW</span>
            Shangrila World
          </div>
          <p className="text-sm text-muted-foreground mt-3 max-w-xs">Premium electronics, curated for Nepal. Innovation at the peak.</p>
        </div>
        {[
          { h: "Shop", l: ["Phones", "Laptops", "Audio", "Wearables", "Cameras"] },
          { h: "Support", l: ["Help Center", "Delivery", "Warranty", "Contact"] },
          { h: "Company", l: ["About", "Stores", "Careers", "Press"] },
        ].map(c => (
          <div key={c.h}>
            <h5 className="font-display font-semibold text-sm mb-4">{c.h}</h5>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {c.l.map(i => <li key={i}><a href="#" className="hover:text-foreground transition-colors">{i}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-6 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-muted-foreground">
        <p>© 2026 Shangrila World Pvt. Ltd. · Kathmandu, Nepal</p>
        <p>Crafted at 1,400m above sea level.</p>
      </div>
    </div>
  </footer>
);
