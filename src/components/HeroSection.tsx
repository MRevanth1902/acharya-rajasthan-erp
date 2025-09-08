import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Award, Shield } from "lucide-react";
import heroImage from "@/assets/acharya-hero.jpg";
const HeroSection = () => {
  return <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Acharya Education Portal - Modern school building" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-secondary/40" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary-foreground mb-6">
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Government of Rajasthan</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-foreground mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-primary">Acharya</span>
              <br />
              Education Portal
            </h1>
            
            <p className="text-lg md:text-xl text-secondary-foreground/80 mb-8 leading-relaxed max-w-2xl">
              Empowering education through digital transformation. A comprehensive ERP system 
              designed for schools across Rajasthan, connecting students, parents, faculty, and 
              administrators in one unified platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary-glow">
                Access Student Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-secondary-foreground/20 text-secondary-foreground bg-slate-800 hover:bg-slate-700">
                Learn More
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-card-hover border border-border/20">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-2">50,000+</h3>
              <p className="text-muted-foreground">Active Students</p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-card-hover border border-border/20">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-accent/20">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-2">5,000+</h3>
              <p className="text-muted-foreground">Faculty Members</p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-card-hover border border-border/20">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-info/20">
                  <Award className="h-6 w-6 text-info" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-2">1,200+</h3>
              <p className="text-muted-foreground">Schools Connected</p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-card-hover border border-border/20">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-success/20">
                  <Shield className="h-6 w-6 text-success" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-2">99.9%</h3>
              <p className="text-muted-foreground">System Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
    </section>;
};
export default HeroSection;