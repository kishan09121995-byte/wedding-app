import { supabase } from '../lib/supabase'

export type NotificationType = 'assignment' | 'chat' | 'arrival' | 'event' | 'general'

export const useNotifications = () => {
  const sendNotification = async (
    userEmail: string,
    title: string,
    message: string,
    type: NotificationType = 'general',
    relatedId?: number,
    relatedType?: string
  ) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            user_email: userEmail,
            title,
            message,
            type,
            related_id: relatedId,
            related_type: relatedType,
            read: false,
          },
        ])

      if (error) throw error
      return true
    } catch (err) {
      console.error('Failed to send notification:', err)
      return false
    }
  }

  const sendToTeam = async (
    emails: string[],
    title: string,
    message: string,
    type: NotificationType = 'general',
    relatedId?: number,
    relatedType?: string
  ) => {
    try {
      const notifications = emails.map((email) => ({
        user_email: email,
        title,
        message,
        type,
        related_id: relatedId,
        related_type: relatedType,
        read: false,
      }))

      const { error } = await supabase
        .from('notifications')
        .insert(notifications)

      if (error) throw error
      return true
    } catch (err) {
      console.error('Failed to send team notification:', err)
      return false
    }
  }

  return { sendNotification, sendToTeam }
}
