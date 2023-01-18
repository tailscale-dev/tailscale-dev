import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className=" dark:bg-black dark:text-white">
        <div>
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  )
}
