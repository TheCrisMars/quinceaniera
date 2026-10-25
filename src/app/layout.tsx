import { Metadata } from 'next';
import { Alex_Brush, Cinzel, Cormorant_Garamond, Great_Vibes, Montserrat, Orbitron, Pinyon_Script, Playfair_Display } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: ["400"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
});

const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: ["400"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quinceaniera.vercel.app"),
  title: "María Sol ✨ Mis XV | Una Celebración Única",
  description: "Esta invitación fue reservada especialmente para ti",
  openGraph: {
    title: "María Sol ✨ Mis XV | Una Celebración Única",
    description: "Esta invitación fue reservada especialmente para ti",
    url: "https://quinceaniera.vercel.app",
    siteName: "quinceaniera.vercel.app",
    type: "website",
    locale: "es_EC",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Invitación Mis XV María Sol",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "María Sol ✨ Mis XV | Una Celebración Única",
    description: "Esta invitación fue reservada especialmente para ti",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${playfair.variable} ${pinyonScript.variable} ${greatVibes.variable} ${alexBrush.variable} ${cinzel.variable} ${montserrat.variable} ${orbitron.variable} scroll-smooth`}
    >
      <body className="min-h-screen w-full text-[#4a3528] antialiased overflow-x-hidden relative selection:bg-[#dfb56c]/30 bg-pink-watercolor">
        <div className="relative z-10 w-full min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
