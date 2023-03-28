import sitemap from './sitemap';
import search from './search';

async function postbuild() {
  await Promise.all([sitemap(), search()]);
}

postbuild();
