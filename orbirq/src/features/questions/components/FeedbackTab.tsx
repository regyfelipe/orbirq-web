import { motion } from "framer-motion";
import FeedbackSection from "./FeedbackSection";

export default function FeedbackTab({
  questaoId,
  alunoId,
}: {
  questaoId: string;
  alunoId: string;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
      <FeedbackSection questaoId={questaoId} alunoId={alunoId} />
    </motion.div>
  );
}
