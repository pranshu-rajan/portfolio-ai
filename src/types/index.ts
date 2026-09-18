export type AppId = 
  | "finder" 
  | "safari" 
  | "aichat" 
  | "terminal" 
  | "resume" 
  | "mail" 
  | "settings"
  | "contacts"
  | "photos";


export interface WindowState {
  id: AppId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: "AI & ML" | "Full Stack" | "Systems & Tools" | "Open Source";
  description: string;
  highlights: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl: string;
  featured: boolean;
  stars?: number;
  role: string;
  timeline: string;
  metrics?: string;
  accentColor: string;
  previewGradient: string;
  icon: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  type: "Full-Time" | "Contract" | "Open Source" | "Freelance";
  description: string;
  achievements: string[];
  skills: string[];
}

export interface CandidateProfile {
  name: string;
  handle: string;
  title: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  portfolioUrl: string;
  bio: string;
  status: string;
  availability: string;
  skills: {
    category: string;
    items: string[];
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
    description: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}

export type WallpaperId = 
  | "sequoia" 
  | "sonoma" 
  | "ventura" 
  | "aurora" 
  | "midnight";

export interface SystemSettings {
  wallpaper: WallpaperId;
  soundEnabled: boolean;
  dockMagnification: boolean;
  accentColor: "blue" | "purple" | "emerald" | "amber" | "rose";
  darkMode: boolean;
}
