import type { Metadata } from "next";
import { Inter, Patrick_Hand } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

const patrick_hand = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--patrick-hand",
});

export const metadata: Metadata = {
  title: "Short Url",
  description: "A simple site to short url",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${patrick_hand.variable}`}>
        <ToastContainer draggable closeOnClick theme="colored"/>
        {children}
      </body>
    </html>
  );
}
