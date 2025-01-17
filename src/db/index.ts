import { Index } from '@upstash/vector';
import { z } from 'zod';

export type Tweet = {
  id: string;
  name: string;
  content: string; // Added content field
  option: 'NoImage' | 'WithImage';
  bangerlevel: number;
  vector: number[];
  createdAt: Date;
};

export const db = new Index<Tweet>();

export function createVector(
  bangerlevel: number,
  option: 'NoImage' | 'WithImage'
): number[] {
  return [bangerlevel / 10, option === 'NoImage' ? 0 : 1, Math.random()];
}

export const TweetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  content: z.string().min(1, 'Content is required'),
  option: z.enum(['NoImage', 'WithImage']),
  bangerlevel: z.number().min(1).max(10),
});

export const AVAILABLE_OPTIONS = ['NoImage', 'WithImage'] as const;
export const AVAILABLE_SORT = ['Latest', 'Oldest'] as const;

export const TweetFilterSchema = z.object({
  name: z.string(),
  options: z.array(z.enum(AVAILABLE_OPTIONS)),
  sort: z.enum(AVAILABLE_SORT),
  bangerLevel: z.tuple([z.number(), z.number()]),
});

export type TweetFilter = z.infer<typeof TweetFilterSchema>;
