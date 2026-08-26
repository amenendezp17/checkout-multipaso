"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Stepper } from "@/components/Stepper";
import { CheckoutGuard } from "@/components/CheckoutGuard";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
      <CheckoutGuard />
      <Stepper />
      {/*
        Solo animación de entrada (sin <AnimatePresence>/exit): mantener el
        paso saliente montado durante su animación de salida hace que
        Framer Motion remonte el paso entrante ~250ms después de aterrizar
        en él, perdiendo lo que el usuario ya hubiera escrito. La entrada
        sigue dando la sensación de slide/fade pedida sin ese efecto
        secundario.
      */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
