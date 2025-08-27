import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Settings
} from "lucide-react";

export default function Reports() {
  const reportTemplates = [
    {
      id: "security-summary",
      name: "Security Summary Report",
      description: "Executive overview of security posture and key metrics",
      category: "Executive",
      frequency: "Weekly",
      lastGenerated: "2 days ago",
      size: "2.4 MB"
    },
    {
      id: "incident-analysis",
      name: "Incident Analysis Report", 
      description: "Detailed analysis of security incidents and response actions",
      category: "Technical",
      frequency: "Daily",
      lastGenerated: "6 hours ago",
      size: "8.7 MB"
    },
    {
      id: "threat-intelligence",
      name: "Threat Intelligence Briefing",
      description: "Latest threat landscape and indicators of compromise",
      category: "Intelligence",
      frequency: "Daily",
      lastGenerated: "12 hours ago",
      size: "3.1 MB"
    },
    {
      id: "compliance-audit",
      name: "Compliance Audit Report",
      description: "Security compliance status and audit findings",
      category: "Compliance",
      frequency: "Monthly",
      lastGenerated: "5 days ago",
      size: "12.3 MB"
    }
  ];

  const recentReports = [
    {
      name: "Weekly Security Summary - Week 47",
      type: "PDF",
      generated: "2024-11-20 14:30",
      size: "2.4 MB",
      status: "completed"
    },
    {
      name: "Incident Response Report - Nov 2024",
      type: "PDF",
      generated: "2024-11-19 09:15",
      size: "8.7 MB", 
      status: "completed"
    },
    {
      name: "Threat Intelligence Brief - Daily",
      type: "Markdown",
      generated: "2024-11-20 06:00",
      size: "1.2 MB",
      status: "completed"
    },
    {
      name: "Compliance Audit - Q4 2024",
      type: "PDF",
      generated: "2024-11-18 16:45",
      size: "12.3 MB",
      status: "processing"
    }
  ];

  const metrics = [
    { label: "Reports Generated", value: "247", change: "+15%", period: "This month" },
    { label: "Automated Reports", value: "189", change: "+23%", period: "This month" },
    { label: "Executive Briefings", value: "28", change: "+8%", period: "This month" },
    { label: "Compliance Reports", value: "12", change: "0%", period: "This month" }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Executive": return "primary";
      case "Technical": return "accent";
      case "Intelligence": return "warning";
      case "Compliance": return "success";
      default: return "muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "processing": return "warning";
      case "failed": return "destructive";
      default: return "muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary font-cyber">Security Reports</h1>
          <p className="text-muted-foreground font-cyber">Automated reporting and documentation</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button size="sm">
            <FileText className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                {metric.label}
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary font-cyber">{metric.value}</div>
              <p className="text-xs text-success">
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Report Templates */}
        <Card className="xl:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary font-cyber">
              <FileText className="w-5 h-5" />
              Report Templates
            </CardTitle>
            <CardDescription>Pre-configured security report templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTemplates.map((template) => (
                <div key={template.id} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{template.name}</h3>
                        <Badge variant={getCategoryColor(template.category) as any} className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {template.frequency}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {template.lastGenerated}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {template.size}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Report Generator */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-primary font-cyber">Custom Report</CardTitle>
              <CardDescription>Generate custom security reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input id="report-name" placeholder="Enter report name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incident">Incident Analysis</SelectItem>
                    <SelectItem value="threat">Threat Intelligence</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="summary">Executive Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-range">Date Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="html">HTML Report</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-primary font-cyber">Recent Reports</CardTitle>
              <CardDescription>Recently generated security reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{report.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{report.type}</span>
                        <span>{report.size}</span>
                        <Badge variant={getStatusColor(report.status) as any} className="text-xs">
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}