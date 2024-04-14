import Navbar from "@/components/common/Navbar"
import Dashboard from "@/components/Dashboard";
import HomePage from "@/components/HomePage";
import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSidePropsContext } from "next";

type HomePageProps = {
  isLoggedIn: boolean;
}

function Home({ isLoggedIn }:HomePageProps) {
  return (
    <div>
      <Navbar/>
      {
        isLoggedIn ?
        <Dashboard />
        :
        <HomePage />
      }
    </div>
  )
}

export default Home

export async function getServerSideProps(context:GetServerSidePropsContext) {
  const user = await getSession(context.req, context.res);
  if(!user)
  return {
    props: {
      isLoggedIn: false
    }
  }
  
  return {
    props: {
      isLoggedIn: true
    }
  }
}