import { NextResponse } from "next/server";
import {
  loadFullDatabaseState,
  saveFullDatabaseState,
  type FullAppDatabaseState,
} from "@/lib/db";

const processedIdempotencyKeys = new Set<string>();

export async function GET() {
  try {
    const state = await loadFullDatabaseState();
    return NextResponse.json({ ok: true, data: state });
  } catch (err) {
    console.error("Database GET /api/state error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const idempotencyKey = req.headers.get("X-Idempotency-Key");
    if (idempotencyKey && processedIdempotencyKeys.has(idempotencyKey)) {
      return NextResponse.json({ ok: true, deduplicated: true });
    }

    const body = (await req.json()) as Partial<FullAppDatabaseState>;
    await saveFullDatabaseState(body);

    if (idempotencyKey) {
      processedIdempotencyKeys.add(idempotencyKey);
      if (processedIdempotencyKeys.size > 500) {
        const firstKey = processedIdempotencyKeys.values().next().value;
        if (firstKey) processedIdempotencyKeys.delete(firstKey);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Database POST /api/state error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Database save error" },
      { status: 500 }
    );
  }
}
