import { createServerFn } from "@tanstack/react-start";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwB9tlgx2OGaRzhTKkt6oHoi3nIYCMPwpnGFpCy4x1yEOdI3T2ASSJUAXVW11J5GwXW/exec";

type ContactLeadInput = {
  service?: string;
  budget?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  brief?: string;
  message?: string;
  source?: string;
};

type LeadPayload = Record<string, string>;

export const submitContactLead = createServerFn({ method: "POST" })
  .inputValidator((input: ContactLeadInput) => input)
  .handler(async ({ data }) => {
    const message = clean(data.message ?? data.brief);
    const lead: LeadPayload = {
      service: clean(data.service),
      budget: clean(data.budget),
      name: clean(data.name),
      email: clean(data.email),
      phone: clean(data.phone),
      company: clean(data.company),
      brief: message,
      message,
      source: clean(data.source) || "terostudios.com /contact",
      submittedAt: new Date().toISOString(),
    };

    if (!lead.name || !/^\S+@\S+\.\S+$/.test(lead.email)) {
      throw new Error("Name and valid email are required.");
    }

    const formResult = await postToAppsScript(lead, "form");
    if (formResult.ok) return { ok: true };

    const jsonResult = await postToAppsScript(lead, "json");
    if (jsonResult.ok) return { ok: true };

    throw new Error(jsonResult.error || formResult.error || "Lead could not be recorded.");
  });

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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