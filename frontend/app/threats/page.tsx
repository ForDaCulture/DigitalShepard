'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ThreatCard, type Threat } from '@/components/ui/ThreatCard';
import { ThreatFilterBar, type ThreatFilters } from '@/components/ui/ThreatFilterBar';
import { Button } from '@/components/ui/Button';

// Simulated API call - replace with your actual API endpoint
const fetchThreats = async (filters: ThreatFilters): Promise<Threat[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This is mock data - replace with actual API call
  return [
    {
      id: '1',
      title: 'Suspicious Login Attempt',
      timestamp: new Date().toISOString(),
      severity: 'high',
      riskScore: 85,
      category: 'suspicious_access',
      description: 'Multiple failed login attempts detected from unknown IP address.',
    },
    {
      id: '2',
      title: 'Potential Phishing Email',
      timestamp: new Date().toISOString(),
      severity: 'medium',
      riskScore: 65,
      category: 'phishing',
      description: 'Email with suspicious attachment from unverified sender.',
    },
    // Add more mock threats as needed
  ];
};

export default function ThreatsPage() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [filters, setFilters] = useState<ThreatFilters>({
    severity: [],
    category: [],
    dateRange: 'all',
  });

  useEffect(() => {
    loadThreats();
    
    // Set up polling for new threats
    const pollInterval = setInterval(() => {
      checkNewThreats();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(pollInterval);
  }, [filters]);

  const loadThreats = async () => {
    try {
      setLoading(true);
      const data = await fetchThreats(filters);
      setThreats(data);
    } catch (error) {
      toast.error('Failed to load threats. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkNewThreats = async () => {
    try {
      const data = await fetchThreats(filters);
      const newThreats = data.filter(
        threat => !threats.find(t => t.id === threat.id)
      );
      
      if (newThreats.length > 0) {
        setThreats(prev => [...newThreats, ...prev]);
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-slate-900 border border-red-500 rounded-lg p-4 shadow-lg`}>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-white font-medium">
                {newThreats.length} new {newThreats.length === 1 ? 'threat' : 'threats'} detected
              </p>
            </div>
          </div>
        ));
      }
    } catch (error) {
      console.error('Failed to check for new threats:', error);
    }
  };

  const handleFilterChange = (newFilters: ThreatFilters) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (threat: Threat) => {
    setSelectedThreat(threat);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-950 text-white px-6 py-12"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Detected Threats</h1>
          <p className="text-slate-400">
            Real-time analysis of anomalies and suspicious behaviors detected by Digital Shepherd.
          </p>
        </div>

        <ThreatFilterBar onFilterChange={handleFilterChange} />

        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[200px] bg-slate-900/50 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : threats.length > 0 ? (
            <motion.div
              layout
              className="grid gap-6"
            >
              {threats.map((threat) => (
                <ThreatCard
                  key={threat.id}
                  threat={threat}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-slate-400">No active threats detected 🎉</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={loadThreats}
              >
                Refresh
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
} 