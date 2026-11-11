const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://dashboard.forke.space'
// Pages that live in the signed-in app on the dashboard subdomain, not on the marketing site.
const APP_PATHS = ['/dashboard', '/settings', '/escrow', '/tasks', '/submissions', '/earnings', '/notifications', '/support']

export function appUrl(path: string) {
  return `${DASHBOARD_URL}${path}`
}

export function isAppPath(href: string) {
  return APP_PATHS.some((p) => href === p || href.startsWith(`${p}/`) || href.startsWith(`${p}?`) || href.startsWith(`${p}#`))
}
