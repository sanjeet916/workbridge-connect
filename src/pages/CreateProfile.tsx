import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { store } from '@/lib/store';
import { WorkerProfile } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const handsOnSkills = ['Electrician', 'Plumber', 'Driver', 'Mechanic', 'Carpenter', 'Technician'];
const computerProfessions = ['Developer', 'Designer', 'Marketer', 'Accountant', 'Analyst', 'Writer'];

const CreateProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const existing = user ? store.getProfile(user.id) : undefined;

  const [fullName, setFullName] = useState(existing?.fullName || user?.name || '');
  const [location, setLocation] = useState(existing?.location || '');
  const [yearsExperience, setYearsExperience] = useState(existing?.yearsExperience?.toString() || '');
  const [bio, setBio] = useState(existing?.bio || '');
  const [primarySkill, setPrimarySkill] = useState(existing?.primarySkill || '');
  const [profession, setProfession] = useState(existing?.profession || '');
  const [skills, setSkills] = useState<string[]>(existing?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [portfolioLink, setPortfolioLink] = useState(existing?.portfolioLink || '');

  if (!user) return null;

  const isHandsOn = user.workType === 'hands-on';

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter(sk => sk !== s));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: WorkerProfile = {
      userId: user.id,
      fullName,
      location,
      yearsExperience: parseInt(yearsExperience) || 0,
      bio,
      workType: user.workType || 'hands-on',
      primarySkill: isHandsOn ? primarySkill : undefined,
      profession: !isHandsOn ? profession : undefined,
      skills: !isHandsOn ? skills : undefined,
      portfolioLink: !isHandsOn ? portfolioLink : undefined,
      verified: false,
    };
    store.saveProfile(profile);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
        <p className="text-muted-foreground mb-8">Tell employers what you can do.</p>

        <form onSubmit={handleSubmit} className="card-shadow rounded-xl bg-card p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Austin, TX" required className="h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Years of Experience</Label>
            <Input type="number" min="0" value={yearsExperience} onChange={e => setYearsExperience(e.target.value)} required className="h-12" />
          </div>

          <div className="space-y-2">
            <Label>Short Bio</Label>
            <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell employers about yourself..." rows={3} />
          </div>

          {isHandsOn ? (
            <div className="space-y-2">
              <Label>Primary Skill</Label>
              <Select value={primarySkill} onValueChange={setPrimarySkill}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your trade" />
                </SelectTrigger>
                <SelectContent>
                  {handsOnSkills.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Profession</Label>
                <Select value={profession} onValueChange={setProfession}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {computerProfessions.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Type a skill and press Enter"
                    className="h-12"
                  />
                  <Button type="button" variant="outline" onClick={addSkill} className="h-12">Add</Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map(s => (
                      <span key={s} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-medium">
                        {s}
                        <button type="button" onClick={() => removeSkill(s)} className="hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Portfolio Link</Label>
                <Input value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} placeholder="https://your-portfolio.com" className="h-12" />
              </div>
            </>
          )}

          <Button type="submit" size="lg" className="w-full">Save Profile</Button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
