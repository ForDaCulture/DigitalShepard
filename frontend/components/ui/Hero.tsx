'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface HeroProps {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export function Hero({
  title,
  description,
  primaryAction,
  secondaryAction,
}: HeroProps) {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-6 bg-gradient-to-br from-gray-950 to-gray-900">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 pb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {description}
        </motion.p>

        {(primaryAction || secondaryAction) && (
          <motion.div
            className="mt-10 flex gap-4 flex-wrap justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {primaryAction && (
              <Link
                href={primaryAction.href}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
              >
                {primaryAction.label}
              </Link>
            )}
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
              >
                {secondaryAction.label}
              </Link>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 