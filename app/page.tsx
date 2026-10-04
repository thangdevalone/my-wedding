import HomeClient from "./components/HomeClient";
import { cleanInviteName } from "./lib/sanitize";
import { getPublicWishes } from "./lib/db";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * Personal invitation link:  /?invite=Thắng  ->  "Trân trọng kính mời  Thắng"
 * Without the param the heading stays "Quý khách".
 */
export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = Array.isArray(params.invite) ? params.invite[0] : params.invite;
  const guestName = cleanInviteName(raw);

  const initialWishes = getPublicWishes(60);

  return <HomeClient guestName={guestName} initialWishes={initialWishes} />;
}

