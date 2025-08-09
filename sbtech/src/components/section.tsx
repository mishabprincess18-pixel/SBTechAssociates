"use client";
import { motion } from "framer-motion";
import React from "react";

type SectionProps = React.ComponentProps<typeof motion.section>;

export function Section({ children, className, ...rest }: SectionProps) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      {...rest}
    >
      {children}
    </motion.section>
  );
}