import fs from 'fs';
import path from 'path';

import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter';

const dataDir = path.join(process.cwd(), 'data');

export interface FrontmatterData {
  title: string;
  link?: string;
  date: string;
  location?: string;
  preview?: string;
  tags?: string[];
}

export interface PostData extends FrontmatterData {
  slug: string;
  repoPath: string,
  content: any;
}

// TODO: Support nested folders
export function getAllFilesFrontMatter(folder: string, urlPath: string) {
  const dir = path.join(dataDir, folder);
  const fileNames = fs.readdirSync(dir);
  
  const data = fileNames.map((fileName) => {
    // Remove ".md" from file name to get slug
    const slug = fileName.replace(/\.mdx$/, '');

    // Read markdown file as string
    const fullPath = path.join(dir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the slug
    return {
      slug,
      link: `${urlPath}/${slug}`,
      ...matterResult.data,
    };
  });

  // TODO: Sort posts by date
  return data;
}

export function getAllSlugs(folder: string) {
  const dir = path.join(dataDir, folder);
  const fileNames = fs.readdirSync(dir);

  return fileNames.map((fileName) => {
    return {
      params: {
        slug: [fileName.replace(/\.(mdx|md)/, '')],
      },
    };
  });
}

export interface PostData {
  slug: string;
  repoPath: string;
  content: any;
  title: string;
}

export async function getPostData(folder: string, slug: string) {
  const mdxPath = path.join(dataDir, folder, `${slug}.mdx`);
  const mdPath = path.join(dataDir, folder, `${slug}.md`);
  const fsPath = fs.existsSync(mdxPath) ? mdxPath : mdPath;

  const source = fs.readFileSync(fsPath);

  const matterResult = matter(source);
  const content = await serialize(matterResult.content);

  return {
    slug,
    repoPath: fsPath.replace(process.cwd(), ''),
    content,
    ...matterResult.data,
  };
}