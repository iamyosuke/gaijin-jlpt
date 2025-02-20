import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg font-medium text-muted-foreground">Loading...</p>
    </div>
  )
}
