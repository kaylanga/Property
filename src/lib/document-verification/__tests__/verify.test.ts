import { verifyDocument } from '../verify';
import * as faceDetection from '@tensorflow-models/face-detection';
import * as tf from '@tensorflow/tfjs-node';
import Tesseract from 'tesseract.js';

// Get the mocked modules (mocked globally in jest.setup.js)
const mockTesseract = Tesseract as jest.Mocked<typeof Tesseract>;
const mockFaceDetection = faceDetection as jest.Mocked<typeof faceDetection>;
const mockTf = tf as jest.Mocked<typeof tf>;

// Create mock face detector
const mockDetector = {
  estimateFaces: jest.fn(),
};

// Create mock tensor
const mockTensor = {
  dispose: jest.fn(),
};

describe('Document Verification', () => {
  // Sample buffer for testing (represents image data)
  const sampleBuffer = Buffer.from('fake-image-data');

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Tesseract OCR
    mockTesseract.recognize.mockResolvedValue({
      data: { text: 'PASSPORT\nJOHN DOE\n123456789' },
    } as any);
    
    // Mock face detector creation
    mockFaceDetection.createDetector.mockResolvedValue(mockDetector as any);
    
    // Mock tensor creation
    mockTf.node.decodeImage.mockReturnValue(mockTensor as any);
  });

  it('should verify a document with a face as matched', async () => {
    // Mock face detection to return a face
    mockDetector.estimateFaces.mockResolvedValue([
      {
        box: { xMin: 10, yMin: 10, width: 100, height: 100 },
        keypoints: [],
      },
    ] as any);

    const result = await verifyDocument(sampleBuffer);
    
    expect(result.faceMatched).toBe(true);
    expect(result.isValid).toBe(true);
    expect(result.extractedText).toBe('PASSPORT\nJOHN DOE\n123456789');
    expect(result.errors).toHaveLength(0);
    expect(mockTensor.dispose).toHaveBeenCalled();
  });

  it('should report no face for an image lacking a face', async () => {
    // Mock face detection to return no faces
    mockDetector.estimateFaces.mockResolvedValue([]);

    const result = await verifyDocument(sampleBuffer);
    
    expect(result.faceMatched).toBe(false);
    expect(result.errors).toContain('No face detected');
    expect(result.extractedText).toBe('PASSPORT\nJOHN DOE\n123456789');
    expect(mockTensor.dispose).toHaveBeenCalled();
  });

  it('should handle face detection errors gracefully', async () => {
    // Mock face detection to throw an error
    mockDetector.estimateFaces.mockRejectedValue(new Error('Face detection failed'));

    const result = await verifyDocument(sampleBuffer);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Error: Face detection failed');
    // Note: tensor disposal may not happen if face detection fails before the dispose call
  });

  it('should handle OCR errors gracefully', async () => {
    // Mock Tesseract to throw an error
    mockTesseract.recognize.mockRejectedValue(new Error('OCR failed'));

    const result = await verifyDocument(sampleBuffer);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Error: OCR failed');
  });

  it('should handle tensor creation errors gracefully', async () => {
    // Mock tensor creation to throw an error
    mockTf.node.decodeImage.mockImplementation(() => {
      throw new Error('Invalid image format');
    });

    const result = await verifyDocument(sampleBuffer);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Error: Invalid image format');
  });
});

