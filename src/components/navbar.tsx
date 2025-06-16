import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { User, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-gray-800 bg-black py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="text-xl font-bold text-white">
          Auto Intern
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-gray-800"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-gray-800"
                >
                  Pricing
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link href="/pricing">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-gray-800"
                >
                  Pricing
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-gray-800"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-white text-black hover:bg-gray-200">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
