import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "L2I",
  description: "LightNovel2Image",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
