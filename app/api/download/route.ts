import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
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
      }
    });
  } catch {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
