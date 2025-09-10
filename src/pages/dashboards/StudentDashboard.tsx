import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardStats from "@/components/DashboardStats";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  CreditCard, 
  Home as HomeIcon, 
  FileText,
  Clock,
  Download,
  Send,
  GraduationCap,
  Award,
  Users,
  MapPin
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
    { subject: "Mathematics", marks: 92, totalMarks: 100, exam: "Mid-term", grade: "A+" },
    { subject: "Science", marks: 88, totalMarks: 100, exam: "Mid-term", grade: "A" },
    { subject: "English", marks: 94, totalMarks: 100, exam: "Unit Test", grade: "A+" },
    { subject: "Hindi", marks: 87, totalMarks: 100, exam: "Unit Test", grade: "A" },
    { subject: "Social Studies", marks: 91, totalMarks: 100, exam: "Mid-term", grade: "A+" },
    { subject: "Computer Science", marks: 96, totalMarks: 100, exam: "Unit Test", grade: "A+" }
  ];

  const todayTimetable = [
    { period: 1, subject: "Mathematics", teacher: "Mr. Sharma", time: "09:00 - 09:45", room: "101" },
    { period: 2, subject: "Science", teacher: "Ms. Verma", time: "09:45 - 10:30", room: "Lab-1" },
    { period: 3, subject: "English", teacher: "Mrs. Gupta", time: "10:45 - 11:30", room: "203" },
    { period: 4, subject: "Hindi", teacher: "Mr. Singh", time: "11:30 - 12:15", room: "105" },
    { period: 5, subject: "Computer Science", teacher: "Mr. Patel", time: "01:00 - 01:45", room: "Lab-2" }
  ];

  const courseMaterials = [
    { subject: "Mathematics", title: "Chapter 5: Algebra", type: "PDF", uploadDate: "2024-01-15" },
    { subject: "Science", title: "Physics Lab Manual", type: "PDF", uploadDate: "2024-01-12" },
    { subject: "English", title: "Grammar Worksheets", type: "DOC", uploadDate: "2024-01-10" },
    { subject: "Computer Science", title: "Programming Basics", type: "PDF", uploadDate: "2024-01-08" }
  ];

  const feeStatus = {
    totalFees: 25000,
    paidAmount: 20000,
    pendingAmount: 5000,
    dueDate: "2024-03-15",
    installments: [
      { name: "Admission Fee", amount: 5000, status: "Paid", date: "2024-01-05" },
      { name: "Tuition Fee Q1", amount: 7500, status: "Paid", date: "2024-01-15" },
      { name: "Tuition Fee Q2", amount: 7500, status: "Paid", date: "2024-02-15" },
      { name: "Tuition Fee Q3", amount: 5000, status: "Pending", date: "2024-03-15" }
    ]
  };

  const hostelInfo = {
    block: "A",
    room: "205",
    roommate: "Arjun Kumar",
    warden: "Mr. Rajesh Gupta",
    facilities: ["WiFi", "Laundry", "Mess", "Study Hall", "Recreation Room"]
  };

  const leaveRequests = [
    { id: 1, type: "Medical", from: "2024-02-20", to: "2024-02-22", status: "Approved", reason: "Fever" },
    { id: 2, type: "Personal", from: "2024-03-10", to: "2024-03-12", status: "Pending", reason: "Family function" }
  ];

  const dashboardStats = [
    {
      title: "Attendance Rate",
      value: `${attendanceData.percentage}%`,
      icon: Clock,
      description: "This month",
      color: (attendanceData.percentage >= 75 ? "success" : "warning") as const,
      trend: { value: 2.1, isPositive: true }
    },
    {
      title: "Average Grade",
      value: "A",
      icon: Award,
      description: "Current semester",
      color: "primary" as const,
      trend: { value: 5.2, isPositive: true }
    },
    {
      title: "Pending Fees",
      value: `₹${feeStatus.pendingAmount.toLocaleString()}`,
      icon: CreditCard,
      description: "Due March 15",
      color: (feeStatus.pendingAmount > 0 ? "warning" : "success") as const
    },
    {
      title: "Hostel Room",
      value: `${hostelInfo.block}-${hostelInfo.room}`,
      icon: HomeIcon,
      description: "Block A, 2nd Floor",
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
          student_id: "STU2024001"
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

  const downloadMaterial = (material: any) => {
    toast({
      title: "Download Started",
      description: `Downloading ${material.title}`,
    });
  };

  const submitLeaveRequest = () => {
    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted for approval.",
    });
  };

  const sidebarContent = (
    <div className="p-6 space-y-6">
      <div className="text-center pb-4 border-b">
        <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-bold text-lg">{profile?.full_name || 'Student'}</h3>
        <p className="text-sm text-muted-foreground">Class 10-A • Roll: 25</p>
        <p className="text-xs text-muted-foreground">ID: {profile?.student_id || 'STU2024001'}</p>
      </div>
      
      <div className="space-y-4">
        <Button variant="ghost" className="w-full justify-start">
          <BookOpen className="h-4 w-4 mr-3" />
          Academic Records
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Calendar className="h-4 w-4 mr-3" />
          Timetable
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <FileText className="h-4 w-4 mr-3" />
          Course Materials
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <CreditCard className="h-4 w-4 mr-3" />
          Fees & Payments
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <HomeIcon className="h-4 w-4 mr-3" />
          Hostel Info
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Send className="h-4 w-4 mr-3" />
          Leave Requests
        </Button>
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
      title="Student Portal"
      user={user}
      profile={profile}
      sidebarContent={sidebarContent}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}!
          </h2>
          <p className="text-muted-foreground text-lg">Here's your academic overview for today</p>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStats stats={dashboardStats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Timetable */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today's Schedule</span>
              </CardTitle>
              <CardDescription>Your classes for today, {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayTimetable.map((period, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-card rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{period.period}</span>
                    </div>
                    <div>
                      <p className="font-medium">{period.subject}</p>
                      <p className="text-sm text-muted-foreground">{period.teacher}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{period.time}</p>
                    <p className="text-xs text-muted-foreground">Room {period.room}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Marks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Recent Performance</span>
              </CardTitle>
              <CardDescription>Your latest exam results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMarks.slice(0, 4).map((mark, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-card rounded-lg border">
                  <div>
                    <p className="font-medium">{mark.subject}</p>
                    <p className="text-sm text-muted-foreground">{mark.exam}</p>
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
                    <Badge variant="outline" className="ml-2">{mark.grade}</Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                View All Results
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Course Materials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Course Materials</span>
              </CardTitle>
              <CardDescription>Download study materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {courseMaterials.map((material, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{material.title}</p>
                    <p className="text-xs text-muted-foreground">{material.subject}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadMaterial(material)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                View All Materials
              </Button>
            </CardContent>
          </Card>

          {/* Fee Status */}
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
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-primary">₹{feeStatus.pendingAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Pending Amount</p>
                </div>
                
                <Progress 
                  value={(feeStatus.paidAmount / feeStatus.totalFees) * 100} 
                  className="h-2" 
                />
                
                <div className="flex justify-between text-sm">
                  <span>Paid: ₹{feeStatus.paidAmount.toLocaleString()}</span>
                  <span>Total: ₹{feeStatus.totalFees.toLocaleString()}</span>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Due Date: {feeStatus.dueDate}</p>
                  <Button className="w-full" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hostel Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HomeIcon className="h-5 w-5" />
                <span>Hostel Details</span>
              </CardTitle>
              <CardDescription>Your accommodation info</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-2xl font-bold text-primary">{hostelInfo.block}-{hostelInfo.room}</p>
                <p className="text-sm text-muted-foreground">Room Number</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Roommate</span>
                  <span className="text-sm font-medium">{hostelInfo.roommate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Warden</span>
                  <span className="text-sm font-medium">{hostelInfo.warden}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Facilities</p>
                <div className="flex flex-wrap gap-1">
                  {hostelInfo.facilities.map((facility, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button variant="outline" className="w-full" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Request Leave
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests & Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Leave Requests</span>
              </CardTitle>
              <CardDescription>Your recent leave applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaveRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{request.type} Leave</p>
                    <p className="text-sm text-muted-foreground">
                      {request.from} to {request.to}
                    </p>
                    <p className="text-xs text-muted-foreground">{request.reason}</p>
                  </div>
                  <Badge variant={request.status === 'Approved' ? 'default' : request.status === 'Pending' ? 'secondary' : 'destructive'}>
                    {request.status}
                  </Badge>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={submitLeaveRequest}
              >
                <Send className="h-4 w-4 mr-2" />
                New Leave Request
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Attendance Overview</span>
              </CardTitle>
              <CardDescription>Current academic year progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-primary">{attendanceData.percentage}%</p>
                  <p className="text-sm text-muted-foreground">Overall Attendance</p>
                </div>
                
                <Progress value={attendanceData.percentage} className="h-3" />
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-success">{attendanceData.present}</p>
                    <p className="text-xs text-muted-foreground">Present Days</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{attendanceData.total - attendanceData.present}</p>
                    <p className="text-xs text-muted-foreground">Absent Days</p>
                  </div>
                </div>
                
                {attendanceData.percentage < 75 && (
                  <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-sm text-warning font-medium">
                      ⚠️ Attendance below 75%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Please contact your class teacher if needed.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;