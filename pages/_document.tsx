import Document, {
  DocumentContext,
  Head,
  Main,
  Html,
  NextScript,
} from "next/document";

interface DocumentProps {
  styleTags?: any;
}

class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    // const sheet = new ServerStyleSheet();

    const page = ctx.renderPage((App) => (props) =>
      <App {...props} />
    );

    // const styleTags: any = sheet.getStyleElement();

    return { ...page };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" type="image/png" href="/images/favicon.ico" />
          <link rel="apple-touch-icon" href="/images/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
