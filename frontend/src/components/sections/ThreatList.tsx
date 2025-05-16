"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Threat {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  status: "active" | "resolved";
}

const severityColors = {
  low: "bg-green-500/10 text-green-500",
  medium: "bg-yellow-500/10 text-yellow-500",
  high: "bg-orange-500/10 text-orange-500",
  critical: "bg-red-500/10 text-red-500",
};

export function ThreatList() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/threats`);
        const data = await response.json();
        setThreats(data);
      } catch (error) {
        console.error("Failed to fetch threats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {threats.map((threat, index) => (
        <motion.div
          key={threat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">{threat.title}</h3>
              <Badge
                variant="secondary"
                className={severityColors[threat.severity]}
              >
                {threat.severity}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {threat.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {new Date(threat.timestamp).toLocaleDateString()}
              </span>
              <Badge
                variant="outline"
                className={
                  threat.status === "active"
                    ? "border-red-500 text-red-500"
                    : "border-green-500 text-green-500"
                }
              >
                {threat.status}
              </Badge>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
} 