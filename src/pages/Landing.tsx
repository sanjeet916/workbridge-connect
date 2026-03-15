import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Wrench, Laptop, Briefcase, CheckCircle, ArrowRight, Users, Shield, Zap } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="h-16 bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="container h-full flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary tracking-tight">
            WorkBridge
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Start Working</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="container text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight mb-6 animate-fade-in">
            Get hired for what you <span className="text-primary">can do.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Whether you work with your hands or on a computer, WorkBridge connects your skills to real opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button size="xl" variant="hero" asChild>
              <Link to="/signup">
                <Briefcase className="mr-2 h-5 w-5" /> Find Work
              </Link>
            </Button>
            <Button size="xl" variant="hero-outline" asChild>
              <Link to="/signup">
                <Users className="mr-2 h-5 w-5" /> Hire Talent
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Worker Categories */}
      <section className="py-20 bg-card">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">Two worlds. One platform.</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            WorkBridge serves both hands-on tradespeople and digital professionals.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card-shadow rounded-xl p-8 bg-background hover:card-shadow-hover transition-shadow duration-300">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Wrench className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Hands-On Work</h3>
              <p className="text-muted-foreground mb-4">
                Electricians, plumbers, drivers, carpenters, mechanics, and technicians.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Upload photos of your work</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Get skill verification badges</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Find local on-site jobs</li>
              </ul>
            </div>
            <div className="card-shadow rounded-xl p-8 bg-background hover:card-shadow-hover transition-shadow duration-300">
              <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-5">
                <Laptop className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Computer / Office Work</h3>
              <p className="text-muted-foreground mb-4">
                Developers, designers, marketers, accountants, and analysts.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Showcase your portfolio</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> List your digital skills</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Apply for remote jobs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How WorkBridge works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, title: 'Create Your Profile', desc: 'Sign up, choose your work type, and fill out your profile in minutes.' },
              { icon: Shield, title: 'Verify Your Skills', desc: 'Upload work photos or portfolio links to earn a Verified badge.' },
              { icon: Zap, title: 'Get Matched', desc: 'Browse jobs, apply with one click, and start earning.' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to get started?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Join thousands of workers and employers on WorkBridge.
          </p>
          <Button size="xl" variant="hero-outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-0" asChild>
            <Link to="/signup">
              Start Working <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 WorkBridge. Built for the future of work.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
