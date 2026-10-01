import { useEffect } from 'react'

const SUFFIX = 'GFG Hacktober Fest'

/** Sets `document.title` per route: "Projects — GFG Hacktober Fest". */
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} — ${SUFFIX}` : `${SUFFIX} — Code. Contribute. Compete.`
  }, [title])
}
