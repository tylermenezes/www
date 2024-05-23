import { Content, Paragraph } from 'mdast'
import serverConfig from '@/config/serverConfig';
import { obsidianFetch } from "./fetch";
import { markdownParse, renderMarkdown } from '../markdown';
import { HeadingTree, treeReorganizeByHeading, valuesRecursive, treeToString } from '../tree';
import clientConfig from '@/config/clientConfig';

export interface WorkExperience { role: string | null, company: string | null, interval: string | null, blurb: string | null };
function parseWorkExperience(content: Content[]): WorkExperience {
  const company = treeToString([content[0]]);
  const [role, interval] = treeToString([content[1]]).split(' , ').map(e => e.trim());
  const blurb = renderMarkdown(valuesRecursive(content.slice(2)));
  return { role, company, interval, blurb };
}

export interface Education { school: string | null, degree: string | null, interval: string | null}
function parseEducation(content: Content[]): Education {
  const school = treeToString([content[0]]);
  const [degree, interval] = treeToString([content[1]]).split(', ').map(e => e.trim());
  return { school, degree, interval };
}

export interface Publication { url: string | null, title: string | null, conference: string | null, date: string | null, authors: string | null, cite: string | null, abstract: string | null, recommended: boolean }; 
function parsePublication(_content: Content[] | HeadingTree): Publication {
  const content = '_' in _content ? _content._ as Content[] : _content as Content[];
  const link = content[0].type === 'heading' && (content[0].children as Content[])?.filter(c => c.type === 'link')[0];
  const url = link && link.type === 'link' && link.url || null;
  const title = treeToString([content[0]]);

  const infoNode = content[1].type === 'paragraph' && content[1];
  const citeNode = 'Citation' in _content
    ? (_content.Citation as Content[])[1].type === 'paragraph' && (_content.Citation as Content[])[1] as Paragraph
    : null;
  const abstractNode = 'Abstract' in _content
    ? (_content.Abstract as Content[])[1].type === 'paragraph' && (_content.Abstract as Content[])[1] as Paragraph
    : null;

  const [conference, date] = infoNode ? treeToString(infoNode.children.slice(0, 2)).split(', ').map(e => e.trim()) : [];
  const authors = infoNode ? treeToString(infoNode.children.slice(3,4)).trim() : null;
  const recommended = infoNode ? treeToString(infoNode.children.slice(4,5)).toLowerCase().trim().includes('recommended') : false;
  const cite = citeNode ? treeToString(citeNode.children).trim() : null;
  const abstract = abstractNode ? treeToString(abstractNode.children).trim() : null;
  return { url, title, conference, date, authors, recommended, cite, abstract };
}

export interface Press { url: string | null, title: string | null, outlet: string | null, date: string | null, recommended: boolean };
function parsePress(content: Content[]): Press {
  const link = content[0].type === 'heading' && (content[0].children as Content[])?.filter(c => c.type === 'link')[0];
  const url = link && link.type === 'link' && link.url || null;
  const title = treeToString([content[0]]);

  const infoNode = content[1].type === 'paragraph' && content[1];

  const [outlet, date] = infoNode ? treeToString(infoNode.children.slice(0, 2)).split(', ').map(e => e.trim()) : [];
  const recommended = infoNode ? treeToString(infoNode.children.slice(3)).toLowerCase().trim().includes('recommended') : false;
  return { url, title, outlet, date, recommended };
}

export interface OpenSource { url: string | null, title: string | null, description: string | null };
function parseOpenSource(content: Content[]): OpenSource {
  const link = content[0].type === 'heading' && (content[0].children as Content[])?.filter(c => c.type === 'link')[0];
  const url = link && link.type === 'link' && link.url || null;
  const title = treeToString([content[0]]);
  const description = treeToString([content[1]]);
  return { url, title, description };
}

export interface Talk { url: string | null, title: string | null, venue: string | null, date: string | null, recommended: boolean };
function parseTalks(content: Content[]): Talk {
  const link = content[0].type === 'heading' && (content[0].children as Content[])?.filter(c => c.type === 'link')[0];
  const url = link && link.type === 'link' && link.url || null;
  const title = treeToString([content[0]]);

  const infoNode = content[1].type === 'paragraph' && content[1];

  const [venue, date] = infoNode ? treeToString(infoNode.children.slice(0, 2)).split(', ').map(e => e.trim()) : [];
  const recommended = infoNode ? treeToString(infoNode.children.slice(3)).toLowerCase().trim().includes('recommended') : false;
  return { url, title, venue, date, recommended };
}

