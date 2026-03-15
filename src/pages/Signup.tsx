import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole, WorkType } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wrench, Laptop, Briefcase, Users } from 'lucide-react';

const Signup = () => {
  const [step, setStep] = useState<'info' | 'role' | 'worktype'>('info');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('role');
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'employer') {
      handleSignup(selectedRole);
    } else {
      setStep('worktype');
    }
  };

  const handleWorkTypeSelect = (workType: WorkType) => {
    handleSignup('worker', workType);
  };

  const handleSignup = async (r: UserRole, wt?: WorkType) => {
    setError('');
    try {
      await signup(email, password, name, r, wt);
      if (r === 'worker') {
        navigate('/create-profile');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary">WorkBridge</Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">Create your account</h1>
          <p className="text-muted-foreground">
            {step === 'info' && 'Tell us about yourself'}
            {step === 'role' && 'How will you use WorkBridge?'}
            {step === 'worktype' && 'What type of work do you do?'}
          </p>
        </div>

        <div className="card-shadow rounded-xl bg-card p-8">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          {step === 'info' && (
            <form onSubmit={handleInfoSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="h-12" />
              </div>
              <Button type="submit" className="w-full" size="lg">Continue</Button>
            </form>
          )}

          {step === 'role' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect('worker')}
                className="card-shadow rounded-xl p-8 bg-background hover:card-shadow-hover transition-all duration-200 hover:-translate-y-1 text-center group cursor-pointer"
              >
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-1">I want to work</h3>
                <p className="text-sm text-muted-foreground">Find jobs and get hired</p>
              </button>
              <button
                onClick={() => handleRoleSelect('employer')}
                className="card-shadow rounded-xl p-8 bg-background hover:card-shadow-hover transition-all duration-200 hover:-translate-y-1 text-center group cursor-pointer"
              >
                <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-1">I want to hire</h3>
                <p className="text-sm text-muted-foreground">Post jobs and find talent</p>
              </button>
            </div>
          )}

          {step === 'worktype' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleWorkTypeSelect('hands-on')}
                className="card-shadow rounded-xl p-8 bg-background hover:card-shadow-hover transition-all duration-200 hover:-translate-y-1 text-center group cursor-pointer"
              >
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Wrench className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-1">Hands-On Work</h3>
                <p className="text-sm text-muted-foreground">I work with my hands</p>
              </button>
              <button
                onClick={() => handleWorkTypeSelect('computer')}
                className="card-shadow rounded-xl p-8 bg-background hover:card-shadow-hover transition-all duration-200 hover:-translate-y-1 text-center group cursor-pointer"
              >
                <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                  <Laptop className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-1">Computer Work</h3>
                <p className="text-sm text-muted-foreground">I work on a computer</p>
              </button>
            </div>
          )}
        </div>

        {step !== 'info' && (
          <button onClick={() => setStep(step === 'worktype' ? 'role' : 'info')} className="block mx-auto mt-4 text-sm text-muted-foreground hover:text-foreground">
            ← Go back
          </button>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
