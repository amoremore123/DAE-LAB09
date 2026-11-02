import { useEffect, useState } from "react";
export function useDebouncedValue(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
      if (import.meta.env.DEV) console.info("[search-filter]", value);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
}
