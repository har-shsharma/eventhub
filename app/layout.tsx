import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EventEase - Manage and Attend Events Seamlessly",
  description: "Discover, create, and RSVP to events. EventEase makes event handling effortless.",
  icons: {
    icon: "/favicon.ico", 
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header/>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="bg-[url('/images/dashboard.jpeg')] bg-contain bg-no-repeat bg-center md:hidden block fixed top-0 left-0 w-full h-full z-[-1]"></div>
        <div className="min-h-[85vh] md:bg-[url('/images/dashboard.jpeg')] bg-contain !bg-fixed bg-no-repeat bg-right">
        {children}
        </div>
        <Footer/>
      </body>
      </AuthProvider>
    </html>
  );
}
