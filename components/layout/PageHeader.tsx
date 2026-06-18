export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-bold text-rosehouse-muted">Wish You, Yield Happiness</p>
        <h1 className="mt-1 text-3xl font-black tracking-normal md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-rosehouse-muted md:text-base">{subtitle}</p>
      </div>
      {action}
    </header>
  );
}
