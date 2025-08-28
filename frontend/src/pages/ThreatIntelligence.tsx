import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  RefreshCw,
  Globe,
  AlertTriangle,
  TrendingUp,
  Activity,
  Shield,
  Eye,
  Target,
  Clock,
  MapPin,
  BarChart3,
  Zap,
  Database,
  Wifi,
  Server,
  Lock,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface ThreatFeed {
  id: string;
  name: string;
  source: string;
  status: 'active' | 'delayed' | 'offline';
  totalThreats: number;
  newThreats24h: number;
  lastUpdate: string;
  description: string;
  category: string;
}

interface ThreatIOC {
  id: string;
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email';
  value: string;
  threat: string;
  confidence: 'low' | 'medium' | 'high';
  firstSeen: string;
  lastSeen: string;
  tags: string[];
}

interface GeographicThreat {
  country: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export default function ThreatIntelligence() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [threats, setThreats] = useState<any[]>([]);
  const [threatAnalysis, setThreatAnalysis] = useState<any>(null);

  // Sample threat intelligence feeds
  const threatFeeds: ThreatFeed[] = [
    {
      id: "feed-001",
      name: "Malware Command & Control",
      source: "abuse.ch",
      status: "active",
      totalThreats: 1247,
      newThreats24h: 23,
      lastUpdate: "2 minutes ago",
      description: "Malware C&C server tracking and blacklisting",
      category: "Malware"
    },
    {
      id: "feed-002",
      name: "Botnet Tracking",
      source: "Spamhaus",
      status: "active",
      totalThreats: 892,
      newThreats24h: 12,
      lastUpdate: "5 minutes ago",
      description: "Botnet command and control infrastructure",
      category: "Botnet"
    },
    {
      id: "feed-003",
      name: "Phishing URLs",
      source: "PhishTank",
      status: "active",
      totalThreats: 2156,
      newThreats24h: 45,
      lastUpdate: "1 minute ago",
      description: "Phishing website detection and reporting",
      category: "Phishing"
    },
    {
      id: "feed-004",
      name: "Tor Exit Nodes",
      source: "TorProject",
      status: "delayed",
      totalThreats: 678,
      newThreats24h: 3,
      lastUpdate: "45 minutes ago",
      description: "Tor exit node IP addresses",
      category: "Anonymity"
    }
  ];

  // Sample geographic threat distribution
  const geographicThreats: GeographicThreat[] = [
    { country: "Russia", count: 342, percentage: 27.4, trend: "up" },
    { country: "China", count: 298, percentage: 23.9, trend: "up" },
    { country: "North Korea", count: 156, percentage: 12.5, trend: "stable" },
    { country: "Iran", count: 134, percentage: 10.7, trend: "down" },
    { country: "Other", count: 290, percentage: 23.2, trend: "up" }
  ];

  // Sample IoCs
  const sampleIOCs: ThreatIOC[] = [
    {
      id: "ioc-001",
      type: "ip",
      value: "185.220.101.42",
      threat: "APT29",
      confidence: "high",
      firstSeen: "2024-01-15T10:30:00Z",
      lastSeen: "2024-01-27T14:22:00Z",
      tags: ["apt", "russia", "cyber-espionage"]
    },
    {
      id: "ioc-002",
      type: "domain",
      value: "malware.example.com",
      threat: "Emotet",
      confidence: "medium",
      firstSeen: "2024-01-20T08:15:00Z",
      lastSeen: "2024-01-27T16:45:00Z",
      tags: ["malware", "banking-trojan"]
    },
    {
      id: "ioc-003",
      type: "url",
      value: "https://phish.example.com/login",
      threat: "Phishing Campaign",
      confidence: "high",
      firstSeen: "2024-01-25T12:00:00Z",
      lastSeen: "2024-01-27T18:30:00Z",
      tags: ["phishing", "credential-theft"]
    }
  ];

