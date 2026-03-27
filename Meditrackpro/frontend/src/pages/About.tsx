
import React from "react";
import {
  Users,
  Award,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle,
  GraduationCap,
  Calendar
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer-index";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TeamMember = ({ 
  name, 
  role, 
  bio, 
  imagePlaceholder 
}: { 
  name: string; 
  role: string; 
  bio: string;
  imagePlaceholder: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="mb-4 aspect-square rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
        <span className="text-4xl font-bold text-slate-400">{imagePlaceholder}</span>
      </div>
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-primary font-medium mb-3">{role}</p>
      <p className="text-muted-foreground text-sm">{bio}</p>
    </CardContent>
  </Card>
);

const About = () => {
  return (
    <PageContainer
      title="About Us"
      subtitle="Learn more about MediTrack Pro and our mission"
      hideSidebar={true}
    >
      <div className="container mx-auto py-8">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Our Mission: Transforming Healthcare Management in India
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Founded in 2025, MediTrack Pro was created to address the unique inventory 
              and device management challenges faced by Indian healthcare providers.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              With a deep understanding of the Indian healthcare ecosystem, we've built 
              a solution that combines cutting-edge technology with practical insights 
              from doctors, hospital administrators, and regulatory experts.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                <span className="text-3xl font-bold text-primary">00+</span>
                <span className="text-sm text-center">Healthcare Facilities</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                <span className="text-3xl font-bold text-primary">22</span>
                <span className="text-sm text-center">States Across India</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                <span className="text-3xl font-bold text-primary">%</span>
                <span className="text-sm text-center">Customer Satisfaction</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
                <span className="text-3xl font-bold text-primary">0Cr+</span>
                <span className="text-sm text-center">Inventory Managed</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-8">
            <div className="aspect-video rounded-md bg-white dark:bg-slate-700 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Company Video</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 p-3 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quality</h3>
                <p className="text-muted-foreground">
                  We are committed to delivering the highest quality software and services that exceed industry standards.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 p-3 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Collaboration</h3>
                <p className="text-muted-foreground">
                  We believe in working closely with healthcare providers to develop solutions that truly solve their problems.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 p-3 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously innovate to address the evolving challenges of healthcare management in India.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-16" />

        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Leadership Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <TeamMember
              name="Yogesh M"
              role="Founder & CEO"
              bio="Founded MediTrack Pro to solve inventory challenges he experienced firsthand."
              imagePlaceholder="RK"
            />
            <TeamMember
              name="Nikunj V"
              role="Chief Technology Officer"
              bio="Passionate about healthcare technology."
              imagePlaceholder="PS"
            />
            <TeamMember
              name="Adarash P"
              role="Chief BioMedical Officer"
              bio="expertise in hospital administration. Ensures MediTrack Pro meets real clinical needs."
              imagePlaceholder="AP"
            />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-8 mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Journey</h2>
            <div className="space-y-8">
              <div className="flex">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">2025: Foundation</h3>
                  <p className="text-muted-foreground">
                    MediTrack Pro was founded in Bangalore by Yogesh M after experiencing inventory challenges in the hospital.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">2025: First Customers</h3>
                  <p className="text-muted-foreground">
                    Launched our beta with 5 hospitals in Karnataka. Refined our product based on real-world feedback.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">2027: National Expansion</h3>
                  <p className="text-muted-foreground">
                    Expanded to 10 states with 200+ healthcare facilities. Recognized as "Healthcare Tech Startup of the Year."
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Today</h3>
                  <p className="text-muted-foreground">
                    Supporting 800+ healthcare facilities across 22 states in India, with plans to expand internationally to neighboring countries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="locations" className="w-full mb-16">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="locations">Our Offices</TabsTrigger>
              <TabsTrigger value="partners">Partners & Certifications</TabsTrigger>
              <TabsTrigger value="careers">Careers</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="locations">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <MapPin className="h-5 w-5 text-primary mb-2" />
                    <h3 className="text-xl font-bold">Bangalore (HQ)</h3>
                    <p className="text-muted-foreground">
                      123 Tech Park, Whitefield<br />
                      Bangalore, Karnataka 560066
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center mb-2">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>+91 80 1234 5678</span>
                    </p>
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>bangalore@meditrackpro.com</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <MapPin className="h-5 w-5 text-primary mb-2" />
                    <h3 className="text-xl font-bold">Mumbai</h3>
                    <p className="text-muted-foreground">
                      456 Business Tower, Andheri East<br />
                      Mumbai, Maharashtra 400069
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center mb-2">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>+91 22 9876 5432</span>
                    </p>
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>mumbai@meditrackpro.com</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <MapPin className="h-5 w-5 text-primary mb-2" />
                    <h3 className="text-xl font-bold">Delhi NCR</h3>
                    <p className="text-muted-foreground">
                      789 Corporate Park, Gurugram<br />
                      Haryana 122001
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center mb-2">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>+91 11 2468 1357</span>
                    </p>
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>delhi@meditrackpro.com</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="partners">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-border flex items-center justify-center h-24">
                <div className="text-center">
                  <span className="font-bold text-lg">NABH</span>
                  <p className="text-xs text-muted-foreground">Certified Partner</p>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-border flex items-center justify-center h-24">
                <div className="text-center">
                  <span className="font-bold text-lg">ISO 27001</span>
                  <p className="text-xs text-muted-foreground">Certified</p>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-border flex items-center justify-center h-24">
                <div className="text-center">
                  <span className="font-bold text-lg">NASSCOM</span>
                  <p className="text-xs text-muted-foreground">Member</p>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-border flex items-center justify-center h-24">
                <div className="text-center">
                  <span className="font-bold text-lg">HIPAA</span>
                  <p className="text-xs text-muted-foreground">Compliant</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="careers">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-2">Join Our Team</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're always looking for talented individuals passionate about healthcare and technology. 
                Explore opportunities to make a real difference in Indian healthcare.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-bold mb-1">Senior Full Stack Developer</h4>
                  <p className="text-sm text-primary mb-2">Bangalore • Full-time</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join our engineering team to build and enhance our core platform. 
                    Experience with React, Node.js, and healthcare systems preferred.
                  </p>
                  <Button variant="outline" size="sm">Apply Now</Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-bold mb-1">Healthcare Solutions Consultant</h4>
                  <p className="text-sm text-primary mb-2">Multiple Locations • Full-time</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Work with healthcare facilities to implement MediTrack Pro. 
                    Background in healthcare administration or medical device industry required.
                  </p>
                  <Button variant="outline" size="sm">Apply Now</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="icon" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default About;
