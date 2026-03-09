interface AddMessageReactionRequest {
    roomID: string;
    messageID: string;
}

export async function addMessageReaction({
    roomID,
    messageID,
}: AddMessageReactionRequest) {
    const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/rooms/${roomID}/messages/${messageID}/react`,
        {
            method: 'PATCH',
        },
    );

    const data: { count: number } = await response.json();

    console.log(data);

    return data;
}
