import NavBar from "@/components/NavBar";
import "./globals.css";
import { SessionProvider } from "./providers"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <NavBar/>
        {children}
        </SessionProvider>
      </body>
    </html>
  );
}