export interface Grant { title: string | null, sponsor: string | null, date: string | null, recommended: boolean };
function parseGrants(content: Content[]): Grant {
  const link = content[0].type === 'heading' && (content[0].children as Content[])?.filter(c => c.type === 'link')[0];
  const url = link && link.type === 'link' && link.url || null;
  const title = treeToString([content[0]]);

  const infoNode = content[1].type === 'paragraph' && content[1];

  const [sponsor, date] = infoNode ? treeToString(infoNode.children.slice(0, 2)).split(', ').map(e => e.trim()) : [];
  const recommended = infoNode ? treeToString(infoNode.children.slice(3)).toLowerCase().trim().includes('recommended') : false;
  return { title, sponsor, date, recommended };
}

export type SkillBlock = [(string | null), (string | null)[] | null];
type WithType<T, U> = T & { type: U };
export interface Cv {
  bio: string | null
  skills: SkillBlock[]
  roles: WorkExperience[]
  education: Education[]
  volunteering: WorkExperience[]
  service: WorkExperience[]
  affiliations: WorkExperience[]
  publications: Publication[]
  press: Press[]
  openSource: OpenSource[]
  talksInterviews: Talk[]
  grants: Grant[]
}
export type CvList = Cv[keyof Omit<Cv, 'bio' | 'skills'>];

const NOT_FOUND = '## Not Found';

function addTypeKeys<T extends Omit<CvList[number], 'type'>, U>(list: T[], typeKey: U): WithType<T, U>[] {
  return list.map(e => ({ ...e, type: typeKey }));
}

export async function fetchCv(onlyRecommended = false): Promise<Cv> {
  let cvMd = await obsidianFetch(serverConfig.obsidian.publishSiteId, clientConfig.obsidian.cv);
  if (cvMd.slice(0,4) === `---\n`) {
    cvMd = cvMd.slice(cvMd.indexOf(`---\n`, 3) + 4)
  }
  cvMd = cvMd.replace(/[“”]/g, '"').replace(/’/g, '\'').replace(/–/g, '-');
  const cv = await markdownParse(cvMd);
  const mdParsed = treeReorganizeByHeading(cv) as HeadingTree;

  if (cvMd.slice(0,NOT_FOUND.length) === NOT_FOUND) {
    throw new Error(`Note ${clientConfig.obsidian.cv} found`);
  }

  const filterRecommended = (e: any) => onlyRecommended ? (e.recommended !== false) : true;
  
  // Extract parts from the markdown
  const bio = renderMarkdown(valuesRecursive(mdParsed.Bio || {}).slice(1));
  const skills = renderMarkdown(valuesRecursive(mdParsed.Skills || {}).slice(1))
    .trim()
    .split(`\n`)
    ?.map(s => s.replace(/\*\*/g, '').split(': '))
    ?.map(([cat, skill]): SkillBlock => [cat.trim() || null, skill?.split(',')?.map(e => e?.trim() || null) || null]);

  const roles = Object.values(mdParsed['Work Experience'] || {}).slice(1).map(parseWorkExperience);
  const education = Object.values(mdParsed['Education'] || {}).slice(1).map(parseEducation);
  const volunteering = Object.values(mdParsed['Volunteering'] || {}).slice(1).map(parseWorkExperience);
  const service = Object.values(mdParsed['Professional Service'] || {}).slice(1).map(parseWorkExperience);
  const affiliations = Object.values(mdParsed['Affiliations and Professional Organizations'] || {}).slice(1).map(parseWorkExperience);
  const publications = Object.values(mdParsed['Publications'] || {}).slice(1).map(parsePublication).filter(filterRecommended);
  const press = Object.values(mdParsed['Press Coverage'] || {}).slice(1).map(parsePress).filter(filterRecommended);
  const grants = Object.values(mdParsed['Research Grants'] || {}).slice(1).map(parseGrants).filter(filterRecommended);
  const openSource = Object.values(mdParsed['Public Work'] || {}).slice(1).map(parseOpenSource);
  const talksInterviews = Object.values(mdParsed['Talks & Interviews'] || {}).slice(1).map(parseTalks).filter(filterRecommended);

  return {
    bio,
    skills,
    roles: addTypeKeys(roles, 'role'),
    education: addTypeKeys(education, 'education'),
    volunteering: addTypeKeys(volunteering, 'volunteering'),
    publications: addTypeKeys(publications, 'publication'),
    press: addTypeKeys(press, 'press'),
    openSource: addTypeKeys(openSource, 'openSource'),
    talksInterviews: addTypeKeys(talksInterviews, 'talk'),
    service: addTypeKeys(service, 'service'),
    grants: addTypeKeys(grants, 'grants'),
    affiliations: addTypeKeys(affiliations, 'affiliations'),
  };
}