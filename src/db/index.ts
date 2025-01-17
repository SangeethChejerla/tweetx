import { Index } from '@upstash/vector';
import * as dotenv from 'dotenv';

dotenv.config();

export type Tweetx = {
  id: string;
  name: string;
  option: 'NoImage' | 'WithImage';
  bangerlevel: number;
};
export const db = new Index<Tweetx>();
