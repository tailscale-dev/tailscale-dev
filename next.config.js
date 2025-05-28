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
    redirects: () => {
      // Redirect tailscale.dev to equivalent pages on tailscale.com
      return [
        {
          source: '/',
          destination: 'https://tailscale.com/blog',
          permanent: true,
        },
        {
          source: '/blog',
          destination: 'https://tailscale.com/blog',
          permanent: true,
        },
        // TODO: migrate /blog/* pages to tailscale.com
        {
          source: '/events',
          destination: 'https://tailscale.com/events-webinars',
          permanent: true,
        },
        // TODO: migrate /events/* pages to tailscale.com
        {
          source: '/solutions/aws-rds',
          destination: 'https://tailscale.com/kb/1141/aws-rds',
          permanent: true,
        },
        {
          source: '/solutions/caddy-certificates',
          destination: 'https://tailscale.com/kb/1190/caddy-certificates',
          permanent: true,
        },
        {
          source: '/solutions/cloud-azure-linux',
          destination: 'https://tailscale.com/kb/1142/cloud-azure-linux',
          permanent: true,
        },
        {
          source: '/solutions/cloud-azure-windows',
          destination: 'https://tailscale.com/kb/1143/cloud-azure-windows',
          permanent: true,
        },
        {
          source: '/solutions/cloud-gce',
          destination: 'https://tailscale.com/kb/1147/cloud-gce',
          permanent: true,
        },
        {
          source: '/solutions/cloud-hetzner',
          destination: 'https://tailscale.com/kb/1150/cloud-hetzner',
          permanent: true,
        },
        {
          source: '/solutions/cloud-oracle',
          destination: 'https://tailscale.com/kb/1149/cloud-oracle',
          permanent: true,
        },
        {
          source: '/solutions/code-code-server',
          destination: 'https://tailscale.com/kb/1164/codeserver',
          permanent: true,
        },
        {
          source: '/solutions/code-coder',
          destination: 'https://tailscale.com/kb/1163/coder',
          permanent: true,
        },
        {
          source: '/solutions/code-github-codespace',
          destination: 'https://tailscale.com/kb/1160/github-codespaces',
          permanent: true,
        },
        {
          source: '/solutions/code-gitpod',
          destination: 'https://tailscale.com/kb/1161/gitpod',
          permanent: true,
        },
        {
          source: '/solutions/code-openvscode',
          destination: 'https://tailscale.com/kb/1162/openvscode',
          permanent: true,
        },
        {
          source: '/solutions/codesandbox',
          destination: 'https://tailscale.com/kb/1221/codesandbox',
          permanent: true,
        },
        {
          source: '/solutions/connect-to-your-nas',
          destination: 'https://tailscale.com/kb/1307/nas',
          permanent: true,
        },
        {
          source: '/solutions/crunchy-bridge',
          destination: 'https://tailscale.com/kb/1231/crunchy-bridge',
          permanent: true,
        },
        {
          source: '/solutions/docker-desktop',
          destination: 'https://tailscale.com/kb/1184/docker-desktop',
          permanent: true,
        },
        {
          source: '/solutions/dogcam',
          destination: 'https://tailscale.com/kb/1076/dogcam',
          permanent: true,
        },
        {
          source: '/solutions/install-aws',
          destination: 'https://tailscale.com/kb/1021/install-aws',
          permanent: true,
        },
        {
          source: '/solutions/install-opnsense',
          destination: 'https://tailscale.com/kb/1097/install-opnsense',
          permanent: true,
        },
        {
          source: '/solutions/ip-blocklist-relays',
          destination: 'https://tailscale.com/kb/1059/ip-blocklist-relays',
          permanent: true,
        },
        {
          source: '/solutions/kubernetes',
          destination: 'https://tailscale.com/kb/1185/kubernetes',
          permanent: true,
        },
        {
          source: '/solutions/lxc',
          destination: 'https://tailscale.com/kb/1130/lxc-unprivileged',
          permanent: true,
        },
        {
          source: '/solutions/minecraft-bedrock',
          destination: 'https://tailscale.com/kb/1137/minecraft',
          permanent: true,
        },
        {
          source: '/solutions/nixos-minecraft',
          destination: 'https://tailscale.com/kb/1096/nixos-minecraft',
          permanent: true,
        },
        {
          source: '/solutions/ondemand-conductorone',
          destination: 'https://tailscale.com/kb/1208/jit-access-conductorone',
          permanent: true,
        },
        {
          source: '/solutions/ondemand-indent',
          destination: 'https://web.archive.org/web/20240518164134/https://indent.com/',
          permanent: true,
        },
        {
          source: '/solutions/ondemand-opal',
          destination: 'https://tailscale.com/kb/1209/jit-access-opal',
          permanent: true,
        },
        {
          source: '/solutions/ondemand-sym',
          destination: 'https://tailscale.com/kb/1206/jit-access-sym',
          permanent: true,
        },
        {
          source: '/solutions/pfsense',
          destination: 'https://tailscale.com/kb/1146/pfsense',
          permanent: true,
        },
        {
          source: '/solutions/pi-hole',
          destination: 'https://tailscale.com/kb/1114/pi-hole',
          permanent: true,
        },
        {
          source: '/solutions/proxmox',
          destination: 'https://tailscale.com/kb/1133/proxmox',
          permanent: true,
        },
        {
          source: '/solutions/pulumi-provider',
          destination: 'https://tailscale.com/kb/1211/pulumi-provider',
          permanent: true,
        },
        {
          source: '/solutions/secure-server-ubuntu-18-04',
          destination: 'https://tailscale.com/kb/1077/secure-server-ubuntu',
          permanent: true,
        },
        {
          source: '/solutions/serverless-aws-app-runner',
          destination: 'https://tailscale.com/kb/1127/aws-app-runner',
          permanent: true,
        },
        {
          source: '/solutions/serverless-aws-lambda',
          destination: 'https://tailscale.com/kb/1113/aws-lambda',
          permanent: true,
        },
        {
          source: '/solutions/serverless-aws-lightsail',
          destination: 'https://tailscale.com/kb/1128/aws-lightsail',
          permanent: true,
        },
        {
          source: '/solutions/serverless-azure',
          destination: 'https://tailscale.com/kb/1126/azure-app-service',
          permanent: true,
        },
        {
          source: '/solutions/serverless-cloudrun',
          destination: 'https://tailscale.com/kb/1108/cloudrun',
          permanent: true,
        },
        {
          source: '/solutions/serverless-flydotio',
          destination: 'https://tailscale.com/kb/1132/flydotio',
          permanent: true,
        },
        {
          source: '/solutions/serverless-heroku',
          destination: 'https://tailscale.com/kb/1107/heroku',
          permanent: true,
        },
        {
          source: '/solutions/synology',
          destination: 'https://tailscale.com/kb/1131/synology',
          permanent: true,
        },
        {
          source: '/solutions/terraform-provider',
          destination: 'https://tailscale.com/kb/1210/terraform-provider',
          permanent: true,
        },
        {
          source: '/solutions/traefik-certificates',
          destination: 'https://tailscale.com/kb/1234/traefik-certificates',
          permanent: true,
        },
        {
          source: '/solutions/vscode-ipad',
          destination: 'https://tailscale.com/kb/1166/vscode-ipad',
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
