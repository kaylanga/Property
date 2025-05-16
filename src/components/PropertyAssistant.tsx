'use client';

import { useState } from 'react';

export default function PropertyAssistant() {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add your AI integration here
    const response = `I received: ${message}`;

    setResponses((prev) => [...prev, message, response]);
    setMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Property Assistant</h2>
      <div className="h-64 overflow-y-auto mb-4">
        {responses.map((text, index) => (
          <div
            key={index}
            className={`p-3 mb-2 rounded-lg ${index % 2 === 0 ? 'bg-blue-50' : 'bg-gray-50'}`}
          >
            {text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
