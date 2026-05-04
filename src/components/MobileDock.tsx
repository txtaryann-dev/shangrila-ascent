import { Home, Laptop, Smartphone, Headphones, User, Camera } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Home, label: "Home", href: "#" },
  { icon: Smartphone, label: "Phones", href: "#ch-phones" },
  { icon: Laptop, label: "Laptops", href: "#ch-laptops" },
  { icon: Headphones, label: "Audio", href: "#ch-audio" },
  { icon: Camera, label: "Cameras", href: "#ch-cameras" },
  { icon: User, label: "Account", href: "#" },
];

export const MobileDock = () => (
  <motion.nav
    initial={{ y: 80, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.6 }}
    className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
  >
    <div className="glass-strong squircle rounded-full px-3 py-2 flex items-center gap-1">
      {items.map(({ icon: Icon, label, href }, i) => (
        <a key={label} href={href} aria-label={label}
          className={`elastic grid place-items-center h-11 w-11 rounded-full ${i === 0 ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  </motion.nav>
);
