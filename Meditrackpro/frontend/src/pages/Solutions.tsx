import React from "react";
import {
  Building,
  Stethoscope,
  Users,
  BadgeCheck,
  Ambulance,
  Pill,
  Heart,
  Brain,
  Eye,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer-index";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const SolutionCard = ({ 
  icon, 
  title, 
  description, 
  features 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  features: string[];
}) => (
  <Card className="h-full flex flex-col">
    <CardContent className="pt-6 flex-1">
      <div className="mb-5 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter className="pt-0 pb-6">
      <Button variant="outline" className="w-full" asChild>
        <a href="/pricing">
          Learn More <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </CardFooter>
  </Card>
);

const Solutions = () => {
  return (
    <PageContainer
      title="Solutions"
      subtitle="Tailored solutions for different healthcare facilities"
      hideSidebar={true}
    >
      <div className="container mx-auto py-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Industry-Specific Healthcare Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            MediTrack Pro offers specialized solutions to address the unique challenges 
            faced by different types of healthcare facilities across India.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <SolutionCard
            icon={<Building className="h-6 w-6 text-primary" />}
            title="For Hospitals"
            description="Comprehensive inventory and device management for multi-department hospitals."
            features={[
              "Multi-department inventory management",
              "Cross-facility asset tracking",
              "Staff access control and permissions",
              "NABH/JCI compliance support"
            ]}
          />
          
          <SolutionCard
            icon={<Stethoscope className="h-6 w-6 text-primary" />}
            title="For Clinics"
            description="Streamlined solutions for smaller healthcare providers and specialist clinics."
            features={[
              "Simplified inventory management",
              "Basic device tracking",
              "Appointment-based usage tracking",
              "Affordable pricing options"
            ]}
          />
          
          <SolutionCard
            icon={<Users className="h-6 w-6 text-primary" />}
            title="For Diagnostic Centers"
            description="Specialized tools for diagnostic equipment management and maintenance."
            features={[
              "Advanced diagnostic device tracking",
              "Calibration scheduling and alerts",
              "Quality control documentation",
              "Patient testing records"
            ]}
          />
          
          <SolutionCard
            icon={<BadgeCheck className="h-6 w-6 text-primary" />}
            title="For Research Institutes"
            description="Tools for managing research equipment, supplies, and compliance."
            features={[
              "Research equipment inventory",
              "Sample and reagent tracking",
              "Compliance with research protocols",
              "Grant allocation tracking"
            ]}
          />
          
          <SolutionCard
            icon={<Ambulance className="h-6 w-6 text-primary" />}
            title="For Emergency Services"
            description="Mobile-optimized solutions for emergency medical services and ambulance fleets."
            features={[
              "Mobile inventory management",
              "Emergency kit tracking",
              "Real-time stock level monitoring",
              "Rapid reordering workflows"
            ]}
          />
          
          <SolutionCard
            icon={<Pill className="h-6 w-6 text-primary" />}
            title="For Pharmacies"
            description="Medication and pharmaceutical supply management solutions."
            features={[
              "Medication inventory tracking",
              "Expiry date monitoring",
              "Temperature-sensitive storage tracking",
              "Prescription fulfillment management"
            ]}
          />
        </div>

        <Separator className="my-16" />

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Specialty Solutions</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cardiology</h3>
                <p className="text-muted-foreground">
                  Specialized inventory and device management for cardiac care units.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Cardiac device inventory</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Cath lab management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Neurology</h3>
                <p className="text-muted-foreground">
                  Tools for managing neurological equipment and diagnostic devices.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Neuro-diagnostic equipment tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Specialized device maintenance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ophthalmology</h3>
                <p className="text-muted-foreground">
                  Management solutions for ophthalmic equipment and supplies.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Optical inventory management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm">Precision equipment calibration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Customized Solutions</h3>
            <p className="text-lg mb-6">
              Need a solution tailored specifically to your healthcare facility's unique requirements?
              Our team can develop customized implementations of MediTrack Pro to address your specific challenges.
            </p>
            <Button size="lg">Contact Our Solutions Team</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Success Stories</h3>
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="italic mb-4">
                  "MediTrack Pro has transformed how we manage our inventory across our 
                  network of 12 hospitals. We've reduced waste by 32% and improved compliance 
                  scores significantly."
                </p>
                <p className="font-semibold">
                  Dr. Sharma, Medical Director - Apollo Hospitals, Delhi
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="italic mb-4">
                  "As a small clinic with limited staff, MediTrack Pro's automated reordering and 
                  compliance tracking has saved us countless hours of manual work."
                </p>
                <p className="font-semibold">
                  Dr. Patel, Owner - Family Care Clinic, Mumbai
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 border border-primary/20 rounded-lg">
              <h4 className="text-xl font-semibold mb-2">Implementation Process</h4>
              <ol className="space-y-3 list-decimal list-inside">
                <li>Initial consultation and needs assessment</li>
                <li>System configuration and customization</li>
                <li>Data migration from existing systems</li>
                <li>Staff training and onboarding</li>
                <li>Ongoing support and optimization</li>
              </ol>
            </div>
            <div className="p-6 border border-primary/20 rounded-lg">
              <h4 className="text-xl font-semibold mb-2">Guaranteed Results</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Reduce inventory waste by at least 20%</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Improve compliance scores by 15% or more</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Save 10+ hours per week in administrative work</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Solutions;
