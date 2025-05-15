'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-gray-900 shadow-xl">
                    <div className="flex items-center justify-between px-4 py-6">
                      <Dialog.Title className="text-lg font-semibold text-white">
                        Menu
                      </Dialog.Title>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-300"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="relative flex-1 px-4 py-6">
                      <nav className="flex flex-col space-y-6">
                        <Link
                          href="/threats"
                          className="text-lg font-medium text-gray-300 hover:text-indigo-400 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Threats
                        </Link>
                        <Link
                          href="/achievements"
                          className="text-lg font-medium text-gray-300 hover:text-indigo-400 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Achievements
                        </Link>
                      </nav>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 