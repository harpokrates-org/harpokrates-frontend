import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import NavBar from "./components/NavBar";
import StoreProvider from "@/store/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Harpokrates",
  description: "Harpokrates",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <StoreProvider>
            <NavBar>
              {children}
            </NavBar>
          </StoreProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
