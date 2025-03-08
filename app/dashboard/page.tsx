import { Suspense } from "react"
import DashboardLoading from "./loading"
import Dashboard from '@/app/components/Dashboard';

// This would typically come from an API or database
const mockData = {
  streak: 15,
  monthlyHours: [
    { date: "2024-03-01", hours: 2.5 },
    { date: "2024-03-02", hours: 1.8 },
    { date: "2024-03-03", hours: 3.2 },
    { date: "2024-03-04", hours: 2.0 },
    { date: "2024-03-05", hours: 2.7 },
    { date: "2024-03-06", hours: 1.5 },
    { date: "2024-03-07", hours: 3.0 },
    { date: "2024-03-08", hours: 2.2 },
    { date: "2024-03-09", hours: 0 },
    { date: "2024-03-10", hours: 1.8 },
    { date: "2024-03-11", hours: 2.5 },
    { date: "2024-03-12", hours: 3.1 },
    { date: "2024-03-13", hours: 2.3 },
    { date: "2024-03-14", hours: 1.9 },
    { date: "2024-03-15", hours: 2.8 },
    { date: "2024-03-16", hours: 3.2 },
    { date: "2024-03-17", hours: 2.0 },
    { date: "2024-03-18", hours: 1.7 },
    { date: "2024-03-19", hours: 2.4 },
    { date: "2024-03-20", hours: 3.0 },
    { date: "2024-03-21", hours: 2.6 },
    { date: "2024-03-22", hours: 1.5 },
    { date: "2024-03-23", hours: 2.2 },
    { date: "2024-03-24", hours: 2.8 },
    { date: "2024-03-25", hours: 3.1 },
    { date: "2024-03-26", hours: 2.3 },
    { date: "2024-03-27", hours: 1.9 },
    { date: "2024-03-28", hours: 2.7 },
    { date: "2024-03-29", hours: 3.0 },
    { date: "2024-03-30", hours: 2.5 },
  ],
  weeklyWords: [
    { day: "月", count: 25 },
    { day: "火", count: 18 },
    { day: "水", count: 30 },
    { day: "木", count: 22 },
    { day: "金", count: 28 },
    { day: "土", count: 35 },
    { day: "日", count: 15 },
  ],
  weeklyRecords: [
    { date: "3/1", hours: 2.5 },
    { date: "3/2", hours: 1.8 },
    { date: "3/3", hours: 3.2 },
    { date: "3/4", hours: 2.0 },
    { date: "3/5", hours: 2.7 },
    { date: "3/6", hours: 1.5 },
    { date: "3/7", hours: 3.0 },
  ],
  accuracy: {
    correct: 187,
    incorrect: 43,
    rate: 81.3,
  },
  dailyAccuracy: [
    { date: "3/1", correct: 28, incorrect: 7 },
    { date: "3/2", correct: 22, incorrect: 8 },
    { date: "3/3", correct: 35, incorrect: 5 },
    { date: "3/4", correct: 25, incorrect: 10 },
    { date: "3/5", correct: 30, incorrect: 5 },
    { date: "3/6", correct: 20, incorrect: 3 },
    { date: "3/7", correct: 27, incorrect: 5 },
  ],
}

// Simulate data loading delay
async function getData() {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, 1500) // 1.5 second delay to show loading state
  })
}

export default async function DashboardPage() {
  // In a real app, this would fetch data from an API
  const data = await getData()

  return (
    <Suspense fallback={<DashboardLoading />}>
      <Dashboard data={data as any} />
    </Suspense>
  )
}

