import { Hero } from "@/components/sections/Hero";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Hero
        title="Welcome to DigitalShepard"
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
    </div>
  );
} 