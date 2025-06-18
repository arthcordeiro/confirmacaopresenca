// components/Alert.tsx (ou .jsx)
"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface AlertProps {
  isOpen: boolean;
  message: string;
  onClose: () => void; // Adicionamos uma função para fechar o alerta
  duration?: number; // Duração opcional em milissegundos, padrão 3000ms
}

export const Alert: React.FC<AlertProps> = ({ isOpen, message, onClose, duration = 3000 }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Garante que o portal só tente renderizar no cliente
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isOpen) {
      timer = setTimeout(() => {
        onClose(); // Chama a função onClose após a duração especificada
      }, duration);
    }

    // Função de limpeza para o useEffect
    // Garante que o timer seja limpo se o componente for desmontado
    // ou se isOpen mudar para false antes do timer terminar
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, onClose, duration]); // Dependências do useEffect

  if (!isOpen || !mounted) {
    return null; // Não renderiza nada se não estiver aberto ou não estiver montado
  }

  // Renderiza o alerta via portal, fixo no topo da tela
  return createPortal(
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] w-11/12 max-w-sm" // Centraliza no topo
      role="alert"
    >
      <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 shadow-lg">
        <span className="font-medium">{message}</span>
        {/* Opcional: Adicionar um botão de fechar manual */}
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      </div>
    </div>,
    document.body // Renderiza diretamente no body
  );
};