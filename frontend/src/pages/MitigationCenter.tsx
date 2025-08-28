import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  Shield,
  Zap,
  Settings,
  Play,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Activity,
  Target,
  Lock,
  Eye,
  Code,
  Database,
  Network,
  Timer,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Clock,
  Users,
  Server
} from "lucide-react";

interface MitigationRule {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high';
  category: string;
  target: string;
  status: 'draft' | 'active' | 'deployed' | 'disabled';
  configuration: string;
  createdAt: string;
  lastDeployed?: string;
}

interface SimulationResult {
  blocked: number;
  allowed: number;
  falsePositives: number;
  accuracy: number;
  performance: number;
}

export default function MitigationCenter() {
  const { toast } = useToast();
  const [rules, setRules] = useState<MitigationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<string | null>(null);
  const [simulationResults, setSimulationResults] = useState<Record<string, SimulationResult>>({});

  // Sample mitigation rules
  const defaultRules: MitigationRule[] = [
    {
      id: "MIT-001",
      name: "Block SQL Injection Attempts",
      description: "Blocks common SQL injection patterns and payloads",
      severity: "high",
      impact: "low",
      category: "Web Application Firewall",
      target: "SQL Injection",
      status: "draft",
      configuration: `# WAF Rules - SQL Injection Protection
SecRule ARGS "@detectSQLi" "id:1001,phase:2,block,msg:'SQL Injection Attack Detected'"
SecRule ARGS "@detectSQLi" "id:1002,phase:2,block,msg:'SQL Injection Pattern Detected'"
SecRule ARGS "@detectSQLi" "id:1003,phase:2,block,msg:'SQL Injection Payload Detected'"`,
      createdAt: new Date().toISOString(),
    },
    {
      id: "MIT-002",
      name: "Rate Limit Brute Force Attacks",
      description: "Implements aggressive rate limiting for authentication endpoints",
      severity: "high",
      impact: "medium",
      category: "Rate Limiting",
      target: "Brute Force",
      status: "draft",
      configuration: `# Rate Limiting Rules
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

location /login {
    limit_req zone=login burst=10 nodelay;
}

location /api/ {
    limit_req zone=api burst=50 nodelay;
}`,
      createdAt: new Date().toISOString(),
    },
    {
      id: "MIT-003",
      name: "Block Malicious IP Ranges",
      description: "Blocks known malicious IP addresses and ranges",
      severity: "medium",
      impact: "high",
      category: "Network Firewall",
      target: "Multiple",
      status: "draft",
      configuration: `# iptables Rules - Block Malicious IPs
iptables -A INPUT -s 185.220.101.42 -j DROP
iptables -A INPUT -s 192.168.1.45 -j DROP
iptables -A INPUT -s 10.0.0.0/8 -j DROP
iptables -A INPUT -m geoip --src-cc CN,RU,KP -j DROP

# Block known botnet IPs
iptables -A INPUT -s 45.95.147.0/24 -j DROP
iptables -A INPUT -s 185.220.101.0/24 -j DROP`,
      createdAt: new Date().toISOString(),
    },
    {
      id: "MIT-004",
      name: "XSS Protection Headers",
      description: "Implements Content Security Policy and XSS protection headers",
      severity: "medium",
      impact: "low",
      category: "Web Security",
      target: "XSS",
      status: "draft",
      configuration: `# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline';" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;`,
      createdAt: new Date().toISOString(),
    },
    {
      id: "MIT-005",
      name: "DDoS Protection",
      description: "Implements DDoS mitigation with connection limiting",
      severity: "critical",
      impact: "high",
      category: "Network Protection",
      target: "DDoS",
      status: "draft",
      configuration: `# DDoS Protection Rules
# Limit connections per IP
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# Rate limit HTTP requests
limit_req_zone $binary_remote_addr zone=ddos:10m rate=10r/s;
limit_req zone=ddos burst=20 nodelay;`,
      createdAt: new Date().toISOString(),
    }
  ];

  useEffect(() => {
    // Load rules from backend or use defaults
    const loadRules = async () => {
      try {
        // TODO: Replace with actual API call when backend supports mitigation rules
        setRules(defaultRules);
      } catch (error) {
        console.error('Failed to load mitigation rules:', error);
        setRules(defaultRules);
      } finally {
        setLoading(false);
      }
    };

    loadRules();
  }, []);

  const handleDeployRule = async (ruleId: string) => {
    setDeploying(ruleId);
    try {
      // Simulate deployment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setRules(prev => prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, status: 'deployed', lastDeployed: new Date().toISOString() }
          : rule
      ));

      toast({
        title: "Rule Deployed",
        description: `Mitigation rule ${ruleId} has been successfully deployed`,
      });
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: `Failed to deploy rule ${ruleId}`,
        variant: "destructive",
      });
    } finally {
      setDeploying(null);
    }
  };

  const handleSimulateRule = async (ruleId: string) => {
    setSimulating(ruleId);
    try {
      // Simulate rule testing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result: SimulationResult = {
        blocked: Math.floor(Math.random() * 2000) + 500,
        allowed: Math.floor(Math.random() * 100000) + 50000,
        falsePositives: Math.floor(Math.random() * 50) + 5,
        accuracy: Math.random() * 10 + 90,
        performance: Math.random() * 10 + 85,
      };

      setSimulationResults(prev => ({
        ...prev,
        [ruleId]: result
      }));

      toast({
        title: "Simulation Complete",
        description: `Rule ${ruleId} simulation completed successfully`,
      });
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: `Failed to simulate rule ${ruleId}`,
        variant: "destructive",
      });
    } finally {
      setSimulating(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "muted";
      default: return "muted";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "success";
      default: return "muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed": return "success";
      case "active": return "default";
      case "draft": return "secondary";
      case "disabled": return "destructive";
      default: return "muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deployed": return <CheckCircle className="w-4 h-4" />;
      case "active": return <Activity className="w-4 h-4" />;
      case "draft": return <Clock className="w-4 h-4" />;
      case "disabled": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-primary font-cyber">
          <Shield className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading Mitigation Center...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary font-cyber">Mitigation Center</h1>
          <p className="text-muted-foreground font-cyber">Automated defense and response capabilities</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span>Defense Active</span>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary font-cyber">
              {rules.filter(r => r.status === 'deployed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {rules.length} total rules available
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
            <Target className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive font-cyber">1,247</div>
            <p className="text-xs text-muted-foreground">
              +23 in last 24h
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">False Positives</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning font-cyber">12</div>
            <p className="text-xs text-muted-foreground">
              0.96% false positive rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <BarChart3 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success font-cyber">94.2%</div>
            <p className="text-xs text-muted-foreground">
              Optimal performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted/30">
          <TabsTrigger value="rules" className="font-cyber">Available Rules</TabsTrigger>
          <TabsTrigger value="deploy" className="font-cyber">Deploy Rules</TabsTrigger>
          <TabsTrigger value="simulation" className="font-cyber">Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-primary font-cyber">Available Mitigation Rules</CardTitle>
              <CardDescription>Ready-to-deploy security countermeasures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="p-6 border rounded-lg border-border/50 bg-muted/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{rule.name}</h3>
                          <Badge variant="outline" className="font-mono">{rule.id}</Badge>
                        </div>
                        <p className="text-muted-foreground">{rule.description}</p>
                        <div className="flex items-center gap-4">
                          <Badge variant={getSeverityColor(rule.severity) as any}>
                            {rule.severity}
                          </Badge>
                          <Badge variant={getImpactColor(rule.impact) as any}>
                            {rule.impact} Impact
                          </Badge>
                          <Badge variant="outline">
                            {rule.category}
                          </Badge>
                          <Badge variant="outline">
                            vs {rule.target}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(rule.status) as any} className="flex items-center gap-1">
                          {getStatusIcon(rule.status)}
                          {rule.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        onClick={() => handleSimulateRule(rule.id)}
                        disabled={simulating === rule.id}
                      >
                        {simulating === rule.id ? (
                          <Play className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Eye className="w-4 h-4 mr-2" />
                        )}
                        {simulating === rule.id ? "Simulating..." : "Simulate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeployRule(rule.id)}
                        disabled={deploying === rule.id || rule.status === 'deployed'}
                      >
                        {deploying === rule.id ? (
                          <Zap className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Shield className="w-4 h-4 mr-2" />
                        )}
                        {deploying === rule.id ? "Deploying..." : "Deploy Rule"}
                      </Button>
                    </div>

                    {simulationResults[rule.id] && (
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold mb-2">Simulation Results</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-2xl font-bold text-destructive">
                              {simulationResults[rule.id].blocked.toLocaleString()}
                            </div>
                            <div className="text-muted-foreground">Blocked</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-success">
                              {simulationResults[rule.id].allowed.toLocaleString()}
                            </div>
                            <div className="text-muted-foreground">Allowed</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-warning">
                              {simulationResults[rule.id].falsePositives}
                            </div>
                            <div className="text-muted-foreground">False Positives</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">
                              {simulationResults[rule.id].accuracy.toFixed(1)}%
                            </div>
                            <div className="text-muted-foreground">Accuracy</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-primary font-cyber">Rule Configuration</CardTitle>
              <CardDescription>Ready to deploy configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.filter(r => r.status === 'draft').map((rule) => (
                  <div key={rule.id} className="p-4 border rounded-lg border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{rule.name}</h3>
                      <Button
                        size="sm"
                        onClick={() => handleDeployRule(rule.id)}
                        disabled={deploying === rule.id}
                      >
                        {deploying === rule.id ? (
                          <Zap className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Shield className="w-4 h-4 mr-2" />
                        )}
                        {deploying === rule.id ? "Deploying..." : "Deploy Rule"}
                      </Button>
                    </div>
                    <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto">
                      <code>{rule.configuration}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-primary font-cyber">Simulation Results</CardTitle>
              <CardDescription>Performance analysis of deployed rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(simulationResults).map(([ruleId, result]) => {
                  const rule = rules.find(r => r.id === ruleId);
                  return (
                    <div key={ruleId} className="p-4 border rounded-lg border-border/50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{rule?.name}</h3>
                        <Badge variant="outline">{ruleId}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-destructive">
                            {result.blocked.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Threats Blocked</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-success">
                            {result.allowed.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Legitimate Traffic</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-warning">
                            {result.falsePositives}
                          </div>
                          <div className="text-sm text-muted-foreground">False Positives</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Accuracy</span>
                          <span>{result.accuracy.toFixed(1)}%</span>
                        </div>
                        <Progress value={result.accuracy} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Performance Impact</span>
                          <span>{result.performance.toFixed(1)}%</span>
                        </div>
                        <Progress value={result.performance} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}