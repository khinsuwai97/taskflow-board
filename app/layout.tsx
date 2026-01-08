// src/app/layout.tsx

import type { Metadata } from "next";
import { ReduxProvider } from "./components/ReduxProvider";
import "../styles/globals.css"

export const metadata: Metadata = {
  title: "TaskFlow Board - Manage Your Tasks Efficiently",
  description: "A modern, responsive task management board built with Next.js, Redux Toolkit, and TypeScript",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
