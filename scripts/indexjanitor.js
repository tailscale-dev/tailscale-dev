(async () => {
  const { Client } = require('@elastic/elasticsearch');

  const client = new Client({
    node: {
      url: new URL(process.env.ELASTIC_URL),
    },
    auth: {
      username: process.env.ELASTIC_USERNAME,
      password: process.env.ELASTIC_PASSWORD,
    },
    maxRetries: 5,
    requestTimeout: 60000,
  });

  const aliasesToCareAbout = ['site-search-kb', 'site-search-dev-blog', 'site-search-xe-test'];

  const actuallyCloseThings = process.env.ACTUALLY_CLOSE_THINGS
    ? process.env.ACTUALLY_CLOSE_THINGS == 'true'
    : false;
  console.log({ actuallyCloseThings });

  const indices = await client.indices.get({ index: 'site-search-*' });
  const indicesToClose = [];
  const safeIndices = [];

  for (const alias of aliasesToCareAbout) {
    const aliasMeta = await client.indices.getAlias({ name: alias });
    const indexNames = Object.keys(aliasMeta);
    safeIndices.push(...indexNames);
  }

  for (const index of Object.keys(indices)) {
    if (!safeIndices.includes(index)) {
      indicesToClose.push(index);
    }
  }

  console.log(`Found ${indicesToClose.length} indices to close`);

  if (!actuallyCloseThings) {
    console.log('\nWould have closed:');
    indicesToClose.forEach((index) => console.log(`- ${index}`));
    console.log('\nDry run, not closing anything');
    return;
  }

  for (const index of indicesToClose) {
    console.log(`Closing ${index}`);
    await client.indices.close({ index });
  }
})();
