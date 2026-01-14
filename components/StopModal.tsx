import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Moon, X } from 'lucide-react';

interface StopModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const StopModal: React.FC<StopModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl"
        >
          <button onClick={onCancel} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 mb-4">
            <Moon className="w-6 h-6 text-indigo-400" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Put Environment to Sleep?</h2>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Your data, databases, and files will be <strong className="text-zinc-200">preserved</strong>. 
            You can restart instantly by revisiting this URL.
          </p>

          <div className="bg-zinc-950 rounded-lg p-4 mb-6 border border-zinc-800">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-zinc-500">Running Cost</span>
              <span className="text-zinc-300 font-mono">$0.14/hr</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Sleeping Cost</span>
              <span className="text-emerald-400 font-mono font-bold">$0.04/hr</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition shadow-[0_0_15px_rgba(99,102,241,0.4)]"
            >
              Confirm & Stop
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StopModal;