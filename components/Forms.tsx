import { createAnniversary, createMessage, createPhoto, createWish, upsertRecord } from '@/lib/db/actions';
import { todayIso } from '@/lib/utils/dates';
import type { LoveRecord, UserRole } from '@/lib/types';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ImageUploadField } from '@/components/ui/ImageUploadField';

function VisibilitySelect({ defaultValue = 'private' }: { defaultValue?: 'private' | 'public' }) {
  return (
    <select name="visibility" defaultValue={defaultValue}>
      <option value="private">仅 WY 和 YYH 可见</option>
      <option value="public">访客也可见</option>
    </select>
  );
}

export function RecordForm({ role, record }: { role: UserRole; record?: LoveRecord }) {
  return (
    <form action={upsertRecord} className="love-card grid gap-4 p-5">
      {record && <input type="hidden" name="id" value={record.id} />}
      <label className="text-sm font-bold">
        标题
        <input name="title" required defaultValue={record?.title} />
      </label>
      <label className="text-sm font-bold">
        正文
        <textarea name="content" required rows={7} defaultValue={record?.content} />
      </label>
      <ImageUploadField prefix="records" multiple label="图片上传" />
      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-bold">
          记录发生日期
          <input name="date" type="date" defaultValue={record?.date ?? todayIso()} />
        </label>
        <label className="text-sm font-bold">
          记录人
          <select name="author_role" defaultValue={record?.author_role ?? role}>
            <option>WY</option>
            <option>YYH</option>
          </select>
        </label>
        <label className="text-sm font-bold">
          心情
          <select name="mood" defaultValue={record?.mood ?? '甜蜜'}>
            <option>开心</option>
            <option>想念</option>
            <option>感动</option>
            <option>甜蜜</option>
            <option>平静</option>
            <option>特别幸福</option>
          </select>
        </label>
      </div>
      <p className="-mt-2 text-xs font-bold text-rosehouse-muted">这里记录的是事情发生的时间，可以自己选择，不按上传时间计算。</p>
      <label className="text-sm font-bold">
        标签，用英文逗号分隔
        <input name="tags" defaultValue={(record?.tags ?? []).join(', ')} />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-bold">
          可见范围
          <VisibilitySelect defaultValue={record?.visibility ?? 'private'} />
        </label>
        <label className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold">
          <input className="size-4 w-auto" type="checkbox" name="is_favorite" defaultChecked={record?.is_favorite} />
          收藏这条记录
        </label>
      </div>
      <PrimaryButton className="w-fit">保存记录</PrimaryButton>
    </form>
  );
}

export function PhotoForm({ role }: { role: UserRole }) {
  return (
    <form action={createPhoto} className="love-card mb-6 grid gap-4 p-5 md:grid-cols-2">
      <ImageUploadField prefix="album" required label="图片上传" />
      <label className="text-sm font-bold">
        说明
        <input name="caption" />
      </label>
      <label className="text-sm font-bold">
        日期
        <input name="date" type="date" defaultValue={todayIso()} />
      </label>
      <label className="text-sm font-bold">
        上传人
        <select name="author_role" defaultValue={role}>
          <option>WY</option>
          <option>YYH</option>
        </select>
      </label>
      <label className="text-sm font-bold">
        分类
        <select name="category">
          <option>日常</option>
          <option>约会</option>
          <option>旅行</option>
          <option>吃饭</option>
          <option>礼物</option>
          <option>截图</option>
        </select>
      </label>
      <label className="text-sm font-bold">
        可见范围
        <VisibilitySelect />
      </label>
      <PrimaryButton className="w-fit">添加照片</PrimaryButton>
    </form>
  );
}

export function AnniversaryForm() {
  return (
    <form action={createAnniversary} className="love-card mb-6 grid gap-4 p-5 md:grid-cols-2">
      <label className="text-sm font-bold">
        标题
        <input name="title" required />
      </label>
      <label className="text-sm font-bold">
        日期
        <input name="date" type="date" required />
      </label>
      <label className="text-sm font-bold">
        类型
        <select name="type">
          <option>在一起</option>
          <option>第一次见面</option>
          <option>第一次约会</option>
          <option>生日</option>
          <option>节日</option>
          <option>自定义</option>
        </select>
      </label>
      <label className="text-sm font-bold">
        重复
        <select name="repeat">
          <option value="none">不重复</option>
          <option value="monthly">每月</option>
          <option value="yearly">每年</option>
        </select>
      </label>
      <label className="text-sm font-bold md:col-span-2">
        备注
        <textarea name="note" rows={3} />
      </label>
      <label className="text-sm font-bold">
        可见范围
        <VisibilitySelect />
      </label>
      <PrimaryButton className="w-fit">添加纪念日</PrimaryButton>
    </form>
  );
}

export function WishForm({ role }: { role: UserRole }) {
  return (
    <form action={createWish} className="love-card mb-6 grid gap-4 p-5 md:grid-cols-2">
      <label className="text-sm font-bold">
        愿望标题
        <input name="title" required />
      </label>
      <label className="text-sm font-bold">
        计划时间
        <input name="target_date" type="date" />
      </label>
      <label className="text-sm font-bold md:col-span-2">
        愿望描述
        <textarea name="description" rows={3} />
      </label>
      <label className="text-sm font-bold">
        状态
        <select name="status">
          <option value="todo">想做</option>
          <option value="planning">计划中</option>
          <option value="done">已完成</option>
        </select>
      </label>
      <label className="text-sm font-bold">
        创建人
        <select name="creator_role" defaultValue={role}>
          <option>WY</option>
          <option>YYH</option>
        </select>
      </label>
      <label className="text-sm font-bold">
        完成日期
        <input name="completed_date" type="date" />
      </label>
      <label className="text-sm font-bold">
        可见范围
        <VisibilitySelect />
      </label>
      <label className="text-sm font-bold md:col-span-2">
        完成感想
        <textarea name="completed_note" rows={3} />
      </label>
      <ImageUploadField prefix="wishes" multiple label="完成图片上传" />
      <PrimaryButton className="w-fit">添加愿望</PrimaryButton>
    </form>
  );
}

export function MessageForm({ role }: { role: UserRole }) {
  return (
    <form action={createMessage} className="love-card mb-6 grid gap-4 p-5 md:grid-cols-2">
      <label className="text-sm font-bold md:col-span-2">
        留言内容
        <textarea name="content" required rows={4} />
      </label>
      <label className="text-sm font-bold">
        留言人
        <select name="author_role" defaultValue={role}>
          <option>WY</option>
          <option>YYH</option>
        </select>
      </label>
      <label className="text-sm font-bold">
        日期
        <input name="date" type="date" defaultValue={todayIso()} />
      </label>
      <label className="text-sm font-bold">
        便签颜色
        <select name="theme">
          <option value="pink">粉色</option>
          <option value="purple">紫色</option>
          <option value="cream">奶油色</option>
        </select>
      </label>
      <label className="text-sm font-bold">
        可见范围
        <VisibilitySelect />
      </label>
      <label className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold">
        <input className="size-4 w-auto" type="checkbox" name="is_pinned" />
        置顶
      </label>
      <PrimaryButton className="w-fit">写留言</PrimaryButton>
    </form>
  );
}
