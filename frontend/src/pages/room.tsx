import { ArrowRight, Share2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import amaLogo from '../assets/ama-logo.svg';
import { Messages } from '../components/messages';
import { Suspense } from 'react';

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
        <div className="mx-auto my-10 w-[640px] max-w-[640px] flex flex-col gap-6 px-4">
            <div className="flex items-center px-3 gap-3">
                <img className="h-5" src={amaLogo} alt="AMA" />
                <div className="flex flex-1 items-center gap-1">
                    <div className="text-zinc-500 text-sm truncate">
                        Código da sala:
                    </div>
                    <div className="text-zinc-300">{roomID}</div>
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

            <form
                action={handleCreateMessage}
                className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800 ring-orange-400 ring-offset-2 ring-offset-zinc-950 focus-within:ring-1"
            >
                <input
                    type="text"
                    name="message"
                    placeholder="Qual a sua pergunta?"
                    autoComplete="off"
                    className="flex-1 text-sm bg-transparent mx-2 outline-none text-zinc-100 placeholder:text-zinc-500"
                />

                <button
                    type="submit"
                    className="bg-orange-400 text-orange-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-orange-500"
                >
                    Criar pergunta
                    <ArrowRight className="size-4" />
                </button>
            </form>

            <Suspense fallback={<p>Carregando...</p>}>
                <Messages />
            </Suspense>
        </div>
    );
}
