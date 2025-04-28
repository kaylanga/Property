'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import type { Property } from '../../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function PropertyAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      return data as Property[];
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(input, properties as Property[] || []);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string, properties: Property[]): string => {
    const input = userInput.toLowerCase();

    // Basic response patterns
    if (input.includes('hello') || input.includes('hi')) {
      return 'Hello! I can help you find properties and answer questions about real estate. What would you like to know?';
    }

    if (input.includes('price') || input.includes('cost')) {
      const avgPrice = properties.reduce((sum, p) => sum + p.price, 0) / properties.length;
      return `The average property price is $${avgPrice.toLocaleString()}. Would you like to see properties within a specific price range?`;
    }

    if (input.includes('location') || input.includes('where')) {
      const locations = Array.from(new Set(properties.map(p => p.location.city)));
      return `We have properties in ${locations.join(', ')}. Which location interests you?`;
    }

    if (input.includes('feature') || input.includes('amenity')) {
      return 'Our properties come with various features like bedrooms, bathrooms, parking, and furnished options. What specific features are you looking for?';
    }

    // Property recommendations based on user input
    const relevantProperties = properties.filter(property => {
      const searchString = `${property.title} ${property.description} ${property.location.city}`.toLowerCase();
      return searchString.includes(input);
    });

    if (relevantProperties.length > 0) {
      const property = relevantProperties[0];
      if (property && property.title && property.location && property.type && property.features) {
        return `I found a property that might interest you: ${property.title} in ${property.location.city}. It's a ${property.type} with ${property.features.bedrooms} bedrooms and ${property.features.bathrooms} bathrooms. Would you like to see more details?`;
      }
    }

    return "I'm not sure I understand. Could you please rephrase your question? I can help you with property searches, price information, locations, and features.";
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold">Property Assistant</h3>
        <p className="text-sm text-gray-500">Ask me anything about properties!</p>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 