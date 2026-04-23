import { Home, Laptop, Smartphone, Headphones, User } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Home, label: "Home" },
  { icon: Smartphone, label: "Phones" },
  { icon: Laptop, label: "Laptops" },
  { icon: Headphones, label: "Audio" },
  { icon: User, label: "Account" },
];

export const MobileDock = () => (
  <motion.nav
    initial={{ y: 80, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.6 }}
    className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
  >
    <div className="glass-strong rounded-full px-3 py-2 flex items-center gap-1">
      {items.map(({ icon: Icon, label }, i) => (
        <button key={label} aria-label={label}
          className={`elastic grid place-items-center h-11 w-11 rounded-full ${i === 0 ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  </motion.nav>
);
