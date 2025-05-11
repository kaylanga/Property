"use client";

import React, { useState, useEffect, useRef } from "react";
import { Property } from "../../types/property";

interface VirtualTourViewerProps {
  property: Property;
}

export function VirtualTourViewer({ property }: VirtualTourViewerProps) {
  const [tourLoaded, setTourLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const tourUrl = property.media?.virtualTour?.url;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!fullscreen) {
      iframeRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!tourUrl) {
    return (
      <div className="relative h-[450px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg">
        <div className="text-center px-6">
          <svg
            className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 22V12h6v10"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Virtual Tour Not Available
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            This property doesn't have a virtual tour yet. Please check the
            photos or contact the agent for more information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`relative ${tourLoaded ? "" : "bg-gray-100 dark:bg-gray-800"} rounded-lg overflow-hidden h-[450px]`}
      >
        {!tourLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={tourUrl}
          className="w-full h-full border-0"
          allow="camera;microphone;accelerometer;gyroscope;magnetometer"
          allowFullScreen
          loading="lazy"
          onLoad={() => setTourLoaded(true)}
        />
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-black/70 text-white rounded-md hover:bg-black/90 transition-colors"
          aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {fullscreen ? (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
              />
            </svg>
          )}
        </button>

        <a
          href={tourUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-black/70 text-white rounded-md hover:bg-black/90 transition-colors"
          aria-label="Open in new tab"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>

      {/* Tour Instructions */}
      {tourLoaded && (
        <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <p className="text-sm">Use 🖱️ to look around or 👆 to interact</p>
        </div>
      )}
    </div>
  );
}
