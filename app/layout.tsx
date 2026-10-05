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
              "(function(){var d=document.documentElement;function f(){var w=window.innerWidth;var z=Math.min(1,w/420);d.style.setProperty('--page-zoom',z.toFixed(4));var el=document.querySelector('.w-wraper');if(el){el.style.zoom=z.toFixed(4);}}f();if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',f);}window.addEventListener('resize',f);window.addEventListener('orientationchange',f);})();",
          }}
        />
        <meta httpEquiv="Cache-Control" content="no-cache" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Expires" content="-1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="stylesheet" href="/wedding.css" />
        <link href="/css/google-fonts.css" rel="stylesheet" type="text/css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
