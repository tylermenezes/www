export interface WorkExperience { role: string | null, company: string | null, interval: string | null, blurb: string | null, recommended: boolean };
export interface Education { school: string | null, degree: string | null, interval: string | null, recommended: boolean}
export interface Publication { url: string | null, title: string | null, conference: string | null, date: string | null, authors: string | null, cite: string | null, abstract: string | null, recommended: boolean }; 
export interface Press { url: string | null, title: string | null, outlet: string | null, date: string | null, recommended: boolean };
export interface OpenSource { url: string | null, title: string | null, description: string | null, recommended: boolean };
export interface Talk { url: string | null, title: string | null, venue: string | null, date: string | null, recommended: boolean };
export interface Grant { title: string | null, sponsor: string | null, date: string | null, recommended: boolean, url: string | null };
export type SkillBlock = [(string | null), (string | null)[] | null];
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