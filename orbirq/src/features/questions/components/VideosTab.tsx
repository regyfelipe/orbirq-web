import { motion } from "framer-motion";

export default function VideosTab({ links }: { links: string[] }) {
  return (
    <motion.ul
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 list-disc list-inside text-sm space-y-2"
    >
      {links.map((link, i) => (
        <li key={i}>
          <a
            href={link}
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            {link}
          </a>
        </li>
      ))}
    </motion.ul>
  );
}
