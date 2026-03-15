import { Job, WorkerProfile, Application } from '@/types/models';

const JOBS_KEY = 'workbridge_jobs';
const PROFILES_KEY = 'workbridge_profiles';
const APPS_KEY = 'workbridge_applications';

// Seed data
const seedJobs: Job[] = [
  {
    id: '1', title: 'Licensed Electrician Needed', category: 'hands-on', skill: 'Electrician',
    description: 'We need an experienced electrician for a commercial rewiring project. Must have valid license and 3+ years experience.',
    location: 'Austin, TX', jobType: 'on-site', salary: '$45/hour', employerId: 'emp1',
  },
  {
    id: '2', title: 'Senior React Developer', category: 'computer', skill: 'Developer',
    description: 'Join our team building a next-gen SaaS platform. Remote-first, flexible hours.',
    location: 'Remote', jobType: 'remote', salary: '$120k/year', employerId: 'emp1',
  },
  {
    id: '3', title: 'Plumber for Residential Project', category: 'hands-on', skill: 'Plumber',
    description: 'Bathroom renovation project requiring full plumbing work. 2-week timeline.',
    location: 'Denver, CO', jobType: 'on-site', salary: '$40/hour', employerId: 'emp2',
  },
  {
    id: '4', title: 'UI/UX Designer', category: 'computer', skill: 'Designer',
    description: 'Design mobile app interfaces for our fintech product. Figma expertise required.',
    location: 'New York, NY', jobType: 'remote', salary: '$95k/year', employerId: 'emp2',
  },
  {
    id: '5', title: 'HVAC Technician', category: 'hands-on', skill: 'Technician',
    description: 'Commercial HVAC installation and maintenance. EPA certification required.',
    location: 'Chicago, IL', jobType: 'on-site', salary: '$38/hour', employerId: 'emp1',
  },
  {
    id: '6', title: 'Digital Marketing Specialist', category: 'computer', skill: 'Marketer',
    description: 'Run paid ad campaigns across Google and Meta. Analytics experience required.',
    location: 'Remote', jobType: 'remote', salary: '$75k/year', employerId: 'emp2',
  },
];

function getStore<T>(key: string, seed?: T[]): T[] {
  const data = localStorage.getItem(key);
  if (data) return JSON.parse(data);
  if (seed) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return [];
}

function setStore<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const store = {
  getJobs: (): Job[] => getStore(JOBS_KEY, seedJobs),
  addJob: (job: Omit<Job, 'id'>): Job => {
    const jobs = store.getJobs();
    const newJob = { ...job, id: crypto.randomUUID() };
    jobs.push(newJob);
    setStore(JOBS_KEY, jobs);
    return newJob;
  },
  getJob: (id: string): Job | undefined => store.getJobs().find(j => j.id === id),

  getProfiles: (): WorkerProfile[] => getStore(PROFILES_KEY),
  getProfile: (userId: string): WorkerProfile | undefined =>
    store.getProfiles().find(p => p.userId === userId),
  saveProfile: (profile: WorkerProfile) => {
    const profiles = store.getProfiles();
    const idx = profiles.findIndex(p => p.userId === profile.userId);
    if (idx >= 0) profiles[idx] = profile;
    else profiles.push(profile);
    setStore(PROFILES_KEY, profiles);
    // Update user profileComplete flag
    const user = JSON.parse(localStorage.getItem('workbridge_user') || 'null');
    if (user && user.id === profile.userId) {
      user.profileComplete = true;
      localStorage.setItem('workbridge_user', JSON.stringify(user));
    }
  },

  getApplications: (): Application[] => getStore(APPS_KEY),
  apply: (workerId: string, jobId: string): Application => {
    const apps = store.getApplications();
    const existing = apps.find(a => a.workerId === workerId && a.jobId === jobId);
    if (existing) return existing;
    const app: Application = { id: crypto.randomUUID(), workerId, jobId, status: 'pending' };
    apps.push(app);
    setStore(APPS_KEY, apps);
    return app;
  },
  getWorkerApplications: (workerId: string): Application[] =>
    store.getApplications().filter(a => a.workerId === workerId),
  getJobApplications: (jobId: string): Application[] =>
    store.getApplications().filter(a => a.jobId === jobId),
};
