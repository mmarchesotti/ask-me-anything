import { ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { addMessageReaction } from '../http/add-message-reaction';
import { toast } from 'sonner';
import { removeMessageReaction } from '../http/remove-message-reaction';

interface MessageProps {
    id: string;
    text: string;
    reactionCount: number;
    answered?: boolean;
}

export function Message({
    id: messageID,
    text,
    reactionCount,
    answered = false,
}: MessageProps) {
    const { roomID } = useParams();
    const [hasReacted, setHasReacted] = useState(false);

    if (!roomID) {
        throw new Error('Message component must be used within room page');
    }

    async function handleAddReactionToMessage() {
        if (!roomID) {
            return;
        }

        try {
            await addMessageReaction({ messageID, roomID });
        } catch {
            toast.error('Falha ao reagir à mensagem.');
        }

        setHasReacted(true);
    }

    async function handleRemoveReactionFromMessage() {
        if (!roomID) {
            return;
        }

        try {
            await removeMessageReaction({ messageID, roomID });
        } catch {
            toast.error('Falha ao remover reação.');
        }

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
                    type="button"
                    onClick={handleRemoveReactionFromMessage}
                    className="text-zinc-400 mt-3 flex items-center gap-2 text-sm font-medium hover:text-zinc-300"
                >
                    <ArrowUp className="size-4" />
                    Curtir pergunta ({reactionCount})
                </button>
            ) : (
                <button
                    type="button"
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
