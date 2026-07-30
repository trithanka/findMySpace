import dns from "node:dns";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Neon's host resolves to both A and AAAA records. On networks without working
// IPv6 (mobile hotspots, most Indian ISPs), fetch picks the v6 address and dies
// with "TypeError: fetch failed". Force v4 first.
if (typeof window === "undefined") {
  dns.setDefaultResultOrder("ipv4first");
}

/*
 * Neon is reached over HTTP, so a single dropped packet surfaces as
 * "TypeError: fetch failed" and blanks the whole page. Retry the request a
 * couple of times before giving up — these failures are transient and clear
 * within a second. Only network-level errors are retried; a real SQL error
 * comes back as a normal HTTP response and is passed straight through.
 */
const RETRIES = 3;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

neonConfig.fetchFunction = async (input: unknown, init: unknown) => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      return await fetch(input as RequestInfo, init as RequestInit);
    } catch (error) {
      lastError = error;
      if (attempt < RETRIES) await sleep(attempt * 250);
    }
  }

  throw lastError;
};

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql, schema });
