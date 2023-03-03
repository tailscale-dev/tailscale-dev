import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="text-xs text-gray-600">
          <p className="mb-3">The official community site of Tailscale.</p>
          <p className="mb-3">
            WireGuard is a registered
            <br /> trademark of Jason A. Donenfeld.
          </p>
          <p className="mb-3">&copy; Tailscale Inc.</p>
        </div>
      </div>
    </footer>
  );
}
