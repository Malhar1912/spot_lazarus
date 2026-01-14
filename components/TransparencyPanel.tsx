import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { COST_DATA } from '../constants';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const TransparencyPanel: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed right-6 bottom-6 md:top-24 md:bottom-auto w-full max-w-sm bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl p-6 shadow-2xl z-40 hidden lg:block"
    >
      <div className="flex items-center gap-2 mb-4 text-zinc-400">
        <Info className="w-4 h-4" />
        <h3 className="text-xs font-bold uppercase tracking-wider">Cost Transparency</h3>
      </div>
      
      <p className="text-sm text-zinc-300 mb-6">
        We keep this environment asleep when unused and resurrect it only when you need it.
      </p>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={COST_DATA} layout="vertical" margin={{ left: 0, right: 30 }}>
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={110} 
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              interval={0}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
              formatter={(value: number) => [`$${value.toFixed(2)}/hr`, 'Cost']}
            />
            <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={20}>
              {COST_DATA.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.type === 'spot' ? '#3b82f6' : entry.type === 'idle' ? '#71717a' : '#ef4444'} 
                  fillOpacity={entry.type === 'spot' ? 1 : 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs">
        <span className="text-zinc-500">Current Efficiency</span>
        <span className="text-emerald-400 font-medium">Saving 71% vs On-Demand</span>
      </div>
    </motion.div>
  );
};

export default TransparencyPanel;