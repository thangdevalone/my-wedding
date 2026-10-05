import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quang Thắng & Tường Lan - Thiệp Cưới",
  description: "Thân mời bạn tới dự lễ thành hôn của chúng mình!",
  authors: [{ name: "thangdevalone" }],
  metadataBase: new URL("https://vochongthanglan.online"),
  openGraph: {
    title: "Quang Thắng & Tường Lan - Thiệp Cưới",
    description: "Thân mời bạn tới dự lễ thành hôn của chúng mình!",
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
    title: "Quang Thắng & Tường Lan - Thiệp Cưới",
    description: "Thân mời bạn tới dự lễ thành hôn của chúng mình!",
    images: ["/images/gallery-02.jpg"],
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
              "(function(){var d=document.documentElement;function f(){d.style.setProperty('--page-zoom',Math.min(1,innerWidth/420).toFixed(4));}f();addEventListener('resize',f);addEventListener('orientationchange',f);})();",
          }}
        />
        <meta httpEquiv="Cache-Control" content="no-cache" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Expires" content="-1" />
        <link rel="stylesheet" href="/wedding.css" />
        <link href="/css/google-fonts.css" rel="stylesheet" type="text/css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
