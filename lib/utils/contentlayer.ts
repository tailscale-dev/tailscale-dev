import GithubSlugger from 'github-slugger';
import type { Document, MDX } from 'contentlayer/core';
import { allEvents, type Events, type Solution } from 'contentlayer/generated';

export type MDXDocument = Document & { body: MDX };
export type MDXDocumentDate = MDXDocument & {
  date: string;
};
export type MDXBlog = MDXDocumentDate & {
  tags?: string[];
  draft?: boolean;
  authors?: string[];
};
export type MDXAuthor = Document & { name: string };

export function sortedBlogPost(allBlogs: MDXDocumentDate[]) {
  return allBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function sortedFutureEventPosts(allEvents: Events[]) {
  return allEvents
    .filter((e) => e.isFuture)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function sortedEventPosts(allEvents: Events[]) {
  return allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function sortedSolutionPosts(allSolutions: Solution[]) {
  return allSolutions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

type ConvertUndefined<T> = OrNull<{
  [K in keyof T as undefined extends T[K] ? K : never]-?: T[K];
}>;
type OrNull<T> = { [K in keyof T]: Exclude<T[K], undefined> | null };
type PickRequired<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};
type ConvertPick<T> = ConvertUndefined<T> & PickRequired<T>;

/**
 * A typesafe omit helper function
 * @example pick(content, ['title', 'description'])
 *
 * @param {Obj} obj
 * @param {Keys[]} keys
 * @return {*}  {ConvertPick<{ [K in Keys]: Obj[K] }>}
 */
export const pick = <Obj, Keys extends keyof Obj>(
  obj: Obj,
  keys: Keys[]
): ConvertPick<{ [K in Keys]: Obj[K] }> => {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key] ?? null;
    return acc;
  }, {} as any);
};

/**
 * A typesafe omit helper function
 * @example omit(content, ['body', '_raw', '_id'])
 *
 * @param {Obj} obj
 * @param {Keys[]} keys
 * @return {*}  {Omit<Obj, Keys>}
 */
export const omit = <Obj, Keys extends keyof Obj>(obj: Obj, keys: Keys[]): Omit<Obj, Keys> => {
  const result = Object.assign({}, obj);
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

export type CoreContent<T> = Omit<T, 'body' | '_raw' | '_id'>;

export function coreContent<T extends MDXDocument>(content: T) {
  return omit(content, ['body', '_raw', '_id']);
}

export function allCoreContent<T extends MDXDocument>(contents: T[]) {
  return contents.map((c) => coreContent(c)).filter((c) => !('draft' in c && c.draft === true));
}

// TODO: refactor into contentlayer once compute over all docs is enabled
export async function getAllTags(allBlogs: MDXBlog[]) {
  const tagCount: Record<string, number> = {};

  // Iterate through each post, putting all found tags into `tags`
  allBlogs.forEach((file) => {
    if (file.tags && file.draft !== true) {
      file.tags.forEach((tag) => {
        const formattedTag = GithubSlugger.slug(tag);
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1;
        } else {
          tagCount[formattedTag] = 1;
        }
      });
    }
  });

  return tagCount;
}

export function getSideNavData(content: Solution[]) {
  const groups = {};
  const sideNavData = [];
  const groupData = [];
  content.forEach((solution) => {
    if (!solution.group) {
      sideNavData.push({ label: solution.title, link: solution.path });
      return;
    } else {
      if (groups[solution.group]) {
        groups[solution.group].push({
          label: solution.title,
          link: solution.path,
        });
      } else {
        groups[solution.group] = [
          {
            label: solution.title,
            link: solution.path,
          },
        ];
      }
    }
  });
  Object.keys(groups).forEach((group) => {
    const children = groups[group];
    children.sort((a, b) => {
      return a.label.localeCompare(b.label);
    });
    groupData.unshift({ label: group, children });
  });

  groupData.sort((a, b) => {
    return a.label.localeCompare(b.label);
  });

  sideNavData.sort((a, b) => {
    return a.label.localeCompare(b.label);
  });

  const events = [];
  const now = new Date();
  allEvents
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((e) => new Date(e.date) > now)
    .forEach((event) => {
      events.push({
        label: `${event.shortDisplayDate}: ${event.title}`,
        link: event.path,
      });
    });

  groupData.unshift({ label: 'Events', children: events });

  return [
    {
      label: 'Solutions',
      link: 'solutions',
      children: [...groupData, ...sideNavData],
    },
  ];
}
