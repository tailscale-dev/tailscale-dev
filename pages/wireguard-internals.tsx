import { PageSEO } from '@/components/SEO';

export default function WireguardInternals() {
  const page = {
    __html: require('!raw-loader!../public/static/wireguard-internals/index.html').default,
  };
  console.log(page);
  return (
    <>
      <PageSEO title="Wireguard Internals" description="Internals of a WireGuard® Tunnel" />
      <header className="bg-gray-900 py-20 text-center text-gray-100">
        <h1 className="text-4xl font-medium leading-tight tracking-tight">
          Internals of a WireGuard® Tunnel
        </h1>
      </header>
      <div className="container max-w-4xl" dangerouslySetInnerHTML={page} />
    </>
  );
}
