import { motion } from 'framer-motion';
import { Badge } from '../../../shared/components/ui/badge';

interface AchievementCardProps {
  icon: string;
  title: string;
  value: string | number;
  badge: string;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  description?: string;
}

export default function AchievementCard({
  icon,
  title,
  value,
  badge,
  color,
  description
}: AchievementCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
          glow: 'shadow-indigo-500/25',
          text: 'text-indigo-100'
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
          glow: 'shadow-emerald-500/25',
          text: 'text-emerald-100'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
          glow: 'shadow-amber-500/25',
          text: 'text-amber-100'
        };
      case 'danger':
        return {
          bg: 'bg-gradient-to-br from-red-500 to-pink-600',
          glow: 'shadow-red-500/25',
          text: 'text-red-100'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
          glow: 'shadow-cyan-500/25',
          text: 'text-cyan-100'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-500 to-slate-600',
          glow: 'shadow-gray-500/25',
          text: 'text-gray-100'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
      className={`
        relative p-6 rounded-2xl ${colors.bg} ${colors.glow}
        shadow-xl hover:shadow-2xl transition-all duration-300
        border border-white/10 backdrop-blur-sm
        overflow-hidden group cursor-pointer
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
      </div>

      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colors.bg} blur-xl -z-10`} />

      <div className="relative z-10">
        {/* Icon and Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl">{icon}</div>
          <Badge
            variant="secondary"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            {badge}
          </Badge>
        </div>

        {/* Title and Value */}
        <div className="space-y-2">
          <h3 className={`text-lg font-bold ${colors.text}`}>
            {title}
          </h3>
          <p className="text-3xl font-black text-white">
            {value}
          </p>
          {description && (
            <p className="text-sm text-white/80 mt-2">
              {description}
            </p>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>Progresso</span>
            <span>85%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-white h-2 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}