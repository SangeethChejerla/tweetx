import { z } from 'zod';

export const AVAILABLE_OPTIONS = ['No Image', 'WithImage'] as const;

export const AVAILABLE_SORT = ['Latest', 'Oldest'] as const;

export const TweetFilterValidator = z.object({
  options: z.array(z.enum(AVAILABLE_OPTIONS)),
  sort: z.enum(AVAILABLE_SORT),
  BangerLevel: z.tuple([z.number(), z.number()]),
});
export type TweetState = Omit<
  z.infer<typeof TweetFilterValidator>,
  'BangerLevel'
> & {
  BangerLevel: { isCustom: boolean; range: [number, number] };
};
