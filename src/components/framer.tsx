'use client';

import { motion } from '@motionone/react';

// Motion One components
export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionButton = motion.button;

// Optional: Example usage component (for demo/testing only)
export function MotionExample() {
  return (
    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>Motion One Example Component</h1>
    </MotionDiv>
  );
}
