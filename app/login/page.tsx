import { LoginPanel } from '@/components/LoginPanel';

export default function LoginPage() {
  return (
    <main className="page-shell flex min-h-screen flex-col justify-center py-10">
      <div className="mb-7 text-center">
        <h1 className="text-4xl font-black tracking-normal text-rosehouse-ink md:text-6xl">今天也喜欢你一下</h1>
      </div>
      <LoginPanel />
    </main>
  );
}
