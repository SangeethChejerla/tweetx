import { TweetList } from '@/components/TweetList';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Tweets</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <TweetList />
      </Suspense>
    </main>
  );
}
