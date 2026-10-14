import { useEffect, useState } from 'react'

// Works like useState, but the value is also saved in localStorage
// so it is still there after the page is refreshed.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be full or blocked (e.g. private mode) - the app still works
    }
  }, [key, value])

  return [value, setValue]
}
