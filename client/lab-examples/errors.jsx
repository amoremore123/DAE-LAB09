import React from 'react'
import { createRoot } from 'react-dom/client'
const originalError = console.error
console.error = (...args) => {
  originalError(...args)
  let text = String(args[0])
  for (const arg of args.slice(1)) text = text.replace('%s', String(arg))
  document.getElementById('messages').textContent += text + '\n\n'
}
function MissingKeys() { return <ul>{['A', 'B'].map(item => <li>{item}</li>)}</ul> }
createRoot(document.getElementById('root')).render(<><h2 class="wrong">class en lugar de className</h2><MissingKeys /></>)
