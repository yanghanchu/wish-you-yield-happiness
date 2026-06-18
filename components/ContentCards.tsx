import Link from 'next/link';
import { Calendar, Heart, Pencil, Trash2 } from 'lucide-react';
import { deleteById } from '@/lib/db/actions';
import type { AlbumPhoto, Anniversary, LoveRecord, MessageNote, Wish } from '@/lib/types';
import { formatDate, calculateDaysUntil } from '@/lib/utils/dates';
import { VisibilityBadge } from '@/components/ui/VisibilityBadge';

export function RecordCards({ records, canEdit }: { records: LoveRecord[]; canEdit: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {records.map((record) => (
        <article key={record.id} className="love-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">{record.title}</h2>
              <p className="mt-1 text-sm text-rosehouse-muted">{formatDate(record.date)} · {record.author_role}</p>
            </div>
            <VisibilityBadge value={record.visibility} />
          </div>
          <p className="mt-4 line-clamp-4 text-sm leading-6">{record.content}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {record.is_favorite && <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-rosehouse-deep">收藏</span>}
            {record.mood && <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-rosehouse-ink">{record.mood}</span>}
            {(record.tags ?? []).map((tag) => <span key={tag} className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-rosehouse-muted">{tag}</span>)}
          </div>
          {canEdit && (
            <div className="mt-5 flex gap-2">
              <Link href={`/records/${record.id}/edit`} className="secondary-button"><Pencil size={15} />编辑</Link>
              <DeleteButton table="love_records" id={record.id} path="/records" />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

export function PhotoCards({ photos, canEdit }: { photos: AlbumPhoto[]; canEdit: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => (
        <article key={photo.id} className="love-card overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.image_url} alt={photo.caption ?? 'album photo'} className="aspect-[4/3] w-full object-cover" />
          <div className="p-4">
            <div className="flex items-center justify-between gap-3"><p className="font-black">{photo.caption || '没有写说明的照片'}</p><VisibilityBadge value={photo.visibility} /></div>
            <p className="mt-2 text-sm text-rosehouse-muted">{formatDate(photo.date)} · {photo.author_role} · {photo.category}</p>
            {canEdit && <div className="mt-4"><DeleteButton table="album_photos" id={photo.id} path="/album" /></div>}
          </div>
        </article>
      ))}
    </div>
  );
}

export function AnniversaryCards({ items, canEdit }: { items: Anniversary[]; canEdit: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="love-card p-5">
          <div className="flex items-start justify-between gap-3"><h2 className="text-xl font-black">{item.title}</h2><VisibilityBadge value={item.visibility} /></div>
          <p className="mt-2 text-3xl font-black text-rosehouse-deep">{calculateDaysUntil(item.date, item.repeat)} 天</p>
          <p className="mt-2 text-sm text-rosehouse-muted">{formatDate(item.date)} · {item.type} · {item.repeat}</p>
          {item.note && <p className="mt-4 text-sm leading-6">{item.note}</p>}
          {canEdit && <div className="mt-4"><DeleteButton table="anniversaries" id={item.id} path="/anniversaries" /></div>}
        </article>
      ))}
    </div>
  );
}

export function WishCards({ wishes, canEdit }: { wishes: Wish[]; canEdit: boolean }) {
  const status: Record<Wish['status'], string> = { todo: '想做', planning: '计划中', done: '已完成' };
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {wishes.map((wish) => (
        <article key={wish.id} className="love-card p-5">
          <div className="flex items-start justify-between gap-3"><h2 className="text-xl font-black">{wish.title}</h2><VisibilityBadge value={wish.visibility} /></div>
          <p className="mt-2 text-sm font-bold text-rosehouse-deep">{status[wish.status]} · {wish.creator_role}</p>
          {wish.description && <p className="mt-4 text-sm leading-6">{wish.description}</p>}
          {wish.target_date && <p className="mt-4 text-sm text-rosehouse-muted">计划时间：{formatDate(wish.target_date)}</p>}
          {wish.completed_note && <p className="mt-3 rounded-2xl bg-white/70 p-3 text-sm">{wish.completed_note}</p>}
          {canEdit && <div className="mt-4"><DeleteButton table="wishes" id={wish.id} path="/wishlist" /></div>}
        </article>
      ))}
    </div>
  );
}

export function MessageCards({ messages, canEdit }: { messages: MessageNote[]; canEdit: boolean }) {
  const theme = { pink: 'bg-pink-100', purple: 'bg-purple-100', cream: 'bg-yellow-50' };
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {messages.map((message) => (
        <article key={message.id} className={`rounded-[24px] p-5 shadow-love ${theme[message.theme]}`}>
          <div className="flex items-start justify-between gap-3"><Heart className="text-rosehouse-deep" size={18} /><VisibilityBadge value={message.visibility} /></div>
          <p className="mt-4 min-h-24 text-base leading-7">{message.content}</p>
          <p className="mt-4 text-sm font-bold text-rosehouse-muted">- {message.author_role} · {formatDate(message.date)}</p>
          {message.is_pinned && <p className="mt-2 text-xs font-black text-rosehouse-deep">置顶</p>}
          {canEdit && <div className="mt-4"><DeleteButton table="message_notes" id={message.id} path="/messages" /></div>}
        </article>
      ))}
    </div>
  );
}

export function TimelineList({ records, anniversaries, wishes, messages }: { records: LoveRecord[]; anniversaries: Anniversary[]; wishes: Wish[]; messages: MessageNote[] }) {
  const items = [
    ...records.map((item) => ({ id: `r-${item.id}`, type: '恋爱记录', title: item.title, date: item.date, text: item.content, author: item.author_role, visibility: item.visibility })),
    ...anniversaries.map((item) => ({ id: `a-${item.id}`, type: '纪念日', title: item.title, date: item.date, text: item.note ?? item.type, author: 'WY & YYH', visibility: item.visibility })),
    ...wishes.filter((item) => item.status === 'done').map((item) => ({ id: `w-${item.id}`, type: '完成愿望', title: item.title, date: item.completed_date ?? item.target_date ?? item.id, text: item.completed_note ?? item.description ?? '', author: item.creator_role, visibility: item.visibility })),
    ...messages.map((item) => ({ id: `m-${item.id}`, type: '留言', title: item.content.slice(0, 16), date: item.date, text: item.content, author: item.author_role, visibility: item.visibility }))
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="love-card flex gap-4 p-5">
          <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-rosehouse-deep"><Calendar size={18} /></div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><span className="text-xs font-black text-rosehouse-deep">{item.type}</span><VisibilityBadge value={item.visibility as 'public' | 'private'} /></div>
            <h2 className="mt-2 text-lg font-black">{item.title}</h2>
            <p className="mt-1 text-sm text-rosehouse-muted">{formatDate(item.date)} · {item.author}</p>
            <p className="mt-3 line-clamp-2 text-sm leading-6">{item.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function DeleteButton({ table, id, path }: { table: string; id: string; path: string }) {
  return (
    <form action={deleteById}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="path" value={path} />
      <button className="secondary-button text-rosehouse-deep"><Trash2 size={15} />删除</button>
    </form>
  );
}
