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
  Eye
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Activity },
  { title: "Incidents", url: "/incidents", icon: AlertTriangle },
  { title: "Threat Intelligence", url: "/threat-intel", icon: Globe },
  { title: "Mitigation Center", url: "/mitigation", icon: Zap },
  { title: "Reports", url: "/reports", icon: FileText },
];

const systemItems = [
  { title: "AI Assistant", url: "/ai-assistant", icon: Brain },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive: active }: { isActive: boolean }) =>
    `transition-all duration-200 ${
      active 
        ? "bg-primary/20 text-primary border-r-2 border-primary glow-primary" 
        : "hover:bg-muted/50 hover:text-primary"
    }`;

  return (
    <Sidebar
      className="border-r border-border/50 bg-card/50 backdrop-blur-sm"
      collapsible="icon"
    >
      <SidebarContent className="p-2">
        {/* Header */}
        <div className={`flex items-center gap-3 p-4 border-b border-border/50 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="relative">
            <Shield className="h-8 w-8 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full pulse-cyber" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-primary">SecureOps</h1>
              <p className="text-xs text-muted-foreground">Security Platform</p>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-primary">
            {!isCollapsed && "Security Operations"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"} 
                      className={getNavCls}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-accent">
            {!isCollapsed && "System"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status Indicator */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-success rounded-full pulse-cyber" />
              <span className="text-muted-foreground">System Online</span>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <Eye className="w-3 h-3 text-accent" />
              <span className="text-muted-foreground">Monitoring Active</span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}