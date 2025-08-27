import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertTriangle,
  Search,
  Filter,
  Clock,
  Globe,
  Shield,
  Eye,
  Brain,
  Target,
  Zap,
  FileText,
  ChevronRight,
  Activity,
  Terminal,
  Cpu
} from "lucide-react";

export default function Incidents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [isMitigating, setIsMitigating] = useState(false);
  const [actionDialog, setActionDialog] = useState<{ type: 'investigate' | 'mitigate' | null, incident: any }>({ type: null, incident: null });

  const incidents = [
    {
      id: "INC-2024-001",
      title: "SQL Injection Attempt Detected",
      description: "Multiple SQL injection payloads detected from suspicious IP address",
      severity: "Critical",
      status: "investigating",
      time: "2 minutes ago",
      source: "192.168.1.45",
      technique: "T1190 - Exploit Public-Facing Application",
      aiConfidence: 95,
      affectedSystems: ["web-server-01", "database-primary"],
      tags: ["web", "database", "injection"]
    },
    {
      id: "INC-2024-002",
      title: "Suspicious Login Activity from Russia",
      description: "Multiple failed login attempts followed by successful login from geographically distant location",
      severity: "High",
      status: "mitigated",
      time: "15 minutes ago",
      source: "185.220.101.42",
      technique: "T1110 - Brute Force",
      aiConfidence: 87,
      affectedSystems: ["auth-server"],
      tags: ["authentication", "geolocation"]
    },
    {
      id: "INC-2024-003",
      title: "Port Scan Activity Detected",
      description: "Systematic port scanning activity detected from internal network",
      severity: "Medium",
      status: "investigating",
      time: "1 hour ago",
      source: "10.0.0.100",
      technique: "T1046 - Network Service Scanning",
      aiConfidence: 78,
      affectedSystems: ["network-scanner"],
      tags: ["reconnaissance", "network"]
    },
    {
      id: "INC-2024-004",
      title: "Malware Command & Control Communication",
      description: "Suspicious outbound connections to known C&C domains detected",
      severity: "Critical",
      status: "contained",
      time: "3 hours ago",
      source: "workstation-045",
      technique: "T1071 - Application Layer Protocol",
      aiConfidence: 92,
      affectedSystems: ["workstation-045"],
      tags: ["malware", "c2", "communication"]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive";
      case "High": return "warning";
      case "Medium": return "accent";
      case "Low": return "muted";
      default: return "muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "investigating": return "warning";
      case "mitigated": return "accent";
      case "contained": return "success";
      case "resolved": return "success";
      default: return "muted";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-success";
    if (confidence >= 70) return "text-warning";
    return "text-muted-foreground";
  };

  const handleInvestigate = async (incident: any) => {
    setActionDialog({ type: 'investigate', incident });
    setIsInvestigating(true);
    
    // Simulate investigation process
    toast.success(`Initiating investigation for ${incident.id}`);
    
    setTimeout(() => {
      toast.success("Investigation completed successfully");
      setIsInvestigating(false);
      setActionDialog({ type: null, incident: null });
    }, 3000);
  };

  const handleMitigate = async (incident: any) => {
    setActionDialog({ type: 'mitigate', incident });
    setIsMitigating(true);
    
    // Simulate mitigation process
    toast.success(`Deploying countermeasures for ${incident.id}`);
    
    setTimeout(() => {
      toast.success("Threat successfully mitigated");
      setIsMitigating(false);
      setActionDialog({ type: null, incident: null });
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary font-cyber glitch">Security Incidents</h1>
          <p className="text-muted-foreground font-cyber">AI-powered threat detection and real-time response</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="font-cyber">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Button size="sm" className="font-cyber glow-primary">
            <Target className="w-4 h-4 mr-2" />
            Threat Hunt
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents, IPs, techniques..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <Tabs value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
                <TabsTrigger value="high">High</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <div className="space-y-4">
        {incidents.map((incident) => (
          <Card key={incident.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-200 cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={getSeverityColor(incident.severity) as any} className="font-cyber">
                        {incident.severity}
                      </Badge>
                      <Badge variant={getStatusColor(incident.status) as any} className="font-cyber">
                        {incident.status}
                      </Badge>
                      <span className="font-cyber text-sm text-muted-foreground">{incident.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {incident.time}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-1">{incident.title}</h3>
                    <p className="text-sm text-muted-foreground">{incident.description}</p>
                  </div>

                  {/* Technical Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-accent" />
                      <span className="text-muted-foreground">Source:</span>
                      <code className="font-cyber bg-muted/30 px-2 py-1 rounded text-primary">
                        {incident.source}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-warning" />
                      <span className="text-muted-foreground">MITRE:</span>
                      <code className="font-cyber bg-muted/30 px-2 py-1 rounded text-warning">
                        {incident.technique}
                      </code>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="flex items-center justify-between bg-muted/20 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm font-medium">AI Analysis Confidence</p>
                        <p className="text-xs text-muted-foreground">Machine learning assessment</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold font-cyber ${getConfidenceColor(incident.aiConfidence)}`}>
                        {incident.aiConfidence}%
                      </div>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-1 rounded ${
                              i < Math.floor(incident.aiConfidence / 20) ? 'bg-success' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tags and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {incident.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                     <div className="flex gap-2">
                       <Button 
                         variant="outline" 
                         size="sm" 
                         onClick={() => handleInvestigate(incident)}
                         disabled={isInvestigating || isMitigating}
                         className="font-cyber hover:bg-accent/20"
                       >
                         <Eye className="w-4 h-4 mr-2" />
                         Investigate
                       </Button>
                       <Button 
                         variant="outline" 
                         size="sm" 
                         onClick={() => handleMitigate(incident)}
                         disabled={isInvestigating || isMitigating}
                         className="font-cyber hover:bg-destructive/20 hover:text-destructive"
                       >
                         <Zap className="w-4 h-4 mr-2" />
                         Mitigate
                       </Button>
                       <Button variant="ghost" size="sm" className="font-cyber">
                         <ChevronRight className="w-4 h-4" />
                       </Button>
                     </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" className="font-cyber">
          <Terminal className="w-4 h-4 mr-2" />
          Load More Incidents
        </Button>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialog.type !== null} onOpenChange={() => setActionDialog({ type: null, incident: null })}>
        <DialogContent className="bg-card/90 backdrop-blur-lg border-border/50 font-cyber">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2">
              {actionDialog.type === 'investigate' ? (
                <>
                  <Eye className="w-5 h-5" />
                  Investigating Incident
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Mitigating Threat
                </>
              )}
            </DialogTitle>
            <DialogDescription className="font-cyber">
              {actionDialog.type === 'investigate' 
                ? "Performing deep forensic analysis and gathering threat intelligence..."
                : "Deploying automated countermeasures and blocking malicious activity..."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm">
                {actionDialog.type === 'investigate'
                  ? isInvestigating ? "Analysis in progress..." : "Investigation complete"
                  : isMitigating ? "Deploying countermeasures..." : "Mitigation complete"
                }
              </span>
            </div>
            
            {actionDialog.incident && (
              <div className="bg-muted/20 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="font-medium">Target: {actionDialog.incident.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-accent" />
                  <span>Severity: {actionDialog.incident.severity}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-warning" />
                  <span>Source: {actionDialog.incident.source}</span>
                </div>
              </div>
            )}
            
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>• Real-time threat analysis</span>
              <span>• MITRE ATT&CK mapping</span>
              <span>• Automated response protocols</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}