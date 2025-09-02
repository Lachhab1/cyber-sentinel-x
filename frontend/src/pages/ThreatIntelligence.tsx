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
  XCircle,
  Brain
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

interface ThreatAnalysis {
  totalThreats: number;
  severityBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  threatTrends: {
    last24h: number;
    last7d: number;
    trend: string;
    percentageChange: number;
  };
  geographicThreats: GeographicThreat[];
  iocAnalysis: {
    total: number;
    byType: Record<string, number>;
    recent: any[];
  };
  aiRecommendations: string[];
  threatScore: number;
  lastUpdated: string;
}

export default function ThreatIntelligence() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [threats, setThreats] = useState<any[]>([]);
  const [threatAnalysis, setThreatAnalysis] = useState<ThreatAnalysis | null>(null);
  const [threatFeeds, setThreatFeeds] = useState<ThreatFeed[]>([]);

  useEffect(() => {
    loadThreatIntelligence();
  }, []);

  const loadThreatIntelligence = async () => {
    try {
      setLoading(true);
      
      // Load threats
      const threatsResponse = await api.getThreats();
      setThreats(threatsResponse.data || []);
      
      // Load threat analysis
      const analysisResponse = await api.getThreatAnalysis();
      setThreatAnalysis(analysisResponse.data?.analysis || null);
      
      // Load threat feeds
      const feedsResponse = await api.getThreatFeeds();
      setThreatFeeds(feedsResponse.data || []);
      
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

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadThreatIntelligence();
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

  const getThreatScoreColor = (score: number) => {
    if (score >= 70) return "destructive";
    if (score >= 40) return "warning";
    return "success";
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
          <p className="text-muted-foreground font-cyber">Real-time threat landscape and AI-powered analysis</p>
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
            <div className="text-2xl font-bold text-primary font-cyber">
              {threatAnalysis?.iocAnalysis?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{threatAnalysis?.threatTrends?.last24h || 0} in last 24h
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Target className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary font-cyber">
              {threats.filter(t => t.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {threatAnalysis?.threatTrends?.trend === 'increasing' ? 'Trending up' : 'Stable'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Score</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-cyber text-${getThreatScoreColor(threatAnalysis?.threatScore || 0)}`}>
              {threatAnalysis?.threatScore || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {threatAnalysis?.threatScore >= 70 ? 'High Risk' : 
               threatAnalysis?.threatScore >= 40 ? 'Medium Risk' : 'Low Risk'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary font-cyber">
              {threatAnalysis?.aiRecommendations?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              AI-generated recommendations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Threat Score and Trends */}
      {threatAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Threat Risk Score
              </CardTitle>
              <CardDescription>
                AI-calculated risk assessment based on current threats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Risk Level</span>
                  <Badge variant={getThreatScoreColor(threatAnalysis.threatScore) === 'destructive' ? 'destructive' : 
                                 getThreatScoreColor(threatAnalysis.threatScore) === 'warning' ? 'secondary' : 'default'}>
                    {threatAnalysis.threatScore >= 70 ? 'HIGH' : 
                     threatAnalysis.threatScore >= 40 ? 'MEDIUM' : 'LOW'}
                  </Badge>
                </div>
                <Progress value={threatAnalysis.threatScore} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Score: {threatAnalysis.threatScore}/100
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">24h Change</div>
                  <div className="font-semibold">{threatAnalysis.threatTrends.last24h} threats</div>
                </div>
                <div>
                  <div className="text-muted-foreground">7d Change</div>
                  <div className="font-semibold">{threatAnalysis.threatTrends.last7d} threats</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Severity Breakdown
              </CardTitle>
              <CardDescription>
                Distribution of threats by severity level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Critical</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-destructive/20 rounded-full h-2">
                      <div 
                        className="bg-destructive h-2 rounded-full" 
                        style={{ width: `${(threatAnalysis.severityBreakdown.critical / threatAnalysis.totalThreats) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{threatAnalysis.severityBreakdown.critical}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">High</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-orange-500/20 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${(threatAnalysis.severityBreakdown.high / threatAnalysis.totalThreats) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{threatAnalysis.severityBreakdown.high}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medium</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-yellow-500/20 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(threatAnalysis.severityBreakdown.medium / threatAnalysis.totalThreats) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{threatAnalysis.severityBreakdown.medium}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Low</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-green-500/20 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(threatAnalysis.severityBreakdown.low / threatAnalysis.totalThreats) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{threatAnalysis.severityBreakdown.low}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Recommendations */}
      {threatAnalysis?.aiRecommendations && threatAnalysis.aiRecommendations.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI-Powered Recommendations
            </CardTitle>
            <CardDescription>
              Intelligent security recommendations based on threat analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {threatAnalysis.aiRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Threat Intelligence Feeds */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Threat Intelligence Feeds
          </CardTitle>
          <CardDescription>
            Real-time threat feeds and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {threatFeeds.map((feed) => (
              <div key={feed.id} className="p-4 rounded-lg border border-border/50 bg-background/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-sm">{feed.name}</h4>
                    <p className="text-xs text-muted-foreground">{feed.source}</p>
                  </div>
                  <Badge variant={getStatusColor(feed.status) as any} className="text-xs">
                    {getStatusIcon(feed.status)}
                    {feed.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Threats:</span>
                    <span className="font-medium">{feed.totalThreats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New (24h):</span>
                    <span className="font-medium text-primary">{feed.newThreats24h}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Update:</span>
                    <span className="text-muted-foreground">{feed.lastUpdate}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border/30">
                  <Badge variant="outline" className="text-xs">
                    {feed.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Threats */}
      {threats.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Threats
            </CardTitle>
            <CardDescription>
              Latest threats detected in your environment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {threats.slice(0, 5).map((threat) => (
                <div key={threat.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      threat.severity === 'critical' ? 'bg-destructive' :
                      threat.severity === 'high' ? 'bg-orange-500' :
                      threat.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <div className="font-medium text-sm">{threat.title || threat.name}</div>
                      <div className="text-xs text-muted-foreground">{threat.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {threat.severity}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {threat.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}