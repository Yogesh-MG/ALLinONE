
import React from "react";
import { Book, ChevronDown, ExternalLink, FileQuestion, Globe, Headphones, HelpCircle, Info, Mail, MessageSquare, Phone, Video } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer-demo";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Supportdemo = () => {
  const faqs = [
    {
      question: "How do I add a new medical device to the inventory?",
      answer: "To add a new medical device, navigate to the Devices page, click the 'Add Device' button in the top right corner, and fill in the required information in the form. Be sure to include the device serial number, model, and calibration schedule if applicable."
    },
    {
      question: "How can I set up automated inventory alerts?",
      answer: "Go to the Inventory page, click on 'Settings' in the top right corner, then select 'Alerts & Notifications'. From there, you can configure thresholds for low stock alerts and select notification preferences (email, SMS, or in-app)."
    },
    {
      question: "How do I generate compliance reports?",
      answer: "Navigate to the Compliance page, select the standards you need to report on (FDA, ISO, etc.), choose your date range, and click 'Generate Report'. You can export the report in PDF, Excel, or CSV format."
    },
    {
      question: "Can I track maintenance history for specific devices?",
      answer: "Yes, on the Devices page, click on any device to view its details. The 'Maintenance History' tab shows all past maintenance and calibration records. You can also add new maintenance entries or schedule future maintenance from this screen."
    },
    {
      question: "How do I connect our suppliers to the system?",
      answer: "Go to the Suppliers page and click 'Add Supplier'. Enter their contact information and select 'Send Invitation' to allow them access to the portal. Once connected, you can set up automated orders and track deliveries."
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
            <p className="text-muted-foreground">
              Get help with MediTrack features and functionality
            </p>
          </div>
          <Button className="flex gap-2">
            <Headphones size={16} />
            Contact Support
          </Button>
        </div>

        <div className="relative">
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-background rounded-lg p-6 md:p-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">How can we help you today?</h2>
              <p className="text-muted-foreground mb-6">
                Search our knowledge base or browse commonly asked questions
              </p>
              <div className="relative">
                <HelpCircle className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  className="pl-11 h-12 text-base w-full max-w-xl mx-auto"
                  placeholder="Search for help with inventory, devices, billing..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard 
            title="Documentation" 
            description="User guides and manuals"
            className="hover:shadow-md transition-shadow"
            footer={
              <Button variant="outline" className="w-full flex gap-2 items-center">
                <Book size={16} />
                View Documentation
              </Button>
            }
          >
            <div className="flex justify-center py-4">
              <FileQuestion size={48} className="text-primary/70" />
            </div>
            <p className="text-sm text-center">
              Comprehensive guides and tutorials for all MediTrack features
            </p>
          </DashboardCard>
          
          <DashboardCard 
            title="Video Tutorials" 
            description="Step-by-step walkthroughs"
            className="hover:shadow-md transition-shadow"
            footer={
              <Button variant="outline" className="w-full flex gap-2 items-center">
                <Video size={16} />
                Watch Tutorials
              </Button>
            }
          >
            <div className="flex justify-center py-4">
              <Video size={48} className="text-primary/70" />
            </div>
            <p className="text-sm text-center">
              Visual guides to help you learn MediTrack's features quickly
            </p>
          </DashboardCard>
          
          <DashboardCard 
            title="Community Forum" 
            description="Connect with other users"
            className="hover:shadow-md transition-shadow"
            footer={
              <Button variant="outline" className="w-full flex gap-2 items-center">
                <MessageSquare size={16} />
                Join Discussion
              </Button>
            }
          >
            <div className="flex justify-center py-4">
              <Globe size={48} className="text-primary/70" />
            </div>
            <p className="text-sm text-center">
              Ask questions and share best practices with other healthcare professionals
            </p>
          </DashboardCard>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Common questions and answers about using MediTrack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
          <CardFooter className="flex-col items-start">
            <h3 className="font-medium mb-2">Still need help?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <Button variant="outline" className="w-full flex gap-2 items-center justify-center">
                <Mail size={16} />
                Email Support
              </Button>
              <Button variant="outline" className="w-full flex gap-2 items-center justify-center">
                <Phone size={16} />
                Call Us
              </Button>
              <Button variant="outline" className="w-full flex gap-2 items-center justify-center">
                <MessageSquare size={16} />
                Live Chat
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support Team</CardTitle>
            <CardDescription>
              Get personalized help from our support specialists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="Your email address" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="What can we help you with?" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea 
                    id="message" 
                    className="min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="Describe your issue in detail..."
                  />
                </div>
                <Button className="w-full">Send Message</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Supportdemo;