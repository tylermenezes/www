import { fetchCv } from '@/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json(await fetchCv());
}