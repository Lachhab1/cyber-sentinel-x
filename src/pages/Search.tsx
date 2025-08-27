import { useState } from "react";
import { Search as SearchIcon, Filter, Clock, Database, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'vulnerability' | 'threat' | 'incident' | 'asset';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  source: string;
}

// Mock data for demonstration
const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "SQL Injection Vulnerability Detected",
    description: "Potential SQL injection vulnerability found in user authentication module",
    type: "vulnerability",
    severity: "high",
    timestamp: "2024-01-15T10:30:00Z",
    source: "Automated Scanner"
  },
  {
    id: "2", 
    title: "Suspicious Network Activity",
    description: "Unusual outbound traffic detected from internal server 192.168.1.100",
    type: "threat",
    severity: "medium",
    timestamp: "2024-01-15T09:15:00Z",
    source: "Network Monitor"
  },
  {
    id: "3",
    title: "Failed Login Attempts",
    description: "Multiple failed login attempts from IP address 203.0.113.45",
    type: "incident",
    severity: "low",
    timestamp: "2024-01-15T08:45:00Z",
    source: "Auth System"
  }
];

const getSeverityColor = (severity: string) => {
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
    case 'vulnerability': return <AlertTriangle className="h-4 w-4" />;
    case 'threat': return <Database className="h-4 w-4" />;
    case 'incident': return <Clock className="h-4 w-4" />;
    default: return <SearchIcon className="h-4 w-4" />;
  }
};

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");
  const [results, setResults] = useState<SearchResult[]>(mockResults);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search when backend is ready
    // For now, filter mock data
    if (query.trim() === "") {
      setResults(mockResults);
    } else {
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const filteredResults = results.filter(result => {
    if (activeTab === "all") return true;
    return result.type === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Search</h1>
          <p className="text-muted-foreground mt-2">
            Search across vulnerabilities, threats, incidents, and assets
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for vulnerabilities, threats, incidents..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({results.length})</TabsTrigger>
          <TabsTrigger value="vulnerability">
            Vulnerabilities ({results.filter(r => r.type === 'vulnerability').length})
          </TabsTrigger>
          <TabsTrigger value="threat">
            Threats ({results.filter(r => r.type === 'threat').length})
          </TabsTrigger>
          <TabsTrigger value="incident">
            Incidents ({results.filter(r => r.type === 'incident').length})
          </TabsTrigger>
          <TabsTrigger value="asset">
            Assets ({results.filter(r => r.type === 'asset').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredResults.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <SearchIcon className="h-12 w-12 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">No results found</h3>
                  <p className="text-muted-foreground">
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
              {filteredResults.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-lg leading-tight">
                            {result.title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {result.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(result.severity)}>
                        {result.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                      <span>Source: {result.source}</span>
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