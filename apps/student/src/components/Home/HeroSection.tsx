import Image from "next/image"
import { EvervaultCard } from "../common/evervault-card"

function HeroSection() {
  return (
    <section className="max-w-7xl p-4 mx-auto min-h-[95vh] grid md:grid-cols-2 gap-4 justify-center items-center">
        <div className="pt-12 md:pt-0 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold font-cinzel">Learn Loom</h1>
          <p className="pt-2 text-lg md:text-2xl font-semibold">Your Gateway to Comprehensive Education</p>
          <p className="pt-5">We believe in the power of education to transform lives. Our platform offers a diverse range of educational resources and tools to help you excel in your academic journey.</p>
        </div>
        <div className="flex justify-center items-center">
          <EvervaultCard/>
        </div>
    </section>
  )
}

export default HeroSection