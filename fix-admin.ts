import fs from 'fs';

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Replace dark mode classes with light mode ones
content = content.replace(/text-zinc-400/g, 'text-gray-600 font-medium');
content = content.replace(/text-zinc-500/g, 'text-gray-500');
content = content.replace(/border-zinc-800/g, 'border-gray-200');
content = content.replace(/bg-zinc-800/g, 'bg-gray-100');
content = content.replace(/bg-zinc-900/g, 'bg-gray-50');
content = content.replace(/hover:bg-zinc-800/g, 'hover:bg-gray-200');
content = content.replace(/hover:bg-zinc-900/g, 'hover:bg-gray-100');
content = content.replace(/hover:bg-zinc-700/g, 'hover:bg-gray-200');
content = content.replace(/bg-\[var\(--panel-bg\)\]/g, 'bg-white shadow-md');
content = content.replace(/text-white/g, 'text-gray-900');

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
