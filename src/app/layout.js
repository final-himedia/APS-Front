import RootLayout from "./RootLayout";

import "./style.css";

export const metadata = {
  title: "CRAFT ERP",
  description: "An integrated ERP system",
};

export default function Layout({ children }) {
  return (
    <html lang="ko">
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
