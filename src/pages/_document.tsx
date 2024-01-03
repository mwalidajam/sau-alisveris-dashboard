// create _document.tsx file in pages folder

import React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

const MyDocument = () => {
  return (
    <Html>
      <Head>
        <meta name="description" content="SAÜ Alışveriş Uygulaması" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
