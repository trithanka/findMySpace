import dns from "node:dns";
import { neon, neonConfig } from "@neondatabase/serverless";
import {
  drizzle as drizzleNeon,
  type NeonHttpDatabase,
} from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

/**
 * Neon speaks its own HTTP protocol, which a plain PostgreSQL server does not
 * understand, so the driver has to follow the connection string rather than be
 * fixed. This is what lets local development run against the Docker container
 * on :5436 while production stays on Neon — change `DATABASE_URL`, nothing else.
 */
const isNeon = /\.neon\.tech/.test(connectionString);

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

/**
 * The local client is cached on `globalThis` because Next.js re-evaluates
 * modules on every hot reload in development, and a fresh connection pool each
 * time exhausts the server's connection limit within a few edits. The Neon
 * client is stateless HTTP and needs no such care.
 */
const globalForDb = globalThis as unknown as {
  localSql?: ReturnType<typeof postgres>;
};

function createLocalClient() {
  globalForDb.localSql ??= postgres(connectionString, { max: 5 });
  return globalForDb.localSql;
}

/*
 * Typed as the Neon client because that is what production runs and what the
 * queries were written against. The cast is safe: both drivers expose the same
 * query-building and relational API, and the parts that genuinely differ —
 * neon-http cannot do interactive transactions — are not used anywhere here.
 * Without it, `db` becomes a union and TypeScript loses the overloads for
 * `.returning()`.
 */
export const db = (
  isNeon
    ? drizzleNeon({ client: neon(connectionString), schema })
    : drizzlePostgres({ client: createLocalClient(), schema })
) as NeonHttpDatabase<typeof schema>;
