export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issuerCategory: "Industry Vendor" | "Academic & Honors" | "AI & Cloud" | "Specialized";
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verifyUrl?: string;
  imageSrc: string;
  badgeSrc?: string;
  description: string;
  skills: string[];
}

export const certificationsData: CertificationItem[] = [
  {
    id: "sap-genai-developer",
    title: "SAP Certified - SAP Generative AI Developer",
    issuer: "SAP",
    issuerCategory: "AI & Cloud",
    issueDate: "Jan 15, 2026",
    expiryDate: "Jan 16, 2027",
    verifyUrl: "https://www.credly.com/badges/b004db60-7712-45cf-88d2-93997a79f6e4",
    imageSrc: "/certificates/sap-genai-developer.webp",
    badgeSrc: "/certificates/sap-genai-badge.webp",
    description: "Verifies deep understanding of SAP's Business AI capabilities and the skills to extend SAP BTP applications while leveraging leading Large Language Models (LLMs), using SAP AI Core, SAP AI Launchpad, and SAP's Generative AI hub.",
    skills: ["Generative AI", "SAP AI Core", "SAP BTP", "Large Language Models", "Prompt Engineering", "SAP AI Launchpad"]
  },
  {
    id: "oracle-genai-professional",
    title: "Oracle Certified Professional: OCI 2025 Generative AI Professional",
    issuer: "Oracle University",
    issuerCategory: "Industry Vendor",
    issueDate: "Sep 09, 2025",
    credentialId: "321763733OCI25GAIOCP",
    imageSrc: "/certificates/oracle-genai-professional.webp",
    description: "Certified by Oracle Corporation as an Oracle Certified Professional in Oracle Cloud Infrastructure 2025 Certified Generative AI Professional, covering large language models, fine-tuning, retrieval-augmented generation (RAG), and generative AI service deployment.",
    skills: ["OCI Generative AI", "RAG Pipelines", "LLM Fine-tuning", "Oracle Cloud Infrastructure", "AI Deployment"]
  },
  {
    id: "oracle-ai-foundations",
    title: "Oracle Certified Foundations Associate: OCI 2025 AI Foundations Associate",
    issuer: "Oracle University",
    issuerCategory: "Industry Vendor",
    issueDate: "Aug 18, 2025",
    credentialId: "321763733OCI25AICFA",
    imageSrc: "/certificates/oracle-ai-foundations.webp",
    description: "Certified by Oracle Corporation in Oracle Cloud Infrastructure AI Foundations, validating fundamental knowledge of Machine Learning, Deep Learning, Computer Vision, Natural Language Processing, and Cloud AI architectures.",
    skills: ["Machine Learning Foundations", "Computer Vision", "Natural Language Processing", "Cloud AI", "Deep Learning"]
  },
  {
    id: "nirma-scholar-certificate",
    title: "Certificate of Scholar — Nirma University",
    issuer: "Nirma University (School of Technology)",
    issuerCategory: "Academic & Honors",
    issueDate: "07-Jul-2025",
    credentialId: "SCHOLAR-CERTI/2502599",
    imageSrc: "/certificates/nirma-scholar-certificate.webp",
    description: "Awarded to Rajan Pranshu Piyushkumar (24BEI056) of B.Tech. in Electronics and Instrumentation Engineering Programme (Batch: 2024-28), School of Technology, Nirma University, in recognition of outstanding scholastic performance with SGPA 8.57/10 in the Second Semester.",
    skills: ["Academic Excellence", "Scholastic Distinction", "Instrumentation Engineering", "Electronics Engineering", "SGPA 8.57/10"]
  },
  {
    id: "huggingface-ai-agents",
    title: "AI Agents Course — Certificate of Excellence",
    issuer: "Hugging Face",
    issuerCategory: "AI & Cloud",
    issueDate: "Apr 2026",
    credentialId: "pranshurajan",
    imageSrc: "/certificates/huggingface-ai-agents.webp",
    description: "Certificate of Excellence awarded for successfully completing the Hugging Face AI Agents Course, covering autonomous agent architectures, smolagents, tool-calling interfaces, multi-step planning, and LLM reasoning loops.",
    skills: ["AI Agents", "smolagents", "Autonomous Tool Calling", "ReAct Framework", "Hugging Face Transformers"]
  },
  {
    id: "knowledgegate-c-programming",
    title: "C Programming Certification Test — Certificate of Completion",
    issuer: "KnowledgeGate",
    issuerCategory: "Specialized",
    issueDate: "2025",
    credentialId: "12219903219980860626648",
    verifyUrl: "https://learn.knowledgegate.ai/learn/certificate/12219903-219980",
    imageSrc: "/certificates/knowledgegate-c-programming.webp",
    description: "Certified completion of the C Programming Certification examination covering memory management, pointer arithmetic, data structures, low-level systems programming, and algorithmic efficiency.",
    skills: ["C Programming", "Pointers & Memory Allocation", "Data Structures", "Systems Programming"]
  },
  {
    id: "simplilearn-databricks-ml",
    title: "Get Started with Databricks for Machine Learning",
    issuer: "SimpliLearn SkillUp",
    issuerCategory: "Specialized",
    issueDate: "3rd July 2025",
    credentialId: "8565682",
    imageSrc: "/certificates/simplilearn-databricks-ml.webp",
    description: "Successfully completed Databricks for Machine Learning course covering distributed machine learning, MLflow tracking, Delta Lake integrations, and cloud data processing pipelines.",
    skills: ["Databricks", "MLflow", "Distributed ML", "Data Engineering", "Cloud Pipelines"]
  },
  {
    id: "isa-nirma-renewable-ai",
    title: "Certificate of Participation — AI in Renewable Energy Field",
    issuer: "International Society of Automation (ISA) Students' Chapter, Nirma University",
    issuerCategory: "Academic & Honors",
    issueDate: "28th June 2025",
    imageSrc: "/certificates/isa-nirma-renewable-ai.webp",
    description: "Certificate of Participation awarded for active participation in the 'AI in Renewable Energy Field' technical symposium organized by ISA Students' Chapter, Gujarat Section, Nirma University.",
    skills: ["AI in Renewable Energy", "Automation", "Smart Grid Optimization", "ISA Leadership"]
  }
];
