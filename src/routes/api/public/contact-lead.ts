import { createFileRoute } from "@tanstack/react-router";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwB9tlgx2OGaRzhTKkt6oHoi3nIYCMPwpnGFpCy4x1yEOdI3T2ASSJUAXVW11J5GwXW/exec";

type LeadPayload = Record<string, string>;

export const Route = createFileRoute("/api/public/contact-lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown>;

        try {
          body = await request.json();
        } catch {
          return json({ ok: false, error: "Invalid contact form payload." }, 400);
        }

        const message = clean(body.message ?? body.brief);
        const lead: LeadPayload = {
          service: clean(body.service),
          budget: clean(body.budget),
          name: clean(body.name),
          email: clean(body.email),
          phone: clean(body.phone),
          company: clean(body.company),
          brief: message,
          message,
          source: clean(body.source) || "terostudios.com /contact",
          submittedAt: new Date().toISOString(),
        };

        if (!lead.name || !/^\S+@\S+\.\S+$/.test(lead.email)) {
          return json({ ok: false, error: "Name and valid email are required." }, 400);
        }

        const formResult = await postToAppsScript(lead, "form");
        if (formResult.ok) return json({ ok: true });

        const jsonResult = await postToAppsScript(lead, "json");
        if (jsonResult.ok) return json({ ok: true });

        return json(
          {
            ok: false,
            error: jsonResult.error || formResult.error || "Lead could not be recorded.",
          },
          502,
        );
      },
    },
  },
});

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function postToAppsScript(lead: LeadPayload, format: "form" | "json") {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers:
        format === "form"
          ? { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" }
          : { "Content-Type": "application/json;charset=UTF-8" },
      body:
        format === "form"
          ? new URLSearchParams(lead).toString()
          : JSON.stringify(lead),
      redirect: "follow",
    });
    const text = await response.text();
    const parsed = safeJson(text);

    if (!response.ok) {
      return { ok: false, error: `Apps Script returned ${response.status}.` };
    }

    if (parsed && parsed.ok === false) {
      return { ok: false, error: String(parsed.error || "Apps Script rejected the lead.") };
    }

    if (/ServiceLogin|accounts\.google\.com|<html/i.test(text)) {
      return { ok: false, error: "Apps Script is not deployed with public access." };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unknown submit error." };
  }
}

function safeJson(text: string): { ok?: boolean; error?: unknown } | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}