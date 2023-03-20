import type { NextApiRequest, NextApiResponse } from 'next';

export interface SearchResults {
  posts?: string[];
  message?: string;
}

export interface SearchRequest {
  q: string;
}

export const lookerLookup = async (req: SearchRequest): Promise<SearchResults> => {
  const resp = await fetch(`${process.env.LOOKER_URL}/api/search?q=${encodeURIComponent(req.q)}`, {
    headers: {
      Authorization: `Bearer ${process.env.LOOKER_TOKEN}`,
    },
  });
  return await resp.json();
};

export default async function search(req: NextApiRequest, res: NextApiResponse) {
  const q = req.query.q as string;
  if (q === undefined) {
    res.status(400).json({ message: 'must include search query q=' });
    return;
  }

  const { message, posts } = await lookerLookup({ q });

  if (message !== undefined) {
    res.status(500).json({ message });
    return;
  }

  res.status(200).json({ posts });
}
