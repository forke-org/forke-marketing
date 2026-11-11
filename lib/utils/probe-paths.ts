const PROBE_PATH_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/\.ssh/i,
  /\/id_rsa/i,
  /\/\.kube/i,
  /\/\.aws/i,
  /\/\.config/i,
  /\/\.ds_store/i,
  /\/Jenkinsfile/i,
  /\/owa\b/i,
  /\/solr\b/i,
  /\/wp-(admin|login|content|includes)/i,
  /\/phpmyadmin/i,
  /\/server-status/i,
  /\/nginx_status/i,
  /\/actuator/i,
  /\/boaform/i,
  /\/autodiscover/i,
  /\/api\/fs\//i,
  /\/error_log/i,
  /\/graphql/i,
  /\/dns-query/i,
]

export function isProbePath(pathname: string): boolean {
  return PROBE_PATH_PATTERNS.some((pattern) => pattern.test(pathname))
}

const CRAWLER_FILE_PATTERN = /^\/(robots\.txt|llms(-full)?\.txt|sitemap[^/]*\.xml|ai\.txt|\.well-known\/ai-plugin\.json)$/i

export function isCrawlerFilePath(pathname: string): boolean {
  return CRAWLER_FILE_PATTERN.test(pathname)
}
