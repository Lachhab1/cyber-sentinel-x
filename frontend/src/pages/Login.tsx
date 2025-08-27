import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Zap, Eye, Brain, Lock, Mail, Terminal, Cpu } from 'lucide-react';

export default function Auth() {
  const { user, loading, signUp, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-grid">
        <div className="flex items-center gap-3 text-primary font-cyber">
          <Cpu className="w-6 h-6 animate-spin" />
          <span className="text-lg">Initializing Security Matrix...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn(email, password);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signUp(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center cyber-grid p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Shield className="w-12 h-12 text-primary pulse-cyber" />
              <div className="absolute inset-0 animate-pulse">
                <Shield className="w-12 h-12 text-primary-glow opacity-50" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-primary font-cyber glitch">
                X-AutoPentest
              </h1>
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="text-primary border-primary/30">
                  <Terminal className="w-3 h-3 mr-1" />
                  v2.1.0
                </Badge>
                <Badge variant="outline" className="text-success border-success/30">
                  <Zap className="w-3 h-3 mr-1" />
                  ONLINE
                </Badge>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground font-cyber">
              Advanced Penetration Testing Platform
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Real-time Monitoring</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="bg-card/80 backdrop-blur-lg border-border/50 glow-primary">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-cyber text-primary">
              Secure Access Portal
            </CardTitle>
            <CardDescription className="font-cyber">
              Authenticate to access advanced security tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-muted/30">
                <TabsTrigger value="signin" className="font-cyber">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="font-cyber">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-cyber text-primary">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="operator@x-autopentest.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background/50 border-border/50 font-cyber"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-cyber text-primary">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-background/50 border-border/50 font-cyber"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full font-cyber"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Cpu className="w-4 h-4 mr-2 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Access System
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="font-cyber text-primary">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="operator@x-autopentest.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background/50 border-border/50 font-cyber"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="font-cyber text-primary">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-background/50 border-border/50 font-cyber"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Password must be at least 6 characters</p>
                    <p>• Use mix of letters, numbers, and symbols</p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full font-cyber"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Cpu className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Register Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <Separator className="my-6 bg-border/30" />

            <div className="text-center text-xs text-muted-foreground space-y-2">
              <p>Protected by military-grade encryption</p>
              <div className="flex items-center justify-center gap-1 text-success">
                <Lock className="w-3 h-3" />
                <span>TLS 1.3 • AES-256 • RSA-4096</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>© 2024 X-AutoPentest. Advanced Security Solutions.</p>
          <div className="flex items-center justify-center gap-4">
            <span>Status: Operational</span>
            <span>Security Level: Maximum</span>
          </div>
        </div>
      </div>
    </div>
  );
}