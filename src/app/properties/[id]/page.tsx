'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Property Detail: {id}</h1>
      <p className="text-gray-600">This is a simple test page to check if build works.</p>
    </div>
  );
}
