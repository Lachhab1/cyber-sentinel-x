import { useState } from "react";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Globe, 
  Settings, 
  FileText, 
  Zap,
  ChevronDown,
  Brain,
  Eye,
  Home,
  TrendingUp,
  LogOut,
  Terminal,
  BarChart3,
  Users,
  Clock,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = {
  main: [
    { title: "Dashboard", url: "/", icon: Home, stats: "12", color: "text-success" },
    { title: "Incidents", url: "/incidents", icon: AlertTriangle, stats: "3", color: "text-destructive" },
    { title: "Threat Intel", url: "/threat-intel", icon: Globe, stats: "127", color: "text-warning" },
    { title: "Mitigation", url: "/mitigation", icon: Zap, stats: "8", color: "text-primary" },
    { title: "Reports", url: "/reports", icon: FileText, stats: "24", color: "text-accent" },
  ],
  system: [
    { title: "AI Assistant", url: "/ai-assistant", icon: Brain, stats: "AI", color: "text-primary" },
    { title: "Settings", url: "/settings", icon: Settings, stats: "•", color: "text-muted-foreground" },
  ],
};

export function AppSidebar() {
  const { signOut, user } = useAuth();
  const { open } = useSidebar();
  
  return (
    <Sidebar className="border-r border-border/40 bg-gradient-to-b from-card/40 to-card/20 backdrop-blur-xl">
      <SidebarHeader className="border-b border-sidebar-border/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="relative group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary via-primary-glow to-accent rounded-xl flex items-center justify-center shadow-primary/20 shadow-lg transition-all duration-300 group-hover:scale-105">
              <Shield className="w-5 h-5 text-primary-foreground drop-shadow-sm" />
            </div>
            <div className="absolute inset-0 w-9 h-9 bg-primary/10 rounded-xl blur-md animate-pulse" />
          </div>
          {open && (
            <div className="flex flex-col animate-fade-in">
              <span className="font-bold text-sidebar-foreground font-cyber text-lg tracking-tight">X-AutoPentest</span>
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="px-2 py-0 text-xs font-cyber border-success/30 text-success">
                  v3.0.1
                </Badge>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                  <span className="text-sidebar-foreground/70 font-cyber">Online</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {open && (
            <SidebarGroupLabel className="text-primary font-cyber text-sm font-semibold mb-2 px-2">
              <BarChart3 className="w-4 h-4 mr-2 inline" />
              Operations
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center ${open ? 'gap-3 px-3' : 'justify-center px-2'} py-2.5 rounded-xl transition-all duration-300 font-cyber group relative overflow-hidden ${
                          isActive 
                            ? "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 text-primary border border-primary/20 shadow-primary/10 shadow-lg" 
                            : "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary"
                        }`
                      }
                    >
                      <div className="relative z-10 flex items-center w-full">
                        <item.icon className={`${open ? 'w-4 h-4' : 'w-5 h-5'} transition-all duration-200 group-hover:scale-110 flex-shrink-0`} />
                        {open ? (
                          <div className="flex items-center justify-between w-full ml-3">
                            <span className="font-medium truncate">{item.title}</span>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs px-2 py-0 ${item.color} bg-background/50 border-current/20 ml-2 flex-shrink-0`}
                            >
                              {item.stats}
                            </Badge>
                          </div>
                        ) : (
                          <div className="absolute -right-1 -top-1">
                            <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`}>
                              <div className={`w-2 h-2 rounded-full ${item.color} opacity-75`} />
                            </div>
                          </div>
                        )}
                      </div>
                      {!open && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-4 border-t border-sidebar-border/30" />

        <SidebarGroup>
          {open && (
            <SidebarGroupLabel className="text-accent font-cyber text-sm font-semibold mb-2 px-2">
              <Settings className="w-4 h-4 mr-2 inline" />
              System
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.system.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center ${open ? 'gap-3 px-3' : 'justify-center px-2'} py-2.5 rounded-xl transition-all duration-300 font-cyber group relative overflow-hidden ${
                          isActive 
                            ? "bg-gradient-to-r from-accent/20 via-accent/15 to-accent/10 text-accent border border-accent/20 shadow-accent/10 shadow-lg" 
                            : "hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent/5 hover:text-accent"
                        }`
                      }
                    >
                      <div className="relative z-10 flex items-center w-full">
                        <item.icon className={`${open ? 'w-4 h-4' : 'w-5 h-5'} transition-all duration-200 group-hover:scale-110 flex-shrink-0`} />
                        {open ? (
                          <div className="flex items-center justify-between w-full ml-3">
                            <span className="font-medium truncate">{item.title}</span>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs px-2 py-0 ${item.color} bg-background/50 border-current/20 ml-2 flex-shrink-0`}
                            >
                              {item.stats}
                            </Badge>
                          </div>
                        ) : (
                          <div className="absolute -right-1 -top-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                          </div>
                        )}
                      </div>
                      {!open && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/30 bg-gradient-to-r from-card/20 to-card/10 backdrop-blur">
        <div className="px-3 py-4 space-y-3">
          {open ? (
            <>
              <div className="text-xs text-sidebar-foreground/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-success/50 shadow-sm" />
                    <span className="font-cyber font-medium">System Status</span>
                  </div>
                  <Badge variant="outline" className="text-xs font-cyber border-success/30 text-success">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-cyber text-sidebar-foreground/60">Active User</span>
                  <span className="font-cyber font-medium text-primary">
                    {user?.email?.split('@')[0]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-sidebar-foreground/50">Session</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-sidebar-foreground/60">24m</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={signOut}
                variant="soft" 
                size="sm" 
                className="w-full font-cyber text-xs group"
              >
                <LogOut className="w-3 h-3 mr-2 group-hover:rotate-6 transition-transform duration-200" />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <Button 
                onClick={signOut}
                variant="ghost" 
                size="icon"
                className="w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}