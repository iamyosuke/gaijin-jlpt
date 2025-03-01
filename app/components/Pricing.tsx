'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Check, ShipIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Plan {
  link: string;
  priceId: string;
  price: number;
  duration: string;
}

// Stripe Plans
const plans: Plan[] = [
  {
    link: process.env.NEXT_PUBLIC_MONTHLY_LINK || '',
    priceId: process.env.NEXT_PUBLIC_MONTHLY_PRICE_ID || '',
    price: 1000,
    duration: '/month'
  },
  {
    link: process.env.NEXT_PUBLIC_YEARLY_LINK || '',
    priceId: process.env.NEXT_PUBLIC_YEARLY_PRICE_ID || '',
    price: 10000,
    duration: '/year'
  }
];

const features = [
  'NextJS boilerplate',
  'User oauth',
  'Database',
  'Emails',
  '1 year of updates',
  '24/7 support'
];

const Pricing: React.FC = () => {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);

  const handlePlanChange = (value: string) => {
    const newPlan = plans.find(p => p.duration === `/${value}`) || plans[0];
    setSelectedPlan(newPlan);
  };

  return (
    <>
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Hello YouTube
          </h2>
        </div>

        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Choose your plan</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="month" onValueChange={handlePlanChange} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="month">Monthly</TabsTrigger>
                <TabsTrigger value="year">
                  Yearly
                  <Badge variant="secondary" className="ml-2">60% OFF</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-baseline justify-center mb-6">
              <span className="text-5xl font-extrabold tracking-tight">
                ${selectedPlan.price / 100}
              </span>
              <span className="ml-1 text-xl font-semibold text-muted-foreground">
                {selectedPlan.duration}
              </span>
            </div>

            <ul className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              asChild
            >
              <a
                href={`${selectedPlan.link}?prefilled_email=${session?.user?.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Subscribe
              </a>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <div className="fixed right-8 bottom-8">
        <a
          href="https://shipfa.st?ref=stripe_pricing_video"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="mr-2">Built with</span>
          <span className="font-bold flex items-center">
            ShipFast
            <ShipIcon className="ml-1 h-4 w-4" />
          </span>
        </a>
      </div>
    </>
  );
};

export default Pricing;
