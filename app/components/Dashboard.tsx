"use client"

import type React from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CalendarIcon, ClockIcon, BookOpenIcon, PercentIcon } from "lucide-react"

interface DashboardProps {
  data: {
    streak: number
    monthlyHours: Array<{ date: string; hours: number }>
    weeklyWords: Array<{ day: string; count: number }>
    weeklyRecords: Array<{ date: string; hours: number }>
    accuracy: {
      correct: number
      incorrect: number
      rate: number
    }
    dailyAccuracy: Array<{ date: string; correct: number; incorrect: number }>
  }
}

const DashboardComponent: React.FC<DashboardProps> = ({ data }) => {
  // Calculate total monthly hours
  const totalMonthlyHours = data.monthlyHours.reduce((sum, day) => sum + day.hours, 0)

  // Calculate total weekly words
  const totalWeeklyWords = data.weeklyWords.reduce((sum, day) => sum + day.count, 0)

  // Process data for accuracy chart
  const accuracyChartData = data.dailyAccuracy.map((day) => ({
    date: day.date,
    correct: day.correct,
    incorrect: day.incorrect,
    rate: Math.round((day.correct / (day.correct + day.incorrect)) * 100),
  }))

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">学習ダッシュボード</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Streak Card */}
        <Card className="border-blue-100 bg-blue-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">連続学習日数</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.streak}日</div>
            <p className="text-xs text-muted-foreground">継続は力なり</p>
          </CardContent>
        </Card>

        {/* Monthly Hours Card */}
        <Card className="border-blue-100 bg-blue-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">今月の学習時間</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMonthlyHours.toFixed(1)}時間</div>
            <p className="text-xs text-muted-foreground">今月の合計学習時間</p>
          </CardContent>
        </Card>

        {/* Weekly Words Card */}
        <Card className="border-blue-100 bg-blue-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">今週の学習単語数</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeeklyWords}単語</div>
            <p className="text-xs text-muted-foreground">今週学習した単語の合計</p>
          </CardContent>
        </Card>

        {/* Accuracy Card */}
        <Card className="border-blue-100 bg-blue-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">正解率</CardTitle>
            <PercentIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.accuracy.rate}%</div>
            <p className="text-xs text-muted-foreground">
              正解: {data.accuracy.correct} / 不正解: {data.accuracy.incorrect}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-blue-100">
          <TabsTrigger value="weekly">週間データ</TabsTrigger>
          <TabsTrigger value="monthly">月間データ</TabsTrigger>
          <TabsTrigger value="accuracy">正解率分析</TabsTrigger>
        </TabsList>

        {/* Weekly Data Tab */}
        <TabsContent value="weekly" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-blue-100 bg-blue-50/30">
              <CardHeader>
                <CardTitle>週間学習時間</CardTitle>
                <CardDescription>一週間の学習時間の推移</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      hours: {
                        label: "学習時間",
                        color: "hsl(210, 100%, 60%)",
                      },
                    }}
                  >
                    <AreaChart data={data.weeklyRecords} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-hours)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--color-hours)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="hours"
                        stroke="var(--color-hours)"
                        fillOpacity={1}
                        fill="url(#colorHours)"
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 bg-blue-50/30">
              <CardHeader>
                <CardTitle>週間学習単語数</CardTitle>
                <CardDescription>曜日ごとの学習単語数</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      count: {
                        label: "単語数",
                        color: "hsl(200, 90%, 60%)",
                      },
                    }}
                  >
                    <BarChart data={data.weeklyWords} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monthly Data Tab */}
        <TabsContent value="monthly" className="space-y-4">
          <Card className="border-blue-100 bg-blue-50/30">
            <CardHeader>
              <CardTitle>月間学習時間</CardTitle>
              <CardDescription>今月の日ごとの学習時間</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    hours: {
                      label: "学習時間",
                      color: "hsl(220, 80%, 65%)",
                    },
                  }}
                >
                  <BarChart data={data.monthlyHours} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value, name, props) => [`${value}時間`, "学習時間"]}
                      labelFormatter={(label) => new Date(label).toLocaleDateString("ja-JP")}
                    />
                    <Bar dataKey="hours" fill="var(--color-hours)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accuracy Tab */}
        <TabsContent value="accuracy" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-blue-100 bg-blue-50/30">
              <CardHeader>
                <CardTitle>日別正解率</CardTitle>
                <CardDescription>日ごとの正解率の推移</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      rate: {
                        label: "正解率",
                        color: "hsl(195, 85%, 55%)",
                      },
                    }}
                  >
                    <LineChart data={accuracyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="var(--color-rate)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 bg-blue-50/30">
              <CardHeader>
                <CardTitle>正解・不正解の内訳</CardTitle>
                <CardDescription>日ごとの正解数と不正解数</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      correct: {
                        label: "正解",
                        color: "hsl(205, 90%, 60%)",
                      },
                      incorrect: {
                        label: "不正解",
                        color: "hsl(350, 80%, 65%)",
                      },
                    }}
                  >
                    <BarChart data={data.dailyAccuracy} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="correct" fill="var(--color-correct)" stackId="a" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="incorrect" fill="var(--color-incorrect)" stackId="a" radius={[0, 0, 4, 4]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardComponent

