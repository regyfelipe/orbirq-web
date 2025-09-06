import { motion } from "framer-motion";

export default function ReferenciasTab({ referencias }: { referencias: string[] }) {
  return (
    <motion.ul
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 list-disc list-inside text-sm space-y-1"
    >
      {referencias.map((ref, i) => (
        <li key={i} className="text-blue-600">
          {ref}
        </li>
      ))}
    </motion.ul>
  );
}
