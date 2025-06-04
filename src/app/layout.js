import "./style.css";

export const metadata = {
  title: "CRAFT ERP",
  description: "An integrated ERP system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">

      <body style={{ height: "100vh" }}>{children}</body>

    </html>
  );
}
