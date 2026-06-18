import { LoginPanel } from '@/components/LoginPanel';

export default function LoginPage() {
  return (
    <main className="page-shell flex min-h-screen flex-col justify-center py-10">
      <div className="mb-8 text-center">
        <p className="text-sm font-bold text-rosehouse-muted">Wish You, Yield Happiness</p>
        <h1 className="mt-2 text-4xl font-black md:text-6xl">欢迎来到 WY 和 YYH 的小屋</h1>
        <p className="mt-4 text-rosehouse-muted">请选择身份，进入只属于我们的甜蜜空间</p>
      </div>
      <LoginPanel />
    </main>
  );
}
