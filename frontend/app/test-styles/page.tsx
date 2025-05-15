'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TestStylesPage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="bg-background text-foreground p-8 space-y-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Style Test Page</h1>
            <button
              onClick={() => setIsDark(!isDark)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Toggle Theme
            </button>
          </div>

          {/* Forms Plugin Test */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Forms Plugin Test</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Regular Input"
                className="form-input w-full bg-background border-border"
              />
              <select className="form-select w-full bg-background border-border">
                <option>Select Option 1</option>
                <option>Select Option 2</option>
              </select>
              <textarea
                className="form-textarea w-full bg-background border-border"
                placeholder="Textarea Test"
              />
            </div>
          </section>

          {/* Typography Plugin Test */}
          <section className="prose dark:prose-invert max-w-none">
            <h2>Typography Plugin Test</h2>
            <p>
              This is a test of the typography plugin. It should include proper
              spacing and styling for various elements like <strong>bold text</strong>,
              <em>italic text</em>, and <a href="#">links</a>.
            </p>
            <blockquote>
              This is a blockquote to test typography styling.
            </blockquote>
          </section>

          {/* Aspect Ratio Plugin Test */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Aspect Ratio Test</h2>
            <div className="aspect-w-16 aspect-h-9 bg-muted rounded-lg">
              <div className="flex items-center justify-center">
                16:9 Aspect Ratio
              </div>
            </div>
          </section>

          {/* Animation Test */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Animation Test</h2>
            <div className="flex gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-card text-card-foreground rounded-lg"
              >
                Hover Me
              </motion.div>
              <div className="animate-fade-in p-4 bg-accent text-accent-foreground rounded-lg">
                Fade In
              </div>
              <div className="animate-slide-up p-4 bg-secondary text-secondary-foreground rounded-lg">
                Slide Up
              </div>
            </div>
          </section>

          {/* Custom Variants Test */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Custom Variants Test</h2>
            <div className="flex gap-4">
              <button className="hocus:scale-105 transition-transform p-4 bg-primary text-primary-foreground rounded-lg">
                Hocus Test
              </button>
              <div className="group">
                <div className="group-hocus:translate-x-2 transition-transform p-4 bg-muted text-muted-foreground rounded-lg">
                  Group Hocus
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 