import '../styles/globals.css'

import dynamic from 'next/dynamic';

const ProgressBar = dynamic(() => import('../components/ProgressBar'), { ssr: false });
export default function App({ Component, pageProps }) {
  
  return (
    <>
        <ProgressBar className="!bg-yellow-500"/>
        <Component {...pageProps} />
      
    </>
  )
}
