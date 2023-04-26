import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer>
      <div className="container max-w-6xl">
        <div className="pt-24 pb-12 text-base">
          The official community site of Tailscale.
          <br />
          WireGuard is a registeredtrademark of Jason A. Donenfeld.
          <br />
          &copy; Tailscale Inc.
        </div>
        <Image src="/shapes/footer.svg" alt="Footer" width={1000} height={100} />
      </div>
    </footer>
  );
}
