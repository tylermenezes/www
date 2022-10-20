import {findAndReplace} from 'mdast-util-find-and-replace'
import { Node } from 'mdast-util-find-and-replace/lib';

export interface RemarkNotesLinkOptions {
  prefix: string
}

export function remarkNotesLink({ prefix }: RemarkNotesLinkOptions) {
  return (tree: Node) => {
    findAndReplace(
      tree,
      [[
        /\[\[([([a-z0-9\@\~\, \(\)\_\-]+)\]\]/gi,
        (value, name) => ({type: 'link', title: null, url: prefix + encodeURIComponent(name), children: [{ type: 'text', value: name }]})
      ]],
      {ignore: ['link', 'linkReference']}
    );
  };
}