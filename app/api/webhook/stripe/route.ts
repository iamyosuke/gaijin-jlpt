import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/prisma';
import { NextResponse, NextRequest } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {

    const body = await req.text();

    const signature = (await headers()).get('stripe-signature');

    let eventType: string;
    let event: Stripe.Event;

    // verify Stripe event is legit
    try {
        event = stripe.webhooks.constructEvent(body, signature as string, webhookSecret);
        eventType = event.type;
    } catch (err) {
        const errorMessage = (err as Error).message;
        console.error(`Webhook signature verification failed. ${errorMessage}`);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }


    try {
        if (eventType) {
            switch (eventType) {
                case 'checkout.session.completed': {
                    // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
                    // ✅ Grant access to the product
                    let user;
                    const session = await stripe.checkout.sessions.retrieve(
                        (event.data.object as Stripe.Checkout.Session).id,
                        {
                            expand: ['line_items']
                        }
                    );
                    const customerId = session?.customer as string;
                    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
                    const priceId = session?.line_items?.data[0]?.price?.id;

                    if (customer.email) {
                        user = await prisma.user.findUnique({
                            where: { email: customer.email },
                        });

                        if (!user) {
                            user = await prisma.user.create({
                                data: {
                                    email: customer.email,
                                    name: customer.name,
                                    customerId,
                                    priceId,
                                    hasAccess: true,
                                },
                            });
                        } else {
                            await prisma.user.update({
                                where: { email: customer.email },
                                data: {
                                  customerId: customerId,
                                    priceId: priceId ?? null,
                                    hasAccess: true,
                                },
                            });
                        }
                    } else {
                        console.error('No user found');
                        throw new Error('No user found');
                    }

                    // Extra: >>>>> send email to dashboard <<<<

                    break;
                }

                case 'customer.subscription.deleted': {
                    // ❌ Revoke access to the product
                    // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
                    const subscription = await stripe.subscriptions.retrieve(
                        (event.data.object as Stripe.Subscription).id
                    );
                    const user = await prisma.user.findUnique({
                        where: {
                            customerId: subscription.customer as string,
                        },
                    });

                    if (user) {
                        await prisma.user.update({
                            where: { customerId: subscription.customer as string },
                            data: { hasAccess: false },
                        });
                    }

                    break;
                }

                default:
                    console.log(`Unhandled event type ${eventType}`);
            }
        } else {
            console.error('Event type is undefined');
        }
    } catch (e) {
        console.error(
            'stripe error: ' + (e as Error).message + ' | EVENT TYPE: ' + eventType
        );
    }

    return NextResponse.json({ message: 'Webhook received' });
}