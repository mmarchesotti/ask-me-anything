import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { GetRoomMessagesResponse } from '../http/get-room-messages';

interface UseMessagesWebsocketsParams {
    roomID: string;
}

type WebHookMessage =
    | { kind: 'message_created'; value: { id: string; message: string } }
    | { kind: 'message_add_reaction'; value: { id: string; count: number } }
    | { kind: 'message_remove_reaction'; value: { id: string; count: number } }
    | { kind: 'message_answered'; value: { id: string } };

export function UseMessagesWebSockets({ roomID }: UseMessagesWebsocketsParams) {
    const queryClient = useQueryClient();

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomID}`);

        ws.onmessage = (event) => {
            const data: WebHookMessage = JSON.parse(event.data);

            switch (data.kind) {
                case 'message_created':
                    queryClient.setQueryData<GetRoomMessagesResponse>(
                        ['messages', roomID],
                        (state) => {
                            return {
                                messages: [
                                    ...(state?.messages ?? []),
                                    {
                                        id: data.value.id,
                                        message: data.value.message,
                                        reactionCount: 0,
                                        answered: false,
                                    },
                                ],
                            };
                        },
                    );
                    break;
                case 'message_add_reaction':
                case 'message_remove_reaction':
                    queryClient.setQueryData<GetRoomMessagesResponse>(
                        ['messages', roomID],
                        (state) => {
                            if (!state) {
                                return;
                            }

                            return {
                                messages: state.messages.map((item) => {
                                    if (item.id == data.value.id) {
                                        return {
                                            ...item,
                                            reactionCount: data.value.count,
                                        };
                                    } else {
                                        return item;
                                    }
                                }),
                            };
                        },
                    );
                    break;
                case 'message_answered':
                    queryClient.setQueryData<GetRoomMessagesResponse>(
                        ['messages', roomID],
                        (state) => {
                            if (!state) {
                                return;
                            }

                            return {
                                messages: state.messages.map((item) => {
                                    if (item.id == data.value.id) {
                                        return { ...item, answered: true };
                                    } else {
                                        return item;
                                    }
                                }),
                            };
                        },
                    );
                    break;
            }
        };

        return () => {
            ws.close();
        };
    });
}