  useEffect(() => {
    const loadThreatIntelligence = async () => {
      try {
        setLoading(true);
        
        // Load threats from backend
        const threatsData = await api.threats.getAll();
        setThreats(threatsData);

        // Load threat analysis
        const analysisData = await api.threats.analyze();
        setThreatAnalysis(analysisData);

      } catch (error) {
        console.error('Failed to load threat intelligence:', error);
        toast({
          title: "Error",
          description: "Failed to load threat intelligence data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadThreatIntelligence();
  }, [toast]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reload data
      const threatsData = await api.threats.getAll();
      setThreats(threatsData);

      const analysisData = await api.threats.analyze();
      setThreatAnalysis(analysisData);

      toast({
        title: "Refreshed",
        description: "Threat intelligence data updated",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh threat intelligence data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "delayed": return "warning";
      case "offline": return "destructive";
      default: return "muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "delayed": return <Clock className="w-4 h-4" />;
      case "offline": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "muted";
      default: return "muted";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-destructive" />;
      case "down": return <TrendingUp className="w-4 h-4 text-success rotate-180" />;
      case "stable": return <Activity className="w-4 h-4 text-muted-foreground" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-primary font-cyber">
          <Globe className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading Threat Intelligence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary font-cyber">Threat Intelligence</h1>
          <p className="text-muted-foreground font-cyber">Global threat landscape and indicators of compromise</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total IoCs</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary font-cyber">12,847</div>
            <p className="text-xs text-muted-foreground">
              +156 in last 24h
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Target className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive font-cyber">23</div>
            <p className="text-xs text-muted-foreground">
              +3 new campaigns
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
            <Shield className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success font-cyber">3,456</div>
            <p className="text-xs text-muted-foreground">
              +89 in last 24h
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detection Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning font-cyber">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Threat Intelligence Feeds */}
        <Card className="xl:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary font-cyber">
              <Wifi className="w-5 h-5" />
              Threat Intelligence Feeds
            </CardTitle>
            <CardDescription>Real-time threat data from multiple sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {threatFeeds.map((feed) => (
                <div key={feed.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{feed.name}</h3>
                      <Badge variant="outline" className="text-xs">{feed.source}</Badge>
                      <Badge variant={getStatusColor(feed.status) as any} className="flex items-center gap-1">
                        {getStatusIcon(feed.status)}
                        {feed.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{feed.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Total Threats: {feed.totalThreats.toLocaleString()}</span>
                      <span>New (24h): +{feed.newThreats24h}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {feed.lastUpdate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary font-cyber">
              <MapPin className="w-5 h-5" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>Threats by country (last 24h)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geographicThreats.map((threat, index) => (
                <div key={threat.country} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{threat.country}</span>
                      {getTrendIcon(threat.trend)}
                    </div>
                    <span className="font-bold">{threat.count}</span>
                  </div>
                  <Progress value={threat.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Indicators of Compromise */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary font-cyber">
            <AlertTriangle className="w-5 h-5" />
            Recent Indicators of Compromise
          </CardTitle>
          <CardDescription>Newly discovered threat indicators</CardDescription>
        </CardHeader>
        <CardContent>
          {threats.length > 0 ? (
            <div className="space-y-4">
              {threats.slice(0, 5).map((threat) => (
                <div key={threat.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{threat.title}</h3>
                      <Badge variant={getConfidenceColor(threat.severity) as any}>
                        {threat.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{threat.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(threat.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No threat intelligence data available. Database connection established but no threats detected.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Intelligence Summary */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary font-cyber">
            <BarChart3 className="w-5 h-5" />
            Intelligence Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12,847</div>
              <div className="text-sm text-muted-foreground">Total IoCs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">23</div>
              <div className="text-sm text-muted-foreground">Active Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">3,456</div>
              <div className="text-sm text-muted-foreground">Blocked IPs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">94.2%</div>
              <div className="text-sm text-muted-foreground">Detection Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}