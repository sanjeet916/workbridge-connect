import { useParams, Link, useNavigate } from 'react-router-dom';
import { store } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, Wrench, Laptop, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const job = id ? store.getJob(id) : undefined;
  const [applied, setApplied] = useState(() => {
    if (!user || !id) return false;
    return store.getWorkerApplications(user.id).some(a => a.jobId === id);
  });

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Job not found</h1>
          <Button asChild><Link to="/jobs">Browse Jobs</Link></Button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    store.apply(user.id, job.id);
    setApplied(true);
    toast.success('Application submitted!');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="h-16 bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="container h-full flex items-center">
          <Link to="/" className="text-xl font-bold text-primary">WorkBridge</Link>
        </div>
      </nav>

      <div className="container py-8 max-w-3xl">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link to="/jobs"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Jobs</Link>
        </Button>

        <div className="card-shadow rounded-xl bg-card p-8">
          <div className="flex items-center gap-3 mb-4">
            {job.category === 'hands-on'
              ? <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center"><Wrench className="h-6 w-6 text-primary" /></div>
              : <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center"><Laptop className="h-6 w-6 text-secondary" /></div>
            }
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{job.skill}</span>
              <h1 className="text-2xl font-bold">{job.title}</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{job.location}</span>
            <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" />{job.jobType === 'on-site' ? 'On-site' : 'Remote'}</span>
            <span className="font-bold text-foreground text-base tabular-nums">{job.salary}</span>
          </div>

          <div className="mb-8">
            <h2 className="font-bold mb-2">Job Description</h2>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          {user?.role === 'worker' && (
            applied ? (
              <Button disabled size="lg" className="w-full" variant="success">
                <CheckCircle className="h-4 w-4 mr-2" /> Applied
              </Button>
            ) : (
              <Button size="lg" className="w-full" onClick={handleApply}>
                Apply Now
              </Button>
            )
          )}
          {!user && (
            <Button size="lg" className="w-full" asChild>
              <Link to="/login">Log in to Apply</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
