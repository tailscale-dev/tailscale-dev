const { withContentlayer } = require('next-contentlayer');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self' js.tito.io www.google.com;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.rudderlabs.com js.tito.io;
  style-src 'self' 'unsafe-inline' js.tito.io;
  img-src * blob: data:;
  media-src 'self' stream.mux.com;
  connect-src *;
  font-src 'self';
  frame-src youtube.com www.youtube.com;
`;

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer];
  return plugins.reduce((acc, next) => next(acc), {
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    eslint: {
      dirs: ['pages', 'components', 'lib', 'layouts', 'scripts'],
    },
    async redirects() {
      return [
        // Singles
        { source: '/up', destination: 'https://tailscale.com/', permanent: true },
        { source: '/', destination: 'https://tailscale.com/blog/', permanent: true },
        { source: '/events', destination: 'https://tailscale.com/blog/', permanent: true },

        // Blog root + pagination
        { source: '/blog', destination: 'https://tailscale.com/blog/', permanent: true },
        {
          source: '/blog/page/:path*',
          destination: 'https://tailscale.com/blog/',
          permanent: true,
        },

        // Tags
        { source: '/tags/:path*', destination: 'https://tailscale.com/blog/', permanent: true },

        // TEMPORARY 302
        {
          source:
            '/blog/:slug((?:battery-life|configuring-emacs-mdx|darwin-spelunking|docker-mod-tailscale|embedded-funnel|funnel-101|headscale-funnel|id-headers-tailscale-serve-flask|libtailscale|multi-user-tailnet-github-orgs|on-the-node-while-on-the-road|strawberry-jam-steam-deck|tailgraft|tailscale-serve-obsoleted-my-code|tailscale-sucks|tclip|tclip-updates-092023|telltail-universal-clipboard-ajit-singh-interview|tevents|tsup-tsnet|vaultwarden-tailnet|weaponizing-hyperfocus|funnel-serve-demo|get-started-in-10-nov2023|homelab-networking-vlans))',
          destination: 'https://tailscale.com/blog/',
          permanent: false,
        },

        // PERMANENT 301
        {
          source:
            '/blog/:slug((?:2020-05-in-the-wild|2020-06-in-the-wild|2020-08-in-the-wild|2020-10-in-the-wild|2021-02-in-the-wild|2021-03-in-the-wild|2021-04-in-the-wild|2021-05-in-the-wild|2021-06-in-the-wild|2021-08-in-the-wild|2021-09-in-the-wild|2021-10-in-the-wild|2021-11-in-the-wild|2021-12-in-the-wild|2022-03-in-the-wild|2022-04-in-the-wild|2022-05-in-the-wild|2022-06-in-the-wild|2022-07-in-the-wild|2022-08-in-the-wild|2022-09-in-the-wild|2022-10-in-the-wild|2022-11-in-the-wild|2022-12-in-the-wild|astral-projection-release-recap-oct-2023|funnel-y-enough-release-recap-nov-2023|remote-control-vscode-release-recap-sept-2023|serve-plain-release-recap-aug-2023))',
          destination: 'https://tailscale.com/blog/',
          permanent: true,
        },
      ];
    },
    rewrites: () => {
      return [
        {
          source: '/wireguard-internals',
          destination: '/wireguard-internals/index.html',
        },
      ];
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ];
    },
    images: {
      formats: ['image/webp', 'image/avif'],
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });

      return config;
    },
  });
};
