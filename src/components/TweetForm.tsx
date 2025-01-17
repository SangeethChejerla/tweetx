'use client';

import { addTweet, updateTweet } from '@/actions/tweetAction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tweet } from '@/db';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface TweetFormProps {
  tweet?: Tweet;
  isEditing?: boolean;
}

export function TweetForm({ tweet, isEditing }: TweetFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = isEditing
        ? await updateTweet(tweet!.id, formData)
        : await addTweet(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(isEditing ? 'Tweet updated!' : 'Tweet added!');
      router.push('/');
    });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Tweet' : 'Add New Tweet'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={tweet?.name}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={tweet?.content}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Option</Label>
            <RadioGroup
              name="option"
              defaultValue={tweet?.option || 'NoImage'}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="NoImage" id="no-image" />
                <Label htmlFor="no-image">No Image</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="WithImage" id="with-image" />
                <Label htmlFor="with-image">With Image</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Banger Level (1-10)</Label>
            <Slider
              name="bangerlevel"
              min={1}
              max={10}
              step={1}
              defaultValue={[tweet?.bangerlevel || 5]}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Saving...' : isEditing ? 'Update Tweet' : 'Add Tweet'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
