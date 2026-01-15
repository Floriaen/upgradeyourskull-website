import * as React from "react"

const HealthPage = () => {
  return (
    <pre>
      {JSON.stringify({ status: "ok" }, null, 2)}
    </pre>
  )
}

export default HealthPage

export const Head = () => <title>Health Check</title>
