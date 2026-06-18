import { signOut, updateSettings, approveGuestRequest, rejectGuestRequest } from '@/lib/db/actions';
import { requireOwner } from '@/lib/auth/getCurrentUser';
import { getOwnerDashboardData } from '@/lib/db/queries';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { PinkCard } from '@/components/ui/PinkCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { formatDate } from '@/lib/utils/dates';

export default async function SettingsPage() {
  const { profile } = await requireOwner();
  const data = await getOwnerDashboardData();
  const settings = data.settings;

  return (
    <AppLayout profile={profile}>
      <PageHeader title="小屋设置" subtitle="在这里管理 WY 和 YYH 的 Wish You, Yield Happiness" />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          <PinkCard>
            <h2 className="text-xl font-black">当前身份</h2>
            <p className="mt-3 text-rosehouse-muted">当前登录：{profile.role}</p>
            <form action={signOut} className="mt-5"><PrimaryButton variant="secondary">退出登录</PrimaryButton></form>
          </PinkCard>
          {settings && (
            <form action={updateSettings} className="love-card grid gap-4 p-5">
              <input type="hidden" name="id" value={settings.id} />
              <h2 className="text-xl font-black">基础设置</h2>
              <label className="text-sm font-bold">网站标题<input name="site_title" defaultValue="Wish You, Yield Happiness" /></label>
              <label className="text-sm font-bold">情侣名称<input name="couple_name" defaultValue={settings.couple_name} /></label>
              <label className="text-sm font-bold">WY 昵称<input name="wy_display_name" defaultValue={settings.wy_display_name} /></label>
              <label className="text-sm font-bold">YYH 昵称<input name="yyh_display_name" defaultValue={settings.yyh_display_name} /></label>
              <label className="text-sm font-bold">恋爱开始日期<input name="start_date" type="date" defaultValue={settings.start_date} /></label>
              <label className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold"><input className="size-4 w-auto" name="allow_guest_request" type="checkbox" defaultChecked={settings.allow_guest_request} />允许访客申请</label>
              <PrimaryButton className="w-fit">保存设置</PrimaryButton>
            </form>
          )}
        </div>
        <PinkCard>
          <h2 className="text-xl font-black">访客申请审核</h2>
          <div className="mt-4 space-y-4">
            {data.guestRequests.map((item) => (
              <article key={item.id} className="rounded-3xl bg-white/70 p-4 ring-1 ring-pink-100">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h3 className="font-black">{item.guest_name}</h3><p className="mt-1 text-sm text-rosehouse-muted">{formatDate(item.created_at)} · {item.status}</p></div>
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-black text-rosehouse-deep">{item.status}</span>
                </div>
                <p className="mt-3 text-sm leading-6">{item.reason}</p>
                {item.status === 'approved' && item.access_token && <p className="mt-3 break-all rounded-2xl bg-white p-3 text-xs">/guest/access?token={item.access_token}</p>}
                {item.status === 'pending' && (
                  <div className="mt-4 flex gap-2">
                    <form action={approveGuestRequest}><input type="hidden" name="id" value={item.id} /><PrimaryButton>同意访问</PrimaryButton></form>
                    <form action={rejectGuestRequest}><input type="hidden" name="id" value={item.id} /><PrimaryButton variant="danger">拒绝访问</PrimaryButton></form>
                  </div>
                )}
              </article>
            ))}
            {!data.guestRequests.length && <p className="text-sm text-rosehouse-muted">暂时没有访客申请。</p>}
          </div>
        </PinkCard>
      </div>
    </AppLayout>
  );
}
