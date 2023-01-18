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
    <button
    className="px-4 py-2 text-white dark:text-black bg-black dark:bg-white font-semibold rounded-md"
    onClick={() => {
      setTheme(theme === 'light' ? 'dark' : 'light')
    }}
  >
    Theme
  </button>
  )
}
