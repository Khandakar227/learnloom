import { useUser } from '@auth0/nextjs-auth0/client';
import Navbar from "@/components/common/Navbar";
import HeroSection from "@/components/Home/HeroSection";


export default function Home() {
  const { user, error, isLoading } = useUser();
  console.log(user, error, isLoading)
  return (
    <div>
      <Navbar/>
      <HeroSection/>
    </div>
  );
}
