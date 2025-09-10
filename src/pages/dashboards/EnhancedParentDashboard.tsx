import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardStats from "@/components/DashboardStats";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  FileText,
  Download,
  Phone,
  Calendar,
  Clock,
  Bell,
  Award,
  BookOpen,
  AlertCircle,
  Mail,
  MessageCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EnhancedParentDashboard = () => {
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
    studentId: "STU2024001",
    photo: "/placeholder.svg"
  };

  const attendanceData = {
    present: 87,
    total: 95,
    percentage: 91.6,
    monthlyTrend: [85, 88, 90, 91.6]
  };

  const recentMarks = [
    { subject: "Mathematics", marks: 89, totalMarks: 100, exam: "Mid-term", grade: "A", date: "2024-02-15" },
    { subject: "Science", marks: 92, totalMarks: 100, exam: "Mid-term", grade: "A+", date: "2024-02-12" },
    { subject: "English", marks: 85, totalMarks: 100, exam: "Unit Test", grade: "A", date: "2024-02-10" },
    { subject: "Social Studies", marks: 88, totalMarks: 100, exam: "Unit Test", grade: "A", date: "2024-02-08" },
    { subject: "Hindi", marks: 91, totalMarks: 100, exam: "Mid-term", grade: "A+", date: "2024-02-05" },
    { subject: "Computer Science", marks: 94, totalMarks: 100, exam: "Practical", grade: "A+", date: "2024-02-03" }
  ];

  const feeHistory = [
    { month: "January 2024", amount: 8000, status: "Paid", date: "2024-01-15", receipt: "RCT001" },
    { month: "February 2024", amount: 8000, status: "Paid", date: "2024-02-10", receipt: "RCT002" },
    { month: "March 2024", amount: 8000, status: "Pending", date: "2024-03-15", receipt: "" }
  ];

  const reportCards = [
    { term: "First Term 2024", percentage: 87.5, grade: "A", date: "2024-05-15", subjects: 6 },
    { term: "Mid Term 2024", percentage: 89.2, grade: "A", date: "2024-08-20", subjects: 6 }
  ];

  const notifications = [
    { id: 1, type: "exam", title: "Final Exams Schedule Released", message: "Final examinations will begin from March 20, 2024", date: "2024-02-18", read: false },
    { id: 2, type: "fee", title: "Fee Reminder", message: "March fee payment due on 15th March", date: "2024-02-15", read: false },
    { id: 3, type: "event", title: "Parent-Teacher Meeting", message: "PTM scheduled for March 5, 2024 at 10:00 AM", date: "2024-02-12", read: true },
    { id: 4, type: "announcement", title: "School Holiday", message: "School will remain closed on March 8th for Holi festival", date: "2024-02-10", read: true }
  ];

  const upcomingEvents = [
    { title: "Final Examinations", date: "2024-03-20", type: "exam" },
    { title: "Parent-Teacher Meeting", date: "2024-03-05", type: "meeting" },
    { title: "Annual Day Celebration", date: "2024-03-25", type: "event" },
    { title: "Summer Vacation Begins", date: "2024-04-15", type: "holiday" }
  ];

  const dashboardStats = [
    {
      title: "Attendance Rate",
      value: `${attendanceData.percentage}%`,
      icon: Clock,
      description: "This month",
      color: (attendanceData.percentage >= 85 ? "success" : "warning") as const,
      trend: { value: 3.2, isPositive: true }
    },
    {
      title: "Average Grade",
      value: "A",
      icon: Award,
      description: "Current semester",
      color: "primary" as const,
      trend: { value: 2.1, isPositive: true }
    },
    {
      title: "Pending Fees",
      value: "₹8,000",
      icon: CreditCard,
      description: "Due March 15",
      color: "warning" as const
    },
    {
      title: "Notifications",
      value: notifications.filter(n => !n.read).length,
      icon: Bell,
      description: "Unread messages",
      color: "primary" as const
    }
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check for mock user first (for demo purposes)
      const mockUser = localStorage.getItem('mockUser');
      if (mockUser) {
        const userData = JSON.parse(mockUser);
        setUser({ id: userData.id, email: userData.email });
        setProfile({ 
          full_name: userData.full_name, 
          role: userData.role,
          parent_of_student_id: childData.studentId
        });
        setLoading(false);
        return;
      }

      // Regular auth check
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

  const downloadReportCard = (report: any) => {
    toast({
      title: "Download Started",
      description: `Downloading report card for ${report.term}`,
    });
  };

  const downloadReceipt = (fee: any) => {
    toast({
      title: "Download Started",
      description: `Downloading receipt ${fee.receipt}`,
    });
  };

  const markNotificationRead = (notificationId: number) => {
    // Mark notification as read logic here
    toast({
      title: "Notification marked as read",
    });
  };

  const sidebarContent = (
    <div className="p-6 space-y-6">
      <div className="text-center pb-4 border-b">
        <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
          <Users className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-bold text-lg">{profile?.full_name || 'Parent'}</h3>
        <p className="text-sm text-muted-foreground">Parent of {childData.name}</p>
        <p className="text-xs text-muted-foreground">{childData.class} - {childData.section}</p>
      </div>
      
      <div className="space-y-4">
        <Button variant="ghost" className="w-full justify-start">
          <TrendingUp className="h-4 w-4 mr-3" />
          Academic Progress
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Clock className="h-4 w-4 mr-3" />
          Attendance Records
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <CreditCard className="h-4 w-4 mr-3" />
          Fee Management
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <FileText className="h-4 w-4 mr-3" />
          Report Cards
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Bell className="h-4 w-4 mr-3" />
          Notifications
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <MessageCircle className="h-4 w-4 mr-3" />
          Communication
        </Button>
      </div>
      
      <div className="pt-4 border-t">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>+91-98765-43210</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
          <Mail className="h-4 w-4" />
          <span>parent@acharya.gov.in</span>
        </div>
      </div>
    </div>
  );

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
    <DashboardLayout
      title="Parent Portal"
      user={user}
      profile={profile}
      sidebarContent={sidebarContent}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {profile?.full_name?.split(' ')[0] || 'Parent'}!
          </h2>
          <p className="text-muted-foreground text-lg">Monitor {childData.name}'s academic journey</p>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStats stats={dashboardStats} />
        </div>

        {/* Child Information Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Student Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6 mb-4">
              <div className="h-20 w-20 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{childData.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{childData.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
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
                  <div>
                    <p className="text-sm text-muted-foreground">Academic Year</p>
                    <p className="font-medium">2024-25</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Academic Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Recent Performance</span>
              </CardTitle>
              <CardDescription>Latest exam results and grades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMarks.slice(0, 4).map((mark, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-card rounded-lg border">
                  <div>
                    <p className="font-medium">{mark.subject}</p>
                    <p className="text-sm text-muted-foreground">{mark.exam} • {mark.date}</p>
                  </div>
                  <div className="text-right flex items-center space-x-3">
                    <div>
                      <p className="text-lg font-bold text-primary">
                        {mark.marks}/{mark.totalMarks}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((mark.marks / mark.totalMarks) * 100)}%
                      </p>
                    </div>
                    <Badge variant="outline">{mark.grade}</Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Detailed Report
              </Button>
            </CardContent>
          </Card>

          {/* Attendance Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Attendance Analytics</span>
              </CardTitle>
              <CardDescription>Monthly attendance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{attendanceData.percentage}%</p>
                  <p className="text-sm text-muted-foreground">Overall Attendance</p>
                </div>
                
                <Progress value={attendanceData.percentage} className="h-3" />
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-success/10 rounded-lg">
                    <p className="text-lg font-bold text-success">{attendanceData.present}</p>
                    <p className="text-xs text-muted-foreground">Present Days</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-lg font-bold">{attendanceData.total - attendanceData.present}</p>
                    <p className="text-xs text-muted-foreground">Absent Days</p>
                  </div>
                </div>
                
                {attendanceData.percentage >= 85 ? (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <p className="text-sm text-success font-medium">✅ Excellent Attendance</p>
                    <p className="text-xs text-muted-foreground">Keep up the good work!</p>
                  </div>
                ) : (
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-sm text-warning font-medium">⚠️ Attendance needs attention</p>
                    <p className="text-xs text-muted-foreground">Please ensure regular attendance.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Fee Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Fee Management</span>
              </CardTitle>
              <CardDescription>Payment history and dues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {feeHistory.map((fee, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{fee.month}</p>
                    <p className="text-sm text-muted-foreground">Due: {fee.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{fee.amount.toLocaleString()}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={fee.status === 'Paid' ? 'default' : 'destructive'}>
                        {fee.status}
                      </Badge>
                      {fee.receipt && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadReceipt(fee)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Pending Dues
              </Button>
            </CardContent>
          </Card>

          {/* Report Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Report Cards</span>
              </CardTitle>
              <CardDescription>Academic reports and certificates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportCards.map((report, index) => (
                <div key={index} className="p-4 bg-gradient-card rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{report.term}</p>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                    <Badge variant="outline">{report.grade}</Badge>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Percentage</span>
                      <span className="font-medium">{report.percentage}%</span>
                    </div>
                    <Progress value={report.percentage} className="h-2" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => downloadReportCard(report)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>Recent updates and announcements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.slice(0, 4).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    !notification.read ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'
                  }`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div className="flex items-start space-x-2">
                    {notification.type === 'exam' && <FileText className="h-4 w-4 mt-0.5 text-primary" />}
                    {notification.type === 'fee' && <CreditCard className="h-4 w-4 mt-0.5 text-warning" />}
                    {notification.type === 'event' && <Calendar className="h-4 w-4 mt-0.5 text-success" />}
                    {notification.type === 'announcement' && <Bell className="h-4 w-4 mt-0.5 text-info" />}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                View All Notifications
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Events</span>
            </CardTitle>
            <CardDescription>Important dates and school events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-4 bg-gradient-card rounded-lg border text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    {event.type === 'exam' && <FileText className="h-6 w-6 text-primary" />}
                    {event.type === 'meeting' && <Users className="h-6 w-6 text-primary" />}
                    {event.type === 'event' && <Calendar className="h-6 w-6 text-primary" />}
                    {event.type === 'holiday' && <Bell className="h-6 w-6 text-primary" />}
                  </div>
                  <h4 className="font-medium mb-1">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EnhancedParentDashboard;