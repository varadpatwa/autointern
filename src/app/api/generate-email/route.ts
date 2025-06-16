import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { goal, careerPath, experience, companies, resumeData, dataType } =
      await request.json();

    // Simple email generation logic (in production, this would use AI/LLM)
    const generateEmail = () => {
      const templates = {
        Internships: {
          subject: `${careerPath} Internship Application`,
          greeting: "Dear Hiring Manager,",
          intro: `I am writing to express my strong interest in ${careerPath.toLowerCase()} internship opportunities at your company.`,
          body: `As a ${experience.toLowerCase()} student with a passion for ${careerPath.toLowerCase()}, I am particularly drawn to ${companies === "FAANG" ? "innovative technology companies" : companies.toLowerCase()} that are shaping the future of the industry.`,
          closing:
            "I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team. Thank you for your consideration.",
        },
        Jobs: {
          subject: `${careerPath} Position Application`,
          greeting: "Dear Hiring Manager,",
          intro: `I am writing to inquire about ${careerPath.toLowerCase()} opportunities at your organization.`,
          body: `With my ${experience.toLowerCase()} background in ${careerPath.toLowerCase()}, I am excited about the possibility of contributing to ${companies === "FAANG" ? "a leading technology company" : "your organization"}.`,
          closing:
            "I look forward to the opportunity to discuss how my experience aligns with your team's needs.",
        },
        Research: {
          subject: `Research Collaboration Inquiry - ${careerPath}`,
          greeting: "Dear Professor/Researcher,",
          intro: `I am reaching out to explore potential research opportunities in ${careerPath.toLowerCase()}.`,
          body: `As someone with ${experience.toLowerCase()} experience in this field, I am particularly interested in contributing to cutting-edge research projects.`,
          closing:
            "I would be honored to discuss potential collaboration opportunities at your convenience.",
        },
        Referrals: {
          subject: `Referral Request - ${careerPath} Opportunities`,
          greeting: "Hello,",
          intro: `I hope this message finds you well. I am currently seeking ${careerPath.toLowerCase()} opportunities and would greatly appreciate your insights.`,
          body: `Given your experience at ${companies === "FAANG" ? "leading tech companies" : "top organizations"}, I would value any guidance or potential referrals you might be able to provide.`,
          closing:
            "Thank you for your time and consideration. I look forward to hearing from you.",
        },
      };

      const template =
        templates[goal as keyof typeof templates] || templates.Internships;

      return `${template.greeting}\n\n${template.intro} ${template.body}\n\n${template.closing}\n\nBest regards,\n[Your Name]`;
    };

    const email = generateEmail();

    return NextResponse.json({ email });
  } catch (error) {
    console.error("Error generating email:", error);
    return NextResponse.json(
      { error: "Failed to generate email" },
      { status: 500 },
    );
  }
}
