"use client"

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { useState, useEffect } from "react"

export default function CheckoutPage({ amount }: { amount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 支払い意図を作成するためのAPI呼び出し
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
  }, [amount])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    console.log("handleSubmit")
    if (!stripe || !elements) {
      console.log("stripe or elements is not found")
      return
    }

    setLoading(true)

    // elements.submit()を呼び出してフォームを検証
    const { error: submitError } = await elements.submit()
    if (submitError) {
      setErrorMessage(submitError.message)
      setLoading(false)
      return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/payment-success?amount=${amount}`,
      },
    })

    console.log("confirmPayment")

    if (error) {
      setErrorMessage(error.message)
    }

    setLoading(false)
  }

  if (!clientSecret) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}
      <button>支払いを完了</button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  )
}
