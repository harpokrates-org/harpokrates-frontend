import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import NavBar from "./components/NavBar";

const inter = Inter({ subsets: ["latin"] });
import Providers from "@/store/provider";

export const metadata = {
  title: "Harpokrates",
  description: "Harpokrates",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Providers>
            <NavBar/>
            {children}
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
