'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tweet } from '@/db';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TweetCard } from './Tweet';

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function TweetList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: tweets, isLoading } = useQuery<Tweet[]>({
    queryKey: ['tweets', searchTerm],
    queryFn: async () => {
      const response = await fetch(
        `/api/tweets${searchTerm ? `?search=${searchTerm}` : ''}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch tweets');
      }
      return response.json();
    },
  });

  const debouncedSearch = debounce((term: string) => {
    setSearchTerm(term);
  }, 300);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Search tweets..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => router.push('/tweets/new')}>
          Add New Tweet
        </Button>
      </div>

      {tweets?.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No tweets found</h3>
          <p className="text-gray-600">Get started by creating a new tweet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tweets?.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      )}
    </div>
  );
}
