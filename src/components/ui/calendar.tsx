"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  startMonth,
  endMonth,
  ...props
}: CalendarProps) {
  const now = new Date()
  const defaultStart = React.useMemo(
    () => startMonth ?? new Date(now.getFullYear() - 1, 0, 1),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [startMonth]
  )
  const defaultEnd = React.useMemo(
    () => endMonth ?? new Date(now.getFullYear() + 5, 11, 31),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endMonth]
  )

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      startMonth={defaultStart}
      endMonth={defaultEnd}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-3",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label:
          "inline-flex items-center gap-1 text-sm font-medium text-gray-900",
        dropdowns: "flex items-center gap-1.5",
        dropdown_root:
          "relative inline-flex items-center h-8 px-2.5 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors data-[disabled=true]:opacity-50",
        dropdown: "absolute inset-0 opacity-0 cursor-pointer",
        nav: "hidden",
        button_previous: "hidden",
        button_next: "hidden",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-gray-400 rounded-md w-9 font-normal text-[0.75rem]",
        week: "flex w-full mt-1",
        day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day_button:
          "inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-normal text-gray-900 hover:bg-gray-100 transition-colors aria-selected:opacity-100",
        selected:
          "[&>button]:bg-primary [&>button]:text-white [&>button]:hover:bg-primary [&>button]:hover:text-white [&>button]:focus:bg-primary",
        today: "[&>button]:bg-gray-100 [&>button]:font-semibold",
        outside: "text-gray-300 [&>button]:text-gray-300",
        disabled: "text-gray-300 [&>button]:text-gray-300 [&>button]:cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ ...iconProps }) => (
          <ChevronDown className="h-4 w-4 text-gray-500" {...iconProps} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
