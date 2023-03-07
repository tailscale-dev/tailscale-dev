import type { NextApiRequest, NextApiResponse } from 'next';
import getSearchChannel from '@/lib/utils/sonic';

export interface SearchResults {
  posts?: string[];
  message?: string;
}

export default async function search(req: NextApiRequest, res: NextApiResponse) {
  const q = req.query.q;
  if (q === undefined) {
    res.status(400).json({ message: 'must include search query q=' });
    return;
  }

  // XXX(Xe): this is synchronous, but there's no way to avoid it
  const ch = getSearchChannel();

  const posts = await ch.query('posts', 'blog', q as string);
  if (posts.length == 0) {
    res.status(200).json({ message: 'no posts found' });
    return;
  }

  await ch.close();

  res.status(200).json({ posts });
}
