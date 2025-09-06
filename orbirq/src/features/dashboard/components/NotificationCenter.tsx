import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Flame, Target, BookOpen, TrendingUp, Bell } from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: string;
  type: 'achievement' | 'streak' | 'goal' | 'milestone' | 'reminder';
  title: string;
  message: string;
  time: string;
  read?: boolean;
  actionUrl?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDismiss
}: {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  const getIcon = () => {
    switch (notification.type) {
      case 'achievement':
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 'streak':
        return <Flame className="h-5 w-5 text-orange-400" />;
      case 'goal':
        return <Target className="h-5 w-5 text-green-400" />;
      case 'milestone':
        return <TrendingUp className="h-5 w-5 text-blue-400" />;
      case 'reminder':
        return <BookOpen className="h-5 w-5 text-purple-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'achievement':
        return 'border-yellow-400/30';
      case 'streak':
        return 'border-orange-400/30';
      case 'goal':
        return 'border-green-400/30';
      case 'milestone':
        return 'border-blue-400/30';
      case 'reminder':
        return 'border-purple-400/30';
      default:
        return 'border-gray-400/30';
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.(notification.id);
    }, 300);
  };

  const handleMarkAsRead = () => {
    onMarkAsRead?.(notification.id);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className={`
            relative bg-gradient-to-r from-slate-800 to-slate-900
            border-l-4 ${getBorderColor()} rounded-lg p-4 shadow-lg
            hover:shadow-xl transition-all duration-200 cursor-pointer
            ${!notification.read ? 'ring-1 ring-blue-400/30' : ''}
          `}
          onClick={handleMarkAsRead}
        >
          {/* Unread Indicator */}
          {!notification.read && (
            <div className="absolute top-3 right-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          )}

          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 p-2 bg-slate-700/50 rounded-lg">
              {getIcon()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-300 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {notification.time}
                  </p>
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss();
                  }}
                  className="flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Button if URL exists */}
          {notification.actionUrl && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                Ver detalhes →
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onDismiss
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Notificações
          </h3>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>

        <button className="text-sm text-gray-400 hover:text-white transition-colors">
          Marcar todas como lidas
        </button>
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-400"
          >
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Você está em dia! 🎉</p>
            <p className="text-sm">Não há novas notificações</p>
          </motion.div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDismiss={onDismiss}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center pt-4"
        >
          <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
            Carregar mais notificações
          </button>
        </motion.div>
      )}
    </div>
  );
}