"use client";
import FlyingButterflies from "@/app/components/FlyingButterflies";
import { Alert } from "@/app/components/Alert";
import { Modal } from "@/app/components/Modal";
import React, { useEffect, useState } from 'react'; // Importe useState
import Image from 'next/image'

interface IConfirmationDisplay {
    id: string;
    nomePrincipal: string;
    numAdultos: number;
    numCriancas: number;
    acompanhantes: string[];
    timestampConfirmacao: string;
}

export default function ConfirmacaoPage() {
    
    // Estado para controlar a visibilidade do modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nomePrincipal, setNomePrincipal] = useState(''); // Pode pré-preencher com o nome do convidado da URL
    const [acompanhantes, setAcompanhantes] = useState<string[]>([]); // Lista de nomes dos acompanhantes
    const [novoAcompanhante, setNovoAcompanhante] = useState(''); // Estado para o input de novo acompanhante
    const [nomePrincipalError, setNomePrincipalError] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [isButtonDisabled, setBtnDisabled] = useState(false);
    const [sugestoesNomesPrincipais, setSugestoesNomesPrincipais] = useState<string[]>([]);

    useEffect(()=>{
        if (novoAcompanhante) {
            setBtnDisabled(true);
        }
        if (novoAcompanhante == '') {
            setBtnDisabled(false);
        }
    }, [novoAcompanhante])
    
    const handleCloseAlert = () => setShowAlert(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        let hasError = false;
        if (nomePrincipal.trim() === '') {
            setNomePrincipalError('Por favor, digite o nome completo.');
            hasError = true;
        } else {
            setNomePrincipalError(''); // Limpa o erro se o campo não estiver vazio
        }

        if (hasError) {
            return; // Impede o envio do formulário se houver erro
        }


        const confirmacaoData = {
            nomePrincipal: nomePrincipal,
            acompanhantes: acompanhantes,
            // timestampConfirmacao será gerado pelo backend
        };

        console.log(confirmacaoData);

        try {
            const response = await fetch('https://api.scriptsys.com.br/api/confirmations', { // Ajuste a URL se seu backend estiver em outra porta ou domínio
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(confirmacaoData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao confirmar presença');
            }

            const result = await response.json();
            console.log('Confirmação enviada com sucesso:', result);

            // Exibir o alerta de sucesso
            setShowAlert(true);

            setIsModalOpen(false); // Fecha o modal
            // Resetar estados do formulário após sucesso
            setNomePrincipal('');
            setAcompanhantes([]);
            setNovoAcompanhante('');

        } catch (error) {
            console.error('Erro ao enviar confirmação:', error);
            // Exibir um alerta de erro para o usuário (você pode criar um componente Alert de erro)
            alert(`Erro: ${error}`);
        }
    };

    const handleAddAcompanhante = () => {
        if (novoAcompanhante.trim() !== '' && !acompanhantes.includes(novoAcompanhante.trim())) {
            setAcompanhantes([...acompanhantes, novoAcompanhante.trim()]);
            setNovoAcompanhante(''); // Limpa o input após adicionar
        }
        setBtnDisabled(false);
    };

    const handleRemoveAcompanhante = (nomeParaRemover: string) => {
        setAcompanhantes(acompanhantes.filter(nome => nome !== nomeParaRemover));
    };

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

            // Extrair apenas os nomes principais para as sugestões
            const nomesUnicos = Array.from(new Set(result.map(c => c.nomePrincipal)));
            setSugestoesNomesPrincipais(nomesUnicos);

        } catch (error) {
            console.error('Erro ao carregar participantes confirmados:', error);
        }
    };

    useEffect(() => {
        fetchConfirmedParticipants();
    }, []);
  return (
    <>
        <div className="relative h-screen flex flex-col p-8 font-[family-name:var(--font-geist-sans)]">
            <Image
                src="/background.svg" // ou '/40x30@4x.png', se for o caso
                alt="Background"
                layout="fill" // Faz a imagem cobrir o container
                objectFit="cover" // Garante que a imagem cubra todo o espaço sem distorcer
                style={{ zIndex: -1 }} // Coloca a imagem atrás do conteúdo
            />
            <FlyingButterflies imageSrc="/butterfly_animated.gif" quantity={15} /> 
            <div className="flex justify-center items-start mt-0">
                <Image width={200} height={200} src="/um_aninho.png" alt="Logo" className="w-1/2 md:w-1/3 lg:w-1/4 2xl:w-1/5 ml-2" />
            </div>
            <div className="mt-auto flex justify-center items-center pb-12">
                <button 
                    className="justify-end bg-[#A03F4F] hover:bg-[#CB6A7C] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                    onClick={() => setIsModalOpen(true)} // Abre o modal ao clicar
                >Confirmar Presença</button>
            </div>
            {/* O Modal Componente */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {/* Conteúdo do formulário dentro do modal */}
                <h2 className="text-2xl font-bold mb-4 text-white text-center">Confirme Sua Presença</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="nomeCompleto" className="block text-white text-sm font-bold mb-2">
                            Quem é você?
                        </label>
                        <input
                            type="text"
                            id="nomeCompleto"
                            name="nomeCompleto"
                            list="principais-sugestoes"
                            value={nomePrincipal}
                            onChange={(e) => {
                                setNomePrincipal(e.target.value);
                                setNomePrincipalError(''); // Limpa o erro ao digitar
                            }}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline ${nomePrincipalError ? 'border-red-500' : ''}`} // Adiciona borda vermelha
                            placeholder="Seu nome aqui"
                        />
                        <datalist id="principais-sugestoes">
                            {sugestoesNomesPrincipais.map((nome, index) => (
                                <option key={index} value={nome} />
                            ))}
                        </datalist>
                         {/* Mensagem de Erro */}
                        {nomePrincipalError && (
                            <p className="text-red-500 text-xs italic mt-1">{nomePrincipalError}</p>
                        )}
                    </div>
                    {/* Bloco para Adicionar Acompanhantes Dinamicamente */}
                    <div>
                        <label htmlFor="novoAcompanhante" className="block text-white text-sm font-bold mb-2">
                            Quem vem com você?
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                id="novoAcompanhante"
                                name="novoAcompanhante"
                                value={novoAcompanhante}
                                onChange={(e) => setNovoAcompanhante(e.target.value)}
                                onKeyPress={(e) => { // Adiciona ao pressionar Enter
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Evita o envio do formulário
                                        handleAddAcompanhante();
                                    }
                                }}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Nome do acompanhante aqui"
                            />
                            <button
                                type="button" // Importante: type="button" para não enviar o formulário
                                onClick={handleAddAcompanhante}
                                className="bg-[#A03F4F] hover:bg-[#CB6A7C] text-white font-bold py-2 px-4 rounded-full text-xl leading-none flex items-center justify-center"
                                title="Adicionar acompanhante"
                            >
                                +
                            </button>
                        </div>
                        {novoAcompanhante && (<p className="text-red-500 text-xs italic my-1">Pressione o botão + para confirmar seu acompanhate!</p>)}

                        {/* Lista de Acompanhantes Adicionados */}
                        {acompanhantes.length > 0 && (
                            <div className="bg-gray-100 p-3 rounded max-h-32 overflow-y-auto">
                                <p className="text-gray-600 text-xs font-bold mb-1">Acompanhantes adicionados:</p>
                                <ul className="list-disc pl-5 text-gray-600 text-sm">
                                    {acompanhantes.map((acompanhante, index) => (
                                        <li key={index} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
                                            {acompanhante}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAcompanhante(acompanhante)}
                                                className="text-[#A03F4F] ml-2 text-xs font-bold"
                                                title="Remover"
                                            >
                                                &times;
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`bg-[#A03F4F] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isButtonDisabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#A03F4F] hover:bg-[#CB6A7C]' }`}
                        disabled={isButtonDisabled}
                    >
                        Enviar Confirmação
                    </button>
                </form>
            </Modal>
            <Alert
                isOpen={showAlert}
                message="Sua presença foi confirmada com sucesso!"
                onClose={handleCloseAlert}
                duration={3000} // Opcional, mas bom para clareza
            />
        </div>
        
    </>

  );
}