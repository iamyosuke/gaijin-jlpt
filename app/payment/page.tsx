"use client"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutPage from "@/components/ui/CheckOutPage"

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)

export default function PaymentPage() {
  const amount = 1000
  return (
    <Elements stripe={stripe}
    options={{
      mode: "payment",
      amount: amount,
      currency: "jpy",
    }}
    >
      <CheckoutPage amount={amount} />
    </Elements>
  )
}


