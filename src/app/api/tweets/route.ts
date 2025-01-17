import { db, Tweet } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search')?.toLowerCase();

    // Fetch all tweets with proper parameters
    const results = await db.query({
      topK: 100, // Adjust based on your needs
      vector: Array(3).fill(0), // Match the vector dimensions you're using
      includeMetadata: true,
    });

    // Extract and type the tweets from the metadata
    const tweets: Tweet[] = results
      .filter((item) => item && item.metadata)
      .map((item) => item.metadata as Tweet);

    // Apply search filter if search parameter exists
    const filteredTweets = search
      ? tweets.filter(
          (tweet) =>
            tweet.name.toLowerCase().includes(search) ||
            tweet.content.toLowerCase().includes(search)
        )
      : tweets;

    // Sort by newest first
    const sortedTweets = [...filteredTweets].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json(sortedTweets);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tweets' },
      { status: 500 }
    );
  }
}
