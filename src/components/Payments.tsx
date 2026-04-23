import { motion } from "framer-motion";
import { CreditCard, Shield, Wallet } from "lucide-react";

const methods = [
  { name: "eSewa", color: "from-emerald-500 to-emerald-700", initials: "eS" },
  { name: "Khalti", color: "from-purple-600 to-purple-800", initials: "K" },
  { name: "IME Pay", color: "from-orange-500 to-rose-600", initials: "IME" },
  { name: "Connect IPS", color: "from-sky-500 to-blue-700", initials: "IPS" },
];

export const Payments = () => (
  <section className="relative py-24">
    <div className="container">
      <div className="glass-strong rounded-[2.5rem] p-8 md:p-14 grid lg:grid-cols-2 gap-10 items-center overflow-hidden relative">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          <p className="text-sm text-accent font-medium tracking-wider uppercase">Pay your way</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-2">Local wallets. Global trust.</h2>
          <p className="text-muted-foreground mt-4 max-w-md">
            Checkout with the wallets you already use every day. Bank-grade encryption and zero hidden fees.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Shield className="h-4 w-4 text-accent" /> PCI DSS</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><CreditCard className="h-4 w-4 text-accent" /> 3D Secure</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Wallet className="h-4 w-4 text-accent" /> EMI</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {methods.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -4, rotate: -1 }}
              className="glass rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${m.color} text-white grid place-items-center font-display font-bold text-sm`}>
                {m.initials}
              </div>
              <div className="font-medium">{m.name}</div>
              <div className="text-xs text-muted-foreground">Instant checkout</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
