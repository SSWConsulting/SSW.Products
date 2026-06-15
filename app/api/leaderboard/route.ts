// Cache at the CDN; the homepage fetches this on every load.
const CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=3600';

export async function GET() {
    try {
      const response = await fetch('https://api.yakshaver.ai/api/leaderboard/total-counts', {
        next: { revalidate: 300 },
      });
      if (!response.ok) {
        return new Response(JSON.stringify({ error: `HTTP error! Status: ${response.status}` }), { status: response.status });
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Cache-Control': CACHE_CONTROL },
      });
    } catch (error) {
      console.error('Failed to fetch leaderboard data:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch leaderboard data' }), { status: 500 });
    }
  }
