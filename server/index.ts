import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { createClient } from "@supabase/supabase-js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Admin: minimal health check to verify Supabase admin connectivity (no PII)
  app.get("/api/admin/health", async (_req, res) => {
    try {
      const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !serviceKey) {
        return res.status(500).json({ ok: false, error: "Missing SUPABASE env" });
      }
      const admin = createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data, error } = await admin.from("profiles").select("id").limit(1);
      if (error) return res.status(500).json({ ok: false, error: error.message });
      return res.json({ ok: true, sample: data?.length ?? 0 });
    } catch (e: any) {
      return res.status(500).json({ ok: false, error: e?.message || "unknown" });
    }
  });

  return app;
}
