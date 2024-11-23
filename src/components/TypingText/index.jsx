import { useEffect, useRef } from "react";
import Typed from "typed.js";

const TypingText = ({ text, typeSpeed = 50, loop = false, backSpeed = 50 }) => {
    const typedElement = useRef(null);

    useEffect(() => {
        const typedInstance = new Typed(typedElement.current, {
            strings: [text],
            typeSpeed,
            backSpeed,
            loop,
            cursorChar: "",
        });

        return () => {
            typedInstance.destroy();
        };
    }, [text]);

    return <span ref={typedElement} className="break-words"></span>;
};

export default TypingText;
