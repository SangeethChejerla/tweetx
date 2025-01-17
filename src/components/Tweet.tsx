'use client';

import { deleteTweet, findSimilarTweets } from '@/actions/tweetAction';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Tweet } from '@/db';
import { Pen, Share2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface TweetProps {
  tweet: Tweet;
}

export function TweetCard({ tweet }: TweetProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);
  const [similarTweets, setSimilarTweets] = useState<Tweet[]>([]);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this tweet?')) return;
    setIsLoading(true);
    try {
      const result = await deleteTweet(tweet.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Tweet deleted!');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete tweet');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFindSimilar() {
    setIsLoading(true);
    try {
      const result = await findSimilarTweets(tweet.id);
      if ('error' in result) {
        toast.error(result.error);
        return;
      }
      setSimilarTweets(result.data);
      setShowSimilar(true);
    } catch (error) {
      toast.error('Failed to find similar tweets');
    } finally {
      setIsLoading(false);
    }
  }

  const bangerLevelColor =
    tweet.bangerlevel >= 8
      ? 'text-green-500'
      : tweet.bangerlevel >= 5
      ? 'text-yellow-500'
      : 'text-red-500';

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="font-semibold text-lg">{tweet.name}</h3>
        <span className={`font-bold ${bangerLevelColor}`}>
          {tweet.bangerlevel}/10
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-gray-700">{tweet.content}</p>
          <p className="text-sm text-gray-600">Type: {tweet.option}</p>
          <p className="text-sm text-gray-600">
            Posted: {new Date(tweet.createdAt).toLocaleDateString()}
          </p>
          {showSimilar && similarTweets.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Similar Tweets:</h4>
              <ul className="space-y-2">
                {similarTweets.map((similar) => (
                  <li key={similar.id} className="text-sm text-gray-600">
                    {similar.name} - {similar.bangerlevel}/10
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/tweets/${tweet.id}/edit`)}
          >
            <Pen className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFindSimilar}
            disabled={isLoading}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Similar
          </Button>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
