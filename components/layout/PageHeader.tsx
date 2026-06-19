export function PageHeader({ title, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-3xl font-black tracking-normal md:text-4xl">{title}</h1>
      {action}
    </header>
  );
}
