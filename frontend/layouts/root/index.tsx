import { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/theme";
import { ReduxProvider } from "@/providers/ReduxProvider";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ReduxProvider>
      <ThemeProvider>
        {children}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default RootLayout;
