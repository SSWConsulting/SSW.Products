export async function GET() {
    try {
      const response = await fetch('https://api.yakshaver.ai/api/leaderboard/total-counts');
      if (!response.ok) {
        return new Response(JSON.stringify({ error: `HTTP error! Status: ${response.status}` }), { status: response.status });
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      console.error('Failed to fetch leaderboard data:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch leaderboard data' }), { status: 500 });
    }
  }
  