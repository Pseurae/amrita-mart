import { Inter } from "next/font/google";
import "./globals.css";
import { ProductProvider } from "./_context/products";

const inter = Inter({ subsets: ["latin"] });

export default function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ProductProvider>
        <body className={inter.className}>{children}</body>
      </ProductProvider>
    </html>
  );
}
