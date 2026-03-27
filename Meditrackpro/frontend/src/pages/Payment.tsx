import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Check, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { baseUrl } from '@/utils/apiconfig';
// Declare Razorpay on the Window object
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  prefill: { name: string; email: string };
  notes: { [key: string]: string };
  theme: { color: string };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const Payment = () => {
  const [searchParams] = useSearchParams();
  const hospitalId = searchParams.get('hospital_id');
  const hospitalName = decodeURIComponent(searchParams.get('hospital_name') || '');
  const adminEmail = decodeURIComponent(searchParams.get('admin_email') || '');
  const gstin = decodeURIComponent(searchParams.get('gstin') || ''); // Get GSTIN from URL
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plan, setPlan] = useState<string>('basic');
  const [paymentMethod, setPaymentMethod] = useState<string>('prepaid');
  const [isRenewal, setIsRenewal] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/subscriptions/${hospitalId}/`);
        if (response.data.subscription) {
          setIsRenewal(true);
          setPaymentMethod('direct');
        }
      } catch (error) {
        // Handle silently for now
      }
    };
    checkSubscription();
  }, [hospitalId]);

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Calculate base amount, GST, and total amount
  const getAmounts = (selectedPlan: string) => {
    const planAmountsMonthly = { basic: 4999, pro: 9999, premium: 19999 };
    const planAmountsYearly = { basic: 47990, pro: 95990, premium: 191990 };
    const baseAmount = billingCycle === 'monthly'
      ? planAmountsMonthly[selectedPlan as keyof typeof planAmountsMonthly]
      : planAmountsYearly[selectedPlan as keyof typeof planAmountsYearly];
    const gstRate = 0.18; // 18% GST
    const gstAmount = baseAmount * gstRate;
    const totalAmount = baseAmount + gstAmount;
    return { baseAmount, gstAmount, totalAmount };
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { baseAmount, totalAmount } = getAmounts(plan);

      const response = await axios.post(`${baseUrl}/api/payment/`, {
        hospital_id: hospitalId,
        plan,
        payment_method: paymentMethod,
        hospital_name: hospitalName,
        admin_email: adminEmail,
        billing_cycle: billingCycle,
        base_amount: baseAmount, // Pass base amount
        total_amount: totalAmount, // Pass total incl. GST
        gstin: gstin || 'N/A', // Pass GSTIN
      });

      if (paymentMethod === 'prepaid') {
        const { order_id, amount: razorpayAmount, currency, key_id, subscription_id } = response.data;
        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded) {
          toast({ title: 'Error', description: 'Razorpay SDK failed to load', variant: 'destructive' });
          return;
        }

        const options: RazorpayOptions = {
          key: key_id,
          amount: razorpayAmount,
          currency,
          order_id,
          name: 'MediTrack Pro',
          description: `Payment for ${plan} plan - ${hospitalName} (${billingCycle})`,
          handler: async function (response) {
            await axios.post(`${baseUrl}/api/verify-payment/`, {
              subscription_id,
              payment_status: 'paid',
            });
            toast({ title: 'Payment Successful', description: 'Login with your admin email-id and password' });
            localStorage.setItem('hospital_id', hospitalId || '');
            navigate('/login');
          },
          prefill: {
            name: `${hospitalName} Admin`,
            email: adminEmail,
          },
          notes: {
            hospital_name: hospitalName,
            admin_email: adminEmail,
            gstin: gstin || 'N/A',
          },
          theme: { color: '#4CAF50' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (paymentMethod === 'cod') {
        const { subscription_id, total_amount } = response.data;
        await axios.post(`${baseUrl}/api/verify-payment/`, {
          subscription_id,
          payment_status: 'pending',
        });
        toast({ 
          title: 'COD Selected', 
          description: `Payment of ₹${total_amount.toLocaleString()} (incl. 18% GST) due on delivery for ${hospitalName}.` 
        });
        localStorage.setItem('hospital_id', hospitalId || '');
        navigate('/login');
      } else { // Direct
        const { subscription_id, total_amount } = response.data;
        toast({
          title: 'Direct Payment Requested',
          description: `Please transfer ₹${total_amount.toLocaleString()} (incl. 18% GST) to [Your Bank/UPI Details] within 7 days for ${hospitalName}.`,
        });
        localStorage.setItem('hospital_id', hospitalId || '');
        navigate('/login');
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      toast({ 
        title: 'Payment Error', 
        description: axiosError.response?.data?.error || 'Something went wrong', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const { baseAmount, gstAmount, totalAmount } = getAmounts(plan);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {isRenewal ? 'Renew Your Plan' : `Payment for ${hospitalName}`}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Billing to: {hospitalName} ({adminEmail}) {gstin && `| GSTIN: ${gstin}`}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={billingCycle} onValueChange={setBillingCycle} className="w-full">
            <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">
                Yearly
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                  Save 20%
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monthly">
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <Card className={plan === 'basic' ? 'border-2 border-primary' : 'border-2'}>
                  <CardHeader>
                    <CardTitle>Basic</CardTitle>
                    <p className="text-2xl font-bold">₹4,999 <span className="text-sm text-gray-500">/month</span></p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Up to 10 staff</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Inventory management</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Basic reporting</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Email support</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant={plan === 'basic' ? 'default' : 'outline'} onClick={() => setPlan('basic')} className="w-full">
                      {plan === 'basic' ? 'Selected' : 'Select Basic'}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className={plan === 'pro' ? 'border-2 border-primary' : 'border-2'}>
                  <CardHeader>
                    <CardTitle>Professional</CardTitle>
                    <p className="text-2xl font-bold">₹9,999 <span className="text-sm text-gray-500">/month</span></p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Up to 50 staff</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Advanced inventory</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Device tracking</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Priority support</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant={plan === 'pro' ? 'default' : 'outline'} onClick={() => setPlan('pro')} className="w-full">
                      {plan === 'pro' ? 'Selected' : 'Select Pro'}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className={plan === 'premium' ? 'border-2 border-primary' : 'border-2'}>
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <p className="text-2xl font-bold">₹19,999 <span className="text-sm text-gray-500">/month</span></p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Unlimited staff</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Multi-facility</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Custom analytics</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> API access</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant={plan === 'premium' ? 'default' : 'outline'} onClick={() => setPlan('premium')} className="w-full">
                      {plan === 'premium' ? 'Selected' : 'Select Enterprise'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="yearly">
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <Card className={plan === 'basic' ? 'border-2 border-primary' : 'border-2'}>
                  <CardHeader>
                    <CardTitle>Basic</CardTitle>
                    <p className="text-2xl font-bold">₹47,990 <span className="text-sm text-gray-500">/year</span></p>
                    <p className="text-sm text-green-600">Save ₹11,998</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Up to 10 staff</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Inventory management</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Basic reporting</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Email support</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant={plan === 'basic' ? 'default' : 'outline'} onClick={() => setPlan('basic')} className="w-full">
                      {plan === 'basic' ? 'Selected' : 'Select Basic'}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className={plan === 'pro' ? 'border-2 border-primary' : 'border-2'}>
                  <CardHeader>
                    <CardTitle>Professional</CardTitle>
                    <p className="text-2xl font-bold">₹95,990 <span className="text-sm text-gray-500">/year</span></p>
                    <p className="text-sm text-green-600">Save ₹23,998</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Up to 50 staff</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Advanced inventory</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Device tracking</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Priority support</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant={plan === 'pro' ? 'default' : 'outline'} onClick={() => setPlan('pro')} className="w-full">
                      {plan === 'pro' ? 'Selected' : 'Select Pro'}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className={plan === 'premium' ? 'border-2 border-primary' : 'border-2'}>
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <p className="text-2xl font-bold">₹191,990 <span className="text-sm text-gray-500">/year</span></p>
                    <p className="text-sm text-green-600">Save ₹47,998</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Unlimited staff</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Multi-facility</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Custom analytics</li>
                      <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> API access</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant={plan === 'premium' ? 'default' : 'outline'} onClick={() => setPlan('premium')} className="w-full">
                      {plan === 'premium' ? 'Selected' : 'Select Enterprise'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              {!isRenewal && (
                <>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prepaid" id="prepaid" />
                    <Label htmlFor="prepaid">Pay Now (Prepaid)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Cash on Delivery</Label>
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="direct" id="direct" />
                <Label htmlFor="direct">Direct Payment (Bank/UPI)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Billing Summary</h3>
            <div className="space-y-2">
              <p>Base Price: ₹{baseAmount.toLocaleString()}</p>
              <p>GST (18%): ₹{gstAmount.toLocaleString()}</p>
              <p className="font-bold">Total: ₹{totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
        <Button onClick={handlePayment} className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              paymentMethod === 'prepaid' ? 'Proceed to Pay' : paymentMethod === 'cod' ? 'Confirm COD' : 'Request Direct Payment'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Payment;