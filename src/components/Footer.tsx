import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-government text-secondary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Branding */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Acharya</h3>
                <p className="text-xs text-secondary-foreground/80">Government of Rajasthan</p>
              </div>
            </div>
            <p className="text-sm text-secondary-foreground/80 leading-relaxed">
              Empowering education through digital transformation for a better tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">About Us</Link></li>
              <li><Link to="/faculty" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">Faculty</Link></li>
              <li><Link to="/gallery" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">Gallery</Link></li>
              <li><Link to="/notices" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">Notices</Link></li>
            </ul>
          </div>

          {/* Student Portal */}
          <div>
            <h4 className="font-semibold mb-4">Student Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">Student Portal</Link></li>
              <li><Link to="/login" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">Parent Portal</Link></li>
              <li><Link to="/admissions" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">Admissions</Link></li>
              <li><Link to="/fees" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">Fee Payment</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-secondary-foreground/80">info@acharya.raj.gov.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-secondary-foreground/80">+91-141-2234567</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-secondary-foreground/80">Education Directorate, Jaipur, Rajasthan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-6 text-center">
          <p className="text-sm text-secondary-foreground/60">
            © 2024 Acharya Education Portal, Government of Rajasthan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;