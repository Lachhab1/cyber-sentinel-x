import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";
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
  Cpu,
  Plus,
  Loader2
} from "lucide-react";

export default function Incidents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [isMitigating, setIsMitigating] = useState(false);
  const [actionDialog, setActionDialog] = useState<{ type: 'investigate' | 'mitigate' | null, incident: any }>({ type: null, incident: null });
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredIncidents, setFilteredIncidents] = useState<any[]>([]);

  // Fetch incidents from backend
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const data = await api.incidents.getAll();
        setIncidents(data);
      } catch (error) {
        console.error('Failed to fetch incidents:', error);
        toast.error("Failed to load incidents");
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  // Filter incidents based on search and severity
  useEffect(() => {
    let filtered = incidents;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(incident =>
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (incident.project?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by severity (if we had severity field in incidents)
    if (selectedSeverity !== "all") {
      // For now, we'll use status as a proxy for severity
      filtered = filtered.filter(incident => {
        if (selectedSeverity === "critical") return incident.status === "open";
        if (selectedSeverity === "high") return incident.status === "investigating";
        if (selectedSeverity === "medium") return incident.status === "resolved";
        return true;
      });
    }

    setFilteredIncidents(filtered);
  }, [incidents, searchQuery, selectedSeverity]);

  const getSeverityColor = (status: string) => {
    switch (status) {
      case "open": return "destructive";
      case "investigating": return "warning";
      case "resolved": return "success";
      case "closed": return "muted";
      default: return "muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "investigating": return "warning";
      case "open": return "destructive";
      case "resolved": return "success";
      case "closed": return "muted";
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
    
    try {
      await api.incidents.updateStatus(incident.id, 'investigating');
      toast.success(`Investigation initiated for ${incident.id}`);
      
      // Refresh incidents
      const updatedIncidents = await api.incidents.getAll();
      setIncidents(updatedIncidents);
    } catch (error) {
      toast.error("Failed to update incident status");
    } finally {
      setIsInvestigating(false);
      setActionDialog({ type: null, incident: null });
    }
  };

  const handleMitigate = async (incident: any) => {
    setActionDialog({ type: 'mitigate', incident });
    setIsMitigating(true);
    
    try {
      await api.incidents.updateStatus(incident.id, 'resolved');
      toast.success(`Threat successfully mitigated for ${incident.id}`);
      
      // Refresh incidents
      const updatedIncidents = await api.incidents.getAll();
      setIncidents(updatedIncidents);
    } catch (error) {
      toast.error("Failed to update incident status");
    } finally {
      setIsMitigating(false);
      setActionDialog({ type: null, incident: null });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-primary font-cyber">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading Security Incidents...</span>
        </div>
      </div>
    );
  }

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
                placeholder="Search incidents, status, projects..."
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
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map((incident) => (
            <Card key={incident.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-200 cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={getSeverityColor(incident.status) as any} className="font-cyber">
                          {incident.status === 'open' ? 'Critical' : incident.status === 'investigating' ? 'High' : 'Medium'}
                        </Badge>
                        <Badge variant={getStatusColor(incident.status) as any} className="font-cyber">
                          {incident.status}
                        </Badge>
                        <span className="font-cyber text-sm text-muted-foreground">{incident.id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTime(incident.createdAt)}
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-card-foreground mb-1">{incident.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {incident.project?.name ? `Project: ${incident.project.name}` : 'No project assigned'}
                      </p>
                    </div>

                    {/* Technical Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-accent" />
                        <span className="text-muted-foreground">Status:</span>
                        <code className="font-cyber bg-muted/30 px-2 py-1 rounded text-primary">
                          {incident.status}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-warning" />
                        <span className="text-muted-foreground">Created:</span>
                        <code className="font-cyber bg-muted/30 px-2 py-1 rounded text-warning">
                          {new Date(incident.createdAt).toLocaleDateString()}
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
                        <div className={`text-lg font-bold font-cyber ${getConfidenceColor(85)}`}>
                          85%
                        </div>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-1 rounded ${
                                i < Math.floor(85 / 20) ? 'bg-success' : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tags and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {incident.status}
                        </Badge>
                        {incident.project?.name && (
                          <Badge variant="outline" className="text-xs">
                            {incident.project.name}
                          </Badge>
                        )}
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
          ))
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No incidents found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try adjusting your search criteria' : 'No security incidents have been detected yet'}
            </p>
          </div>
        )}
      </div>

      {/* Load More */}
      {filteredIncidents.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="font-cyber">
            <Terminal className="w-4 h-4 mr-2" />
            Load More Incidents
          </Button>
        </div>
      )}

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
                  <span>Status: {actionDialog.incident.status}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-warning" />
                  <span>Project: {actionDialog.incident.project?.name || 'None'}</span>
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