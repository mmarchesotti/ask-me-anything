import { useParams } from 'react-router-dom';
import { Message } from './message.tsx';
import { getRoomMessages } from '../http/get-room-messages.ts';
import { useSuspenseQuery } from '@tanstack/react-query';

export function Messages() {
    const { roomID } = useParams();

    if (!roomID) {
        throw new Error('Messages component must be used within room page.');
    }

    const { data } = useSuspenseQuery({
        queryKey: ['messages', roomID],
        queryFn: () => getRoomMessages({ roomID }),
    });

    console.log(data);

    return (
        <ol className="list-decimal list-outside px-3 space-y-8">
            {data.messages.map((message) => (
                <Message
                    key={message.id}
                    text={message.message}
                    reactionCount={message.reaction_count}
                    answered={message.answered}
                />
            ))}
        </ol>
    );
}
