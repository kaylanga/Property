import React, { useState } from 'react';

export default function PropertyUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [features, setFeatures] = useState('');
  const [nearbyFacilities, setNearbyFacilities] = useState('');

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length < 5) {
      setError('Please select at least 5 pictures.');
      setSelectedFiles([]);
      return;
    }
    if (files.length > 100) {
      setError('You can upload a maximum of 100 pictures.');
      setSelectedFiles([]);
      return;
    }
    // TODO: Add quality check for images here if needed
    setSelectedFiles(files);
    setValidationResult(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Please select pictures to upload.');
      return;
    }
    if (!title || !description || !price || !propertyType || !address) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    selectedFiles.forEach((file, _index) => {
      formData.append('documents', file);
    });
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('property_type', propertyType);
    formData.append('address', address);
    formData.append('phone', phone);
    formData.append('features', features);
    formData.append('nearby_facilities', nearbyFacilities);

    try {
      const response = await fetch('/api/document-validation', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setValidationResult(data.validationResult);

        // Call AI auto-tag API with uploaded image URLs
        const imageUrls = data.validationResult?.uploadedImageUrls || [];
        if (imageUrls.length > 0) {
          const tagResponse = await fetch('/api/ai/auto-tag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrls }),
          });
          const tagData = await tagResponse.json();
          if (tagResponse.ok) {
            // Save tags to property record (this requires a property creation API or DB update)
            // For now, just log tags
            console.log('Auto-generated tags:', tagData.tags);
          }
        }

        // Reset form fields on success
        setTitle('');
        setDescription('');
        setPrice('');
        setPropertyType('');
        setAddress('');
        setPhone('');
        setFeatures('');
        setNearbyFacilities('');
        setSelectedFiles([]);
      } else {
        setError(data.error || 'Validation failed.');
      }
    } catch (_err) {
      setError('An error occurred during validation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Upload Property Document</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        onChange={handleFileChange}
        style={{ padding: '10px', fontSize: '16px' }}
      />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          type="text"
          placeholder="Property Type"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <textarea
          placeholder="Features (JSON format)"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <textarea
          placeholder="Nearby Facilities (comma separated)"
          value={nearbyFacilities}
          onChange={(e) => setNearbyFacilities(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '12px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Validating...' : 'Upload and Validate'}
        </button>
      </form>

      {validationResult && (
        <div
          style={{
            marginTop: '25px',
            padding: '15px',
            borderRadius: '6px',
            backgroundColor: '#d1fae5',
            color: '#065f46',
          }}
        >
          <p>{validationResult.message}</p>
          <p>Confidence: {(validationResult.confidence * 100).toFixed(2)}%</p>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: '25px',
            padding: '15px',
            borderRadius: '6px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
          }}
        >
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
