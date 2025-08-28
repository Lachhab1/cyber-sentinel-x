import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  Activity,
  AlertTriangle,
  Shield,
  TrendingUp,
  Globe,
  Zap,
  Eye,
  Clock,
  Users,
  Target,
  Scan,
  PlayCircle
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const [scanRunning, setScanRunning] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const stats = await api.dashboard.getStats();
        setDashboardData(stats);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const handleSecurityScan = async () => {
    setScanRunning(true);
    try {
      toast({
        title: "Security Scan Initiated",
        description: "Running comprehensive security assessment...",
      });
      
      // Simulate scan process
      setTimeout(() => {
        setScanRunning(false);
        toast({
          title: "Security Scan Complete",
          description: "Found 3 low-risk vulnerabilities. Check Reports for details.",
        });
      }, 3000);
    } catch (error) {
      setScanRunning(false);
      toast({
        title: "Scan Failed",
        description: "Unable to complete security scan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleThreatHunt = () => {
    toast({
      title: "Threat Hunt Started",
      description: "Analyzing network traffic for suspicious patterns...",
    });
  };

  const handleUserActivity = () => {
    window.location.href = "/settings";
  };

  // Calculate stats from backend data
  const stats = dashboardData ? [
    { 
      title: "Active Threats", 
      value: dashboardData.totalThreats.toString(), 
      change: "+12%", 
      icon: AlertTriangle,
      status: "critical",
      trend: "up"
    },
    { 
      title: "Security Incidents", 
      value: dashboardData.totalIncidents.toString(), 
      change: "+5%", 
      icon: Shield,
      status: "warning",
      trend: "up"
    },
    { 
      title: "Active Projects", 
      value: dashboardData.totalProjects.toString(), 
      change: "+2%", 
      icon: TrendingUp,
      status: "success",
      trend: "up"
    },
    { 
      title: "Systems Protected", 
      value: "1,247", 
      change: "+8%", 
      icon: Activity,
      status: "info",
      trend: "up"
    }
  ] : [];

  const recentIncidents = dashboardData?.recentIncidents?.map((incident: any) => ({
    id: incident.id,
    title: incident.title,
    severity: incident.status === 'open' ? 'High' : incident.status === 'investigating' ? 'Medium' : 'Low',
    time: new Date(incident.createdAt).toLocaleString(),
    source: incident.project?.name || 'Unknown',
    status: incident.status
  })) || [];

  const recentThreats = dashboardData?.recentThreats?.map((threat: any) => ({
    id: threat.id,
    title: threat.title,
    severity: threat.severity,
    time: new Date(threat.createdAt).toLocaleString(),
    description: threat.description
  })) || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
      case "high":
      case "critical": 
        return "destructive";
      case "Medium":
      case "medium": 
        return "warning";
      case "Low":
      case "low": 
        return "muted";
      default: 
        return "muted";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-primary font-cyber">
          <Scan className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading Security Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary font-cyber">Security Dashboard</h1>
          <p className="text-muted-foreground font-cyber">Real-time threat monitoring and system overview</p>
        </div>
        <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full pulse-status" />
            <span>Live</span>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Watch
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 text-${stat.status === 'critical' ? 'destructive' : stat.status === 'success' ? 'success' : 'accent'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary font-cyber">{stat.value}</div>
              <p className={`text-xs text-${stat.status === 'critical' ? 'destructive' : 'success'}`}>
                {stat.change} from last hour
              </p>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-cyber opacity-50" />
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Incidents */}
        <Card className="xl:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary font-cyber">
              <AlertTriangle className="w-5 h-5" />
              Recent Security Incidents
            </CardTitle>
            <CardDescription>Latest threats and anomalies detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIncidents.length > 0 ? (
                recentIncidents.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Badge variant={getSeverityColor(incident.severity) as any} className="font-cyber">
                          {incident.severity}
                        </Badge>
                        <span className="font-cyber text-sm text-muted-foreground">{incident.id}</span>
                      </div>
                      <p className="font-medium text-card-foreground">{incident.title}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {incident.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {incident.source}
                        </span>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(incident.status) as any} className="font-cyber">
                      {incident.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent incidents</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & System Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-primary font-cyber">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={handleSecurityScan}
                disabled={scanRunning}
              >
                {scanRunning ? (
                  <Scan className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                {scanRunning ? "Scanning..." : "Run Security Scan"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={handleThreatHunt}
              >
                <Target className="w-4 h-4 mr-2" />
                Threat Hunt
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={handleUserActivity}
              >
                <Users className="w-4 h-4 mr-2" />
                User Activity
              </Button>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-primary font-cyber">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Detection Engine</span>
                <Badge variant="default" className="bg-success text-success-foreground">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Threat Intel Feeds</span>
                <Badge variant="default" className="bg-success text-success-foreground">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">AI Analysis</span>
                <Badge variant="default" className="bg-success text-success-foreground">Running</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Log Ingestion</span>
                <Badge variant="outline" className="text-warning border-warning">Degraded</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}