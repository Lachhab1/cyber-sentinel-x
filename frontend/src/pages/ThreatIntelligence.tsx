import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Globe,
  AlertTriangle,
  Activity,
  TrendingUp,
  Eye,
  MapPin,
  Clock,
  Shield,
  RefreshCw,
  ExternalLinkIcon
} from "lucide-react";

export default function ThreatIntelligence() {
  const { toast } = useToast();
  const [threatData, setThreatData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchThreatData = async () => {
    try {
      const { data, error } = await supabase
        .from('threat_intelligence')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setThreatData(data || []);
    } catch (error) {
      console.error('Error fetching threat data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshThreatData = async () => {
    setRefreshing(true);
    await fetchThreatData();
    toast({
      title: "Threat Intelligence Updated",
      description: "Latest threat data has been synchronized.",
    });
  };

  useEffect(() => {
    fetchThreatData();
  }, []);
  const threatFeeds = [
    {
      name: "Malware Command & Control",
      source: "abuse.ch",
      status: "active",
      lastUpdate: "2 minutes ago",
      threats: 1247,
      newThreats: 23
    },
    {
      name: "Botnet Tracking",
      source: "Spamhaus",
      status: "active", 
      lastUpdate: "5 minutes ago",
      threats: 892,
      newThreats: 12
    },
    {
      name: "Phishing URLs",
      source: "PhishTank",
      status: "active",
      lastUpdate: "1 minute ago",
      threats: 2156,
      newThreats: 45
    },
    {
      name: "Tor Exit Nodes",
      source: "TorProject",
      status: "delayed",
      lastUpdate: "45 minutes ago",
      threats: 678,
      newThreats: 3
    }
  ];

  const recentIoCs = [
    {
      indicator: "185.220.101.42",
      type: "IP Address",
      threat: "Botnet C&C Server",
      confidence: "High",
      firstSeen: "2 hours ago",
      country: "Russia",
      asn: "AS12345 - Evil Corp",
      tags: ["malware", "c2", "botnet"]
    },
    {
      indicator: "malicious-domain.xyz",
      type: "Domain",
      threat: "Phishing Campaign",
      confidence: "Medium",
      firstSeen: "4 hours ago",
      country: "Unknown",
      asn: "Cloudflare",
      tags: ["phishing", "fraud"]
    },
    {
      indicator: "SHA256:a1b2c3d4...",
      type: "File Hash",
      threat: "Ransomware Payload",
      confidence: "Critical",
      firstSeen: "1 day ago",
      country: "N/A",
      asn: "N/A",
      tags: ["ransomware", "malware"]
    }
  ];

  const geographicThreats = [
    { country: "Russia", threats: 342, percentage: 28 },
    { country: "China", threats: 298, percentage: 24 },
    { country: "North Korea", threats: 156, percentage: 13 },
    { country: "Iran", threats: 134, percentage: 11 },
    { country: "Other", threats: 290, percentage: 24 }
  ];

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "Critical": return "destructive";
      case "High": return "warning";
      case "Medium": return "accent";
      case "Low": return "muted";
      default: return "muted";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary font-cyber">Threat Intelligence</h1>
          <p className="text-muted-foreground font-cyber">Global threat landscape and indicators of compromise</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshThreatData}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full pulse-status" />
            <span className="font-cyber">Live Feeds</span>
          </div>
        </div>
      </div>

      {/* Threat Feed Status */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary font-cyber">
            <Globe className="w-5 h-5" />
            Threat Intelligence Feeds
          </CardTitle>
          <CardDescription>Real-time threat data from multiple sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {threatFeeds.map((feed, index) => (
              <div key={index} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm">{feed.name}</h3>
                    <p className="text-xs text-muted-foreground">{feed.source}</p>
                  </div>
                  <Badge variant={getStatusColor(feed.status) as any} className="text-xs">
                    {feed.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Threats:</span>
                    <span className="font-cyber text-primary">{feed.threats.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">New (24h):</span>
                    <span className="font-cyber text-warning">+{feed.newThreats}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {feed.lastUpdate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent IoCs */}
        <Card className="xl:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary font-cyber">
              <AlertTriangle className="w-5 h-5" />
              Recent Indicators of Compromise
            </CardTitle>
            <CardDescription>Newly discovered threat indicators</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading threat data...</div>
            ) : (
              <div className="space-y-4">
                {threatData.length > 0 ? threatData.map((threat) => (
                  <div key={threat.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-cyber">
                          {threat.ip_address || threat.domain || 'Unknown'}
                        </Badge>
                        <span className="text-sm font-medium text-card-foreground">
                          {threat.threat_type || 'Threat'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {threat.geolocation?.country || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(threat.last_seen || threat.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant={threat.confidence_level > 80 ? 'destructive' : threat.confidence_level > 60 ? 'outline' : 'secondary'} 
                      className="font-cyber"
                    >
                      {threat.confidence_level || 0}% Confidence
                    </Badge>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No threat intelligence data available. Database connection established but no threats detected.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Geographic Threat Distribution */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary font-cyber">
                <MapPin className="w-5 h-5" />
                Geographic Distribution
              </CardTitle>
              <CardDescription>Threats by country (last 24h)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {geographicThreats.map((country, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{country.country}</span>
                      <span className="font-cyber text-primary">{country.threats}</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-warning to-destructive h-2 rounded-full"
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-primary font-cyber">Intelligence Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total IoCs</span>
                <span className="font-cyber text-primary text-lg">12,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Campaigns</span>
                <span className="font-cyber text-warning text-lg">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Blocked IPs</span>
                <span className="font-cyber text-success text-lg">3,456</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Detection Rate</span>
                <span className="font-cyber text-primary text-lg">94.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}