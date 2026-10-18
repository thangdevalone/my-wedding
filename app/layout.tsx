import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Quang Thắng & Tường Lan - Thiệp Cưới",
  description: "Thân mời bạn tới dự lễ thành hôn của chúng mình!",
  authors: [{ name: "thangdevalone" }],
  metadataBase: new URL("https://vochongthanglan.online"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Quang Thắng & Tường Lan - Thiệp Cưới",
    description: "Thân mời bạn tới dự lễ thành hôn của chúng mình!",
    url: "https://vochongthanglan.online",
    siteName: "Quang Thắng & Tường Lan",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "/images/og-share.jpg",
        width: 1200,
        height: 630,
        alt: "Quang Thắng & Tường Lan - Thiệp Cưới",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quang Thắng & Tường Lan - Thiệp Cưới",
    description: "Thân mời bạn tới dự lễ thành hôn của chúng mình!",
    images: ["/images/og-share.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* The invitation is designed on a 420px canvas: scale it down on narrower screens */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;function f(){var w=window.innerWidth;var z=Math.min(1,w/420);d.style.setProperty('--page-zoom',z.toFixed(4));}f();window.addEventListener('resize',f);window.addEventListener('orientationchange',f);})();",
          }}
        />
        <meta httpEquiv="Cache-Control" content="no-cache" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Expires" content="-1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />

        {/* Preload stylesheets */}
        <link rel="preload" href="/wedding.css" as="style" />
        <link rel="preload" href="/css/google-fonts.css" as="style" />

        {/* Preload hero & moments images */}
        <link rel="preload" href="/images/moments-5126.jpg" as="image" />
        <link rel="preload" href="/images/deco-white-sparkle.png" as="image" />
        <link rel="preload" href="/images/deco-ampersand-red.png" as="image" />

        {/* Preload Hero section fonts ("the" cursive, "SAVE DATE" serif, names) */}
        <link
          rel="preload"
          href="/fonts/1ftv-vip-high-spirited-20260517150751-hrtrm.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/forest-regular-20260619012504-he6vp.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/google/ahcZv8Cj3ylylTXzTOYrUtFw.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/google/ahcZv8Cj3ylylTXzTOkrUg.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/google/nuFiD-vYSZviVYUb_rj3ij__anPXDTPYgFE_.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/google/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/google/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTSCmu1aB.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/google/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-muw.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Preload all other wedding invitation typography */}
        <link
          rel="preload"
          href="/fonts/cinzeldecorative-regular-20260608072146-oxrr_.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/1ftv-vip-ergisa-regular-1-20260507115831-zgvj8.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/svn-wallows-20260615031637-bjis_.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/svn-rustling-sound-20260617074109-dq1gv.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/1ftv-vip-lazuardi-20260623105043-0zc9k.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/beyondperfection-regular-20260608154336-ef_3n.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/lora-regular-20260507122944-joqic.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />

        <link rel="stylesheet" href="/wedding.css" />
        <link href="/css/google-fonts.css" rel="stylesheet" type="text/css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
