'use client';
import { useEffect, useState } from "react";

interface IConfirmationDisplay {
    id: string;
    nomePrincipal: string;
    numAdultos: number;
    numCriancas: number;
    acompanhantes: string[];
    timestampConfirmacao: string;
}

export default function ConfirmadosPage() {

    const [listaConfirmados, setListaConfirmados] = useState<IConfirmationDisplay[]>([]); 

    // Modificar fetchConfirmedParticipants para popular sugestoesNomesPrincipais
    const fetchConfirmedParticipants = async () => {
        try {
            const response = await fetch('https://api.scriptsys.com.br/api/confirmations', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao carregar participantes confirmados');
            }

            const result: IConfirmationDisplay[] = await response.json();
            console.log('Lista de participantes confirmados:', result);
            setListaConfirmados(result);

        } catch (error) {
            console.error('Erro ao carregar participantes confirmados:', error);
        }
    };

    useEffect(() => {
        fetchConfirmedParticipants();
    }, []); 


    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#D9BCBC] p-4">
      <h1 className="text-4xl font-bold text-[#96B780] mb-8">Lista de Confirmados</h1>
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 max-h-[70vh] overflow-y-auto">
            <ul className="space-y-4">
            {listaConfirmados.map((confirmado) => (
                <li key={confirmado.id} className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-[#96B780]">{confirmado.nomePrincipal}</h2>
                    {confirmado.acompanhantes && confirmado.acompanhantes.length > 0 && (
                        <>
                            <h4 className="ml-10 text-[#96B780]">Acompanhantes:</h4>
                            {confirmado.acompanhantes.map((acompanhante, index) => (
                                <p key={index} className="ml-12 text-gray-600">
                                    - {acompanhante}
                                </p>
                            ))}
                        </>
                    )}
                </li>
            ))}
            </ul>
        </div>
    </div>
  );
}