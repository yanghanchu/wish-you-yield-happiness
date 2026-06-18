import { GuestWaitingPanel } from '@/components/GuestWaitingPanel';

export default async function GuestWaitingPage({ searchParams }: { searchParams: Promise<{ requestId?: string }> }) {
  const { requestId } = await searchParams;
  return (
    <main className="page-shell flex min-h-screen flex-col justify-center py-10">
      <GuestWaitingPanel requestId={requestId ?? ''} />
    </main>
  );
}
