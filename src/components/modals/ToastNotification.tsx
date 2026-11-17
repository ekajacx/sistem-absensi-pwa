"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ToastNotification() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 animate-slide-up ${
        toastMessage.type === "error"
          ? "bg-red-950/90 border-red-500/50 text-red-200 shadow-red-950/50"
          : toastMessage.type === "info"
          ? "bg-sky-950/90 border-sky-500/50 text-sky-200 shadow-sky-950/50"
          : "bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50"
      }`}
    >
      {toastMessage.type === "error" ? (
        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
      )}
      <span>{toastMessage.text}</span>
    </div>
  );
}
