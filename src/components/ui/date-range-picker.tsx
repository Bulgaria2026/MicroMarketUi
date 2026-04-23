import type { DateRange } from "react-day-picker"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const d = new Date(value)
  return isNaN(d.getTime()) ? undefined : d
}

interface DateRangePickerProps {
  from?: string
  to?: string
  onChange: (from: string | undefined, to: string | undefined) => void
  className?: string
  align?: "start" | "center" | "end"
}

export function DateRangePicker({ from, to, onChange, className, align = "start" }: Readonly<DateRangePickerProps>) {
  const range: DateRange = {
    from: parseDate(from),
    to: parseDate(to),
  }

  function handleSelect(selected: DateRange | undefined) {
    onChange(
      selected?.from ? toDateString(selected.from) : undefined,
      selected?.to ? toDateString(selected.to) : undefined,
    )
  }

  let label = "Pick a date range"
  if (range.from && range.to) {
    label = `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`
  } else if (range.from) {
    label = `${range.from.toLocaleDateString()} – …`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("h-8 justify-start gap-2 text-sm font-normal", !from && !to && "text-muted-foreground", className)}
        >
          <CalendarIcon className="size-3.5 shrink-0" />
          <span>{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
