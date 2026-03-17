import React, { useState } from 'react';

const HistorySlider = () => {

  const currentYear = new Date().getFullYear();

  const [value, setValue] = useState(currentYear);

  // Helper to turn -3000 into "3000 BC" and 2026 into "2026 AD"
  const formatYear = (year) => {
    if (year < 0) {
      return `${Math.abs(year)} BC`;
    } else if (year === 0) {
      return "1 AD"; // History technically skips Year 0
    } else {
      return `${year} AD`;
    }
  };

  return (
    <div className="w-full max-w-2xl p-8 bg-slate-50 rounded-xl shadow-sm">
      <div className="flex justify-between mb-4 text-sm font-medium text-slate-500">
        <span>3000 BC</span>
        <span className="text-blue-600 text-lg font-bold">{formatYear(value)}</span>
        <span>{currentYear} AD</span>
      </div>

      <input
        type="range"
        min="-3000"
        max={currentYear}
        step="1"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />

      <div className="flex justify-between mt-2 text-xs text-slate-400">
        <span>Ancient Era</span>
        <span>Middle Ages</span>
        <span>Modern Era</span>
      </div>
    </div>
  );
};

export default HistorySlider