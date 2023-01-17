import ListLayout from '../layouts/ListLayout'
import events from '../data/events.json'
import { PostData } from '../lib/md';

export default function Events({ allEvents }: { allEvents: PostData[] }) {
  return (
    <>
      <ListLayout
        items={allEvents}
        title="Events"
      />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      allEvents: events
    }
  }
}
