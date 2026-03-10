import { useParams } from 'react-router-dom';
import { Message } from './message.tsx';
import { getRoomMessages } from '../http/get-room-messages.ts';
import { useSuspenseQuery } from '@tanstack/react-query';
import { UseMessagesWebSockets } from '../hooks/use-messages-web-sockets.ts';

export function Messages() {
    const { roomID } = useParams();

    if (!roomID) {
        throw new Error('Messages component must be used within room page.');
    }

    const { data } = useSuspenseQuery({
        queryKey: ['messages', roomID],
        queryFn: () => getRoomMessages({ roomID }),
    });

    UseMessagesWebSockets({ roomID });

    const sortedMessages = data.messages.sort(
        (a, b) => b.reactionCount - a.reactionCount,
    );

    return (
        <ol className="list-decimal list-outside px-3 space-y-8">
            {sortedMessages.map((message) => (
                <Message
                    key={message.id}
                    id={message.id}
                    text={message.message}
                    reactionCount={message.reactionCount}
                    answered={message.answered}
                />
            ))}
        </ol>
    );
}
