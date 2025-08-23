import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Target
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    { 
      title: "Active Threats", 
      value: "23", 
      change: "+12%", 
      icon: AlertTriangle,
      status: "critical",
      trend: "up"
    },
    { 
      title: "Systems Protected", 
      value: "1,247", 
      change: "+5%", 
      icon: Shield,
      status: "success",
      trend: "up"
    },
    { 
      title: "Security Score", 
      value: "94%", 
      change: "+2%", 
      icon: TrendingUp,
      status: "success",
      trend: "up"
    },
    { 
      title: "Live Connections", 
      value: "45,892", 
      change: "+8%", 
      icon: Activity,
      status: "info",
      trend: "up"
    }
  ];

  const recentIncidents = [
    {
      id: "INC-2024-001",
      title: "SQL Injection Attempt Detected",
      severity: "High",
      time: "2 minutes ago",
      source: "192.168.1.45",
      status: "investigating"
    },
    {
      id: "INC-2024-002", 
      title: "Unusual Login Pattern from Russia",
      severity: "Medium",
      time: "15 minutes ago",
      source: "185.220.101.42",
      status: "mitigated"
    },
    {
      id: "INC-2024-003",
      title: "Port Scan Activity Detected",
      severity: "Low",
      time: "1 hour ago", 
      source: "10.0.0.100",
      status: "resolved"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "destructive";
      case "Medium": return "warning";
      case "Low": return "muted";
      default: return "muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "investigating": return "warning";
      case "mitigated": return "accent";
      case "resolved": return "success";
      default: return "muted";
    }
  };

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
            <div className="w-2 h-2 bg-success rounded-full pulse-cyber" />
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
              {recentIncidents.map((incident) => (
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
              ))}
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
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Zap className="w-4 h-4 mr-2" />
                Run Security Scan
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Target className="w-4 h-4 mr-2" />
                Threat Hunt
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
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