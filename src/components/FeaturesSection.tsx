import { Card, CardContent } from "@/components/ui/card";
import { 
  UserCheck, 
  GraduationCap, 
  Users, 
  Shield, 
  BarChart3, 
  CreditCard,
  FileText,
  Building,
  Bell
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: UserCheck,
      title: "Student Portal",
      description: "Access attendance, marks, timetable, course materials, and fee status in one place.",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      icon: Users,
      title: "Parent Dashboard",
      description: "Monitor your child's progress, view attendance, download report cards, and track fees.",
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      icon: GraduationCap,
      title: "Faculty Management",
      description: "Enter marks, update attendance, upload course materials, and approve student leave.",
      color: "text-info",
      bg: "bg-info/10"
    },
    {
      icon: Building,
      title: "Hostel Management",
      description: "Streamlined hostel operations with leave approvals and occupancy tracking.",
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics for administrators with detailed insights and reports.",
      color: "text-success",
      bg: "bg-success/10"
    },
    {
      icon: CreditCard,
      title: "Payment Integration",
      description: "Secure fee payments through Razorpay with automatic receipt generation.",
      color: "text-warning",
      bg: "bg-warning/10"
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "JWT-based authentication with role-based access control and audit logs.",
      color: "text-destructive",
      bg: "bg-destructive/10"
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Secure file uploads, document verification, and digital certificate storage.",
      color: "text-muted-foreground",
      bg: "bg-muted/20"
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Real-time notifications for important updates, announcements, and deadlines.",
      color: "text-primary",
      bg: "bg-primary/10"
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive School Management
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to run a modern educational institution, from student management 
            to administrative operations, all in one integrated platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-lg ${feature.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-primary text-primary-foreground font-medium shadow-primary-glow">
            🚀 Ready to transform your school's digital infrastructure?
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;