import RootLayout from "./RootLayout";
import { registerLicense } from "@syncfusion/ej2-base";
import "./style.css";

export const metadata = {
  title: "MAIDAY",
  description: "An integrated ERP system",
};

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NNaF1cXGJCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXhecnZURmFeUkFxXkRWYUA="
);

export default function Layout({ children }) {
  return (
    <html lang="ko">
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
