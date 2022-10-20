import { obsidianFetch } from "./fetch";
import serverConfig from '@/config/serverConfig';
import { markdownParse } from '../markdown';

export async function fetchCv() {
  let cvMd = await obsidianFetch(serverConfig.obsidian.publishSiteId, serverConfig.obsidian.cv);
  if (cvMd.slice(0,4) === `---\n`) {
    cvMd = cvMd.slice(cvMd.indexOf(`---\n`, 3) + 4)
  }
  const cv = markdownParse(cvMd);

  return cv;
}