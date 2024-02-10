const { version } = require('../../package.json');

export default function MyApp({ Component, pageProps }) {
  return (
    <p>
      {version}
    </p>
  )
}
