import { cors } from "jsr:@hono/hono/cors";
import { logger } from "jsr:@hono/hono/logger";
import { poweredBy } from "jsr:@hono/hono/powered-by";
import { serveStatic } from "jsr:@hono/hono/deno";
import { Hono } from "jsr:@hono/hono";

const app = new Hono();

app.use("*", logger(), poweredBy());
app.use("/static/*", serveStatic({ root: "./static" }));
app.use("/", serveStatic({ path: "./static/index.html" }));
app.use("/get/*", cors());
app.use("/hit/*", cors());

app.get("/get/:key", async (c) => {
  const { key } = c.req.param();
  const keys = key.split(",").filter(Boolean).map((k) => ["count", k]);
  const payload: { error?: string; data?: Record<string, number> } = {};
  try {
    const kv = await Deno.openKv();
    const result = await kv.getMany<bigint[]>(keys);
    payload.data = Object.fromEntries(
      result.map((item) => [item.key.at(-1), Number(item.value ?? 0n)]),
    );
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
