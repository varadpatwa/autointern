import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import {
  Mail,
  BarChart3,
  Target,
  FileText,
  TrendingUp,
  Clock,
} from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Mock data for demonstration
  const stats = {
    emailsSent: 24,
    responses: 6,
    responseRate: 25,
    activeTemplates: 3,
  };

  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-black text-white">
        <DashboardNavbar />
        <main className="w-full">
          <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
            {/* Header Section */}
            <header className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold">Dashboard</h1>
              <p className="text-gray-400">
                Track your cold email campaigns and responses
              </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Emails Sent
                  </CardTitle>
                  <Mail className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stats.emailsSent}
                  </div>
                  <p className="text-xs text-gray-400">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Responses
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stats.responses}
                  </div>
                  <p className="text-xs text-gray-400">+2 from last week</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Response Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stats.responseRate}%
                  </div>
                  <p className="text-xs text-gray-400">Above average</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Active Templates
                  </CardTitle>
                  <FileText className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stats.activeTemplates}
                  </div>
                  <p className="text-xs text-gray-400">Ready to use</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Recent Campaigns</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your latest email outreach activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">
                          Tech Internship Campaign
                        </p>
                        <p className="text-gray-400 text-sm">
                          8 emails sent • 2 responses
                        </p>
                      </div>
                      <div className="text-green-400 text-sm">25% rate</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">FAANG Outreach</p>
                        <p className="text-gray-400 text-sm">
                          12 emails sent • 3 responses
                        </p>
                      </div>
                      <div className="text-green-400 text-sm">25% rate</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">
                          Startup Applications
                        </p>
                        <p className="text-gray-400 text-sm">
                          4 emails sent • 1 response
                        </p>
                      </div>
                      <div className="text-green-400 text-sm">25% rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Get started with your next campaign
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Link href="/generate-email">
                      <Button className="w-full bg-white text-black hover:bg-gray-200 justify-start">
                        <Target className="mr-2 w-4 h-4" />
                        Generate Smart Email
                      </Button>
                    </Link>

                    <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 justify-start">
                      <FileText className="mr-2 w-4 h-4" />
                      Resume Builder
                    </Button>

                    <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 justify-start">
                      <BarChart3 className="mr-2 w-4 h-4" />
                      View Analytics
                    </Button>

                    <Link href="/pricing">
                      <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 justify-start">
                        <TrendingUp className="mr-2 w-4 h-4" />
                        Upgrade Plan
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SubscriptionCheck>
  );
}
