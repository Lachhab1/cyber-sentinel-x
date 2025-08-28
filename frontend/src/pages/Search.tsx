import { useState, useEffect } from "react";
import { Search as SearchIcon, Filter, Clock, Database, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'threat' | 'incident' | 'project';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: string;
  timestamp: string;
  source?: string;
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [threats, setThreats] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [threatsData, incidentsData, projectsData] = await Promise.all([
          api.threats.getAll(),
          api.incidents.getAll(),
          api.projects.getAll()
        ]);
        
        setThreats(threatsData);
        setIncidents(incidentsData);
        setProjects(projectsData);
        
        // Combine all data for search
        const allResults: SearchResult[] = [
          ...threatsData.map(threat => ({
            id: threat.id,
            title: threat.title,
            description: threat.description,
            type: 'threat' as const,
            severity: threat.severity,
            timestamp: threat.createdAt,
            source: 'Threat Intelligence'
          })),
          ...incidentsData.map(incident => ({
            id: incident.id,
            title: incident.title,
            description: `Status: ${incident.status}${incident.project?.name ? ` | Project: ${incident.project.name}` : ''}`,
            type: 'incident' as const,
            status: incident.status,
            timestamp: incident.createdAt,
            source: 'Incident Management'
          })),
          ...projectsData.map(project => ({
            id: project.id,
            title: project.name,
            description: project.description || 'No description available',
            type: 'project' as const,
            timestamp: project.createdAt,
            source: 'Project Management'
          }))
        ];
        
        setResults(allResults);
      } catch (error) {
        console.error('Failed to load search data:', error);
        toast.error("Failed to load search data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      // Show all results when query is empty
      const allResults: SearchResult[] = [
        ...threats.map(threat => ({
          id: threat.id,
          title: threat.title,
          description: threat.description,
          type: 'threat' as const,
          severity: threat.severity,
          timestamp: threat.createdAt,
          source: 'Threat Intelligence'
        })),
        ...incidents.map(incident => ({
          id: incident.id,
          title: incident.title,
          description: `Status: ${incident.status}${incident.project?.name ? ` | Project: ${incident.project.name}` : ''}`,
          type: 'incident' as const,
          status: incident.status,
          timestamp: incident.createdAt,
          source: 'Incident Management'
        })),
        ...projects.map(project => ({
          id: project.id,
          title: project.name,
          description: project.description || 'No description available',
          type: 'project' as const,
          timestamp: project.createdAt,
          source: 'Project Management'
        }))
      ];
      setResults(allResults);
      return;
    }

    try {
      setLoading(true);
      
      // Perform global search
      const searchResults = await api.search.global(query);
      
      // Transform search results to match our interface
      const transformedResults: SearchResult[] = [
        ...(searchResults.threats || []).map(threat => ({
          id: threat.id,
          title: threat.title,
          description: threat.description,
          type: 'threat' as const,
          severity: threat.severity,
          timestamp: threat.createdAt,
          source: 'Threat Intelligence'
        })),
        ...(searchResults.incidents || []).map(incident => ({
          id: incident.id,
          title: incident.title,
          description: `Status: ${incident.status}${incident.project?.name ? ` | Project: ${incident.project.name}` : ''}`,
          type: 'incident' as const,
          status: incident.status,
          timestamp: incident.createdAt,
          source: 'Incident Management'
        })),
        ...(searchResults.projects || []).map(project => ({
          id: project.id,
          title: project.name,
          description: project.description || 'No description available',
          type: 'project' as const,
          timestamp: project.createdAt,
          source: 'Project Management'
        }))
      ];
      
      setResults(transformedResults);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter(result => {
    if (activeTab === "all") return true;
    return result.type === activeTab;
  });

  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case "timestamp":
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case "severity":
        if (a.severity && b.severity) {
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        }
        return 0;
      case "type":
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'threat': return <AlertTriangle className="h-4 w-4" />;
      case 'incident': return <Database className="h-4 w-4" />;
      case 'project': return <Clock className="h-4 w-4" />;
      default: return <SearchIcon className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'threat': return 'text-destructive';
      case 'incident': return 'text-warning';
      case 'project': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-cyber">Security Search</h1>
          <p className="text-muted-foreground font-cyber mt-2">
            Search across threats, incidents, and projects
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for threats, incidents, projects..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timestamp">Latest</SelectItem>
              <SelectItem value="severity">Severity</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({results.length})</TabsTrigger>
          <TabsTrigger value="threat">
            Threats ({results.filter(r => r.type === 'threat').length})
          </TabsTrigger>
          <TabsTrigger value="incident">
            Incidents ({results.filter(r => r.type === 'incident').length})
          </TabsTrigger>
          <TabsTrigger value="project">
            Projects ({results.filter(r => r.type === 'project').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-primary font-cyber">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-lg">Searching...</span>
                </div>
              </CardContent>
            </Card>
          ) : sortedResults.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <SearchIcon className="h-12 w-12 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold text-primary font-cyber">No results found</h3>
                  <p className="text-muted-foreground font-cyber">
                    {searchQuery 
                      ? `No results for "${searchQuery}". Try adjusting your search terms.`
                      : "Start typing to search across your security data."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedResults.map((result) => (
                <Card key={result.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-200 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-muted/50 ${getTypeColor(result.type)}`}>
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-lg leading-tight text-primary font-cyber">
                            {result.title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {result.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {result.severity && (
                          <Badge className={getSeverityColor(result.severity)}>
                            {result.severity.toUpperCase()}
                          </Badge>
                        )}
                        {result.status && (
                          <Badge variant="outline" className="text-xs">
                            {result.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                      {result.source && <span>Source: {result.source}</span>}
                      <Badge variant="outline" className="capitalize">
                        {result.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}