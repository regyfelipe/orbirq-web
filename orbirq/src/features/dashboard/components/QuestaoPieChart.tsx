"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie" // ✅ type-only import

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart" // ✅ type-only import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type QuestaoPieChartProps = {
  data: {
    disciplina: string
    totalQuestoes: number
  }[]
}

export default function QuestaoPieChart({ data }: QuestaoPieChartProps) {
  const id = "questoes-pie"

  // configura dinamicamente as cores e labels
  const chartConfig: ChartConfig = data.reduce((acc, item, idx) => {
    acc[item.disciplina] = {
      label: item.disciplina,
      color: `var(--chart-${(idx % 5) + 1})`,
    }
    return acc
  }, {} as ChartConfig)

  const [activeDisciplina, setActiveDisciplina] = React.useState(
    data.length > 0 ? data[0].disciplina : ""
  )

  const activeIndex = React.useMemo(
    () => data.findIndex((item) => item.disciplina === activeDisciplina),
    [activeDisciplina, data]
  )
  const disciplinas = React.useMemo(() => data.map((item) => item.disciplina), [data])

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Questões por Disciplina</CardTitle>
          <CardDescription>Distribuição das questões cadastradas</CardDescription>
        </div>
        {disciplinas.length > 0 && (
          <Select value={activeDisciplina} onValueChange={setActiveDisciplina}>
            <SelectTrigger
              className="ml-auto h-7 w-[150px] rounded-lg pl-2.5"
              aria-label="Selecione uma disciplina"
            >
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {disciplinas.map((key) => {
                const config = chartConfig[key as keyof typeof chartConfig]
                if (!config) return null

                return (
                  <SelectItem
                    key={key}
                    value={key}
                    className="rounded-lg [&_span]:flex"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="flex h-3 w-3 shrink-0 rounded-xs"
                        style={{ backgroundColor: config.color }}
                      />
                      {config.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[320px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="totalQuestoes"
              nameKey="disciplina"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {data[activeIndex]?.totalQuestoes ?? 0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 22}
                          className="fill-muted-foreground text-sm"
                        >
                          Questões
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
