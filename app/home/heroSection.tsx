import Link from "next/link";
import Image from "next/image"
import HeroImage from "@/public/images/heroImage.png"

export function HeroSection() {
  return (
    <div className="bg-[#0C0B28] text-white px-6 md:px-20">
      

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-20">
        <div className="max-w-lg">
          <h2 className="text-purple-400 font-semibold">VTU Services</h2>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Instant Recharge On Payonce!
          </h1>
          <p className="text-gray-300 mt-4">
            Buy Cheap Mobile Data, Airtime, Pay Electricity Bill, Pay TV
            Subscription, Educational Payment, Print Recharge Card & Data Pin.
          </p>
          <div className="mt-6 space-x-4">
            <Link
              href="/auth/signin"
              className="bg-purple-600 px-6 py-3 rounded-md text-white font-semibold hover:bg-purple-700"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="bg-purple-400 px-6 py-3 rounded-md text-white font-semibold hover:bg-purple-500"
            >
              Register
            </Link>
          </div>
        </div>
        <div className="mt-10 md:mt-0">
          <Image
            src={HeroImage}
            alt="App Screenshots"
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
