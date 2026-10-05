import type { Metadata } from "next";
import HomeClient from "./components/HomeClient";
import { cleanInviteName } from "./lib/sanitize";
import { getPublicWishes } from "./lib/db";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * Dynamic metadata for personal invitation links
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const raw = Array.isArray(params.invite) ? params.invite[0] : params.invite;
  const guestName = cleanInviteName(raw);

  const title = guestName
    ? `Kính mời ${guestName} - Thiệp Cưới Quang Thắng & Tường Lan`
    : "Quang Thắng & Tường Lan - Thiệp Cưới";
  const description = guestName
    ? `Trân trọng kính mời ${guestName} tới dự lễ thành hôn của Quang Thắng & Tường Lan!`
    : "Thân mời bạn tới dự lễ thành hôn của chúng mình!";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://vochongthanglan.online",
      siteName: "Quang Thắng & Tường Lan",
      type: "website",
      locale: "vi_VN",
      images: [
        {
          url: "/images/gallery-02.jpg",
          alt: "Quang Thắng & Tường Lan",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/gallery-02.jpg"],
    },
  };
}

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
