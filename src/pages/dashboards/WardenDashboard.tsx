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
  Home as HomeIcon, 
  Users, 
  AlertTriangle, 
  ClipboardList,
  LogOut,
  CheckSquare,
  XCircle,
  Building,
  UserCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WardenDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample data
  const hostelStats = {
    totalRooms: 120,
    occupiedRooms: 98,
    availableRooms: 22,
    totalStudents: 196,
    occupancyRate: 81.7
  };

  const pendingLeaveRequests = [
    { 
      id: 1,
      student: "Arjun Patel", 
      room: "A-204", 
      reason: "Home visit", 
      dates: "Feb 16-18", 
      requestDate: "2024-02-14",
      contact: "+91-98765-43210" 
    },
    { 
      id: 2,
      student: "Priya Singh", 
      room: "B-102", 
      reason: "Medical appointment", 
      dates: "Feb 17", 
      requestDate: "2024-02-15",
      contact: "+91-98765-43211" 
    },
    { 
      id: 3,
      student: "Rohit Kumar", 
      room: "A-315", 
      reason: "Family function", 
      dates: "Feb 20-22", 
      requestDate: "2024-02-14",
      contact: "+91-98765-43212" 
    }
  ];

  const recentComplaints = [
    { 
      id: 1,
      student: "Anita Sharma", 
      room: "B-205", 
      issue: "Water supply issue", 
      priority: "high",
      status: "pending",
      reportedDate: "2024-02-15" 
    },
    { 
      id: 2,
      student: "Vikram Raj", 
      room: "A-108", 
      issue: "Electricity problem", 
      priority: "medium",
      status: "in-progress",
      reportedDate: "2024-02-14" 
    },
    { 
      id: 3,
      student: "Deepak Singh", 
      room: "C-301", 
      issue: "Room cleaning request", 
      priority: "low",
      status: "pending",
      reportedDate: "2024-02-13" 
    }
  ];

  const roomOccupancy = [
    { block: "Block A", occupied: 38, total: 40, rate: 95 },
    { block: "Block B", occupied: 32, total: 40, rate: 80 },
    { block: "Block C", occupied: 28, total: 40, rate: 70 }
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

  const approveLeave = (studentName: string, id: number) => {
    toast({
      title: "Leave Approved",
      description: `Leave request for ${studentName} has been approved.`,
    });
  };

  const rejectLeave = (studentName: string, id: number) => {
    toast({
      title: "Leave Rejected",
      description: `Leave request for ${studentName} has been rejected.`,
    });
  };

  const resolveComplaint = (id: number, issue: string) => {
    toast({
      title: "Complaint Resolved",
      description: `${issue} has been marked as resolved.`,
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
              <HomeIcon className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Warden Portal</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{profile?.full_name || user?.email}</p>
              <p className="text-sm text-muted-foreground">Hostel Warden</p>
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
            Welcome, {profile?.full_name?.split(' ')[0] || 'Warden'}!
          </h2>
          <p className="text-muted-foreground">Manage hostel operations and student welfare</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{hostelStats.totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{hostelStats.occupiedRooms}</p>
                  <p className="text-sm text-muted-foreground">Occupied Rooms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ClipboardList className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{pendingLeaveRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Leave Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{recentComplaints.length}</p>
                  <p className="text-sm text-muted-foreground">Active Complaints</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Room Occupancy Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Room Occupancy Overview</span>
            </CardTitle>
            <CardDescription>Current occupancy status by blocks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roomOccupancy.map((block, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{block.block}</h4>
                    <Badge variant={block.rate >= 90 ? "destructive" : block.rate >= 80 ? "default" : "secondary"}>
                      {block.rate}%
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {block.occupied}/{block.total} rooms occupied
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${block.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Leave Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Pending Leave Requests</span>
              </CardTitle>
              <CardDescription>Student leave requests awaiting approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingLeaveRequests.map((request) => (
                <div key={request.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{request.student}</p>
                      <p className="text-sm text-muted-foreground">Room: {request.room}</p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
                    <p><strong>Reason:</strong> {request.reason}</p>
                    <p><strong>Dates:</strong> {request.dates}</p>
                    <p><strong>Contact:</strong> {request.contact}</p>
                    <p><strong>Requested:</strong> {request.requestDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => approveLeave(request.student, request.id)}
                      className="flex-1"
                    >
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => rejectLeave(request.student, request.id)}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Complaints Handling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Recent Complaints</span>
              </CardTitle>
              <CardDescription>Student complaints and maintenance issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div key={complaint.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{complaint.student}</p>
                      <p className="text-sm text-muted-foreground">Room: {complaint.room}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        complaint.priority === 'high' ? 'destructive' : 
                        complaint.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {complaint.priority}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{complaint.reportedDate}</p>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{complaint.issue}</p>
                  <Badge variant={
                    complaint.status === 'pending' ? 'secondary' : 
                    complaint.status === 'in-progress' ? 'default' : 'default'
                  } className="mb-3">
                    {complaint.status}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => resolveComplaint(complaint.id, complaint.issue)}
                      className="flex-1"
                    >
                      Mark Resolved
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                    >
                      Assign Staff
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
              <CardTitle>Room Allocation</CardTitle>
              <CardDescription>Allocate room to new student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="student-name">Student Name</Label>
                <Input id="student-name" placeholder="Enter student name" />
              </div>
              <div>
                <Label htmlFor="student-id">Student ID</Label>
                <Input id="student-id" placeholder="Enter student ID" />
              </div>
              <div>
                <Label htmlFor="room-preference">Block Preference</Label>
                <Input id="room-preference" placeholder="e.g., Block A" />
              </div>
              <Button className="w-full">
                <Building className="h-4 w-4 mr-2" />
                Allocate Room
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Issue</CardTitle>
              <CardDescription>Report maintenance or security issue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="issue-type">Issue Type</Label>
                <Input id="issue-type" placeholder="e.g., Electrical, Plumbing" />
              </div>
              <div>
                <Label htmlFor="issue-location">Location</Label>
                <Input id="issue-location" placeholder="e.g., Block A - Room 204" />
              </div>
              <div>
                <Label htmlFor="issue-description">Description</Label>
                <Textarea id="issue-description" placeholder="Describe the issue in detail" />
              </div>
              <Button className="w-full">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WardenDashboard;