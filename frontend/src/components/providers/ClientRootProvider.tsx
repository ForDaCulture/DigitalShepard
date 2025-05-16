'use client';

import { UserXPProvider } from '@/lib/contexts/UserXPContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export function ClientRootProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserXPProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: '!bg-gray-800 !text-white',
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
          }}
        />
      </ThemeProvider>
    </UserXPProvider>
  );
} 