"use client";

import React, { useState, useEffect } from "react";

/**
 * Helper murni untuk menghasilkan format waktu WIB terkini (misal: "07:45:21 WIB")
 * tanpa memicu re-render atau bergantung pada interval state React.
 */
export function getFormattedServerTime(): string {
  const now = new Date();
  return (
    now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " WIB"
  );
}

/**
 * Hook terisolasi untuk komponen yang membutuhkan sinkronisasi jam setiap detik.
 * Hanya komponen yang secara eksplisit memanggil hook ini yang akan di-render ulang.
 */
export function useClock(): string {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      setTime(getFormattedServerTime());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

/**
 * Komponen ServerClock terisolasi.
 * Mengisolasi update per detik ke DOM node spesifik ini sehingga parent
 * container (seperti Topbar atau AbsensiView) tidak perlu ikut re-render cascade.
 */
export function ServerClock({
  className,
  fallback = "--:--:-- WIB",
}: {
  className?: string;
  fallback?: string;
}) {
  const time = useClock();
  return <span className={className}>{time || fallback}</span>;
}

export default ServerClock;
