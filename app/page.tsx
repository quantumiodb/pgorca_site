import { Hero } from "@/components/sections/hero";
import { Why } from "@/components/sections/why";
import { Benchmarks } from "@/components/sections/benchmarks";
import { Features } from "@/components/sections/features";
import { Architecture } from "@/components/sections/architecture";
import { Install } from "@/components/sections/install";
import { Honest } from "@/components/sections/honest";
import { Faq } from "@/components/sections/faq";

export default function Home() {
  return (
    <>
      <Hero />
      <Why />
      <Benchmarks />
      <Features />
      <Architecture />
      <Install />
      <Honest />
      <Faq />
    </>
  );
}
