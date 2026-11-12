import type { ReactNode } from 'react'

/**
 * Cells split by hairlines (a 1px gap that shows the line colour), the way the
 * landing page lays out its fact grids. `cols` is the column count on wide screens.
 */
export default function CellGrid({ children, cols = 4, className = '' }: { children: ReactNode; cols?: 2 | 3 | 4 | 5; className?: string }) {
  const wide = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4', 5: 'sm:grid-cols-2 lg:grid-cols-5' }[cols]
  return (
    <div className={`grid gap-px overflow-hidden rounded-[18px] border border-line bg-line [&>*]:bg-bg ${wide} ${className}`}>{children}</div>
  )
}
