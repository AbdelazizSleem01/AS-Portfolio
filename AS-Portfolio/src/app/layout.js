import { ToastContainer } from "react-toastify";
import "./globals.css";
import "../app/components/AdminStyle.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: {
    default:
      "Abdelaziz Sleem | Fullstack Developer | React, Next.js, Node.js Expert",
    template: "Abdelaziz Sleem | %s | Fullstack Developer",
  },
  description:
    "Abdelaziz Sleem: Fullstack Developer specializing in React, Next.js, and Node.js. Discover my portfolio and hire a freelance developer today!",
  applicationName: "Abdelaziz Sleem Portfolio",
  metadataBase: new URL("https://as-portfolio-ten.vercel.app/"),
  keywords: [
    "Fullstack Developer",
    "Freelance Developer",
    "Frontend Development",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "MongoDB Developer",
    "JavaScript Developer",
    "Tailwind CSS",
    "Web Development",
    "Freelance Developer Egypt",
    "Responsive Web Design",
  ],
  authors: [
    {
      name: "Abdelaziz Sleem",
      url: "https://as-portfolio-ten.vercel.app/",
    },
  ],
  creator: "Abdelaziz Sleem",
  publisher: "Abdelaziz Sleem",
  formatDetection: {
    email: true,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
  },
  openGraph: {
    title:
      "Abdelaziz Sleem | Fullstack Developer | React, Next.js, Node.js Expert",
    description:
      "Passionate Fullstack Developer specializing in React, Next.js, Node.js, and MongoDB. Hire a freelance developer for your next project!",
    url: "https://as-portfolio-ten.vercel.app/",
    siteName: "Abdelaziz Sleem Portfolio",
    images: [
      {
        url: "https://as-portfolio-ten.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Abdelaziz Sleem - Fullstack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Abdelaziz Sleem | Fullstack Developer | React, Next.js, Node.js Expert",
    description:
      "Passionate Fullstack Developer specializing in React, Next.js, Node.js, and MongoDB. Hire a freelance developer for your next project!",
    creator: "@AbdelazizSleem",
    images: ["https://as-portfolio-ten.vercel.app/twitter-image.png"],
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
      <head>
        <link rel="canonical" href="https://as-portfolio-ten.vercel.app/" />
        <meta name="google-adsense-account" content="ca-pub-1270698221637999" />

        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1270698221637999"
          crossOrigin="anonymous"
        />

        {/* Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Abdelaziz Sleem",
              url: "https://as-portfolio-ten.vercel.app/",
              jobTitle: "Fullstack Developer",
              description:
                "Passionate Fullstack Developer specializing in React, Next.js, Node.js, and MongoDB. Freelance Developer creating responsive, user-friendly websites.",
              skills: [
                "React",
                "Next.js",
                "Node.js",
                "MongoDB",
                "JavaScript",
                "Tailwind CSS",
                "Web Development",
              ],
              sameAs: [
                "https://github.com/AbdelazizSleem01",
                "https://www.linkedin.com/in/abdelaziz-sleem-600a1027a/",
              ],
              image: "https://as-portfolio-ten.vercel.app/imgs/my-img.jpeg",
            }),
          }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Abdelaziz Sleem Portfolio",
              url: "https://as-portfolio-ten.vercel.app/",
              description:
                "Portfolio of Abdelaziz Sleem, a Fullstack Developer specializing in React, Next.js, Node.js, and MongoDB.",
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          >
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-screen w-screen bg-gray-100 text-gray-600">
                  <svg
                    className="animate-spin h-10 w-10 text-indigo-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-label="Loading"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="mt-2 text-gray-500">Loading...</p>
                </div>
              }
            >
              <Navbar />
              {children}
              <ToastContainer />
              <Analytics />
              <SpeedInsights />
              <Footer />
            </Suspense>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
