import { Eye, LockKeyhole } from 'lucide-react';
import type { Visibility } from '@/lib/types';

export function VisibilityBadge({ value }: { value: Visibility }) {
  const Icon = value === 'public' ? Eye : LockKeyhole;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-rosehouse-muted ring-1 ring-pink-100">
      <Icon size={13} />
      {value === 'public' ? '访客可见' : '私密'}
    </span>
  );
}
