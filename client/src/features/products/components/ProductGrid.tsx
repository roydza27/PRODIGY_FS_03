// features/products/components/ProductGrid.tsx
"use client";

import type { Product } from "../types/product.types";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

type Props = {
  products: Product[];
};

// Animation settings for the staggered grid entrance cascade
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Cascades card presentation subtly one-by-one
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
};

export default function ProductGrid({ products }: Props) {
  return (
    /* 1. Kept your exact column breaks but enforced 'auto-rows-fr'.
         This forces every card in the same horizontal row to scale to the exact same 
         height as its tallest neighbor, creating a perfectly flat uniform row layout grid.
    */
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid auto-rows-fr items-stretch gap-5 sm:grid-cols-2 2xl:grid-cols-3 overflow-visible"
    >
      {products.map((product) => (
        <motion.div 
          key={product._id} 
          variants={itemVariants}
          className="h-full overflow-visible"
          layout // Smoothly updates positions when filters or sorts alter the array sequence
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}