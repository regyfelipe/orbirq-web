import { motion } from "framer-motion";

type Estatisticas = {
  taxaAcerto: number;
  vezesRespondida: number;
  rating: number;
};

export default function AnalyticsTab({ estatisticas }: { estatisticas: Estatisticas }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 text-sm grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 shadow">
        Taxa de acerto: <strong>{estatisticas.taxaAcerto * 100}%</strong>
      </div>
      <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 shadow">
        Vezes respondida: <strong>{estatisticas.vezesRespondida}</strong>
      </div>
      <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 shadow">
        Rating: <strong>{estatisticas.rating}</strong>
      </div>
    </motion.div>
  );
}
