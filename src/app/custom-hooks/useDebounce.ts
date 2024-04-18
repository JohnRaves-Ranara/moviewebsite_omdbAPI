import { useEffect, useState } from "react";
export function useDebounce(value : any, delay : number) : any {

    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => clearTimeout(debounceTimeout)
    }, [value, delay])

    return debouncedValue
}