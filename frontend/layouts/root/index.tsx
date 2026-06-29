import { ReactNode } from "react";
import { ThemeProvider } from "@/theme";
import { ReduxProvider } from "@/providers/ReduxProvider";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ReduxProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default RootLayout;
