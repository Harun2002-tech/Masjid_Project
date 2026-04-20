import React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  min?: number
  max?: number
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderProps) {
  // Determine number of thumbs
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={`${className ?? ''} relative flex w-full touch-none items-center select-none
        disabled:opacity-50 vertical:flex-col vertical:h-full vertical:min-h-44 vertical:w-auto`}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="bg-muted relative grow overflow-hidden rounded-full
          horizontal:h-1.5 horizontal:w-full vertical:h-full vertical:w-1.5"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="bg-primary absolute horizontal:h-full vertical:w-full"
        />
      </SliderPrimitive.Track>

      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary ring-ring/50 block w-4 h-4 shrink-0 rounded-full border bg-white shadow-sm
            transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-none
            disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
