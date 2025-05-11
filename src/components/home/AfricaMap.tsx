"use client";

import React from "react";
import { motion } from "framer-motion";

interface AfricaMapProps {
  activeCountry: string | null;
  onSelectCountry: (country: string) => void;
}

export function AfricaMap({ activeCountry, onSelectCountry }: AfricaMapProps) {
  // Simplified map data for major African countries
  const countries = [
    {
      id: "NG",
      name: "Nigeria",
      path: "M240,180 L250,200 L270,205 L280,220 L260,240 L240,235 L230,220 L220,190 Z",
      center: [250, 210],
    },
    {
      id: "KE",
      name: "Kenya",
      path: "M320,220 L340,230 L335,250 L320,260 L310,250 L305,235 L310,225 Z",
      center: [320, 240],
    },
    {
      id: "UG",
      name: "Uganda",
      path: "M300,225 L310,225 L305,235 L310,250 L300,245 L290,235 L295,225 Z",
      center: [300, 235],
    },
    {
      id: "TZ",
      name: "Tanzania",
      path: "M310,250 L320,260 L330,270 L320,285 L300,280 L290,265 L300,245 Z",
      center: [310, 265],
    },
    {
      id: "GH",
      name: "Ghana",
      path: "M210,210 L220,210 L225,230 L215,240 L205,235 L200,220 Z",
      center: [210, 225],
    },
    {
      id: "ZA",
      name: "South Africa",
      path: "M270,330 L290,320 L315,330 L330,350 L310,370 L280,365 L260,350 L265,335 Z",
      center: [295, 345],
    },
    {
      id: "EG",
      name: "Egypt",
      path: "M290,120 L320,130 L330,150 L320,170 L290,170 L270,160 L280,140 Z",
      center: [300, 145],
    },
    {
      id: "MA",
      name: "Morocco",
      path: "M180,120 L210,130 L220,150 L200,170 L180,165 L170,150 L175,130 Z",
      center: [190, 145],
    },
  ];

  return (
    <div className="relative w-full">
      <svg viewBox="150 100 250 300" className="w-full h-auto">
        {/* Africa outline - simplified */}
        <path
          d="M180,120 Q350,150 330,350 Q240,400 260,200 Q200,150 180,120 Z"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />

        {/* Countries */}
        {countries.map((country) => (
          <motion.path
            key={country.id}
            d={country.path}
            fill={
              activeCountry === country.name
                ? "rgba(234,179,8,0.8)"
                : "rgba(255,255,255,0.2)"
            }
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
            onClick={() => onSelectCountry(country.name)}
            whileHover={{
              fill: "rgba(234,179,8,0.6)",
              cursor: "pointer",
              transition: { duration: 0.3 },
            }}
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{
              scale: activeCountry === country.name ? 1.05 : 1,
              opacity: activeCountry === country.name ? 1 : 0.7,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}

        {/* Country labels */}
        {countries.map((country) => (
          <g key={`label-${country.id}`}>
            <circle
              cx={country.center[0]}
              cy={country.center[1]}
              r="3"
              fill={activeCountry === country.name ? "#EAB308" : "white"}
            />
            {activeCountry === country.name && (
              <text
                x={country.center[0]}
                y={country.center[1] - 10}
                fontSize="8"
                fill="white"
                textAnchor="middle"
              >
                {country.name}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Tooltip explaining the map */}
      <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 text-xs">
        Click on a country to see properties
      </div>
    </div>
  );
}
