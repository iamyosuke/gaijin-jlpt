"use client"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutPage from "@/components/ui/CheckOutPage"

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)

export default function PaymentPage() {
  const amount = 1000

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">決済ページ</h1>
      <Elements
        stripe={stripe}
        options={{
          mode: "payment",
          amount: amount,
          currency: "jpy",
          appearance: {
            theme: "stripe",
          },
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
    </div>
  )
}

