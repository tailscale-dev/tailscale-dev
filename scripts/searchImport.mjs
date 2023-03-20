import { allBlogs } from '../.contentlayer/generated/index.mjs';
import { Ingest } from 'sonic-channel';

(async () => {
  const ch = new Ingest({
    host: 'tsdev-search.internal',
    port: 1491,
    auth: 'hunter2',
  }).connect({
    connected: () => {
      console.info('connected');
    },
    disconnected: () => {
      console.error('Sonic Channel is now disconnected (ingest).');
    },
    timeout: () => {
      console.error('Sonic Channel connection timed out (ingest).');
    },
    retrying: () => {
      console.error('Trying to reconnect to Sonic Channel (ingest)...');
    },
    error: (error) => {
      console.error('Sonic Channel failed to connect to host (ingest).', error);
    },
  });

  for (const post of allBlogs) {
    await ch.push('posts', 'blog', `${post.slug}`, post.body.raw);
    console.log(post.slug);
  }

  await ch.close();
})();
