'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Property } from '@/types/property';
import { ArrowUpIcon as Send, ArrowPathIcon } from '@heroicons/react/24/outline';

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
  const abortControllerRef = useRef<AbortController>();

  const { data: properties, error } = useQuery({
    queryKey: ['assistant-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, location(*)');
      if (error) throw new Error(error.message);
      return data as Property[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: input,
        timestamp: new Date(),
      },
    ]);

    setInput('');
    setIsTyping(true);

    try {
      abortControllerRef.current = new AbortController();

      // Replace with actual AI API call
      const response = await generateAIResponse(input, properties || []);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I'm having trouble responding. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = async (
    userInput: string,
    properties: Property[]
  ): Promise<string> => {
    // Implement actual AI integration here
    const lowerInput = userInput.toLowerCase();

    // Price analysis
    if (/price|cost|worth|value/.test(lowerInput)) {
      if (properties.length === 0) return 'No property data available';

      const prices = properties.map((p) => p.pricing.listPrice);
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      const min = Math.min(...prices);
      const max = Math.max(...prices);

      return (
        `Property prices range from $${min.toLocaleString()} to $${max.toLocaleString()} ` +
        `with an average of $${avg.toLocaleString()}.`
      );
    }

    // Location analysis
    if (/location|where|place|city/.test(lowerInput)) {
      const locations = [
        ...new Set(
          properties.map((p) => `${p.location.city}, ${p.location.country}`)
        ),
      ];

      return `We have properties in ${locations.join(', ')}.`;
    }

    // Property recommendations
    const keywords = lowerInput.split(' ');
    const matches = properties.filter((property) =>
      keywords.some(
        (keyword) =>
          property.title.toLowerCase().includes(keyword) ||
          property.description.toLowerCase().includes(keyword) ||
          property.location.city.toLowerCase().includes(keyword)
      )
    );

    if (matches.length > 0) {
      const sample = matches[0];
      return (
        `I found ${matches.length} properties matching your query. For example: ` +
        `${sample.title} in ${sample.location.city} - $${sample.pricing.listPrice.toLocaleString()}`
      );
    }

    return (
      'I can help with property prices, locations, and features. ' +
      'Could you please clarify your question?'
    );
  };

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md bg-background rounded-xl shadow-2xl border">
      <div className="p-4 border-b bg-muted/50">
        <h3 className="font-semibold text-lg">Property Assistant</h3>
        <p className="text-sm text-muted-foreground">
          Ask about prices, locations, and features
        </p>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center justify-start space-x-2 text-muted-foreground">
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
            <span className="text-sm">Analyzing properties...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-muted/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about properties..."
            className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isTyping}
          />

          <button
            onClick={handleSendMessage}
            disabled={isTyping}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
