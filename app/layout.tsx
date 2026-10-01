import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quang Thắng & Tường Lan - Thiệp Cưới",
  description: "Thân mời bạn tới dự lễ thành hôn của chúng mình!",
  authors: [{ name: "thangdevalone" }],
  metadataBase: new URL("https://vochongthanglan.online"),
  openGraph: {
    title: "Quang Thắng & Tường Lan",
    description: "Thân mời bạn tới dự lễ thành hôn của chúng mình!",
    url: "https://vochongthanglan.online",
    siteName: "thangdevalone",
    type: "website",
    images: ["/images/snaptik-20260619121115-i-ldr.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Expires" content="-1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Montserrat:wght@400;700&family=Taviraj:wght@400;700&family=Playfair+Display:wght@400;700&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="stylesheet" href="/wedding.css" />
        <link href="/css/css2" rel="stylesheet" type="text/css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
