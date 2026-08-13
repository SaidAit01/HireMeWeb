// templates/sampleData.ts

// ==========================================
// 1. THE DATA CONTRACT (INTERFACES)
// ==========================================

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string | "Present";
  highlights: string[];
}

export interface Education {
  id: string;
  degree: string;
  university: string;
  graduationYear: string;
  grade?: string;
}

export interface StudentData {
  personal: {
    fullName: string;
    tagline: string;
    bio: string;
    email: string;
    location: string;
    avatarUrl?: string;
  };
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  skills: {
    category: string;
    items: string[];
  }[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
}

// ==========================================
// 2. THE MOCK DATA (For Template Testing)
// ==========================================

export const sampleStudent: StudentData = {
  personal: {
    fullName: "Alex Chen",
    tagline: "Software Engineer & HCI Researcher",
    bio: "I am a recent Computer Science graduate with a passion for building accessible, high-performance web applications. I bridge the gap between complex backend architecture and seamless user experiences.",
    email: "hello@alexchen.dev",
    location: "London, UK",
  },
  socials: {
    linkedin: "https://linkedin.com/in/sample",
    github: "https://github.com/sample",
  },
  skills: [
    {
      category: "Frontend",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      category: "Backend",
      items: ["Node.js", "PostgreSQL", "Supabase", "Python"],
    },
    {
      category: "Design & Tools",
      items: ["Figma", "Git", "Docker", "Jest"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "FinDash - Financial Dashboard",
      summary: "A real-time cryptocurrency portfolio tracker.",
      description: "Built a highly responsive dashboard using Next.js and Tailwind. Integrated with the CoinGecko API to pull real-time pricing data and utilized Recharts for interactive data visualization.",
      techStack: ["Next.js", "TypeScript", "Tailwind", "REST API"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
    },
    {
      id: "proj-2",
      title: "EcoSort AI",
      summary: "Computer vision app for recycling classification.",
      description: "Trained a custom machine learning model using TensorFlow.js to run directly in the browser, identifying whether waste is recyclable, compostable, or landfill.",
      techStack: ["React", "TensorFlow.js", "Python"],
      githubUrl: "https://github.com",
    },
  ],
  experience: [
    {
      id: "exp-1",
      role: "Frontend Developer Intern",
      company: "TechNova Solutions",
      startDate: "Jun 2023",
      endDate: "Sep 2023",
      highlights: [
        "Migrated legacy React codebase to Next.js, improving page load speeds by 40%.",
        "Collaborated with UX designers to implement a new design system.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "BSc Computer Science",
      university: "University College London (UCL)",
      graduationYear: "2024",
      grade: "First Class Honours",
    },
  ],
};