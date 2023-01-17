import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Tailscale Community</title>
      </Head>
      <div className="flex flex-row">
        <main className="w-full sm:w-2/3 md:w-3/4 pt-1 px-2">
          <h2>Community Centers</h2>
          <ul>
            <li><a href="https://github.com/tailscale/tailscale">Tailscale OSS project</a> <span>(github.com)</span></li>
            <li><a href="https://reddit.com/r/tailscale">/r/tailscale</a> <span>(reddit.com)</span></li>
          </ul>

          <h2>Events</h2>
          <h2>In the wild</h2>
        </main>
        <aside className="w-full sm:w-1/3 md:w-1/4">
          <div className="card">
            <h2>Tailscale is programmable network infrastructure for developers.</h2>
          </div>
          <div className="card">
            <a href="https://tailscale.com/blog/how-nat-traversal-works/"><b>Access</b></a> your
            devices from anywhere with a programmable mesh network
          </div>
          <div className="card">
            <a href="https://tailscale.com/kb/1084/sharing/"><b>Share</b></a> devices to other
            Tailscale users
          </div>
          <div className="card">
            <a href="https://tailscale.com/blog/tailscale-ssh/"><b>SSH</b></a> without managing keys
          </div>
          <div className="card">
            <a href="https://tailscale.com/blog/introducing-tailscale-funnel/"><b>Funnel</b></a> the
            public internet to private servers where and when you choose
          </div>
          <div className="card">
            <a href="https://tailscale.com/kb/1081/magicdns/"><b>DNS</b></a> names and
            <a href="https://tailscale.com/blog/tls-certs/"><b>TLS</b></a> certs for internal
            services, created automatically
          </div>
        </aside>
      </div>
    </>
  )
}
