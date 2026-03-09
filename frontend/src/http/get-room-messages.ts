interface GetRoomMessagesRequest {
    roomID: string;
}

export async function getRoomMessages({ roomID }: GetRoomMessagesRequest) {
    const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/rooms/${roomID}/messages`,
    );

    const messages: Array<{
        id: string;
        room_id: string;
        message: string;
        reaction_count: number;
        answered: boolean;
    }> = await response.json();

    return { messages };
}
