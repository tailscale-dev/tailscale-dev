import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { siteMetadata } from '@/data/siteMetadata';

class MyDocument extends Document {
  render() {
    return (
      <Html lang={siteMetadata.language} className="scroll-smooth">
        <Head>
          <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              !function(){var e=window.rudderanalytics=window.rudderanalytics||[];e.methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId","getUserId","getUserTraits","getGroupId","getGroupTraits","startSession","endSession","getSessionId"],e.factory=function(t){return function(){var r=Array.prototype.slice.call(arguments);return r.unshift(t),e.push(r),e}};for(var t=0;t<e.methods.length;t++){var r=e.methods[t];e[r]=e.factory(r)}e.loadJS=function(e,t){var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a)},e.loadJS(),
              e.load("${process.env.NEXT_PUBLIC_RUDDERSTACK_KEY}","${process.env.NEXT_PUBLIC_RUDDERSTACK_URL}"),
              e.page()}();
          `,
            }}
          />
        </Head>
        <body className="min-h-screen bg-white text-black antialiased dark:bg-gray-900 dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
