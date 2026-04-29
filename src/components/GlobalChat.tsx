import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { Send, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react'
import { toast } from 'sonner'

interface ChatMessage {
  id: number
  sender: string
  message: string
  created_at: string
}

export default function GlobalChat() {
  const { user } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !isMinimized) {
      loadMessages()
    }
  }, [isOpen, isMinimized])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('assignment_id', 0)
        .order('created_at', { ascending: true })
        .limit(50)

      if (error) throw error
      setMessages(data || [])
    } catch (err: any) {
      console.error('Error loading messages:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            assignment_id: 0,
            sender: user?.email?.split('@')[0] || 'User',
            message: newMessage,
          },
        ])

      if (error) throw error

      setNewMessage('')
      loadMessages()
      toast.success('Message sent')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-rose-gold hover:bg-rose-gold/90 text-white rounded-full shadow-lg flex items-center justify-center transition z-40"
        title="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col transition-all z-50 ${
            isMinimized ? 'h-12' : 'h-96'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-rose-gold text-white flex items-center justify-between">
            <h3 className="font-semibold text-sm">Team Chat</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-rose-gold/80 rounded"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-rose-gold/80 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {loading ? (
                  <div className="text-center text-gray-500 text-sm">Loading...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm">
                    No messages yet. Start chatting!
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === user?.email?.split('@')[0]
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded text-sm ${
                          msg.sender === user?.email?.split('@')[0]
                            ? 'bg-rose-gold text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="font-semibold text-xs mb-1">{msg.sender}</p>
                        <p className="break-words">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type message..."
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-3 py-1 bg-rose-gold hover:bg-rose-gold/90 disabled:opacity-50 text-white rounded text-sm transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
