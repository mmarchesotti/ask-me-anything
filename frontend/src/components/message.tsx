import { ArrowUp } from 'lucide-react';
import { useState } from 'react';

interface MessageProps {
    text: string;
    reactionCount: number;
    answered?: boolean;
}

export function Message({
    text,
    reactionCount,
    answered = false,
}: MessageProps) {
    const [hasReacted, setHasReacted] = useState(false);

    function handleAddReactionToMessage() {
        setHasReacted(true);
    }

    function handleRemoveReactionFromMessage() {
        setHasReacted(false);
    }

    return (
        <li
            data-answered={answered}
            className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none"
        >
            {text}

            {hasReacted ? (
                <button
                    onClick={handleRemoveReactionFromMessage}
                    className="text-zinc-400 mt-3 flex items-center gap-2 text-sm font-medium hover:text-zinc-300"
                >
                    <ArrowUp className="size-4" />
                    Curtir pergunta ({reactionCount})
                </button>
            ) : (
                <button
                    onClick={handleAddReactionToMessage}
                    className="text-orange-400 mt-3 flex items-center gap-2 text-sm font-medium hover:text-orange-500"
                >
                    <ArrowUp className="size-4" />
                    Curtir pergunta ({reactionCount})
                </button>
            )}
        </li>
    );
}
