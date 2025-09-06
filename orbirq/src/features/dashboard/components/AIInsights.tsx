import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';

interface AIInsightsProps {
  insights: {
    mainInsight: string;
    recommendations: string[];
    weakAreas: string[];
    strengths: string[];
    nextSteps: string[];
  };
}

export default function AIInsights({ insights }: AIInsightsProps) {
  return (
    <div className="space-y-6">
      {/* Main AI Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 rounded-2xl p-6 border border-purple-500/20 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="flex-shrink-0 p-3 bg-purple-500/20 rounded-xl"
          >
            <Brain className="h-8 w-8 text-purple-300" />
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xl font-bold text-white">
                🤖 Insight da IA
              </h3>
              <div className="px-2 py-1 bg-purple-500/20 rounded-full">
                <span className="text-xs text-purple-200 font-medium">Premium</span>
              </div>
            </div>

            <p className="text-purple-100 text-lg leading-relaxed mb-4">
              {insights.mainInsight}
            </p>

            <div className="flex flex-wrap gap-2">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Ver Plano de Estudo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-purple-400 text-purple-200 hover:bg-purple-500/10">
                Análise Detalhada
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-900 to-green-900 rounded-2xl p-6 border border-emerald-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-300" />
            </div>
            <h4 className="text-lg font-semibold text-white">💪 Seus Pontos Fortes</h4>
          </div>

          <ul className="space-y-3">
            {insights.strengths.map((strength, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-center gap-3 text-emerald-100"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0" />
                <span>{strength}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Areas for Improvement */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-orange-900 to-red-900 rounded-2xl p-6 border border-orange-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Target className="h-5 w-5 text-orange-300" />
            </div>
            <h4 className="text-lg font-semibold text-white">🎯 Áreas para Melhorar</h4>
          </div>

          <ul className="space-y-3">
            {insights.weakAreas.map((area, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-center gap-3 text-orange-100"
              >
                <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0" />
                <span>{area}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 border border-blue-500/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Lightbulb className="h-5 w-5 text-blue-300" />
          </div>
          <h4 className="text-lg font-semibold text-white">💡 Recomendações Personalizadas</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20"
            >
              <p className="text-blue-100">{recommendation}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
      >
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🚀 Próximos Passos
        </h4>

        <div className="space-y-3">
          {insights.nextSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <p className="text-gray-200">{step}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}