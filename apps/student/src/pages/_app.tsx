import 'react-toastify/dist/ReactToastify.css';
import "@/styles/globals.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { AppProps } from "next/app";
import { Flip, ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserProvider>
        <Component {...pageProps} />
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
        />
      </UserProvider>
      
      <footer className='bg-black px-4 py-6'>
        {/* Code here */}
      </footer>
    </>
  )
  
}
