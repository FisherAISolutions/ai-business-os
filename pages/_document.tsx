// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    // Prefer env var; fallback to your current ID
    const pixelId = process.env.NEXT_PUBLIC_ROKU_PIXEL_ID || "Paccy9uVA2AL";

    return (
      <Html>
        <Head>
          {/* Roku Pixel Code */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
!function(e,r){if(!e.rkp){var t=e.rkp=function(){
var e=Array.prototype.slice.call(arguments);
e.push(Date.now()),t.eventProcessor?t.eventProcessor.apply(t,e):t.queue.push(e)
};t.initiatorVersion="1.0",t.queue=[],t.load=function(e){
var t=r.createElement("script");t.async=!0,t.src=e;
var n=r.getElementsByTagName("script")[0];
(n?n.parentNode:r.body).insertBefore(t,n)},rkp.load("https://cdn.ravm.tv/ust/dist/rkp.loader.js")}
}(window,document);
rkp("init","${pixelId}");
              `.trim(),
            }}
          />
          {/* End Roku Pixel Code */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
