import rss from './rss';
import sitemap from './sitemap';
import search from './search';

async function postbuild() {
  await Promise.all([rss(), sitemap(), search()]);
}

postbuild();
