// src/app/layout.tsx
import './globals.css';
import ClientLayout from '../components/ClientLayout';

export const metadata = {
  title: 'Property Africa',
  description: 'Find your dream property in Africa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the `dark` class only for client-side hydration.
  // Avoid setting `dark` on the `html` tag here; instead, leave that to `ClientLayout` component.
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
