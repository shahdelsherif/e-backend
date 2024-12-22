// pages/_app.js
import '@/app/globals.css'; // Adjust the path if needed

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
