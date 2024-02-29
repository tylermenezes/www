import { fetchCv, CvList, UnionToIntersection } from '@/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

type CvEntry = { title: string, items: CvList };

function* cvListItemToTex(
  item: Partial<UnionToIntersection<CvList[number]>>
): Generator<string> {
  if (item.cite) {
    yield item.cite
      .replace(/\.$/, '')
      .replace(item.title || 'IGNOREME', `\\textbf{${item.title}}`);
    return;
  }

  if (item.interval) yield item.interval;
  else if (item.date) yield item.date;
  
  if (item.role && item.company) yield `\\textbf{${item.role} at ${item.company}}`;
  if (item.degree && item.school) yield `${item.degree}, ${item.school}`;
  if (item.title) yield `\\textbf{\`\`${item.title}''}`;

  if (item.outlet) yield item.outlet;
  if (item.venue) yield item.venue;

  if (item.blurb && (item as { type: string }).type === 'role') {
    yield ' \\\\ \\begin{sublist}' + item.blurb
      .replace(/ *[\-\*] +/g, '\\item ')
      .replace(/\n\w*$/, '')
      .replace(/\n/g, '')
      + '\\end{sublist}'
  };
}

function cvListToTex(list: CvList): string {
  return list
    .map(i => 
      '\\item '
      + [...cvListItemToTex(i)]
        .join('. ')
        .replace(/\&/g, '\\&')
        .replace(/\$/g, '\\$')
        .replace(/\%/g, '\\%')
        .replace(/(https?:\/\/[\w\.\/\?]+)/g, '\\href{$1}{$1}')
    )
    .join('\n');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  const entries = await fetchCv();
  const sections: CvEntry[] = [
    {
      title: 'Work',
      items: entries.roles,
    },
    {
      title: 'Education',
      items: entries.education,
    },
    {
      title: 'Publications',
      items: entries.publications,
    },
    {
      title: 'Service \\& Outreach',
      items: entries.volunteering,
    },
    {
      title: 'Lectures, Talks, Workshops',
      items: entries.talksInterviews,
    },
    {
      title: 'Press',
      items: entries.press,
    },
  ];

  const texBody = sections
    .map(({ title, items }) => `\\section{${title}}\n\\begin{cvlist}\n${cvListToTex(items)}\n\\end{cvlist}`)
    .join(`\n\n`);

  res.setHeader('Content-type', 'text/plain').send(texBody);

}