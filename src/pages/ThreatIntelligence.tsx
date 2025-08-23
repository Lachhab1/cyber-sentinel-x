import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  MapPin,
  Activity,
  AlertTriangle,
  Shield,
  TrendingUp,
  Database,
  ExternalLink,
  Eye,
  Clock,
  Users
} from "lucide-react";

export default function ThreatIntelligence() {
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
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Database className="w-4 h-4 mr-2" />
            Export IoCs
          </Button>
          <Button size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Live Feed
          </Button>
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
            <div className="space-y-4">
              {recentIoCs.map((ioc, index) => (
                <div key={index} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{ioc.type}</Badge>
                        <Badge variant={getConfidenceColor(ioc.confidence) as any} className="text-xs">
                          {ioc.confidence}
                        </Badge>
                      </div>
                      <code className="font-cyber text-sm bg-background/50 px-2 py-1 rounded">
                        {ioc.indicator}
                      </code>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm font-medium text-warning mb-2">{ioc.threat}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      First seen: {ioc.firstSeen}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {ioc.country}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {ioc.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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