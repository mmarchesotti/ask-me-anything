interface GetRoomMessagesRequest {
    roomID: string;
}

export interface GetRoomMessagesResponse {
    messages: Array<{
        id: string;
        message: string;
        reactionCount: number;
        answered: boolean;
    }>;
}

export async function getRoomMessages({
    roomID,
}: GetRoomMessagesRequest): Promise<GetRoomMessagesResponse> {
    const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/rooms/${roomID}/messages`,
    );

    const data: GetRoomMessagesResponse = await response.json();

    return data;
}
