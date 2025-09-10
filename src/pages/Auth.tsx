import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  UserCheck, 
  Building, 
  Shield,
  Settings,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showStaffOptions, setShowStaffOptions] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleRoleLogin = async (role: string, roleName: string) => {
    setIsLoading(true);
    
    try {
      // Mock authentication - create a temporary session
      const mockUser = {
        id: `mock-${role}-${Date.now()}`,
        email: `${role}@acharya.gov.in`,
        full_name: `Demo ${roleName}`,
        role: role
      };

      // Set mock session in localStorage for demo purposes
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      toast({
        title: `Welcome, ${roleName}!`,
        description: `Accessing your ${roleName} dashboard...`,
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffRole = (staffRole: string, staffName: string) => {
    setShowStaffOptions(false);
    handleRoleLogin(staffRole, staffName);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-primary-glow">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Acharya Education Portal</h1>
          <p className="text-white/80 text-lg">Government of Rajasthan</p>
          <p className="text-white/60 text-sm mt-2">शिक्षा विभाग | Education Department</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Student Role */}
          <Card className="group hover:shadow-primary-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Student</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Access your academic records, attendance, and course materials
              </p>
              <Button 
                className="w-full" 
                onClick={() => handleRoleLogin('student', 'Student')}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Enter Portal"}
              </Button>
            </CardContent>
          </Card>

          {/* Staff Role */}
          <Card className="group hover:shadow-primary-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Staff</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Faculty, Warden, and Management access
              </p>
              <Button 
                className="w-full" 
                onClick={() => setShowStaffOptions(true)}
                disabled={isLoading}
              >
                Select Role
              </Button>
            </CardContent>
          </Card>

          {/* Parent Role */}
          <Card className="group hover:shadow-primary-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Parent</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Monitor your child's academic progress and fees
              </p>
              <Button 
                className="w-full" 
                onClick={() => handleRoleLogin('parent', 'Parent')}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Enter Portal"}
              </Button>
            </CardContent>
          </Card>

          {/* Admission Role */}
          <Card className="group hover:shadow-primary-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Admission</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Apply for admission and track application status
              </p>
              <Button 
                className="w-full" 
                onClick={() => handleRoleLogin('admission', 'Admission')}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Apply Now"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Staff Sub-roles Modal */}
        {showStaffOptions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Select Staff Role</span>
                </CardTitle>
                <CardDescription>Choose your specific role to continue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start h-16" 
                  variant="outline"
                  onClick={() => handleStaffRole('faculty', 'Faculty')}
                >
                  <BookOpen className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Faculty</p>
                    <p className="text-sm text-muted-foreground">Teaching staff and subject experts</p>
                  </div>
                </Button>
                
                <Button 
                  className="w-full justify-start h-16" 
                  variant="outline"
                  onClick={() => handleStaffRole('warden', 'Warden')}
                >
                  <Building className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Warden</p>
                    <p className="text-sm text-muted-foreground">Hostel and residential management</p>
                  </div>
                </Button>
                
                <Button 
                  className="w-full justify-start h-16" 
                  variant="outline"
                  onClick={() => handleStaffRole('admin', 'Manager')}
                >
                  <Settings className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Manager</p>
                    <p className="text-sm text-muted-foreground">Administrative and management roles</p>
                  </div>
                </Button>
                
                <Button 
                  className="w-full mt-4" 
                  variant="ghost"
                  onClick={() => setShowStaffOptions(false)}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Government Branding Footer */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
            <Shield className="h-6 w-6 text-white" />
            <div className="text-white text-sm">
              <p className="font-medium">राजस्थान सरकार | Government of Rajasthan</p>
              <p className="text-white/70">Secure Portal • आधिकारिक पोर्टल</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;