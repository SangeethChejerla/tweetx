'use server';

import { createVector, db, Tweet, TweetSchema } from '@/db';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function addTweet(formData: FormData) {
  try {
    const parsed = TweetSchema.parse({
      name: formData.get('name'),
      content: formData.get('content'),
      option: formData.get('option'),
      bangerlevel: Number(formData.get('bangerlevel')),
    });

    const vector = createVector(parsed.bangerlevel, parsed.option);

    const tweet: Tweet = {
      id: uuidv4(),
      ...parsed,
      vector,
      createdAt: new Date().toISOString(),
    };

    // Add to vector database with proper parameters
    await db.upsert([
      {
        id: tweet.id,
        metadata: tweet,
        vector: vector,
      },
    ]);

    revalidatePath('/');
    return { success: true, data: tweet };
  } catch (error) {
    console.error('Error adding tweet:', error);
    return { error: 'Failed to add tweet' };
  }
}

export async function updateTweet(id: string, formData: FormData) {
  try {
    const parsed = TweetSchema.parse({
      name: formData.get('name'),
      content: formData.get('content'),
      option: formData.get('option'),
      bangerlevel: Number(formData.get('bangerlevel')),
    });

    const vector = createVector(parsed.bangerlevel, parsed.option);

    const tweet: Tweet = {
      id,
      ...parsed,
      vector,
      createdAt: new Date().toISOString(),
    };

    await db.upsert([
      {
        id: tweet.id,
        metadata: tweet,
        vector: vector,
      },
    ]);

    revalidatePath('/');
    return { success: true, data: tweet };
  } catch (error) {
    console.error('Error updating tweet:', error);
    return { error: 'Failed to update tweet' };
  }
}

export async function findSimilarTweets(id: string) {
  try {
    // First get the tweet to find its vector
    const tweetResult = await db.query({
      topK: 1,
      vector: Array(3).fill(0),
      includeMetadata: true,
      filter: { id: { $eq: id } },
    });

    if (!tweetResult.length || !tweetResult[0].metadata) {
      return { error: 'Tweet not found' };
    }

    const tweet = tweetResult[0].metadata as Tweet;

    // Then find similar tweets
    const similar = await db.query({
      topK: 5,
      vector: tweet.vector,
      includeMetadata: true,
      filter: { id: { $ne: id } },
    });

    const similarTweets = similar
      .filter((item) => item && item.metadata)
      .map((item) => item.metadata as Tweet);

    return { data: similarTweets };
  } catch (error) {
    console.error('Error finding similar tweets:', error);
    return { error: 'Failed to find similar tweets' };
  }
}

export async function deleteTweet(id: string) {
  try {
    await db.delete([id]);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting tweet:', error);
    return { error: 'Failed to delete tweet' };
  }
}
