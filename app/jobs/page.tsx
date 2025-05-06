/*
 * SpaceJam Jobs
 */

import Link from "next/link";

export default function Jobs() {
  return (
    <main className="h-page mx-auto max-w-screen-md py-12">
      <h1 className="text-2xl font-bold">Jobs 👾</h1>
      <p className="mt-4 text-muted-foreground">
        feel free to reach out{" "}
        <Link
          href="https://t.me/clearloop"
          target="_blank"
          className="font-bold text-foreground"
        >
          @clearloop
        </Link>{" "}
        on telegram.
      </p>
      <section className="mt-12 space-y-2">
        <h2 className="text-xl font-bold underline pb-4">Rust Engineer</h2>
        <p>
          working on the JAM implementation of{" "}
          <Link href="https://spacejam.app" className="font-bold">
            SpaceJam
          </Link>{" "}
          and{" "}
          <Link href="https://github.com/zink-lang/zink" className="font-bold">
            Zink Language
          </Link>
        </p>
        <p>
          must have good profile of github, conrtibuted to the top open source
          projects in crypto.
        </p>
      </section>
      <section className="mt-12 space-y-2">
        <h2 className="text-xl font-bold underline pb-4">React Engineer</h2>
        <p>working on sort of secret project that will be announced soon.</p>
        <p>must have good tastes.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold underline pb-4">Moderator / DevRel</h2>
        <p>working on twitter and the community channels.</p>
      </section>
    </main>
  );
}
