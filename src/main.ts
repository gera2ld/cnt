import {
  cors,
  logger,
  poweredBy,
  serveStatic,
} from "https://deno.land/x/hono@v3.7.5/middleware.ts";
import { Hono } from "https://deno.land/x/hono@v3.7.5/mod.ts";

const app = new Hono();

app.use("*", logger(), poweredBy());
app.use("/static/*", serveStatic({ root: "./static" }));
app.use("/", serveStatic({ path: "./static/index.html" }));
app.use("/get/*", cors());
app.use("/hit/*", cors());

app.get("/get/:key", async (c) => {
  const { key } = c.req.param();
  const payload: { error?: string; data?: number } = {};
  try {
    const kv = await Deno.openKv();
    const result = await kv.get<bigint>(["count", key]);
    payload.data = Number(result.value ?? 0n);
  } catch (err) {
    console.error(err);
    payload.error = err?.message || "Unknown error";
  }
  return c.json(payload);
});

app.get("/hit/:key", async (c) => {
  const { key } = c.req.param();
  const payload: { error?: string } = {};
  try {
    const kv = await Deno.openKv();
    await kv.atomic().sum(["count", key], 1n).commit();
  } catch (err) {
    console.error(err);
    payload.error = err?.message || "Unknown error";
  }
  return c.json(payload);
});

app.get("*", (c) => {
  return c.redirect("https://github.com/gera2ld/cnt");
});

Deno.serve(app.fetch);
