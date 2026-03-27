
import React from "react";
import {
  ShieldCheck,
  Stethoscope,
  BarChart3,
  Package,
  Truck,
  FileText,
  Bell,
  Wifi,
  Globe,
  Clock,
  Users,
  CheckCircle
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer-index";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <Card className="border-border hover:border-primary transition-colors duration-300">
    <CardContent className="p-6">
      <div className="mb-4 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Features = () => {
  return (
    <PageContainer
      title="Features"
      subtitle="Discover the powerful features of MediTrack Pro"
      hideSidebar={true}
    >
      <div className="container mx-auto py-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Comprehensive Healthcare Management System
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            MediTrack Pro is designed specifically for the Indian healthcare ecosystem, 
            providing everything you need to run your hospital or clinic efficiently.
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-16">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="all">All Features</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Package className="h-6 w-6 text-primary" />}
                title="Inventory Management"
                description="Track medicines, supplies, and equipment with real-time updates and automated reordering."
              />
              <FeatureCard
                icon={<Stethoscope className="h-6 w-6 text-primary" />}
                title="Device Management"
                description="Monitor medical devices, track maintenance schedules, and ensure optimal performance."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6 text-primary" />}
                title="Compliance Tracking"
                description="Stay compliant with healthcare regulations and maintain complete audit trails."
              />
              <FeatureCard
                icon={<BarChart3 className="h-6 w-6 text-primary" />}
                title="Advanced Analytics"
                description="Make data-driven decisions with comprehensive analytics and reporting tools."
              />
              <FeatureCard
                icon={<Truck className="h-6 w-6 text-primary" />}
                title="Supplier Management"
                description="Manage vendor relationships, track orders, and optimize procurement processes."
              />
              <FeatureCard
                icon={<FileText className="h-6 w-6 text-primary" />}
                title="Customizable Reports"
                description="Generate tailored reports for different departments and stakeholders."
              />
              <FeatureCard
                icon={<Bell className="h-6 w-6 text-primary" />}
                title="Alerts & Notifications"
                description="Receive timely alerts for low stock, maintenance needs, and compliance issues."
              />
              <FeatureCard
                icon={<Wifi className="h-6 w-6 text-primary" />}
                title="Mobile Access"
                description="Access your system from anywhere using our responsive mobile interface."
              />
              <FeatureCard
                icon={<Users className="h-6 w-6 text-primary" />}
                title="Patient Management"
                description="Track patient interactions and device usage for better care coordination."
              />
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Package className="h-6 w-6 text-primary" />}
                title="Real-time Tracking"
                description="Monitor inventory levels across multiple locations in real-time."
              />
              <FeatureCard
                icon={<Bell className="h-6 w-6 text-primary" />}
                title="Automatic Reordering"
                description="Set reorder points and get automatic notifications when stock is low."
              />
              <FeatureCard
                icon={<Clock className="h-6 w-6 text-primary" />}
                title="Expiry Tracking"
                description="Track expiration dates and receive alerts before items expire."
              />
            </div>
          </TabsContent>

          <TabsContent value="devices">
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Stethoscope className="h-6 w-6 text-primary" />}
                title="Equipment Registry"
                description="Maintain a comprehensive registry of all medical devices with detailed information."
              />
              <FeatureCard
                icon={<CheckCircle className="h-6 w-6 text-primary" />}
                title="Maintenance Scheduling"
                description="Schedule regular maintenance and calibration to ensure optimal performance."
              />
              <FeatureCard
                icon={<FileText className="h-6 w-6 text-primary" />}
                title="Documentation Library"
                description="Store and access device manuals, service records, and warranty information."
              />
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6 text-primary" />}
                title="Regulatory Compliance"
                description="Stay compliant with NABH, JCI, and other healthcare regulatory requirements."
              />
              <FeatureCard
                icon={<Clock className="h-6 w-6 text-primary" />}
                title="Audit Trail"
                description="Maintain detailed logs of all activities for transparent auditing."
              />
              <FeatureCard
                icon={<FileText className="h-6 w-6 text-primary" />}
                title="Compliance Reports"
                description="Generate comprehensive reports for regulatory inspections and internal reviews."
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<BarChart3 className="h-6 w-6 text-primary" />}
                title="Custom Dashboards"
                description="Create personalized dashboards with the metrics that matter most to you."
              />
              <FeatureCard
                icon={<Globe className="h-6 w-6 text-primary" />}
                title="Trend Analysis"
                description="Identify patterns and trends to optimize inventory and resource allocation."
              />
              <FeatureCard
                icon={<FileText className="h-6 w-6 text-primary" />}
                title="Export Capabilities"
                description="Export data in multiple formats for further analysis or presentation."
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-medical-50/50 dark:bg-slate-800/50 rounded-lg p-8 my-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Built for Indian Healthcare</h3>
                <p className="text-muted-foreground mb-6">
                  MediTrack Pro is specifically designed to address the unique challenges 
                  faced by Indian healthcare providers, with features tailored to local regulations, 
                  workflows, and practices.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Compliance with Indian healthcare regulations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Support for multiple languages including Hindi</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Integration with local payment systems</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Offline capabilities for areas with unreliable internet</span>
                  </li>
                </ul>
                <a href="https://wa.me/+918431204137"><Button className="mt-6">Schedule a Demo</Button> </a>
                <a href="/login"> <Button className="mt-6">home</Button> </a>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                <div className="aspect-video rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Product Demo Video</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Features;
