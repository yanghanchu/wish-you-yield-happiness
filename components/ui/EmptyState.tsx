export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="love-card flex min-h-48 flex-col items-center justify-center p-8 text-center">
      <p className="text-lg font-black">{title}</p>
      <p className="mt-2 max-w-md text-sm text-rosehouse-muted">{text}</p>
    </div>
  );
}
