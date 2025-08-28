import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";
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
  Settings,
  Loader2,
  Plus
} from "lucide-react";

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: '',
    type: 'summary',
    projectId: ''
  });

  const reportTemplates = [
    {
      id: "security-summary",
      name: "Security Summary Report",
      description: "Executive overview of security posture and key metrics",
      category: "Executive",
      frequency: "Weekly",
      lastGenerated: "2 days ago",
      size: "2.4 MB",
      type: "summary"
    },
    {
      id: "incident-analysis",
      name: "Incident Analysis Report", 
      description: "Detailed analysis of security incidents and response actions",
      category: "Technical",
      frequency: "Daily",
      lastGenerated: "6 hours ago",
      size: "8.7 MB",
      type: "comprehensive"
    },
    {
      id: "threat-intelligence",
      name: "Threat Intelligence Briefing",
      description: "Latest threat landscape and indicators of compromise",
      category: "Intelligence",
      frequency: "Daily",
      lastGenerated: "12 hours ago",
      size: "3.1 MB",
      type: "detailed"
    },
    {
      id: "compliance-audit",
      name: "Compliance Audit Report",
      description: "Security compliance status and audit findings",
      category: "Compliance",
      frequency: "Monthly",
      lastGenerated: "5 days ago",
      size: "12.3 MB",
      type: "comprehensive"
    }
  ];

  const metrics = [
    { label: "Reports Generated", value: "247", change: "+15%", period: "This month" },
    { label: "Automated Reports", value: "189", change: "+23%", period: "This month" },
    { label: "Executive Briefings", value: "28", change: "+8%", period: "This month" },
    { label: "Compliance Reports", value: "12", change: "0%", period: "This month" }
  ];

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // Since we don't have a getReports endpoint, we'll simulate it
        // In a real implementation, you'd have a reports endpoint
        setReports([]);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleGenerateReport = async (template?: any) => {
    if (template) {
      setReportForm({
        title: template.name,
        type: template.type,
        projectId: ''
      });
    }
    setShowGenerateDialog(true);
  };

  const handleSubmitReport = async () => {
    if (!reportForm.title.trim()) {
      toast.error("Please enter a report title");
      return;
    }

    setGenerating(true);
    try {
      const result = await api.reports.generate(reportForm);
      toast.success(`Report "${result.title}" generated successfully`);
      setShowGenerateDialog(false);
      setReportForm({ title: '', type: 'summary', projectId: '' });
      
      // Refresh reports list
      // In a real implementation, you'd fetch the updated reports list
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      const report = await api.reports.download(reportId);
      // In a real implementation, you'd trigger a download
      toast.success("Report download started");
    } catch (error) {
      console.error('Failed to download report:', error);
      toast.error("Failed to download report");
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-primary font-cyber">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading Security Reports...</span>
        </div>
      </div>
    );
  }

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
          <Button size="sm" onClick={() => handleGenerateReport()}>
            <Plus className="w-4 h-4 mr-2" />
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateReport(template)}
                    >
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
                <Input 
                  id="report-name" 
                  placeholder="Enter report name"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select 
                  value={reportForm.type}
                  onValueChange={(value) => setReportForm({ ...reportForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Executive Summary</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                    <SelectItem value="detailed">Detailed Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full"
                onClick={() => handleGenerateReport()}
              >
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
              {reports.length > 0 ? (
                <div className="space-y-3">
                  {reports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{report.title}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{report.type}</span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No reports generated yet</p>
                  <p className="text-sm">Generate your first report using the templates above</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generate Report Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="bg-card/90 backdrop-blur-lg border-border/50 font-cyber">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Generate Security Report
            </DialogTitle>
            <DialogDescription className="font-cyber">
              Create a new security report with custom parameters
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-title">Report Title</Label>
              <Input 
                id="dialog-title"
                placeholder="Enter report title"
                value={reportForm.title}
                onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dialog-type">Report Type</Label>
              <Select 
                value={reportForm.type}
                onValueChange={(value) => setReportForm({ ...reportForm, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Executive Summary</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                  <SelectItem value="detailed">Detailed Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowGenerateDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitReport}
                disabled={generating || !reportForm.title.trim()}
                className="flex-1"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}