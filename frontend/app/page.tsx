'use client';

import { Hero } from '@/components/ui/Hero';

export default function HomePage() {
  return (
    <main>
      <Hero
        title="Digital Shepherd"
        description="Your AI-Powered Cyber Guardian. Detect threats. Educate users. Protect your digital life with real-time intelligence."
        primaryAction={{
          label: "Start Threat Scan",
          href: "/threats"
        }}
        secondaryAction={{
          label: "View Achievements",
          href: "/achievements"
        }}
      />
    </main>
  );
} 