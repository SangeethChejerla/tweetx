import { TweetForm } from '@/components/TweetForm';
import { db } from '@/db';
import { notFound } from 'next/navigation';

export default async function EditTweetPage({
  params,
}: {
  params: { id: string };
}) {
  const tweets = await db.fetch([params.id]);

  if (!tweets.length) {
    notFound();
  }

  return <TweetForm tweet={tweets[0]} isEditing />;
}
