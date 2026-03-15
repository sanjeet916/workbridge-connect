import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wrench, Laptop, MapPin, Briefcase, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseJob {
  id: string;
  title: string | null;
  category: string | null;
  skill: string | null;
  description: string | null;
  location: string | null;
  job_type: string | null;
  salary: string | null;
  employer_id: string | null;
}

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<SupabaseJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'hands-on' | 'computer'>('all');

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase.from('jobs').select('*');
      if (!error && data) setJobs(data as unknown as SupabaseJob[]);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <nav className="h-16 bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="container h-full flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">WorkBridge</Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link to="/signup">Start Working</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Job Marketplace</h1>
        <p className="text-muted-foreground mb-6">Browse available opportunities</p>

        <div className="flex gap-2 mb-8">
          {[
            { key: 'all' as const, label: 'All Jobs' },
            { key: 'hands-on' as const, label: 'Hands-On', icon: Wrench },
            { key: 'computer' as const, label: 'Computer', icon: Laptop },
          ].map(f => (
            <Button
              key={f.key}
              variant={filter === f.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.key)}
            >
              {f.icon && <f.icon className="h-4 w-4 mr-1" />}
              {f.label}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(job => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="card-shadow rounded-xl bg-card p-6 hover:card-shadow-hover transition-all duration-200 hover:-translate-y-0.5 block"
              >
                <div className="flex items-center gap-2 mb-3">
                  {job.category === 'hands-on'
                    ? <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><Wrench className="h-4 w-4 text-primary" /></div>
                    : <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center"><Laptop className="h-4 w-4 text-secondary" /></div>
                  }
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{job.skill}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{job.title}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                  <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.job_type === 'on-site' ? 'On-site' : 'Remote'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground tabular-nums">{job.salary}</span>
                  <span className="text-primary text-sm font-semibold">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
