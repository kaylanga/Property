'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface ChatSystemProps {
  currentUserId: string;
  otherUserId: string;
  propertyId?: string;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({
  currentUserId,
  otherUserId,
  propertyId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        // Get chat ID or create a new one
        let chatId = '';
        const { data: existingChat, error: chatError } = await supabase
          .from('chats')
          .select('id')
          .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
          .or(`user1_id.eq.${otherUserId},user2_id.eq.${otherUserId}`)
          .single();
        
        if (chatError && chatError.code !== 'PGRST116') {
          throw chatError;
        }
        
        if (existingChat) {
          chatId = existingChat.id;
        } else {
          // Create new chat
          const { data: newChat, error: createError } = await supabase
            .from('chats')
            .insert({
              user1_id: currentUserId,
              user2_id: otherUserId,
              property_id: propertyId,
            })
            .select()
            .single();
          
          if (createError) throw createError;
          chatId = newChat.id;
        }
        
        // Fetch messages
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        setMessages(data || []);
        
        // Mark messages as read
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('chat_id', chatId)
          .eq('receiver_id', currentUserId)
          .eq('read', false);
        
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `chat_id=eq.${propertyId || ''}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [currentUserId, otherUserId, propertyId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      // Get chat ID
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .select('id')
        .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
        .or(`user1_id.eq.${otherUserId},user2_id.eq.${otherUserId}`)
        .single();
      
      if (chatError) throw chatError;
      
      // Send message
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chat.id,
          sender_id: currentUserId,
          receiver_id: otherUserId,
          content: newMessage,
        });
      
      if (error) throw error;
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>
      
      <div className="h-96 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs p-3 rounded-lg ${
                    message.sender_id === currentUserId 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}; 