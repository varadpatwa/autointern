"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  Linkedin,
} from "lucide-react";
import { createClient } from "../../../supabase/client";

interface OnboardingData {
  goal: string;
  careerPath: string;
  experience: string;
  companies: string;
  resumeData: string;
  dataType: "resume" | "linkedin" | "";
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    goal: "",
    careerPath: "",
    experience: "",
    companies: "",
    resumeData: "",
    dataType: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const router = useRouter();

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerateEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setGeneratedEmail(result.email);
      setStep(6);
    } catch (error) {
      console.error("Error generating email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveEmail = () => {
    router.push("/generate-email");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="w-full max-w-md bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>What are you looking for?</CardTitle>
              <CardDescription className="text-gray-400">
                Select your primary goal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Internships", "Jobs", "Research", "Referrals"].map(
                (option) => (
                  <Button
                    key={option}
                    className={`w-full justify-start ${data.goal === option ? "bg-white text-black" : "border-gray-600 text-white hover:bg-gray-800 bg-transparent"}`}
                    onClick={() => setData({ ...data, goal: option })}
                  >
                    {option}
                  </Button>
                ),
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-md bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>What's your career path?</CardTitle>
              <CardDescription className="text-gray-400">
                Choose your field of interest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={data.careerPath}
                onValueChange={(value) =>
                  setData({ ...data, careerPath: value })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select career path" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Tech">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Law">Law</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-md bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>What's your experience level?</CardTitle>
              <CardDescription className="text-gray-400">
                Help us tailor your emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Beginner", "Intermediate", "Expert"].map((option) => (
                <Button
                  key={option}
                  className={`w-full justify-start ${data.experience === option ? "bg-white text-black" : "border-gray-600 text-white hover:bg-gray-800 bg-transparent"}`}
                  onClick={() => setData({ ...data, experience: option })}
                >
                  {option}
                </Button>
              ))}
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-md bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Target companies</CardTitle>
              <CardDescription className="text-gray-400">
                Which companies interest you?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={data.companies}
                onValueChange={(value) =>
                  setData({ ...data, companies: value })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select company type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="FAANG">
                    FAANG (Meta, Apple, Amazon, Netflix, Google)
                  </SelectItem>
                  <SelectItem value="Investment Banking">
                    Investment Banking
                  </SelectItem>
                  <SelectItem value="Consulting">
                    Top Consulting Firms
                  </SelectItem>
                  <SelectItem value="Startups">High-Growth Startups</SelectItem>
                  <SelectItem value="Fortune 500">
                    Fortune 500 Companies
                  </SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="w-full max-w-md bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Upload your profile</CardTitle>
              <CardDescription className="text-gray-400">
                Share your resume or LinkedIn profile URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Button
                  className={`w-full justify-start ${data.dataType === "resume" ? "bg-white text-black" : "border-gray-600 text-white hover:bg-gray-800 bg-transparent"}`}
                  onClick={() => setData({ ...data, dataType: "resume" })}
                >
                  <FileText className="mr-2 w-4 h-4" />
                  Upload Resume
                </Button>

                <Button
                  className={`w-full justify-start ${data.dataType === "linkedin" ? "bg-white text-black" : "border-gray-600 text-white hover:bg-gray-800 bg-transparent"}`}
                  onClick={() => setData({ ...data, dataType: "linkedin" })}
                >
                  <Linkedin className="mr-2 w-4 h-4" />
                  LinkedIn Profile URL
                </Button>
              </div>

              {data.dataType && (
                <div className="mt-4">
                  <Label htmlFor="profileData" className="text-white">
                    {data.dataType === "resume"
                      ? "Paste resume text"
                      : "LinkedIn profile URL"}
                  </Label>
                  <textarea
                    id="profileData"
                    className="w-full mt-2 p-3 bg-gray-800 border border-gray-700 rounded-md text-white min-h-[120px]"
                    placeholder={
                      data.dataType === "resume"
                        ? "Paste your resume content here..."
                        : "https://linkedin.com/in/yourprofile"
                    }
                    value={data.resumeData}
                    onChange={(e) =>
                      setData({ ...data, resumeData: e.target.value })
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card className="w-full max-w-2xl bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Review your email</CardTitle>
              <CardDescription className="text-gray-400">
                AI-generated email based on your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="text-sm text-gray-400 mb-2">
                  Subject: {data.goal} Opportunity - [Your Name]
                </div>
                <textarea
                  className="w-full bg-transparent text-white min-h-[200px] resize-none border-none outline-none"
                  value={generatedEmail}
                  onChange={(e) => setGeneratedEmail(e.target.value)}
                  placeholder="Your personalized email will appear here..."
                />
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleGenerateEmail}
                  disabled={isLoading}
                  className="bg-gray-700 text-white hover:bg-gray-600"
                >
                  {isLoading ? "Generating..." : "Regenerate Email"}
                </Button>
                <Button
                  onClick={handleApproveEmail}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Approve & Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-sm">Step {step} of 6</span>
            <span className="text-gray-400 text-sm">
              {Math.round((step / 6) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="flex justify-center mb-8">{renderStep()}</div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handleBack}
            disabled={step === 1}
            className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>

          {step < 5 && (
            <Button
              onClick={handleNext}
              disabled={
                !data[Object.keys(data)[step - 1] as keyof OnboardingData]
              }
              className="bg-white text-black hover:bg-gray-200"
            >
              Next
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}

          {step === 5 && (
            <Button
              onClick={handleGenerateEmail}
              disabled={!data.resumeData || isLoading}
              className="bg-white text-black hover:bg-gray-200"
            >
              {isLoading ? "Generating..." : "Generate Email"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
