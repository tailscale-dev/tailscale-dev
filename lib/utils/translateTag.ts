import { tags } from '../../data/tags';

export function translateTag(tag) {
  if (tags[tag]) {
    return tags[tag];
  }

  return tag;
}
