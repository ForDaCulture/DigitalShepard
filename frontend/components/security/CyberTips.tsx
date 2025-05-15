import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Trophy, Star, Shield, AlertTriangle } from 'lucide-react';
import { useUserXP } from '@/lib/contexts/UserXPContext';
import axios from 'axios';

interface Tip {
  id: string;
  content: string;
  category: 'phishing' | 'privacy' | 'security' | 'fatigue';
  points: number;
}

interface SessionData {
  typing_speed: number;
  click_rate: number;
  session_duration: number;
  timestamp: Date;
}

export function CyberTips({ event, sessionData }: { event?: string; sessionData?: SessionData }) {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);
  const [anomalyStatus, setAnomalyStatus] = useState<any>(null);
  const { userXP, addXP, trackAction } = useUserXP();

  useEffect(() => {
    if (event) {
      fetchTip(event);
    }
  }, [event]);

  useEffect(() => {
    if (sessionData) {
      analyzeUserBehavior(sessionData);
    }
  }, [sessionData]);

  const analyzeUserBehavior = async (data: SessionData) => {
    try {
      const response = await axios.post('/api/anomaly/analyze', {
        user_id: userXP.userId,
        device_id: 'browser', // Replace with actual device ID
        ...data
      });

      setAnomalyStatus(response.data);

      if (response.data.label === 'normal') {
        trackAction('behavior', 'normal_session');
        addXP(5, 'behavior');
      } else {
        // Trigger security tip for suspicious behavior
        fetchTip('security');
      }
    } catch (error) {
      console.error('Error analyzing user behavior:', error);
    }
  };

  const fetchTip = async (eventType: string) => {
    try {
      // In production, this would call your GPT-4 API endpoint
      const mockTip: Tip = {
        id: Date.now().toString(),
        content: generateMockTip(eventType),
        category: eventType as any,
        points: 10,
      };
      setCurrentTip(mockTip);
    } catch (error) {
      console.error('Error fetching tip:', error);
    }
  };

  const generateMockTip = (eventType: string): string => {
    const tips = {
      phishing: "Be cautious! This page shows signs of a phishing attempt. Always verify the sender's email and don't click suspicious links.",
      privacy: "Great job checking your privacy settings! Remember to regularly review app permissions and data access.",
      security: "Your password strength is improving! Consider using a password manager for even better security.",
      fatigue: "Time for a quick break! Taking regular breaks helps maintain cybersecurity awareness and reduces mistakes.",
    };
    return tips[eventType as keyof typeof tips] || tips.security;
  };

  const handleTipAcknowledge = () => {
    if (currentTip) {
      addXP(currentTip.points, currentTip.category);
      trackAction(currentTip.category, 'tip_acknowledged');
      setCurrentTip(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Security Level {userXP.level}</h3>
          <span className="text-sm text-gray-500">{userXP.totalXP} XP</span>
        </div>
        <Progress 
          value={((userXP.totalXP % 100) / 100) * 100} 
          className="h-2" 
        />
      </div>

      {/* Badges Section */}
      <div className="flex gap-2 flex-wrap">
        {userXP.badges.map(badge => (
          <Badge
            key={badge.id}
            variant="default"
            className="flex items-center gap-1 p-2"
          >
            <span>{badge.icon}</span>
            <span>{badge.name}</span>
          </Badge>
        ))}
      </div>

      {/* Anomaly Status */}
      {anomalyStatus && (
        <Card className={`p-4 ${
          anomalyStatus.label === 'suspicious' ? 'bg-red-50' : 'bg-green-50'
        }`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={
              anomalyStatus.label === 'suspicious' ? 'text-red-500' : 'text-green-500'
            } />
            <span className="text-sm">
              Behavior Analysis: {anomalyStatus.label}
              {anomalyStatus.label === 'suspicious' && 
                ' - Review recent activities for potential security risks'}
            </span>
          </div>
        </Card>
      )}

      {/* Current Tip Card */}
      {currentTip && (
        <Card className="p-4 space-y-4">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <div className="flex-1">
              <p className="text-sm">{currentTip.content}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">+{currentTip.points} XP</span>
                <Button size="sm" onClick={handleTipAcknowledge}>
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 