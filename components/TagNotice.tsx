export function TagNotice({ tags }: { tags: string[] }) {
  return (
    <>
      {tags.includes('community-made') && (
        <div className="note">
          This article is contributed by a member of the Tailscale community, not a Tailscale
          employee. If you have an interesting story to share about how you use Tailscale, reach out
          to <a href="mailto:devrel@tailscale.com">devrel@tailscale.com</a>.
        </div>
      )}
      {tags.includes('personal') && (
        <div className="note">
          The views and opinions expressed in this post are those of the author and do not
          necessarily reflect the views or positions of the company they represent.
        </div>
      )}
    </>
  );
}
