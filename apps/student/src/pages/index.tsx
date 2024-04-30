import Navbar from "@/components/common/Navbar";
import Courses from "@/components/Home/Courses";
import HeroSection from "@/components/Home/HeroSection";


export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <Courses />
    </div>
  );
}
