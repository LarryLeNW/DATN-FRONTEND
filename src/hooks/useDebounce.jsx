import { useEffect, useState } from "react";

let useDebounce = (value, delay) => {
    const [debounceValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const clear = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(clear);
    }, [value]);

    return debounceValue;
};

export default useDebounce;
