import { NextRequest, NextResponse } from 'next/server';

// This route proxies whatever `?url` is passed, so without a host allowlist it
// is an open proxy — and with CDN caching that would let arbitrary external
// content be pinned under our own domain. Restrict it to the GitHub asset hosts
// our content actually links to (ImageGrid downloads use raw.githubusercontent.com).
const ALLOWED_HOSTS = new Set([
  'raw.githubusercontent.com',
  'github.com',
  'objects.githubusercontent.com',
]);

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

  if (parsedUrl.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    return NextResponse.json({ error: 'URL host not allowed' }, { status: 400 });
  }

  const filename = url.split('/').pop() || 'download';

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Length': buffer.byteLength.toString(),
        // Downloads point at static release artifacts. Cache successful proxies
        // at the CDN (keyed on the ?url param) so we don't re-stream the file
        // through the function on every request.
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      }
    });
  } catch {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
