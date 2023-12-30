import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="">
      <div className="flex flex-col lg:flex-row justify-center items-center bg-[#2B2929] dark:bg-slate-800">
        <div className="p-10  space-y-3 bg-[#2B2929] dark:bg-slate-800 text-white">
          <h1 className="text-5xl font-bold  ">
            Welcome to Dropbox.
            <br />
            <br />
            Store all of your personal and business needs at one place.
          </h1>
          <p className="pb-6">
            Enhance your personal storage with Dropbox, offering a simple and
            efficient way to upload , organize and access files from
            anywhere.Securely store important documents and media , and
            experience the convenience of easy file management and sharing in
            one centralized solution.
          </p>

          <Link href="/dashboard" className="flex bg-[#0160FE] cursor-pointer p-5 w-fit">Try it for free<ArrowRight className="ml-2"/></Link>
        </div>
        <div className="bg-[#1E1919] dark:bg-slate-800 m-6">
          <video autoPlay loop muted className="rounded-lg">
            <source src="https://aem.dropbox.com/cms/content/dam/dropbox/warp/en-us/overview/lp-header-graphite200-1920x1080.mp4"/>
            Your browser does not support video tag.</video>
        </div>
      </div>
    </main>
  );
}
