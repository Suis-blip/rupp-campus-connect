import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  CalendarDays,
  MessageSquare,
  LogOut,
  GraduationCap,
  School,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Classes", url: "/classes", icon: School },
  { title: "Attendance", url: "/attendance", icon: ClipboardCheck },
  { title: "Gradebook", url: "/gradebook", icon: BookOpen },
  { title: "Schedule", url: "/schedule", icon: CalendarDays },
  { title: "Messages", url: "/messages", icon: MessageSquare },
];

export function AppSidebar() {
  const { user, logout } = useAuth();

  return (
    <Sidebar className="border-r border-sidebar-border">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-sidebar-foreground tracking-tight">RUPP Portal</span>
          <span className="text-[11px] text-muted-foreground">University System</span>
        </div>
      </div>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-sidebar-foreground/80 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold shadow-sm"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors">
          <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
            {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-[11px] text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
