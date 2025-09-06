import { motion, AnimatePresence } from "framer-motion";

export default function ExplicacaoTab({ explicacao }: { explicacao: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="explicacao"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="mt-4 text-sm leading-relaxed"
      >
        <p>{explicacao}</p>
      </motion.div>
    </AnimatePresence>
  );
}
