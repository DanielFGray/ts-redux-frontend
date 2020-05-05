import React from 'react'

function replacer(k, v) {
  if (typeof v === 'function') return '[function]'
  if (typeof v === 'undefined') return 'undefined'
  return v
}

export default function Stringify(props: string | any) {
  if (typeof props === 'string') return <pre>{props}</pre>
  return <pre>{JSON.stringify(props, replacer, 2)}</pre>
}
