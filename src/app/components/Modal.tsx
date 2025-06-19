// components/Modal.jsx
"use client"; // Essencial para componentes que interagem com o DOM e estado do cliente

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Para renderizar o modal fora da hierarquia DOM normal

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [mounted, setMounted] = useState(false); // Para garantir que o portal só renderize no cliente

  // Efeito para montar o componente apenas no cliente
  useEffect(() => {
    setMounted(true);
    // Adiciona um listener para fechar o modal com a tecla ESC
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!isOpen || !mounted) {
    return null; // Não renderiza nada se não estiver aberto ou não estiver montado no cliente
  }

  // createPortal renderiza o modal diretamente no body ou em outro elemento raiz
  // Isso garante que ele sobreponha outros elementos com facilidade.
  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-[99999]" // z-index muito alto para sobrepor tudo
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay de fundo com opacidade */}
      <div
        className="absolute inset-0 bg-[#96B780] opacity-30 transition-opacity duration-300 " // Fundo preto com 50% de opacidade
        onClick={onClose} // Fecha o modal ao clicar fora
      ></div>

      {/* Conteúdo do Modal (o "quadro" flutuante) */}
      <div className="relative bg-[#D9BCBC] rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto transform transition-all duration-300 scale-100 opacity-100">
        <button
          type="button"
          className="absolute top-3 right-3 text-white hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times; {/* Símbolo de "X" */}
        </button>
        {children} {/* Aqui será renderizado o conteúdo do formulário */}
      </div>
    </div>,
    document.body // Renderiza diretamente dentro da tag <body>
  );
};