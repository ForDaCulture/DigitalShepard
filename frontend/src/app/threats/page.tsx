import { ThreatList } from "@/components/sections/ThreatList";

export default function ThreatsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Threat Detection</h1>
      <ThreatList />
    </div>
  );
} 