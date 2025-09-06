import { motion } from 'framer-motion';
import AchievementCard from './AchievementCard';

interface AchievementSystemProps {
  stats: {
    taxaAcertoGeral: number;
    tempoMedioRespostaSegundos: number;
    questoesRespondidas: number;
    sequenciaAtual: number;
    nivel: number;
  };
}

interface Achievement {
  icon: string;
  title: string;
  value: string | number;
  badge: string;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  description: string;
}

export default function AchievementSystem({ stats }: AchievementSystemProps) {
  // Calculate achievements count first
  const calculateAchievementsCount = () => {
    let count = 0;
    if (stats.taxaAcertoGeral >= 0.8) count++;
    if (stats.tempoMedioRespostaSegundos <= 60) count++;
    if (stats.sequenciaAtual >= 5) count++;
    if (stats.nivel >= 5) count++;
    if (stats.questoesRespondidas >= 100) count++;
    return count;
  };

  const achievements: Achievement[] = [
    {
      icon: "🎯",
      title: "Precisão",
      value: `${Math.round(stats.taxaAcertoGeral * 100)}%`,
      badge: stats.taxaAcertoGeral >= 0.9 ? "Sharpshooter" :
             stats.taxaAcertoGeral >= 0.8 ? "Marksman" : "Apprentice",
      color: stats.taxaAcertoGeral >= 0.85 ? 'success' as const :
             stats.taxaAcertoGeral >= 0.7 ? 'warning' as const : 'danger' as const,
      description: "Taxa de acerto geral"
    },
    {
      icon: "⚡",
      title: "Velocidade",
      value: `${Math.round(stats.tempoMedioRespostaSegundos)}s`,
      badge: stats.tempoMedioRespostaSegundos <= 30 ? "Lightning" :
             stats.tempoMedioRespostaSegundos <= 60 ? "Swift" : "Steady",
      color: stats.tempoMedioRespostaSegundos <= 45 ? 'warning' as const :
             stats.tempoMedioRespostaSegundos <= 90 ? 'success' as const : 'info' as const,
      description: "Tempo médio de resposta"
    },
    {
      icon: "🔥",
      title: "Sequência",
      value: stats.sequenciaAtual,
      badge: stats.sequenciaAtual >= 10 ? "Blaze" :
             stats.sequenciaAtual >= 5 ? "Fire" : "Spark",
      color: stats.sequenciaAtual >= 7 ? 'danger' as const :
             stats.sequenciaAtual >= 3 ? 'warning' as const : 'info' as const,
      description: "Dias consecutivos estudando"
    },
    {
      icon: "🌟",
      title: "Nível",
      value: stats.nivel,
      badge: stats.nivel >= 10 ? "Master" :
             stats.nivel >= 5 ? "Expert" : "Novice",
      color: stats.nivel >= 8 ? 'primary' as const :
             stats.nivel >= 4 ? 'success' as const : 'info' as const,
      description: "Nível de experiência"
    },
    {
      icon: "📚",
      title: "Questões",
      value: stats.questoesRespondidas,
      badge: stats.questoesRespondidas >= 1000 ? "Scholar" :
             stats.questoesRespondidas >= 500 ? "Student" : "Beginner",
      color: stats.questoesRespondidas >= 500 ? 'primary' as const :
             stats.questoesRespondidas >= 100 ? 'success' as const : 'info' as const,
      description: "Total de questões respondidas"
    },
    {
      icon: "🏆",
      title: "Conquistas",
      value: calculateAchievementsCount(),
      badge: "Achiever",
      color: 'primary' as const,
      description: "Conquistas desbloqueadas"
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          🏆 Suas Conquistas
        </h2>
        <p className="text-gray-400">
          Continue evoluindo e desbloqueie novas conquistas!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1 * index,
              type: "spring",
              stiffness: 100
            }}
          >
            <AchievementCard {...achievement} />
          </motion.div>
        ))}
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📊 Resumo de Progresso
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {Math.round(stats.taxaAcertoGeral * 100)}%
            </div>
            <div className="text-sm text-gray-400">Precisão</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {stats.sequenciaAtual}
            </div>
            <div className="text-sm text-gray-400">Sequência</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {stats.nivel}
            </div>
            <div className="text-sm text-gray-400">Nível</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {stats.questoesRespondidas}
            </div>
            <div className="text-sm text-gray-400">Questões</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}