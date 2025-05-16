'use client';

import { MotionDiv } from '../components/framer';

// Export the motion object directly
export { motion };

export default function ExampleComponent() {
  return (
    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>Example Component</h1>
    </MotionDiv>
  );
}