import { Fragment } from 'react'

interface HighlightProps {
  text: string
  /** Inclusive [start, end] character ranges to highlight. */
  ranges: readonly (readonly [number, number])[]
}

/** Merges overlapping or touching ranges and clamps them to the text. */
function normalise(ranges: HighlightProps['ranges'], length: number): [number, number][] {
  const sorted = ranges
    .map(([start, end]) => [Math.max(0, start), Math.min(length - 1, end)] as [number, number])
    .filter(([start, end]) => start <= end)
    .sort((a, b) => a[0] - b[0])

  const merged: [number, number][] = []
  for (const range of sorted) {
    const last = merged[merged.length - 1]
    if (last && range[0] <= last[1] + 1) last[1] = Math.max(last[1], range[1])
    else merged.push([...range])
  }
  return merged
}

/** Renders `text` with the matched ranges wrapped in `<mark>`. */
export function Highlight({ text, ranges }: HighlightProps) {
  const parts = normalise(ranges, text.length)
  if (parts.length === 0) return <>{text}</>

  const nodes = []
  let cursor = 0
  for (const [start, end] of parts) {
    if (start > cursor)
      nodes.push(<Fragment key={`t${cursor}`}>{text.slice(cursor, start)}</Fragment>)
    nodes.push(
      <mark key={`m${start}`} className="rounded-sm bg-accent-100 px-px text-inherit">
        {text.slice(start, end + 1)}
      </mark>,
    )
    cursor = end + 1
  }
  if (cursor < text.length) nodes.push(<Fragment key={`t${cursor}`}>{text.slice(cursor)}</Fragment>)
  return <>{nodes}</>
}
