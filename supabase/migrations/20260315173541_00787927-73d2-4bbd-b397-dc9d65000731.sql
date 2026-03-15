
ALTER TABLE public.jobs
ADD COLUMN category text DEFAULT 'hands-on',
ADD COLUMN skill text,
ADD COLUMN job_type text DEFAULT 'on-site';

-- Seed some jobs
INSERT INTO public.jobs (title, category, skill, description, location, job_type, salary, employer_id) VALUES
('Licensed Electrician Needed', 'hands-on', 'Electrician', 'We need an experienced electrician for a commercial rewiring project. Must have valid license and 3+ years experience.', 'Austin, TX', 'on-site', '$45/hour', null),
('Senior React Developer', 'computer', 'Developer', 'Join our team building a next-gen SaaS platform. Remote-first, flexible hours.', 'Remote', 'remote', '$120k/year', null),
('Plumber for Residential Project', 'hands-on', 'Plumber', 'Bathroom renovation project requiring full plumbing work. 2-week timeline.', 'Denver, CO', 'on-site', '$40/hour', null),
('UI/UX Designer', 'computer', 'Designer', 'Design mobile app interfaces for our fintech product. Figma expertise required.', 'New York, NY', 'remote', '$95k/year', null),
('HVAC Technician', 'hands-on', 'Technician', 'Commercial HVAC installation and maintenance. EPA certification required.', 'Chicago, IL', 'on-site', '$38/hour', null),
('Digital Marketing Specialist', 'computer', 'Marketer', 'Run paid ad campaigns across Google and Meta. Analytics experience required.', 'Remote', 'remote', '$75k/year', null);

-- Allow public read access to jobs
CREATE POLICY "Anyone can read jobs" ON public.jobs FOR SELECT USING (true);
