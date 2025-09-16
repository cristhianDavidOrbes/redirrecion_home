'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Ajusta estos valores a tu app:
 * - SCHEME: esquema de tu deep link (debe coincidir con el AndroidManifest).
 * - PKG:    packageName Android (para intent:// en Chrome/Android).
 * - HOSTTXT: solo para mostrar el ejemplo en la UI.
 */
const SCHEME = 'casa_segura'; // coincide con <data android:scheme="casa_segura" android:host="reset" />
const PKG = 'com.example.flutter_seguridad_en_casa';
const HOSTTXT = 'redireccion-home-6rj5hjz68.vercel.app';

export default function ResetCallbackPage() {
  const params = useSearchParams();

  // Appwrite añade estos query params a la Recovery URL
  const userId = params.get('userId');
  const secret = params.get('secret');

  // Deep link principal a la app nativa: casa_segura://reset?userId=...&secret=...
  const deepLink = useMemo(() => {
    if (!userId || !secret) return null;
    return `${SCHEME}://reset?userId=${encodeURIComponent(userId)}&secret=${encodeURIComponent(secret)}`;
  }, [userId, secret]);

  // Fallback intent:// para Chrome/Android
  const intentLink = useMemo(() => {
    if (!userId || !secret) return null;
    return `intent://reset?userId=${encodeURIComponent(userId)}&secret=${encodeURIComponent(
      secret
    )}#Intent;scheme=${SCHEME};package=${PKG};end`;
  }, [userId, secret]);

  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!deepLink) return;

    const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
    const isAndroid = ua.includes('android');
    const isChrome = ua.includes('chrome');

    // 1) En Android/Chrome usamos intent://
    if (isAndroid && isChrome && intentLink) {
      window.location.replace(intentLink);
    } else {
      // 2) En el resto: intentamos directamente el esquema
      window.location.replace(deepLink);
    }

    // Si la página sigue visible después de 1.5s, mostramos fallback
    const t = setTimeout(() => {
      if (!document.hidden) setShowFallback(true);
    }, 1500);

    return () => clearTimeout(t);
  }, [deepLink, intentLink]);

  const retry = () => {
    if (!deepLink) return;
    window.location.href = deepLink;
  };

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-black/10 dark:border-white/15 p-6 shadow-lg bg-white dark:bg-zinc-900">
        <h1 className="text-xl font-semibold mb-2">Restablecer contraseña</h1>

        {!userId || !secret ? (
          <>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Esta URL debe incluir los parámetros <code className="font-mono">userId</code> y{' '}
              <code className="font-mono">secret</code>. Abre el enlace desde el correo de recuperación enviado por Appwrite.
            </p>
            <p className="text-xs mt-3 text-zinc-500">
              Ejemplo:{' '}
              <code className="font-mono">https://{HOSTTXT}/reset-callback?userId=...&amp;secret=...</code>
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">Intentando abrir tu app automáticamente…</p>
            <p className="text-xs mt-2 text-zinc-500 break-all">
              Deep link: <span className="font-mono">{deepLink}</span>
            </p>

            {showFallback && (
              <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-50 dark:bg-amber-900/20 p-4">
                <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                  No pudimos abrir la app automáticamente.
                </p>

                <button
                  onClick={retry}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Reintentar abrir la app
                </button>

                <ul className="text-xs mt-3 text-zinc-600 dark:text-zinc-400 list-disc pl-5 space-y-1">
                  <li>Verifica que la app esté instalada.</li>
                  <li>
                    En Android, el esquema <code className="font-mono">{SCHEME}://</code> y el{' '}
                    <code className="font-mono">host="reset"</code> deben existir en tu AndroidManifest.
                  </li>
                  <li>
                    En Appwrite, la <em>Recovery URL</em> debe ser{' '}
                    <code className="font-mono">https://{HOSTTXT}/reset-callback</code>.
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
