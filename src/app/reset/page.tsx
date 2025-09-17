import { Suspense } from 'react';
import ResetBridge from './ResetBridge';



export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Cargando…</div>}>
      <ResetBridge />
    </Suspense>
  );
}
