import { useCallback } from "react";
import confetti from "canvas-confetti";

const useConfetti = (data) => {
    const triggerConfetti = useCallback(() => {
        confetti(data);
    }, [data]);

    return triggerConfetti;
};

export default useConfetti;
