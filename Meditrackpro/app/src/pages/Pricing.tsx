
import React from "react";
import { Check, Info } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer-index";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Pricing = () => {
  return (
    <PageContainer
      title="Pricing Plans"
      subtitle="Choose the right plan for your hospital's needs"
      hideSidebar={true}
    >
      <div className="container mx-auto py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Affordable Plans for Every Healthcare Facility
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Transparent pricing with no hidden fees, designed for the Indian healthcare market
          </p>
        </div>

        <Tabs defaultValue="monthly" className="w-full mb-8">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
              <TabsTrigger value="yearly">
                Yearly Billing
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                  Save 20%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="monthly">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <Card className="border-2 border-gray-200 dark:border-gray-800 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Basic</CardTitle>
                  <CardDescription>For small clinics</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">₹4,999</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-0">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Up to 10 staff members</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Inventory management</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Basic reporting</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Email support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch pt-6">
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                    No credit card required to start
                  </p>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className="border-2 border-primary relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium">
                  Most Popular
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Professional</CardTitle>
                  <CardDescription>For mid-sized hospitals</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">₹9,999</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-0">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Up to 50 staff members</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Advanced inventory management</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Device tracking & maintenance</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Compliance monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Priority support (24/7)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Analytics dashboard</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch pt-6">
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                    30-day free trial included
                  </p>
                </CardFooter>
              </Card>

              {/* Enterprise Plan */}
              <Card className="border-2 border-gray-200 dark:border-gray-800 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>For large hospital networks</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">₹19,999</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-0">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Unlimited staff members</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Complete inventory ecosystem</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Multi-facility management</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Advanced compliance tools</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Custom analytics & reporting</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>API access for integrations</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch pt-6">
                  <Button className="w-full" size="lg" variant="outline">
                    Contact Sales
                  </Button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                    Custom implementation included
                  </p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="yearly">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Yearly Basic Plan */}
              <Card className="border-2 border-gray-200 dark:border-gray-800 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Basic</CardTitle>
                  <CardDescription>For small clinics</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">₹47,990</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">/year</span>
                  </div>
                  <p className="text-sm text-green-600 font-medium mt-1">Save ₹11,998</p>
                </CardHeader>
                <CardContent className="pb-0">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Up to 10 staff members</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Inventory management</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Basic reporting</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Email support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch pt-6">
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                    No credit card required to start
                  </p>
                </CardFooter>
              </Card>

              {/* Yearly Pro Plan */}
              <Card className="border-2 border-primary relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium">
                  Most Popular
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Professional</CardTitle>
                  <CardDescription>For mid-sized hospitals</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">₹95,990</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">/year</span>
                  </div>
                  <p className="text-sm text-green-600 font-medium mt-1">Save ₹23,998</p>
                </CardHeader>
                <CardContent className="pb-0">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Up to 50 staff members</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Advanced inventory management</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Device tracking & maintenance</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Compliance monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Priority support (24/7)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Analytics dashboard</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch pt-6">
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                    30-day free trial included
                  </p>
                </CardFooter>
              </Card>

              {/* Yearly Enterprise Plan */}
              <Card className="border-2 border-gray-200 dark:border-gray-800 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>For large hospital networks</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">₹191,990</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">/year</span>
                  </div>
                  <p className="text-sm text-green-600 font-medium mt-1">Save ₹47,998</p>
                </CardHeader>
                <CardContent className="pb-0">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Unlimited staff members</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Complete inventory ecosystem</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Multi-facility management</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Advanced compliance tools</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Custom analytics & reporting</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>API access for integrations</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch pt-6">
                  <Button className="w-full" size="lg" variant="outline">
                    Contact Sales
                  </Button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                    Custom implementation included
                  </p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16 bg-slate-50 dark:bg-slate-900 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Is there a free trial available?</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, we offer a 30-day free trial for all plans. No credit card required.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Can I change plans later?</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Do you offer discounts for NABH/JCI accredited hospitals?</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, we offer special pricing for accredited healthcare facilities. Contact our sales team for details.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Is my data secure and compliant with regulations?</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, we are fully compliant with HIPAA, GDPR, and Indian Data Protection regulations to ensure your data is secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Pricing;
