import Link from 'next/link';

import * as React from 'react';
import Breadcrumbs from '@/components/breadcrumbs';
import Head from 'next/head';

export default function EventsCodeOfConduct() {
  return (
    <>
      <Head>
        <title>Tailscale Events Code of Conduct</title>
      </Head>

      <header className="bg-gray-900 py-20 text-center text-gray-100">
        <h1 className="text-4xl font-medium leading-tight tracking-tight">
          Events Code of Conduct{' '}
        </h1>
      </header>

      <Breadcrumbs
        titleMap={{ up: 'Tailscale Up', 'code-of-conduct': 'Events Code of Conduct ' }}
      />

      <main className="Markdown BlogMarkdown">
        <h3>Our Pledge</h3>
        <p>
          We as members, contributors, and leaders pledge to make participation in our community a
          harassment-free experience for everyone, regardless of age, body size, visible or
          invisible disability, ethnicity, sex characteristics, gender identity and expression,
          level of experience, education, socio-economic status, nationality, personal appearance,
          race, religion, or sexual identity and orientation.
        </p>
        <p>
          We pledge to act and interact in ways that contribute to an open, welcoming, diverse,
          inclusive, and healthy community. Tailscale and its communities are dedicated to providing
          a harassment-free experience for participants at all of our events, whether they are held
          in person or virtually. They exist to encourage the open exchange of ideas and expression.
          They require an environment that recognizes the inherent worth of every person and group.
          While at Tailscale events or related ancillary or social events, any participants,
          including members, speakers, attendees, volunteers, sponsors, exhibitors, booth staff and
          anyone else, should not engage in harassment in any form.
        </p>
        <p>
          This Events Code of Conduct may be revised at any time by Tailscale and the terms are
          non-negotiable. Registration for or attendance at any Tailscale event, whether it&apos;s
          held in person or virtually, indicates your agreement to abide by this policy and its
          terms.
        </p>

        <h3>Expected Behavior</h3>
        <p>
          All event participants, whether they are attending an in-person event or a virtual event,
          are expected to behave in accordance with professional standards, with both this Events
          Code of Conduct as well as their respective employer&apos;s policies governing appropriate
          workplace behavior and applicable laws.
        </p>

        <h3>Unacceptable Behavior</h3>
        <p>
          Harassment will not be tolerated in any form, whether in person or virtually. Harassment
          includes the use of abusive, offensive or degrading language, intimidation, stalking,
          harassing photography or recording, inappropriate physical contact, sexual imagery and
          unwelcome sexual advances or requests for sexual favors. Any report of harassment at one
          of our events, whether in person or virtual, will be addressed immediately. Participants
          asked to stop any harassing behavior are expected to comply immediately. Anyone who
          witnesses or is subjected to unacceptable behavior should notify a conference organizer at
          once.
        </p>

        <h3>Consequences of Unacceptable Behavior</h3>
        <p>
          If a participant engages in harassing behavior, whether in person or virtually, the event
          organizers may take any action they deem appropriate depending on the circumstances,
          ranging from issuance of a warning to the offending individual to expulsion from the
          conference with no refund. Tailscale reserves the right to exclude any participant found
          to be engaging in harassing behavior from participating in any further Tailscale events,
          trainings or other activities.
        </p>
        <p>
          If a participant (or individual wishing to participate in a Tailscale event, in-person
          and/or virtual), through postings on social media or other online publications or another
          form of electronic communication, engages in conduct that violates this policy, whether
          before, during or after a Tailscale event, Tailscale may take appropriate corrective
          action, which could include imposing a temporary or permanent ban on an individual&apos;s
          participation in future Tailscale events.
        </p>

        <h3>What To Do If You Witness or Are Subject To Unacceptable Behavior</h3>
        <p>
          If you are being harassed, notice that someone else is being harassed, or have any other
          concerns relating to harassment, please contact a member of the conference staff
          immediately. You are also encouraged to contact Katie Reese, Senior Events Manager, at
          katie@tailscale.com.
        </p>

        <h3>Incident Response</h3>
        <p>
          If a participant engages in harassing behavior, whether in-person or virtually, the
          conference organizers may take any action they deem appropriate, ranging from issuance of
          a warning to the offending individual to expulsion from the conference with no refund,
          depending on the circumstances. Tailscale reserves the right to exclude any participant
          found to be engaging in harassing behavior from participating in any further Tailscale
          events, trainings or other activities.
        </p>
        <p>Conference staff will also provide support to victims, including, but not limited to:</p>
        <ul className="font-bold">
          <li>Providing an escort</li>
          <li>Contacting hotel/venue security or local law enforcement</li>
          <li>Briefing key event staff for response/victim assistance</li>
          <li>
            And otherwise assisting those experiencing harassment to ensure that they feel safe for
            the duration of the conference.
          </li>
        </ul>

        <h3>Attribution</h3>
        <p>
          This Code of Conduct is adapted from{' '}
          <Link href="https://github.com/tailscale/tailscale/blob/main/CODE_OF_CONDUCT.md">
            Tailscale&apos;s Contributor Covenant Code of Conduct
          </Link>
          , the{' '}
          <Link href="https://events.linuxfoundation.org/about/code-of-conduct/">
            Linux Foundation&apos;s event Code of Conduct
          </Link>{' '}
          and the <Link href="https://www.contributor-covenant.org/">Contributor Covenant</Link>,
          version 2.0 available{' '}
          <Link href="https://www.notion.so/2eed917d43774e828c794215c42b8b45">here</Link>.
        </p>
      </main>
    </>
  );
}
