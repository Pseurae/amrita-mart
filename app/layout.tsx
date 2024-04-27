import { Inter, DM_Sans, DM_Serif_Display, Onest, Noto_Sans, Raleway, Figtree, Quattrocento, Montagu_Slab, Fraunces, DM_Mono, JetBrains_Mono, Playfair_Display_SC, Lexend, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ display: "swap", subsets: ['latin'] });
const figtree = Figtree({ display: "swap", subsets: ['latin'], variable: '--font-figtree' });
const fraunces = Fraunces({ display: "swap", subsets: ["latin"], variable: '--font-fraunces' });
const dmSerifDisplay = Playfair_Display({ display: 'swap', subsets: ['latin'], variable: '--font-dmserif', weight: '800' });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${figtree.className} ${fraunces.variable} ${dmSerifDisplay.variable}`}>
            <body>
                {children}
            </body>
        </html>
    );
}
