import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Upload, Image, Link as LinkIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const VerifySkills = () => {
  const { user } = useAuth();
  const profile = user ? store.getProfile(user.id) : undefined;
  const [uploaded, setUploaded] = useState(false);

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Create your profile first</h1>
          <Button asChild><Link to="/create-profile">Create Profile</Link></Button>
        </div>
      </div>
    );
  }

  const handleVerify = () => {
    profile.verified = true;
    profile.verificationMedia = 'uploaded';
    store.saveProfile(profile);
    setUploaded(true);
    toast.success('Skills verified! Badge added to your profile.');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="h-16 bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="container h-full flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">WorkBridge</Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </nav>

      <div className="container py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Verify Your Skills</h1>
        <p className="text-muted-foreground mb-8">
          Upload proof of your work to earn a Verified badge that employers trust.
        </p>

        {(profile.verified || uploaded) ? (
          <div className="card-shadow rounded-xl bg-card p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-bold mb-2">Skills Verified!</h2>
            <p className="text-muted-foreground mb-4">Your profile now shows a Verified badge.</p>
            <span className="verification-badge inline-flex mx-auto">
              <CheckCircle className="h-3 w-3" /> Verified
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="card-shadow rounded-xl bg-card p-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Current Skill: {profile.workType === 'hands-on' ? profile.primarySkill : profile.profession}
              </h2>

              <div className="space-y-4">
                {profile.workType === 'hands-on' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Image className="inline h-4 w-4 mr-1" /> Upload a photo of your completed work
                      </label>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
                        <Input type="file" accept="image/*" className="hidden" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      <LinkIcon className="inline h-4 w-4 mr-1" /> Portfolio or project link
                    </label>
                    <Input placeholder="https://your-portfolio.com" className="h-12" />
                  </div>
                )}

                <Button size="lg" className="w-full" onClick={handleVerify}>
                  <Shield className="h-4 w-4 mr-2" /> Submit for Verification
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifySkills;
