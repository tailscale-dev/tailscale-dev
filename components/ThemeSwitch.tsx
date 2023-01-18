import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <select value={theme} onChange={e => setTheme(e.target.value)}>
      <option value="system">system</option>
      <option value="dark">dark</option>
      <option value="light">light</option>
    </select>
  )
}
