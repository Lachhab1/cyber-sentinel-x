-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'analyst', 'viewer')),
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create incidents table
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  status TEXT NOT NULL DEFAULT 'investigating' CHECK (status IN ('investigating', 'mitigated', 'contained', 'resolved')),
  source_ip TEXT,
  technique TEXT,
  ai_confidence INTEGER CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
  affected_systems TEXT[],
  tags TEXT[],
  assigned_to UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create threat_intelligence table
CREATE TABLE public.threat_intelligence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET,
  domain TEXT,
  threat_type TEXT,
  confidence_level INTEGER CHECK (confidence_level >= 0 AND confidence_level <= 100),
  source_feed TEXT,
  geolocation JSONB,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_malicious BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create security_modules table
CREATE TABLE public.security_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  version TEXT,
  category TEXT,
  enabled BOOLEAN DEFAULT false,
  configuration JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system_integrations table
CREATE TABLE public.system_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  integration_type TEXT,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  configuration JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for incidents (analysts and admins can see all)
CREATE POLICY "Analysts can view all incidents" ON public.incidents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'analyst')
    )
  );

CREATE POLICY "Analysts can create incidents" ON public.incidents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'analyst')
    )
  );

CREATE POLICY "Analysts can update incidents" ON public.incidents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'analyst')
    )
  );

-- Create RLS policies for threat intelligence (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view threat intelligence" ON public.threat_intelligence
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create RLS policies for security modules (admins only)
CREATE POLICY "Admins can manage security modules" ON public.security_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create RLS policies for system integrations (admins only)
CREATE POLICY "Admins can manage integrations" ON public.system_integrations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create RLS policies for audit logs (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    'viewer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_security_modules_updated_at
  BEFORE UPDATE ON public.security_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_integrations_updated_at
  BEFORE UPDATE ON public.system_integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for security modules
INSERT INTO public.security_modules (name, description, version, category, enabled, configuration) VALUES
('Threat Detection Engine', 'AI-powered threat detection and analysis', 'v2.1.4', 'core', true, '{"detection_threshold": 85, "auto_response": true}'),
('Incident Response', 'Automated incident response and workflow', 'v1.8.2', 'core', true, '{"auto_assign": true, "escalation_time": 60}'),
('Threat Intelligence', 'External threat intelligence feeds integration', 'v3.0.1', 'intelligence', true, '{"feeds_enabled": ["alienvault", "abuse_ch"], "update_frequency": 3600}'),
('Malware Sandbox', 'File analysis and malware detection sandbox', 'v1.2.0', 'analysis', false, '{"timeout": 300, "vm_instances": 2}'),
('Phishing Analysis', 'Email and URL phishing detection module', 'v2.5.7', 'analysis', true, '{"url_scanning": true, "email_analysis": true}'),
('Vulnerability Scanner', 'Network and application vulnerability scanning', 'v1.9.3', 'scanning', false, '{"scan_frequency": 86400, "severity_threshold": "medium"}');

-- Insert sample data for system integrations
INSERT INTO public.system_integrations (name, description, integration_type, status, configuration) VALUES
('Supabase', 'Database and authentication backend', 'database', 'connected', '{"connection_string": "***", "ssl": true}'),
('Slack', 'Security alerts and notifications', 'notifications', 'disconnected', '{"webhook_url": null, "channels": ["#security"]}'),
('Microsoft Sentinel', 'SIEM integration and log forwarding', 'siem', 'connected', '{"workspace_id": "***", "api_key": "***"}'),
('VirusTotal', 'File and URL analysis service', 'analysis', 'connected', '{"api_key": "***", "rate_limit": 4});

-- Insert sample incidents
INSERT INTO public.incidents (incident_id, title, description, severity, status, source_ip, technique, ai_confidence, affected_systems, tags) VALUES
('INC-2024-001', 'SQL Injection Attempt Detected', 'Multiple SQL injection payloads detected from suspicious IP address', 'Critical', 'investigating', '192.168.1.45', 'T1190 - Exploit Public-Facing Application', 95, '{"web-server-01", "database-primary"}', '{"web", "database", "injection"}'),
('INC-2024-002', 'Suspicious Login Activity from Russia', 'Multiple failed login attempts followed by successful login from geographically distant location', 'High', 'mitigated', '185.220.101.42', 'T1110 - Brute Force', 87, '{"auth-server"}', '{"authentication", "geolocation"}'),
('INC-2024-003', 'Port Scan Activity Detected', 'Systematic port scanning activity detected from internal network', 'Medium', 'investigating', '10.0.0.100', 'T1046 - Network Service Scanning', 78, '{"network-scanner"}', '{"reconnaissance", "network"}'),
('INC-2024-004', 'Malware Command & Control Communication', 'Suspicious outbound connections to known C&C domains detected', 'Critical', 'contained', '192.168.1.142', 'T1071 - Application Layer Protocol', 92, '{"workstation-045"}', '{"malware", "c2", "communication"}');

-- Insert sample threat intelligence
INSERT INTO public.threat_intelligence (ip_address, threat_type, confidence_level, source_feed, geolocation, is_malicious) VALUES
('185.220.101.42', 'brute_force', 95, 'abuse_ch', '{"country": "RU", "city": "Moscow", "lat": 55.7558, "lon": 37.6176}', true),
('192.168.1.45', 'sql_injection', 87, 'internal_detection', '{"country": "US", "city": "Unknown", "lat": 39.0458, "lon": -76.6413}', true),
('10.0.0.100', 'port_scan', 65, 'internal_detection', '{"country": "Internal", "city": "Network", "lat": 0, "lon": 0}', false);