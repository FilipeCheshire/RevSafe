import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  RotateCcw,
  ShieldCheck,
  Info
} from 'lucide-react';
import { ChatMessage, Product } from '../../types';
import { sendChatMessage } from '../../services/chatService';

interface ChatbotViewProps {
  onOpenProductDetail: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  comparedIds: string[];
  initialQuestion?: string | null;
  onClearInitialQuestion?: () => void;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  onOpenProductDetail,
  onToggleCompare,
  comparedIds,
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content: `Olá! Sou o assistente técnico da **RevSafe**.\n\nPosso comparar especificações, analisar índices de reparabilidade e esclarecer dúvidas com base nos 4 pilares: Qualidade, Segurança, Sustentabilidade e Custo-Benefício.\n\nEm que posso te orientar hoje?`,
      timestamp: 'Agora',
      isSimulated: true,
      suggestedPrompts: [
        'Comparar Galaxy S24 Ultra vs iPhone 15',
        'Qual a melhor Air Fryer com segurança atestada?',
        'Notebook confiável para trabalho até R$ 3.500',
        'Verificação de compatibilidade de placas AM5',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Scroll only the conversation, never its ancestors or the page.
    container.scrollTo({
      top: messages.length === 1 ? 0 : container.scrollHeight,
      behavior: messages.length === 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuestion) {
      handleSend(`Gostaria de saber mais e avaliar o produto "${initialQuestion}".`);
      onClearInitialQuestion?.();
    }
  }, [initialQuestion]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(text, messages);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: response.message,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isSimulated: response.isSimulated,
        referencedProducts: response.referencedProducts,
        suggestedPrompts: response.suggestedPrompts,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: 'Não foi possível completar a consulta externa no momento. A base técnica local continua disponível nas páginas de Catálogo e Comparador.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isSimulated: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        content: `Histórico reiniciado. Digite sua pergunta ou selecione um dos tópicos abaixo:`,
        timestamp: 'Agora',
        isSimulated: true,
        suggestedPrompts: [
          'Comparar Galaxy S24 Ultra vs iPhone 15',
          'Qual a Air Fryer mais segura?',
          'Notebook com maior durabilidade',
        ],
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col h-[calc(100dvh-80px)] min-h-[420px]">
      {/* Header do Chat */}
      <div className="flex items-center justify-between pb-4 section-band shrink-0">
        <div className="flex min-w-0 items-center gap-3">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-brand-action flex items-center justify-center text-white font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-bold text-base text-slate-900 dark:text-white">
                Chatbot RevSafe
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Imparcial
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Orientação técnica sobre produtos e hardware
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          title="Limpar histórico"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Limpar</span>
        </button>
      </div>

      {/* Janela de Mensagens */}
      <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto space-y-4 py-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-brand-action text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="min-w-0 flex-1 max-w-[calc(100%-44px)] sm:max-w-[78%] space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-brand-action text-white rounded-tr-none shadow-sm'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Cards de produtos citados */}
                {!isUser && msg.referencedProducts && msg.referencedProducts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {msg.referencedProducts.map((p) => {
                      const isComp = comparedIds.includes(p.id);

                      return (
                        <div
                          key={p.id}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                                {p.brand}
                              </div>
                              <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {p.name}
                              </div>
                              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                R$ {p.price.toLocaleString('pt-BR')}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              onClick={() => onOpenProductDetail(p)}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
                            >
                              Ficha
                            </button>
                            <button
                              onClick={() => onToggleCompare(p)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                                isComp
                                  ? 'bg-brand-action text-white'
                                  : 'border border-slate-300 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {isComp ? 'Comparando' : 'Comparar'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Sugestões de perguntas */}
                {!isUser && msg.suggestedPrompts && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {msg.suggestedPrompts.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(sug)}
                        className="text-[11px] py-1 px-3 rounded-full bg-slate-100 hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start animate-in fade-in">
            <div className="w-8 h-8 rounded-lg bg-brand-action text-white flex items-center justify-center shrink-0 text-xs font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-brand animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-brand animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-600 dark:text-slate-400 pl-1">Processando resposta...</span>
            </div>
          </div>
        )}

      </div>

      {/* Caixa de Entrada de Texto */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-3 section-band shrink-0"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua dúvida sobre produtos, especificações ou segurança..."
            className="w-full py-3 pl-4 pr-12 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-brand-action hover:bg-brand-action-hover disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white transition-all cursor-pointer"
            title="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
