import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'hands-on' | 'computer'>('hands-on');
  const [skill, setSkill] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState<'on-site' | 'remote'>('on-site');
  const [salary, setSalary] = useState('');

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addJob({ title, category, skill, description, location, jobType, salary, employerId: user.id });
    toast.success('Job posted successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="h-16 bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="container h-full flex items-center">
          <Link to="/" className="text-xl font-bold text-primary">WorkBridge</Link>
        </div>
      </nav>

      <div className="container py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
        <p className="text-muted-foreground mb-8">Find the right worker for your project.</p>

        <form onSubmit={handleSubmit} className="card-shadow rounded-xl bg-card p-8 space-y-6">
          <div className="space-y-2">
            <Label>Job Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Licensed Electrician Needed" required className="h-12" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Job Category</Label>
              <Select value={category} onValueChange={(v: 'hands-on' | 'computer') => setCategory(v)}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hands-on">Hands-On Work</SelectItem>
                  <SelectItem value="computer">Computer Work</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Required Skill</Label>
              <Input value={skill} onChange={e => setSkill(e.target.value)} placeholder="e.g. Electrician" required className="h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Job Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Austin, TX" required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label>Job Type</Label>
              <Select value={jobType} onValueChange={(v: 'on-site' | 'remote') => setJobType(v)}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-site">On-site</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Salary / Budget</Label>
              <Input value={salary} onChange={e => setSalary(e.target.value)} placeholder="e.g. $45/hour" required className="h-12" />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full">Post Job</Button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
