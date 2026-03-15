export interface Job {
  id: string;
  title: string;
  category: 'hands-on' | 'computer';
  skill: string;
  description: string;
  location: string;
  jobType: 'on-site' | 'remote';
  salary: string;
  employerId: string;
}

export interface WorkerProfile {
  userId: string;
  fullName: string;
  photo?: string;
  location: string;
  yearsExperience: number;
  bio: string;
  workType: 'hands-on' | 'computer';
  // hands-on specific
  primarySkill?: string;
  workPhoto?: string;
  // computer specific
  profession?: string;
  skills?: string[];
  portfolioLink?: string;
  // verification
  verified: boolean;
  verificationMedia?: string;
}

export interface Application {
  id: string;
  workerId: string;
  jobId: string;
  status: 'pending' | 'accepted' | 'rejected';
}
