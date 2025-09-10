import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  user: any;
  profile: any;
  sidebarContent?: ReactNode;
}

const DashboardLayout = ({ children, title, user, profile, sidebarContent }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = () => {
    // Clear mock user data
    localStorage.removeItem('mockUser');
    
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account.",
    });
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-government border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {sidebarContent && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-white/10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  {sidebarContent}
                </SheetContent>
              </Sheet>
            )}
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">{title}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-white">{profile?.full_name || user?.email}</p>
              <p className="text-sm text-white/70">{profile?.role || 'User'}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        {sidebarContent && (
          <aside className="hidden md:block w-80 bg-card border-r border-border min-h-screen">
            {sidebarContent}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;