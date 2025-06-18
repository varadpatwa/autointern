import { CheckCircle2, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/navbar";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Welcome to Auto Intern!
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your subscription is now active. Let's start landing you
              interviews.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center text-gray-400">
              You can now access all premium features including unlimited
              emails, resume optimization, and advanced analytics.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Button asChild className="bg-white text-black hover:bg-gray-200">
                <Link href="/onboarding">
                  <Target className="mr-2 w-4 h-4" />
                  Start Your First Campaign
                </Link>
              </Button>
              <Button
                asChild
                className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              >
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
