import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  FileText,
  LogOut,
  Download,
  Phone,
  Calendar,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ParentDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample child data
  const childData = {
    name: "Priya Sharma",
    class: "Class 10",
    section: "A",
    rollNumber: "10A25",
    studentId: "STU2024001"
  };

  const attendanceData = {
    present: 82,
    total: 95,
    percentage: 86.3
  };

  const recentMarks = [
    { subject: "Mathematics", marks: 89, totalMarks: 100, exam: "Mid-term", grade: "A" },
    { subject: "Science", marks: 92, totalMarks: 100, exam: "Mid-term", grade: "A+" },
    { subject: "English", marks: 85, totalMarks: 100, exam: "Unit Test", grade: "A" },
    { subject: "Social Studies", marks: 88, totalMarks: 100, exam: "Unit Test", grade: "A" }
  ];

  const feeHistory = [
    { month: "January 2024", amount: 5000, status: "Paid", date: "2024-01-15" },
    { month: "February 2024", amount: 5000, status: "Paid", date: "2024-02-10" },
    { month: "March 2024", amount: 5000, status: "Pending", date: "2024-03-15" }
  ];

  const reportCards = [
    { term: "First Term 2024", percentage: 87.5, grade: "A", date: "2024-05-15" },
    { term: "Mid Term 2024", percentage: 89.2, grade: "A", date: "2024-08-20" }
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

  const downloadReportCard = (term: string) => {
    toast({
      title: "Download Started",
      description: `Downloading report card for ${term}`,
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
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Parent Portal</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{profile?.full_name || user?.email}</p>
              <p className="text-sm text-muted-foreground">Parent</p>
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
            Welcome, {profile?.full_name?.split(' ')[0] || 'Parent'}!
          </h2>
          <p className="text-muted-foreground">Monitor your child's academic progress</p>
        </div>

        {/* Child Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Child Information</CardTitle>
            <CardDescription>Student details and basic information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{childData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class & Section</p>
                <p className="font-medium">{childData.class} - {childData.section}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Roll Number</p>
                <p className="font-medium">{childData.rollNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Student ID</p>
                <p className="font-medium">{childData.studentId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{attendanceData.percentage}%</p>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">88.6%</p>
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
                  <p className="text-2xl font-bold">₹5,000</p>
                  <p className="text-sm text-muted-foreground">Pending Fees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Academic Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Recent Marks</span>
              </CardTitle>
              <CardDescription>Latest exam performance</CardDescription>
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
                    <Badge variant="outline">{mark.grade}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Attendance Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Attendance Overview</span>
              </CardTitle>
              <CardDescription>Current academic year progress</CardDescription>
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
                  <span className="text-muted-foreground">Attendance Rate</span>
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
                
                {attendanceData.percentage < 75 && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      ⚠️ Attendance is below 75%. Please contact the school if needed.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fee History & Report Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Fee History</span>
              </CardTitle>
              <CardDescription>Payment records and pending fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {feeHistory.map((fee, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{fee.month}</p>
                    <p className="text-sm text-muted-foreground">Due: {fee.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{fee.amount}</p>
                    <Badge variant={fee.status === 'Paid' ? 'default' : 'destructive'}>
                      {fee.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Pending Fees
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Report Cards</span>
              </CardTitle>
              <CardDescription>Download academic reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportCards.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{report.term}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.percentage}% - Grade {report.grade}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadReportCard(report.term)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    For queries, contact: +91-98765-43210 | parent@acharya.gov.in
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;