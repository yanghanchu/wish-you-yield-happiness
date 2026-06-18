import type { Anniversary } from '@/lib/types';

const day = 24 * 60 * 60 * 1000;

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(value));
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function calculateLoveDays(startDate: string) {
  return Math.max(1, Math.floor((Date.now() - new Date(startDate).getTime()) / day) + 1);
}

export function calculateDaysUntil(date: string, repeat: Anniversary['repeat'] = 'none') {
  const now = new Date();
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  if (repeat === 'yearly') {
    target.setFullYear(now.getFullYear());
    if (target.getTime() < startOfToday(now).getTime()) target.setFullYear(now.getFullYear() + 1);
  }

  if (repeat === 'monthly') {
    target.setFullYear(now.getFullYear(), now.getMonth());
    if (target.getTime() < startOfToday(now).getTime()) target.setMonth(now.getMonth() + 1);
  }

  return Math.ceil((target.getTime() - startOfToday(now).getTime()) / day);
}

export function getNextAnniversary(items: Anniversary[]) {
  return [...items].sort((a, b) => calculateDaysUntil(a.date, a.repeat) - calculateDaysUntil(b.date, b.repeat))[0];
}

function startOfToday(now: Date) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
