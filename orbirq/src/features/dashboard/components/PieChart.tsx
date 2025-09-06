"use client"

import { PieChart as RePieChart, Pie, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PieChartProps {
  correctAnswers: number
  incorrectAnswers: number
}

const PieChart = ({ correctAnswers, incorrectAnswers }: PieChartProps) => {
  const data = [
    { name: "Corretas", value: correctAnswers, fill: "var(--chart-1)" },
    { name: "Erradas", value: incorrectAnswers, fill: "var(--chart-2)" },
  ]

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Distribuição de Respostas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
              />
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default PieChart
