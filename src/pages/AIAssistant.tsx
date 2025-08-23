import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  MessageSquare,
  Send,
  Bot,
  User,
  Target,
  Shield,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ExternalLink
} from "lucide-react";

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI Security Analyst. I can help you investigate incidents, understand attack patterns, and provide mitigation recommendations based on MITRE ATT&CK framework. How can I assist you today?",
      timestamp: "2024-11-20 14:30:00"
    },
    {
      id: 2,
      type: "user", 
      content: "Can you analyze the SQL injection attempt from IP 192.168.1.45?",
      timestamp: "2024-11-20 14:31:00"
    },
    {
      id: 3,
      type: "bot",
      content: "I've analyzed the SQL injection attempt from 192.168.1.45. Here's what I found:\n\n**Attack Analysis:**\n- MITRE Technique: T1190 - Exploit Public-Facing Application\n- Payload: Multiple UNION-based SQL injection attempts\n- Target: /login.php endpoint\n- Confidence: 95%\n\n**Recommended Mitigations:**\n1. Implement input validation and parameterized queries\n2. Deploy Web Application Firewall (WAF) rules\n3. Block source IP: `iptables -A INPUT -s 192.168.1.45 -j DROP`\n\n**MITRE Reference:** [T1190](https://attack.mitre.org/techniques/T1190/)",
      timestamp: "2024-11-20 14:31:15",
      attachments: [
        { type: "mitre", technique: "T1190", name: "Exploit Public-Facing Application" },
        { type: "rule", name: "SQL Injection WAF Rule", preview: "location / { if ($args ~* \"(union|select...)\" ..." }
      ]
    }
  ]);

  const [currentMessage, setCurrentMessage] = useState("");

  const quickActions = [
    {
      icon: Target,
      title: "Analyze Latest Incident",
      description: "Get AI analysis of the most recent security incident",
      action: "analyze_latest"
    },
    {
      icon: Shield,
      title: "Security Posture Assessment",
      description: "Evaluate current security posture and recommendations",
      action: "assess_posture"
    },
    {
      icon: AlertTriangle,
      title: "Threat Hunting Query",
      description: "Generate threat hunting queries for suspicious activity",
      action: "threat_hunt"
    },
    {
      icon: Lightbulb,
      title: "Mitigation Recommendations",
      description: "Get tailored security mitigation recommendations",
      action: "recommend_mitigations"
    }
  ];

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: currentMessage,
      timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19)
    };
    
    setMessages([...messages, newMessage]);
    setCurrentMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "bot" as const,
        content: "I'm analyzing your request. This is a simulated response. In a real implementation, this would connect to an AI service to provide detailed security analysis and recommendations.",
        timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19)
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const executeQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      analyze_latest: "Please analyze the latest security incident and provide MITRE ATT&CK mapping",
      assess_posture: "Can you assess our current security posture and provide improvement recommendations?",
      threat_hunt: "Generate threat hunting queries for detecting advanced persistent threats",
      recommend_mitigations: "What are the top mitigation strategies based on our recent incident patterns?"
    };
    
    setCurrentMessage(actionMessages[action] || "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary font-cyber">AI Security Assistant</h1>
          <p className="text-muted-foreground font-cyber">Intelligent security analysis and MITRE ATT&CK mapping</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full pulse-cyber" />
          <span className="text-sm text-muted-foreground">AI Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <Card className="xl:col-span-3 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary font-cyber">
              <Brain className="w-5 h-5" />
              Security Analysis Chat
            </CardTitle>
            <CardDescription>Chat with AI for incident analysis and security guidance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-primary' : 'bg-accent'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-accent-foreground" />
                      )}
                    </div>
                    
                    <div className={`rounded-lg p-4 ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted/50 text-card-foreground'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      
                      {/* Attachments */}
                      {message.attachments && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="p-2 rounded border border-border/50 bg-background/50">
                              {attachment.type === 'mitre' && (
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4 text-warning" />
                                  <span className="text-xs font-cyber">{attachment.technique}</span>
                                  <span className="text-xs">{attachment.name}</span>
                                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                </div>
                              )}
                              {attachment.type === 'rule' && (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-success" />
                                    <span className="text-xs font-semibold">{attachment.name}</span>
                                  </div>
                                  <code className="text-xs text-muted-foreground block">{attachment.preview}</code>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground mt-2 opacity-70">
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask about security incidents, threat analysis, or mitigation strategies..."
                className="flex-1 min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button onClick={sendMessage} className="self-end">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-primary font-cyber">Quick Actions</CardTitle>
              <CardDescription>Common security analysis tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => executeQuickAction(action.action)}
                >
                  <action.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-primary font-cyber">AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-warning" />
                <span>MITRE ATT&CK Mapping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-success" />
                <span>Mitigation Recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span>Threat Pattern Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-accent" />
                <span>Security Education</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}