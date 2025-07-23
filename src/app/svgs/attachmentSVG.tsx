import * as React from "react"

const AttachmentSVG = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21.44 11.05l-8.49 8.49a5 5 0 0 1-7.07-7.07L14.36 4.09a3 3 0 0 1 4.24 4.24l-8.49 8.49" />
  </svg>
)

export default AttachmentSVG
