import { Search } from 'sonic-channel';

export default function getSearchChannel(): Search {
  const ch = new Search({
    host: process.env.SONIC_HOST,
    port: parseInt(process.env.SONIC_PORT, 10),
    auth: process.env.SONIC_AUTH,
  }).connect({
    connected: () => {},
    disconnected: () => {},
    timeout: () => {},
    retrying: () => {},
    error: (error) => {
      console.error('Sonic Channel failed to connect to host (search)', error);
    },
  });

  return ch;
}
