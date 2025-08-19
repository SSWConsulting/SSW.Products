import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const filename = searchParams.get('filename');
  
  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return new NextResponse('Failed to fetch file', { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    const headers = new Headers();
    
    headers.set('Content-Disposition', `attachment; filename="${filename || 'download'}"`);
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Content-Length', buffer.byteLength.toString());
    
    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Failed to download file', { status: 500 });
  }
}
