// apps/frontend/src/lib/analytics.ts
import { isSupabaseConfigured, supabase } from "./supabase";

/**
 * Silently records a page view in Supabase to track visitor traffic
 * and keep the Supabase free-tier database active.
 */
export async function recordPageView(path: string = window.location.pathname): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  try {
    // Avoid duplicate logs for the same path within a short 5-minute window in the same browser session
    const storageKey = `janedesk_pv_${path}`;
    const lastRecorded = sessionStorage.getItem(storageKey);
    const now = Date.now();

    if (lastRecorded && now - Number(lastRecorded) < 5 * 60 * 1000) {
      return;
    }

    sessionStorage.setItem(storageKey, String(now));

    // Get or generate an anonymous visitor ID stored in localStorage
    let visitorId = localStorage.getItem("janedesk_visitor_id");
    if (!visitorId) {
      visitorId = `v_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      localStorage.setItem("janedesk_visitor_id", visitorId);
    }

    await supabase.from("page_views").insert({
      path,
      visitor_id: visitorId,
      user_agent: navigator.userAgent.slice(0, 150),
    });
  } catch {
    // Fail silently so analytics never interrupt user experience
  }
}
