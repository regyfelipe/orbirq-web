import { motion } from 'framer-motion';
import { Target, TrendingUp, Clock, BookOpen } from 'lucide-react';

interface GoalsSystemProps {
  goals: {
    semanal: { current: number; target: number };
    acerto: { current: number; target: number };
    tempo: { current: number; target: number };
  };
}

interface GoalCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'danger';
  reverse?: boolean; // For metrics where lower is better (like time)
}

function GoalCard({ title, current, target, unit, icon, color, reverse }: GoalCardProps) {
  const percentage = reverse
    ? Math.max(0, Math.min(100, ((target - current) / target) * 100))
    : Math.min(100, (current / target) * 100);

  const isCompleted = reverse ? current <= target : current >= target;

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-gradient-to-r from-indigo-500 to-purple-600',
          progress: 'bg-gradient-to-r from-indigo-400 to-purple-500',
          text: 'text-indigo-100'
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
          progress: 'bg-gradient-to-r from-emerald-400 to-teal-500',
          text: 'text-emerald-100'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-500 to-orange-600',
          progress: 'bg-gradient-to-r from-amber-400 to-orange-500',
          text: 'text-amber-100'
        };
      case 'danger':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-pink-600',
          progress: 'bg-gradient-to-r from-red-400 to-pink-500',
          text: 'text-red-100'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-slate-600',
          progress: 'bg-gradient-to-r from-gray-400 to-slate-500',
          text: 'text-gray-100'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`
        relative p-6 rounded-2xl ${colors.bg} shadow-xl hover:shadow-2xl
        border border-white/10 backdrop-blur-sm overflow-hidden group
        ${isCompleted ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
      `}
    >
      {/* Completion Badge */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold"
        >
          ✓ Meta Atingida!
        </motion.div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-sm text-white/70">
                {current} / {target} {unit}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Progresso</span>
            <span className="text-white font-medium">
              {Math.round(percentage)}%
            </span>
          </div>

          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-full ${colors.progress} rounded-full relative`}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </motion.div>
          </div>

          {/* Status Message */}
          <div className="text-center">
            <p className="text-sm text-white/80">
              {isCompleted ? (
                <span className="flex items-center justify-center gap-1">
                  🎉 <strong>Parabéns!</strong> Meta atingida!
                </span>
              ) : reverse ? (
                <span>
                  Faltam <strong>{Math.max(0, Math.round(current - target))}</strong> {unit} para atingir a meta
                </span>
              ) : (
                <span>
                  Faltam <strong>{Math.max(0, Math.round(target - current))}</strong> {unit} para atingir a meta
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GoalsSystem({ goals }: GoalsSystemProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          🎯 Suas Metas
        </h2>
        <p className="text-gray-400">
          Acompanhe seu progresso e alcance suas metas de estudo!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GoalCard
          title="Meta Semanal"
          current={goals.semanal.current}
          target={goals.semanal.target}
          unit="questões"
          icon={<BookOpen className="h-5 w-5 text-white" />}
          color="primary"
        />

        <GoalCard
          title="Taxa de Acerto"
          current={Math.round(goals.acerto.current * 100)}
          target={goals.acerto.target}
          unit="%"
          icon={<Target className="h-5 w-5 text-white" />}
          color="success"
        />

        <GoalCard
          title="Tempo Médio"
          current={goals.tempo.current}
          target={goals.tempo.target}
          unit="segundos"
          icon={<Clock className="h-5 w-5 text-white" />}
          color="warning"
          reverse={true}
        />
      </div>

      {/* Weekly Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            📈 Progresso Semanal
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {goals.semanal.current}
            </div>
            <div className="text-sm text-gray-400">Questões Hoje</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.round(goals.acerto.current * 100)}%
            </div>
            <div className="text-sm text-gray-400">Acerto Hoje</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {goals.tempo.current}s
            </div>
            <div className="text-sm text-gray-400">Tempo Médio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round((goals.semanal.current / goals.semanal.target) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Meta Semanal</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}