'use client';

import { useState } from 'react';

export function DateRangePicker() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  return <div className="flex gap-2"><input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} /><input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} /></div>;
}
