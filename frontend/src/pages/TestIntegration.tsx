import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function TestIntegration() {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>({});

  const runTests = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Get threats
      try {
        const threats = await api.threats.getAll();
        results.threats = { success: true, count: threats.length, data: threats };
      } catch (error) {
        results.threats = { success: false, error: error.message };
      }

      // Test 2: Get incidents
      try {
        const incidents = await api.incidents.getAll();
        results.incidents = { success: true, count: incidents.length, data: incidents };
      } catch (error) {
        results.incidents = { success: false, error: error.message };
      }

      // Test 3: Get projects
      try {
        const projects = await api.projects.getAll();
        results.projects = { success: true, count: projects.length, data: projects };
      } catch (error) {
        results.projects = { success: false, error: error.message };
      }

      // Test 4: Dashboard stats
      try {
        const stats = await api.dashboard.getStats();
        results.dashboard = { success: true, data: stats };
      } catch (error) {
        results.dashboard = { success: false, error: error.message };
      }

      setTestResults(results);
      toast.success('Integration tests completed');
    } catch (error) {
      toast.error('Integration tests failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary font-cyber">Backend Integration Test</h1>
        <p className="text-muted-foreground font-cyber">Testing connection to NestJS backend</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Endpoint Tests</CardTitle>
          <CardDescription>Test various backend endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runTests} disabled={loading} className="mb-4">
            {loading ? 'Running Tests...' : 'Run Integration Tests'}
          </Button>

          <div className="space-y-4">
            {Object.entries(testResults).map(([key, result]: [string, any]) => (
              <div key={key} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold capitalize">{key}</h3>
                  <Badge variant={result.success ? 'default' : 'destructive'}>
                    {result.success ? 'PASS' : 'FAIL'}
                  </Badge>
                </div>
                {result.success ? (
                  <div className="text-sm text-muted-foreground">
                    {result.count !== undefined && <p>Count: {result.count}</p>}
                    <p>Data: {JSON.stringify(result.data, null, 2)}</p>
                  </div>
                ) : (
                  <div className="text-sm text-destructive">
                    Error: {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

