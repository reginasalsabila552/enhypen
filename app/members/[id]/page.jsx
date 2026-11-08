import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { members } from "@/data/members";
import YouTubeLite from "@/components/YouTubeLite";
import DoorReveal from "@/components/DoorReveal";

export function generateStaticParams() {
  return members.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const m = members.find((x) => x.id === id);
  return m ? { title: m.name, description: m.lead, openGraph: { images: [m.img] } } : {};
}

export default async function MemberPage({ params }) {
  const { id } = await params;
  const i = members.findIndex((x) => x.id === id);
  if (i < 0) notFound();
  const m = members[i];
  const prev = members[(i + members.length - 1) % members.length];
  const next = members[(i + 1) % members.length];

  return (
    <main className="wrap member">
      <Link href="/" className="back">← ENHYPEN</Link>
      <div className="cols">
        <div className="frame"><Image className="photo" src={m.img} alt={m.name} width={1200} height={1799} priority /></div>
        <div>
          <p className="kicker">Member {String(i + 1).padStart(2, "0")} / {String(members.length).padStart(2, "0")}</p>
          <h1 className="title">{m.name}</h1>
          <p className="role">{m.role}</p>
          <p className="lead">{m.lead}</p>
          <dl className="facts">
            {m.facts.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <h2 className="kicker">Preview</h2>
          <DoorReveal><YouTubeLite id={m.youtube} title={`${m.name} preview`} /></DoorReveal>
        </div>
      </div>
      <nav className="pager">
        <Link href={`/members/${prev.id}`}>← {prev.name}</Link>
        <Link href={`/members/${next.id}`}>{next.name} →</Link>
      </nav>
    </main>
  );
}
