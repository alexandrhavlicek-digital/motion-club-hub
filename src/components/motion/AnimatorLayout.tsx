import React from 'react';
import { Header } from '@/components/motion/Header';
import { 
  BarChart3, 
  UserPlus, 
  UserMinus, 
  User, 
  LogOut,
  Menu,
  Home
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMotionAuth } from '@/hooks/useMotionAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';

interface AnimatorLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const menuItems = [
  { title: 'Dashboard', url: '/animator/dashboard', icon: Home },
  { title: 'Přehled registrací', url: '/animator/registrations', icon: BarChart3 },
  { title: 'Přidat registraci', url: '/animator/add', icon: UserPlus },
  { title: 'Zrušit registraci', url: '/animator/remove', icon: UserMinus },
  { title: 'Profil', url: '/animator/profile', icon: User },
];

function AnimatorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useMotionAuth();
  const { toast } = useToast();
  const { open } = useSidebar();

  const handleLogout = () => {
    logout();
    toast({
      title: "Odhlášení úspěšné",
      description: "Byli jste úspěšně odhlášeni.",
    });
    navigate('/animator/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={open ? "w-64" : "w-16"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Animátor</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                  >
                    <button
                      onClick={() => navigate(item.url)}
                      className="flex items-center w-full"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {open && <span>Odhlásit se</span>}
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export const AnimatorLayout: React.FC<AnimatorLayoutProps> = ({ 
  children, 
  title = "Animátor" 
}) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AnimatorSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-background">
            <div className="flex items-center px-4 h-14">
              <SidebarTrigger>
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <h1 className="ml-4 text-lg font-semibold text-foreground">
                {title}
              </h1>
            </div>
          </header>
          
          <main className="flex-1 p-6 bg-background">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};