interface GetRoomMessagesRequest {
    roomID: string;
}

export async function getRoomMessages({ roomID }: GetRoomMessagesRequest) {
    const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/rooms/${roomID}/messages`,
    );

    const data: {
        messages: Array<{
            id: string;
            message: string;
            reactionCount: number;
            answered: boolean;
        }>;
    } = await response.json();

    return data;
}
