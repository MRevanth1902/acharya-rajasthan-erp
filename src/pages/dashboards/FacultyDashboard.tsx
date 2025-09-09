import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Users, 
  FileText, 
  Upload,
  LogOut,
  CheckSquare,
  BookOpen,
  Calendar,
  ClipboardList
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FacultyDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample data
  const myClasses = [
    { class: "Class 10", section: "A", subject: "Mathematics", students: 45 },
    { class: "Class 9", section: "B", subject: "Mathematics", students: 42 },
    { class: "Class 8", section: "A", subject: "Mathematics", students: 38 }
  ];

  const todaySchedule = [
    { period: 1, class: "10-A", subject: "Mathematics", time: "09:00 - 09:45" },
    { period: 3, class: "9-B", subject: "Mathematics", time: "10:45 - 11:30" },
    { period: 5, class: "8-A", subject: "Mathematics", time: "12:15 - 01:00" }
  ];

  const pendingTasks = [
    { task: "Grade Class 10-A Mid-term papers", deadline: "2024-02-20", priority: "high" },
    { task: "Upload study materials for Class 9-B", deadline: "2024-02-18", priority: "medium" },
    { task: "Approve leave requests", deadline: "2024-02-16", priority: "low" }
  ];

  const leaveRequests = [
    { student: "Priya Sharma", class: "10-A", reason: "Medical", dates: "Feb 15-16", status: "pending" },
    { student: "Rahul Singh", class: "9-B", reason: "Family function", dates: "Feb 18", status: "pending" }
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

  const approveLeave = (student: string) => {
    toast({
      title: "Leave Approved",
      description: `Leave request for ${student} has been approved.`,
    });
  };

  const rejectLeave = (student: string) => {
    toast({
      title: "Leave Rejected",
      description: `Leave request for ${student} has been rejected.`,
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
              <GraduationCap className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Faculty Portal</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{profile?.full_name || user?.email}</p>
              <p className="text-sm text-muted-foreground">{profile?.department || 'Faculty'}</p>
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
            Welcome, {profile?.full_name?.split(' ')[0] || 'Professor'}!
          </h2>
          <p className="text-muted-foreground">Manage your classes and students</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">125</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{myClasses.length}</p>
                  <p className="text-sm text-muted-foreground">Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ClipboardList className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{pendingTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{leaveRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Leave Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today's Schedule</span>
              </CardTitle>
              <CardDescription>Your classes for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaySchedule.map((period, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{period.subject}</p>
                    <p className="text-sm text-muted-foreground">Class {period.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{period.time}</p>
                    <Badge variant="outline">Period {period.period}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* My Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>My Classes</span>
              </CardTitle>
              <CardDescription>Classes you teach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myClasses.map((cls, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{cls.class} - {cls.section}</p>
                    <p className="text-sm text-muted-foreground">{cls.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{cls.students} students</p>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5" />
                <span>Pending Tasks</span>
              </CardTitle>
              <CardDescription>Tasks requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{task.task}</p>
                    <p className="text-sm text-muted-foreground">Due: {task.deadline}</p>
                  </div>
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' : 
                    task.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leave Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5" />
                <span>Leave Requests</span>
              </CardTitle>
              <CardDescription>Student leave requests for approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaveRequests.map((request, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{request.student}</p>
                      <p className="text-sm text-muted-foreground">{request.class}</p>
                    </div>
                    <Badge variant="secondary">{request.status}</Badge>
                  </div>
                  <p className="text-sm mb-2">{request.reason}</p>
                  <p className="text-sm text-muted-foreground mb-3">Dates: {request.dates}</p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => approveLeave(request.student)}
                      className="flex-1"
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => rejectLeave(request.student)}
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Mark Attendance</span>
              </CardTitle>
              <CardDescription>Record student attendance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="attendance-class">Select Class</Label>
                <Input id="attendance-class" placeholder="e.g., 10-A" />
              </div>
              <div>
                <Label htmlFor="attendance-subject">Subject</Label>
                <Input id="attendance-subject" placeholder="e.g., Mathematics" />
              </div>
              <Button className="w-full">
                <CheckSquare className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Materials</span>
              </CardTitle>
              <CardDescription>Share study materials with students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="material-title">Material Title</Label>
                <Input id="material-title" placeholder="e.g., Chapter 5 Notes" />
              </div>
              <div>
                <Label htmlFor="material-description">Description</Label>
                <Textarea id="material-description" placeholder="Brief description of the material" />
              </div>
              <Button className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;