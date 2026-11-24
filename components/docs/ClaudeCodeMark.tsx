/**
 * @fileoverview Forke Platform
 * @copyright (c) 2026 Forke Inc. (https://www.forke.space/)
 *
 * Source-Available License (Non-Commercial / Fair Source).
 * This source code is open for inspection, learning, and personal development.
 * Commercial use, hosting, or resale as a paid service without an explicit
 * commercial license from Forke Inc. is strictly prohibited.
 */

/** Claude Code's pixel mascot. */
export function ClaudeCodeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 10" aria-hidden className={className} shapeRendering="crispEdges">
      <path d="M2 0H14V4H16V6H14V8H13V10H12V8H11V10H10V8H6V10H5V8H4V10H3V8H2V6H0V4H2Z" fill="#D97757" />
      <path d="M4 2H5V4H4ZM11 2H12V4H11Z" fill="#121111" />
    </svg>
  )
}
