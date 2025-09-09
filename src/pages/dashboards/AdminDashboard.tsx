import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Shield, 
  Users, 
  GraduationCap, 
  CreditCard,
  LogOut,
  UserPlus,
  FileText,
  TrendingUp,
  BookOpen,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample analytics data
  const schoolStats = {
    totalStudents: 1250,
    totalFaculty: 85,
    totalStaff: 45,
    totalRevenue: 2450000,
    monthlyGrowth: 8.5,
    attendanceRate: 92.3,
    feeCollection: 89.7
  };

  const monthlyAdmissions = [
    { month: 'Jan', admissions: 45 },
    { month: 'Feb', admissions: 52 },
    { month: 'Mar', admissions: 38 },
    { month: 'Apr', admissions: 65 },
    { month: 'May', admissions: 48 },
    { month: 'Jun', admissions: 71 }
  ];

  const feeCollectionData = [
    { month: 'Jan', collected: 420000, pending: 80000 },
    { month: 'Feb', collected: 450000, pending: 65000 },
    { month: 'Mar', collected: 380000, pending: 95000 },
    { month: 'Apr', collected: 510000, pending: 45000 },
    { month: 'May', collected: 475000, pending: 70000 },
    { month: 'Jun', collected: 520000, pending: 55000 }
  ];

  const classDistribution = [
    { class: 'Class 1-5', students: 485, color: '#0088FE' },
    { class: 'Class 6-8', students: 376, color: '#00C49F' },
    { class: 'Class 9-10', students: 285, color: '#FFBB28' },
    { class: 'Class 11-12', students: 104, color: '#FF8042' }
  ];

  const pendingAdmissions = [
    { name: "Rahul Sharma", class: "Class 9", status: "Documents Pending", date: "2024-02-15" },
    { name: "Priya Patel", class: "Class 11", status: "Payment Pending", date: "2024-02-14" },
    { name: "Ankit Kumar", class: "Class 7", status: "Interview Scheduled", date: "2024-02-16" }
  ];

  const recentReports = [
    { report: "Monthly Fee Collection Report", type: "Financial", date: "2024-02-01" },
    { report: "Student Performance Analysis", type: "Academic", date: "2024-02-03" },
    { report: "Faculty Attendance Report", type: "HR", date: "2024-02-05" },
    { report: "Infrastructure Maintenance", type: "Operations", date: "2024-02-07" }
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      
      // Fetch profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Auth error:', error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      navigate("/");
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const approveAdmission = (name: string) => {
    toast({
      title: "Admission Approved",
      description: `Admission for ${name} has been approved.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Admin Portal</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{profile?.full_name || user?.email}</p>
              <p className="text-sm text-muted-foreground">School Administrator</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome, {profile?.full_name?.split(' ')[0] || 'Administrator'}!
          </h2>
          <p className="text-muted-foreground">Comprehensive school management and analytics dashboard</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{schoolStats.totalStudents.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{schoolStats.totalFaculty}</p>
                  <p className="text-sm text-muted-foreground">Faculty Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">₹{(schoolStats.totalRevenue / 100000).toFixed(1)}L</p>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{schoolStats.monthlyGrowth}%</p>
                  <p className="text-sm text-muted-foreground">Monthly Growth</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>School performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Attendance Rate</span>
                  <span className="text-sm text-muted-foreground">{schoolStats.attendanceRate}%</span>
                </div>
                <Progress value={schoolStats.attendanceRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Fee Collection Rate</span>
                  <span className="text-sm text-muted-foreground">{schoolStats.feeCollection}%</span>
                </div>
                <Progress value={schoolStats.feeCollection} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Faculty Satisfaction</span>
                  <span className="text-sm text-muted-foreground">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Student Satisfaction</span>
                  <span className="text-sm text-muted-foreground">91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Distribution by Class</CardTitle>
              <CardDescription>Current enrollment across different classes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={classDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, students }) => `${name}: ${students}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="students"
                  >
                    {classDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Admissions</CardTitle>
              <CardDescription>New student admissions over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyAdmissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="admissions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fee Collection Trend</CardTitle>
              <CardDescription>Monthly fee collection vs pending amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={feeCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="collected" stroke="#8884d8" name="Collected" />
                  <Line type="monotone" dataKey="pending" stroke="#82ca9d" name="Pending" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <span>Pending Admissions</span>
              </CardTitle>
              <CardDescription>Student admissions requiring verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingAdmissions.map((admission, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{admission.name}</p>
                    <p className="text-sm text-muted-foreground">{admission.class}</p>
                    <p className="text-xs text-muted-foreground">{admission.date}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge variant={
                      admission.status.includes('Pending') ? 'destructive' : 'secondary'
                    }>
                      {admission.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => approveAdmission(admission.name)}
                      className="w-full"
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Recent Reports</span>
              </CardTitle>
              <CardDescription>Generated reports and analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{report.report}</p>
                    <p className="text-sm text-muted-foreground">{report.type}</p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline">{report.type}</Badge>
                    <Button size="sm" variant="outline" className="w-full">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-medium mb-2">User Management</h3>
              <p className="text-sm text-muted-foreground">Manage students, faculty, and staff accounts</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-medium mb-2">Academic Management</h3>
              <p className="text-sm text-muted-foreground">Manage classes, subjects, and curriculum</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-medium mb-2">Fee Management</h3>
              <p className="text-sm text-muted-foreground">Monitor fee collection and payments</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-medium mb-2">System Reports</h3>
              <p className="text-sm text-muted-foreground">Generate comprehensive system reports</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;