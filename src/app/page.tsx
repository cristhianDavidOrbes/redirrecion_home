import { Suspense } from 'react';
import ResetBridge from './ResetBridge';

// Evita el prerender estático para esta página (opcional pero recomendable)
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh grid place-items-center p-6">
          <div className="max-w-lg w-full rounded-2xl border border-black/10 dark:border-white/15 p-6 shadow-lg bg-white dark:bg-zinc-900">
            <h1 className="text-xl font-semibold mb-2">Restablecer contraseña</h1>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Preparando puente hacia la app…
            </p>
          </div>
        </div>
      }
    >
      <ResetBridge />
    </Suspense>
  );
}
