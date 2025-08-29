import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Settings as SettingsIcon,
  Shield,
  Users,
  Database,
  Bell,
  Key,
  Zap,
  Globe,
  Activity,
  Lock,
  Mail,
  Smartphone,
  Eye,
  AlertTriangle
} from "lucide-react";

export default function Settings() {
  const modules = [
    {
      name: "Threat Detection Engine",
      description: "AI-powered threat detection and analysis",
      status: "enabled",
      version: "v2.1.4",
      category: "core"
    },
    {
      name: "Incident Response",
      description: "Automated incident response and workflow",
      status: "enabled", 
      version: "v1.8.2",
      category: "core"
    },
    {
      name: "Threat Intelligence",
      description: "External threat intelligence feeds integration",
      status: "enabled",
      version: "v3.0.1",
      category: "intelligence"
    },
    {
      name: "Malware Sandbox",
      description: "File analysis and malware detection sandbox",
      status: "disabled",
      version: "v1.2.0",
      category: "analysis"
    },
    {
      name: "Phishing Analysis",
      description: "Email and URL phishing detection module",
      status: "enabled",
      version: "v2.5.7",
      category: "analysis"
    },
    {
      name: "Vulnerability Scanner",
      description: "Network and application vulnerability scanning",
      status: "disabled",
      version: "v1.9.3",      
      category: "scanning"
    }
  ];

  const integrations = [
    {
      name: "XAI-Tech Backend",
      description: "NestJS API and authentication backend",
      status: "connected",
      type: "api"
    },
    {
      name: "Slack",
      description: "Security alerts and notifications",
      status: "disconnected",
      type: "notifications"
    },
    {
      name: "Microsoft Sentinel",
      description: "SIEM integration and log forwarding", 
      status: "connected",
      type: "siem"
    },
    {
      name: "VirusTotal",
      description: "File and URL analysis service",
      status: "connected",
      type: "analysis"
    }
  ];

  const users = [
    {
      name: "Admin User",
      email: "admin@xautopentest.com",
      role: "Administrator",
      lastLogin: "2 minutes ago",
      status: "active"
    },
    {
      name: "Security Analyst",
      email: "analyst@xautopentest.com", 
      role: "Analyst",
      lastLogin: "1 hour ago",
      status: "active"
    },
    {
      name: "Junior Analyst",
      email: "junior@xautopentest.com",
      role: "Viewer",
      lastLogin: "2 days ago",
      status: "inactive"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "enabled":
      case "connected":
      case "active": return "success";
      case "disabled":
      case "disconnected":
      case "inactive": return "muted";
      default: return "muted";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "core": return Shield;
      case "intelligence": return Globe;
      case "analysis": return Eye;
      case "scanning": return Activity;
      default: return SettingsIcon;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary font-cyber">System Settings</h1>
          <p className="text-muted-foreground font-cyber">Configure X-AutoPentest platform settings</p>
        </div>
        <Button size="sm">
          <SettingsIcon className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary font-cyber">
                <Zap className="w-5 h-5" />
                Security Modules
              </CardTitle>
              <CardDescription>Manage and configure security platform modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module, index) => {
                  const IconComponent = getCategoryIcon(module.category);
                  return (
                    <div key={index} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 text-accent" />
                          <div>
                            <h3 className="font-semibold text-sm">{module.name}</h3>
                            <p className="text-xs text-muted-foreground">{module.version}</p>
                          </div>
                        </div>
                        <Switch checked={module.status === 'enabled'} />
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant={getStatusColor(module.status) as any} className="text-xs">
                          {module.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary font-cyber">
                <Database className="w-5 h-5" />
                External Integrations
              </CardTitle>
              <CardDescription>Manage third-party service integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-accent" />
                      <div>
                        <h3 className="font-semibold text-sm">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(integration.status) as any} className="text-xs">
                        {integration.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {integration.status === 'connected' ? 'Configure' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary font-cyber">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Last login: {user.lastLogin}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                      <Badge variant={getStatusColor(user.status) as any} className="text-xs">
                        {user.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary font-cyber">
                <Bell className="w-5 h-5" />
                Alert Configuration
              </CardTitle>
              <CardDescription>Configure security alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="critical-alerts">Critical Security Alerts</Label>
                      <Switch id="critical-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="incident-updates">Incident Updates</Label>
                      <Switch id="incident-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      <Switch id="weekly-reports" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Notification Channels</h3>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" placeholder="security@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                    <Input id="slack-webhook" placeholder="https://hooks.slack.com/..." />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary font-cyber">
                <Lock className="w-5 h-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>Platform security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Authentication</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="2fa">Two-Factor Authentication</Label>
                      <Switch id="2fa" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="session-timeout">Auto Session Timeout</Label>
                      <Switch id="session-timeout" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                      <Input id="session-duration" defaultValue="60" type="number" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">API Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="api-rate-limit">Rate Limiting</Label>
                      <Switch id="api-rate-limit" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="flex gap-2">
                        <Input id="api-key" value="sk-x1a2b3c4d5e6f7g8h9i0j1k2" readOnly />
                        <Button variant="outline" size="sm">
                          <Key className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}