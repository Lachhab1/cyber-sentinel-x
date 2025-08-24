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
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

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
} from "@/components/ui/sidebar";

const navigation = {
  main: [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Incidents", url: "/incidents", icon: AlertTriangle },
    { title: "Threat Intel", url: "/threat-intel", icon: Globe },
    { title: "Mitigation", url: "/mitigation", icon: Zap },
    { title: "Reports", url: "/reports", icon: FileText },
  ],
  system: [
    { title: "AI Assistant", url: "/ai-assistant", icon: Brain },
    { title: "Settings", url: "/settings", icon: Settings },
  ],
};

export function AppSidebar() {
  const { signOut, user } = useAuth();
  return (
    <Sidebar className="border-r border-border/50 bg-card/30 backdrop-blur-lg">
      <SidebarHeader className="border-b border-sidebar-border/50">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center pulse-cyber">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute inset-0 w-8 h-8 bg-primary/20 rounded-lg blur-sm animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sidebar-foreground font-cyber glitch">X-AutoPentest</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-sidebar-foreground/60 font-cyber">v3.0.1</span>
              <Terminal className="w-3 h-3 text-success" />
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-cyber">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-cyber ${
                          isActive 
                            ? "bg-primary/20 text-primary border border-primary/30 glow-primary" 
                            : "hover:bg-primary/10 hover:text-primary"
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-accent font-cyber">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.system.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-cyber ${
                          isActive 
                            ? "bg-primary/20 text-primary border border-primary/30 glow-primary" 
                            : "hover:bg-primary/10 hover:text-primary"
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50">
        <div className="px-3 py-3 space-y-3">
          <div className="text-xs text-sidebar-foreground/60 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full pulse-cyber" />
              <span className="font-cyber">System: Operational</span>
            </div>
            <div className="font-cyber">User: {user?.email?.split('@')[0]}</div>
          </div>
          <Button 
            onClick={signOut}
            variant="outline" 
            size="sm" 
            className="w-full font-cyber text-xs"
          >
            <LogOut className="w-3 h-3 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}