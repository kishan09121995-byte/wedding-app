import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { Bell, Check, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Notification {
  id: number
  user_email: string
  title: string
  message: string
  type: 'assignment' | 'chat' | 'arrival' | 'event' | 'general'
  read: boolean
  related_id?: number
  related_type?: string
  created_at: string
}

export default function Notifications() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    loadNotifications()
    subscribeToNotifications()
  }, [user])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_email', user?.email)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotifications(data || [])
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel(`notifications:${user?.email}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_email=eq.${user?.email}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev])
          playNotificationSound()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==')
    audio.play().catch(() => {})
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      toast.success('Marked as read')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) throw error

      setNotifications((prev) => prev.filter((n) => n.id !== id))
      toast.success('Deleted')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_email', user?.email)
        .eq('read', false)

      if (error) throw error

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      toast.success('All marked as read')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const filteredNotifications = notifications.filter((n) =>
    filter === 'unread' ? !n.read : true
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  const typeColors: Record<string, string> = {
    assignment: 'bg-blue-100 text-blue-800',
    chat: 'bg-purple-100 text-purple-800',
    arrival: 'bg-green-100 text-green-800',
    event: 'bg-rose-100 text-rose-800',
    general: 'bg-gray-100 text-gray-800',
  }

  const typeIcons: Record<string, string> = {
    assignment: '📋',
    chat: '💬',
    arrival: '🚗',
    event: '🎉',
    general: '📢',
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-gold" />
            Notifications
          </h2>
          <p className="text-gray-600">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-rose-gold hover:bg-rose-gold/90 text-white rounded-lg text-sm transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
            filter === 'all'
              ? 'bg-rose-gold text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
            filter === 'unread'
              ? 'bg-rose-gold text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filter === 'unread'
              ? 'No unread notifications'
              : 'No notifications yet'}
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-l-4 transition ${
                notification.read
                  ? 'bg-gray-50 border-gray-300'
                  : 'bg-white border-rose-gold shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">
                      {typeIcons[notification.type] || '📌'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      typeColors[notification.type] || typeColors.general
                    }`}>
                      {notification.type.charAt(0).toUpperCase() +
                        notification.type.slice(1)}
                    </span>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-rose-gold rounded-full"></div>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-600"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
