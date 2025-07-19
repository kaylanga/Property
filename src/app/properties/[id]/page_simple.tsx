'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1>Property Detail: {id}</h1>
      <p>This is a simple test page</p>
    </div>
  );
}
