import ListLayout from '../layouts/ListLayout'
import links from '../data/in-the-wild.json'

interface Link {
  title: string;
  url: string;
  date: string;
  preview: string;
  tags: string[];
}

export default function Events({ allLinks }: { allLinks: Link[] }) {
  return (
    <>
      <ListLayout
        items={allLinks}
        title="In The Wild"
      />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      allLinks: links
    }
  }
}
