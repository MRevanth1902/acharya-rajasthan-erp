import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  CreditCard, 
  Home as HomeIcon, 
  FileText,
  LogOut,
  User,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample data
  const attendanceData = {
    present: 85,
    total: 100,
    percentage: 85
  };

  const recentMarks = [
    { subject: "Mathematics", marks: 92, totalMarks: 100, exam: "Mid-term" },
    { subject: "Science", marks: 88, totalMarks: 100, exam: "Mid-term" },
    { subject: "English", marks: 94, totalMarks: 100, exam: "Unit Test" },
    { subject: "Hindi", marks: 87, totalMarks: 100, exam: "Unit Test" }
  ];

  const todayTimetable = [
    { period: 1, subject: "Mathematics", teacher: "Mr. Sharma", time: "09:00 - 09:45" },
    { period: 2, subject: "Science", teacher: "Ms. Verma", time: "09:45 - 10:30" },
    { period: 3, subject: "English", teacher: "Mrs. Gupta", time: "10:45 - 11:30" },
    { period: 4, subject: "Hindi", teacher: "Mr. Singh", time: "11:30 - 12:15" }
  ];

  const feeStatus = {
    totalFees: 15000,
    paidAmount: 10000,
    pendingAmount: 5000,
    dueDate: "2024-02-15"
  };

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
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Student Portal</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{profile?.full_name || user?.email}</p>
              <p className="text-sm text-muted-foreground">{profile?.student_id || 'Student'}</p>
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
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}!
          </h2>
          <p className="text-muted-foreground">Here's your academic overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{attendanceData.percentage}%</p>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">92.5%</p>
                  <p className="text-sm text-muted-foreground">Average Marks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">₹{feeStatus.pendingAmount}</p>
                  <p className="text-sm text-muted-foreground">Pending Fees</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <HomeIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">Block A</p>
                  <p className="text-sm text-muted-foreground">Hostel Room</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Timetable */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today's Schedule</span>
              </CardTitle>
              <CardDescription>Your classes for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayTimetable.map((period, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{period.subject}</p>
                    <p className="text-sm text-muted-foreground">{period.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{period.time}</p>
                    <Badge variant="outline">Period {period.period}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Marks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Recent Marks</span>
              </CardTitle>
              <CardDescription>Your latest exam results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMarks.map((mark, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{mark.subject}</p>
                    <p className="text-sm text-muted-foreground">{mark.exam}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {mark.marks}/{mark.totalMarks}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((mark.marks / mark.totalMarks) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Fee Status & Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Fee Status</span>
              </CardTitle>
              <CardDescription>Academic year 2024-25</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Fees</span>
                  <span className="font-medium">₹{feeStatus.totalFees}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Paid Amount</span>
                  <span className="font-medium text-green-600">₹{feeStatus.paidAmount}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-bold text-orange-600">₹{feeStatus.pendingAmount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Due Date</span>
                  <span className="text-orange-600">{feeStatus.dueDate}</span>
                </div>
                <Button className="w-full mt-4">Pay Now</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Attendance Overview</span>
              </CardTitle>
              <CardDescription>Current academic year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Present Days</span>
                  <span className="font-medium text-green-600">{attendanceData.present}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Days</span>
                  <span className="font-medium">{attendanceData.total}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Attendance Percentage</span>
                  <Badge variant={attendanceData.percentage >= 75 ? "default" : "destructive"}>
                    {attendanceData.percentage}%
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${attendanceData.percentage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;