import { ToastContainer } from "react-toastify";
import "./globals.css";
import "../app/components/AdminStyle.css"
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: "Abdelaziz Sleem | Fullstack Developer",
  description: "Passionate Fullstack Developer specializing in Frontend Development. Expertise in React, Next.js, Node.js, and MongoDB. Freelance Developer creating responsive, user-friendly websites.",
  applicationName: "Abdelaziz Sleem Portfolio",
  metadataBase: new URL("https://as-portfolio-ten.vercel.app/"),
  keywords: [
    "Fullstack Developer",
    "Freelance Developer",
    "Frontend Development",
    "Node.js Developer",
    "MongoDB Developer",
    "React",
    "Next.js",
    "Node.js",
    "MongoDB",
    "Tailwind CSS",
    "Web Development",
    "Web Application Development",
    "Freelance Developer Egypt",
    "Responsive Web Design",
    "JavaScript Developer"
  ],
  authors: [{
    name: "Abdelaziz Sleem",
    url: "https://as-portfolio-ten.vercel.app/"
  }],
  creator: "Abdelaziz Sleem",
  publisher: "Abdelaziz Sleem",
  formatDetection: {
    email: true,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [
      { url: '/favicon.ico' }
    ],
  },
  openGraph: {
    title: "Abdelaziz Sleem | Fullstack Developer",
    description: "Passionate Fullstack Developer specializing in Frontend Development. Expertise in React, Next.js, Node.js, and MongoDB.",
    url: "https://as-portfolio-ten.vercel.app/",
    siteName: "Abdelaziz Sleem Portfolio",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdelaziz Sleem | Fullstack Developer",
    description: "Passionate Fullstack Developer specializing in Frontend Development. Expertise in React, Next.js, Node.js, and MongoDB.",
    images: ["/thumbnail.png"],
    creator: "@yourtwitterhandle"
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

};




export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ClerkProvider frontendApi={process.env.NEXT_PUBLIC_BASE_URL}>
            <Suspense fallback={<div>Loading...</div>}>
              <Navbar />
              {children}
              <ToastContainer />
              <Footer />
            </Suspense>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}