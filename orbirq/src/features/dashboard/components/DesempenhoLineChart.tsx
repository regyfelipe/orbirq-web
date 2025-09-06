// orbirq/src/components/charts/DesempenhoLineChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface DesempenhoLineChartProps {
  data: { disciplina: string; mediaRating: number }[]
}

export default function DesempenhoLineChart({ data }: DesempenhoLineChartProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Evolução do Desempenho</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="disciplina" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mediaRating"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
