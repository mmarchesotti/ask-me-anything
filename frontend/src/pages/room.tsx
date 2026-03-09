import { Share2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import amaLogo from '../assets/ama-logo.svg';
import { Messages } from '../components/messages';
import { Suspense } from 'react';
import { CreateMessageForm } from '../components/create-message-form';

export function Room() {
    const { roomID } = useParams();

    const navigate = useNavigate();

    function handleShareRoom() {
        const url = window.location.href.toString();

        if (navigator.share != undefined && navigator.canShare()) {
            navigator.share({ url });
        } else {
            navigator.clipboard.writeText(url);

            toast('O link da sala foi copiado para a área de transferência');
        }
    }

    function handleCreateMessage(data: FormData) {
        const theme = data.get('theme')?.toString();
        navigate(`/room/${theme}`);
    }

    return (
        <div className="mx-auto my-10 max-w-[640px] flex flex-col gap-6 px-4">
            <div className="flex items-center px-3 gap-3">
                <img className="h-5" src={amaLogo} alt="AMA" />
                <div className="flex items-end gap-1 truncate">
                    <span className="text-zinc-500 text-sm">
                        Código da sala:
                    </span>
                    <span className="text-zinc-300 truncate">{roomID}</span>
                </div>
                <button
                    type="button"
                    onClick={handleShareRoom}
                    className="bg-zinc-800 text-zinc-300 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-zinc-700"
                >
                    Compartilhar
                    <Share2 className="size-4" />
                </button>
            </div>

            <div className="h-px w-full bg-zinc-900" />

            <CreateMessageForm />

            <Suspense fallback={<p>Carregando...</p>}>
                <Messages />
            </Suspense>
        </div>
    );
}
