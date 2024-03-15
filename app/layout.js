import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import NavBar from "./components/NavBar";
import StoreProvider from "@/store/StoreProvider";
import { Toaster } from "react-hot-toast";
import { CssBaseline } from "@mui/material";

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
            <CssBaseline />
            <NavBar />
            <Toaster position="top-right" />
            {children}
          </StoreProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
