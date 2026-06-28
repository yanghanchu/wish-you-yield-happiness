'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CalendarDays, Heart, Pencil, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { deleteById } from '@/lib/db/actions';
import type { LoveRecord } from '@/lib/types';
import { formatDate } from '@/lib/utils/dates';
import { VisibilityBadge } from '@/components/ui/VisibilityBadge';

type FilterValue = 'all' | string;

export function RecordsExplorer({ records }: { records: LoveRecord[] }) {
  const [query, setQuery] = useState('');
  const [author, setAuthor] = useState<FilterValue>('all');
  const [visibility, setVisibility] = useState<FilterValue>('all');
  const [favorite, setFavorite] = useState<FilterValue>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return records
      .filter((record) => {
        const haystack = [record.title, record.content, record.mood, ...(record.tags ?? [])].join(' ').toLowerCase();
        const matchesQuery = !keyword || haystack.includes(keyword);
        const matchesAuthor = author === 'all' || record.author_role === author;
        const matchesVisibility = visibility === 'all' || record.visibility === visibility;
        const matchesFavorite = favorite === 'all' || (favorite === 'favorite' ? record.is_favorite : !record.is_favorite);
        const matchesFrom = !fromDate || record.date >= fromDate;
        const matchesTo = !toDate || record.date <= toDate;

        return matchesQuery && matchesAuthor && matchesVisibility && matchesFavorite && matchesFrom && matchesTo;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [records, query, author, visibility, favorite, fromDate, toDate]);

  return (
    <div className="space-y-5">
      <section className="love-card p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black text-rosehouse-muted">
          <SlidersHorizontal size={16} />
          记录筛选
        </div>
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rosehouse-muted" size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索标题、正文、心情、标签"
              className="pl-10"
            />
          </label>
          <select value={author} onChange={(event) => setAuthor(event.target.value)}>
            <option value="all">全部作者</option>
            <option value="WY">WY</option>
            <option value="YYH">YYH</option>
          </select>
          <select value={visibility} onChange={(event) => setVisibility(event.target.value)}>
            <option value="all">全部可见范围</option>
            <option value="private">私密</option>
            <option value="public">公开</option>
          </select>
          <select value={favorite} onChange={(event) => setFavorite(event.target.value)}>
            <option value="all">全部收藏状态</option>
            <option value="favorite">已收藏</option>
            <option value="normal">未收藏</option>
          </select>
          <input aria-label="开始日期" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          <input aria-label="结束日期" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold text-rosehouse-muted">
          <span>共 {records.length} 条</span>
          <span>当前显示 {filtered.length} 条</span>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setAuthor('all');
              setVisibility('all');
              setFavorite('all');
              setFromDate('');
              setToDate('');
            }}
            className="rounded-full bg-white/80 px-3 py-1 text-rosehouse-deep ring-1 ring-pink-100"
          >
            清空筛选
          </button>
        </div>
      </section>

      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((record) => (
            <article key={record.id} className="love-card overflow-hidden p-5 transition hover:-translate-y-1 hover:bg-white/90">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-black">{record.title}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm font-bold text-rosehouse-muted">
                    <CalendarDays size={15} />
                    {formatDate(record.date)} · {record.author_role}
                  </p>
                </div>
                <VisibilityBadge value={record.visibility} />
              </div>

              <p className="mt-4 line-clamp-4 min-h-24 text-sm leading-6">{record.content}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {record.is_favorite && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-xs font-black text-rosehouse-deep">
                    <Heart size={13} className="fill-current" />
                    收藏
                  </span>
                )}
                {record.mood && <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-rosehouse-ink">{record.mood}</span>}
                {(record.tags ?? []).map((tag) => (
                  <span key={tag} className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-rosehouse-muted ring-1 ring-pink-100">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex gap-2">
                <Link href={`/records/${record.id}/edit`} className="secondary-button">
                  <Pencil size={15} />
                  编辑
                </Link>
                <form action={deleteById}>
                  <input type="hidden" name="table" value="love_records" />
                  <input type="hidden" name="id" value={record.id} />
                  <input type="hidden" name="path" value="/records" />
                  <button className="secondary-button text-rosehouse-deep">
                    <Trash2 size={15} />
                    删除
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="love-card p-10 text-center">
          <p className="text-xl font-black">没有符合条件的记录</p>
          <p className="mt-2 text-sm text-rosehouse-muted">换一个日期范围或关键词试试。</p>
        </div>
      )}
    </div>
  );
}
