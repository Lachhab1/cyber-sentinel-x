import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Zap,
  Shield,
  Copy,
  Download,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Code,
  Terminal,
  Settings,
  Target,
  Activity
} from "lucide-react";

export default function MitigationCenter() {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  
  const mitigationRules = [
    {
      id: "MIT-001",
      title: "Block SQL Injection Attempts",
      description: "Blocks common SQL injection patterns and payloads",
      threat: "SQL Injection",
      confidence: "High",
      impact: "Low",
      category: "Web Application Firewall",
      rule: `# Nginx WAF Rule - SQL Injection Protection
location / {
    if ($args ~* "(union|select|insert|delete|update|drop|create|alter)" ) {
        return 403;
    }
    if ($request_body ~* "(union|select|insert|delete|update|drop|create|alter)") {
        return 403;
    }
}`,
      simulation: {
        blocked: 127,
        allowed: 45892,
        falsePositives: 2
      }
    },
    {
      id: "MIT-002", 
      title: "Rate Limit Brute Force Attacks",
      description: "Implements aggressive rate limiting for authentication endpoints",
      threat: "Brute Force",
      confidence: "High",
      impact: "Medium",
      category: "Rate Limiting",
      rule: `# Fail2ban Configuration
[ssh-aggressive]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
findtime = 300
bantime = 3600
action = iptables-multiport[name=SSH, port="ssh", protocol=tcp]`,
      simulation: {
        blocked: 89,
        allowed: 12456,
        falsePositives: 0
      }
    },
    {
      id: "MIT-003",
      title: "Block Malicious IP Ranges",
      description: "Blocks known malicious IP addresses and ranges",
      threat: "Multiple",
      confidence: "Medium",
      impact: "High",
      category: "Network Firewall",
      rule: `# iptables Rules - Block Malicious IPs
iptables -A INPUT -s 185.220.101.42 -j DROP
iptables -A INPUT -s 192.168.1.45 -j DROP
iptables -A INPUT -s 10.0.0.0/8 -j DROP
iptables -A INPUT -m geoip --src-cc CN,RU,KP -j DROP`,
      simulation: {
        blocked: 1247,
        allowed: 89234,
        falsePositives: 12
      }
    }
  ];

  const automatedActions = [
    {
      name: "Auto-quarantine infected hosts",
      status: "enabled",
      description: "Automatically isolates systems showing signs of compromise",
      lastTriggered: "2 hours ago",
      actions: 12
    },
    {
      name: "Dynamic IP blocking",
      status: "enabled", 
      description: "Real-time blocking of IPs from threat intelligence feeds",
      lastTriggered: "15 minutes ago",
      actions: 234
    },
    {
      name: "Credential reset on compromise",
      status: "disabled",
      description: "Forces password reset when account compromise is detected",
      lastTriggered: "Never",
      actions: 0
    },
    {
      name: "Alert escalation",
      status: "enabled",
      description: "Escalates critical alerts to security team",
      lastTriggered: "5 minutes ago",
      actions: 45
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "destructive";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "muted";
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "High": return "success";
      case "Medium": return "warning";
      case "Low": return "destructive";
      default: return "muted";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary font-cyber">Mitigation Center</h1>
          <p className="text-muted-foreground font-cyber">Automated defense and response capabilities</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button size="sm">
            <Target className="w-4 h-4 mr-2" />
            Deploy Rules
          </Button>
        </div>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">Mitigation Rules</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Rules List */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary font-cyber">
                  <Shield className="w-5 h-5" />
                  Available Mitigation Rules
                </CardTitle>
                <CardDescription>Ready-to-deploy security countermeasures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mitigationRules.map((rule) => (
                    <div 
                      key={rule.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedRule === rule.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border/50 bg-muted/20 hover:bg-muted/30'
                      }`}
                      onClick={() => setSelectedRule(rule.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-sm">{rule.title}</h3>
                          <p className="text-xs text-muted-foreground">{rule.id}</p>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant={getConfidenceColor(rule.confidence) as any} className="text-xs">
                            {rule.confidence}
                          </Badge>
                          <Badge variant={getImpactColor(rule.impact) as any} className="text-xs">
                            {rule.impact} Impact
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {rule.category}
                        </Badge>
                        <span className="text-xs text-warning font-cyber">vs {rule.threat}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rule Details */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary font-cyber">
                  <Code className="w-5 h-5" />
                  Rule Configuration
                </CardTitle>
                <CardDescription>
                  {selectedRule ? "Ready to deploy configuration" : "Select a rule to view configuration"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRule ? (
                  <div className="space-y-4">
                    {(() => {
                      const rule = mitigationRules.find(r => r.id === selectedRule);
                      if (!rule) return null;
                      
                      return (
                        <>
                          {/* Rule Code */}
                          <div className="relative">
                            <Textarea
                              value={rule.rule}
                              readOnly
                              className="font-mono text-sm bg-background/50 min-h-[200px]"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(rule.rule)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Simulation Results */}
                          <div className="bg-muted/20 rounded-lg p-4">
                            <h4 className="font-semibold text-sm mb-3 text-primary">Simulation Results</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="text-center">
                                <div className="text-destructive font-cyber text-lg">{rule.simulation.blocked}</div>
                                <div className="text-muted-foreground">Blocked</div>
                              </div>
                              <div className="text-center">
                                <div className="text-success font-cyber text-lg">{rule.simulation.allowed.toLocaleString()}</div>
                                <div className="text-muted-foreground">Allowed</div>
                              </div>
                              <div className="text-center">
                                <div className="text-warning font-cyber text-lg">{rule.simulation.falsePositives}</div>
                                <div className="text-muted-foreground">False Positives</div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button className="flex-1">
                              <Play className="w-4 h-4 mr-2" />
                              Deploy Rule
                            </Button>
                            <Button variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a mitigation rule to view its configuration and deployment options.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary font-cyber">
                <Zap className="w-5 h-5" />
                Automated Response Actions
              </CardTitle>
              <CardDescription>Configure automatic security responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automatedActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-sm">{action.name}</h3>
                        <Badge variant={action.status === 'enabled' ? 'default' : 'secondary'} className="text-xs">
                          {action.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Last triggered: {action.lastTriggered}</span>
                        <span>Total actions: {action.actions}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        {action.status === 'enabled' ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Disable
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Enable
                          </>
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary font-cyber">
                <Activity className="w-5 h-5" />
                Mitigation Impact Simulation
              </CardTitle>
              <CardDescription>Test and validate mitigation effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-12">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Simulation Engine</h3>
                <p className="mb-4">Run simulations to test the impact of your mitigation rules</p>
                <Button>
                  <Play className="w-4 h-4 mr-2" />
                  Start Simulation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}