import { useAuth } from '@/contexts/AuthContext';
import { store } from '@/lib/store';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, CheckCircle, Wrench, Laptop, Plus, User, FileText, Shield, LayoutDashboard, LogOut } from 'lucide-react';
import { WorkerProfile } from '@/types/models';

const WorkerProfileCard = ({ profile }: { profile: WorkerProfile }) => (
  <div className="card-shadow rounded-xl bg-card p-6">
    <div className="flex items-start gap-4">
      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <User className="h-7 w-7 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-lg truncate">{profile.fullName}</h3>
          {profile.verified && (
            <span className="verification-badge">
              <CheckCircle className="h-3 w-3" /> Verified
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          {profile.workType === 'hands-on' ? profile.primarySkill : profile.profession}
        </p>
        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profile.location}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{profile.yearsExperience} years experience</span>
        </div>
        {profile.skills && profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {profile.skills.map(s => (
              <span key={s} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">{s}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const profile = user.role === 'worker' ? store.getProfile(user.id) : null;
  const jobs = store.getJobs();
  const applications = user.role === 'worker' ? store.getWorkerApplications(user.id) : [];
  const myJobs = user.role === 'employer' ? jobs.filter(j => j.employerId === user.id) : [];
  const allProfiles = user.role === 'employer' ? store.getProfiles() : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = user.role === 'worker'
    ? [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: User, label: 'My Profile', href: '/create-profile' },
        { icon: FileText, label: 'Applications' },
        { icon: Briefcase, label: 'Job Listings', href: '/jobs' },
        { icon: Shield, label: 'Skill Verification', href: '/verify' },
      ]
    : [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: Plus, label: 'Post a Job', href: '/post-job' },
        { icon: Briefcase, label: 'My Jobs' },
        { icon: User, label: 'Find Workers' },
      ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <nav className="h-16 bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="h-full flex items-center justify-between px-6">
          <Link to="/" className="text-xl font-bold text-primary">WorkBridge</Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">Find Jobs</Link>
            <Link to="/dashboard" className="text-foreground">Dashboard</Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Log out
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-60 min-h-[calc(100vh-4rem)] bg-card border-r border-border/50 p-4">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                to={item.href || '/dashboard'}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-primary/10 text-primary border-l-4 border-primary -ml-1 pl-4'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold mb-1">
              {user.role === 'worker' ? 'Worker Dashboard' : 'Employer Dashboard'}
            </h1>
            <p className="text-muted-foreground mb-8">
              Welcome back, {user.name}.
            </p>

            {/* Worker view */}
            {user.role === 'worker' && (
              <div className="space-y-8">
                {/* Profile card */}
                {profile ? (
                  <div>
                    <h2 className="text-lg font-bold mb-3">Your Profile</h2>
                    <WorkerProfileCard profile={profile} />
                    {!profile.verified && (
                      <Button variant="success" size="sm" className="mt-3" asChild>
                        <Link to="/verify">
                          <Shield className="h-4 w-4 mr-1" /> Verify Your Skills
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="card-shadow rounded-xl bg-card p-8 text-center">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2">Complete Your Profile</h3>
                    <p className="text-muted-foreground mb-4">Create your profile to start applying for jobs.</p>
                    <Button asChild>
                      <Link to="/create-profile">Create Profile</Link>
                    </Button>
                  </div>
                )}

                {/* Applications */}
                <div>
                  <h2 className="text-lg font-bold mb-3">Your Applications ({applications.length})</h2>
                  {applications.length === 0 ? (
                    <p className="text-muted-foreground text-sm">You haven't applied to any jobs yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {applications.map(app => {
                        const job = store.getJob(app.jobId);
                        if (!job) return null;
                        return (
                          <div key={app.id} className="card-shadow rounded-xl bg-card p-4 flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{job.title}</h4>
                              <p className="text-sm text-muted-foreground">{job.location} · {job.salary}</p>
                            </div>
                            <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                              app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              app.status === 'accepted' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent jobs */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold">Recent Jobs</h2>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/jobs">View All →</Link>
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    {jobs.slice(0, 3).map(job => (
                      <Link key={job.id} to={`/jobs/${job.id}`} className="card-shadow rounded-xl bg-card p-4 hover:card-shadow-hover transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {job.category === 'hands-on' ? <Wrench className="h-4 w-4 text-primary" /> : <Laptop className="h-4 w-4 text-secondary" />}
                              <h4 className="font-semibold">{job.title}</h4>
                            </div>
                            <div className="flex gap-3 text-sm text-muted-foreground">
                              <span>{job.skill}</span>
                              <span>·</span>
                              <span>{job.location}</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-foreground tabular-nums">{job.salary}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Employer view */}
            {user.role === 'employer' && (
              <div className="space-y-8">
                <div className="flex gap-3">
                  <Button asChild>
                    <Link to="/post-job"><Plus className="h-4 w-4 mr-1" /> Post a Job</Link>
                  </Button>
                </div>

                {/* My jobs */}
                <div>
                  <h2 className="text-lg font-bold mb-3">Your Posted Jobs ({myJobs.length})</h2>
                  {myJobs.length === 0 ? (
                    <p className="text-muted-foreground text-sm">You haven't posted any jobs yet.</p>
                  ) : (
                    <div className="grid gap-3">
                      {myJobs.map(job => (
                        <div key={job.id} className="card-shadow rounded-xl bg-card p-4">
                          <h4 className="font-semibold">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.location} · {job.salary}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {store.getJobApplications(job.id).length} applicants
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Browse workers */}
                <div>
                  <h2 className="text-lg font-bold mb-3">Available Workers ({allProfiles.length})</h2>
                  <div className="grid gap-3">
                    {allProfiles.map(p => (
                      <WorkerProfileCard key={p.userId} profile={p} />
                    ))}
                    {allProfiles.length === 0 && (
                      <p className="text-muted-foreground text-sm">No workers have signed up yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
