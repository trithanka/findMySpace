/**
 * Instagram reels are stored as a bare shortcode, never as a pasted URL — the
 * embed `src` is built from it, so it must not contain arbitrary input.
 */

const SHORTCODE_PATTERN = /^[A-Za-z0-9_-]{5,30}$/;

/** Matches /reel/CODE, /reels/CODE, /p/CODE and /tv/CODE, with or without a host. */
const URL_PATTERN =
  /(?:instagram\.com)?\/(?:reels?|p|tv)\/([A-Za-z0-9_-]{5,30})/;

export class InstagramLinkError extends Error { }

/**
 * Extracts the shortcode from anything an admin might paste: a full reel URL,
 * a URL with tracking params, or the bare shortcode itself.
 * Throws on input we cannot resolve — `/share/` links carry no shortcode and
 * would need a network round trip, so they are rejected with guidance.
 */
export function parseInstagramShortcode(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  if (/\/share\//.test(value)) {
    throw new InstagramLinkError(
      "That's an Instagram share link. Open the reel in Instagram and copy the URL from the address bar (it should look like instagram.com/reel/ABC123/).",
    );
  }

  const matched = value.match(URL_PATTERN)?.[1];
  if (matched) return matched;

  // Bare shortcode pasted directly.
  if (!value.includes("/") && SHORTCODE_PATTERN.test(value)) return value;

  throw new InstagramLinkError(
    "Could not read an Instagram reel from that link. Paste the full URL, e.g. https://www.instagram.com/reel/ABC123/",
  );
}

export function instagramEmbedUrl(shortcode: string): string {
  return `https://www.instagram.com/reel/${encodeURIComponent(shortcode)}/embed/`;
}

export function instagramPermalink(shortcode: string): string {
  return `https://www.instagram.com/reel/${encodeURIComponent(shortcode)}/`;
}
