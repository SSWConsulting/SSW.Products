import { NextRequest, NextResponse } from 'next/server';

// Only SSW's own GitHub files. Checking the host alone isn't enough: anyone can
// host files on these hosts, and the route would serve them from our domains.
const ALLOWED_HOSTS = new Set(['raw.githubusercontent.com', 'github.com']);
const ALLOWED_OWNER = '/SSWConsulting/';

const MAX_BYTES = 25 * 1024 * 1024;
const TIMEOUT_MS = 15_000;

const isAllowed = (url: URL) =>
  url.protocol === 'https:' &&
  ALLOWED_HOSTS.has(url.hostname) &&
  url.pathname.startsWith(ALLOWED_OWNER);

// Read the body up to MAX_BYTES, so a large file can't fill the function's memory.
async function readCapped(response: Response): Promise<Uint8Array<ArrayBuffer> | null> {
  const declared = Number(response.headers.get('Content-Length'));
  if (declared > MAX_BYTES || !response.body) return null;

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL parameter' }, { status: 400 });
  }

  if (!isAllowed(parsedUrl)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 400 });
  }

  // From the path that's fetched, so a ?query or #fragment can't pick the name.
  let lastSegment = parsedUrl.pathname.split('/').pop() || '';
  try {
    lastSegment = decodeURIComponent(lastSegment);
  } catch {
    // Keep the encoded name.
  }
  const filename = lastSegment.replace(/["\\\r\n]/g, '') || 'download';

  try {
    const response = await fetch(parsedUrl, { signal: AbortSignal.timeout(TIMEOUT_MS) });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: response.status });
    }

    const body = await readCapped(response);
    if (!body) {
      return NextResponse.json({ error: 'File too large' }, { status: 413 });
    }

    return new NextResponse(body, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Length': body.byteLength.toString(),
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      }
    });
  } catch {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
