import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  User, 
  Copy, 
  Mic, 
  Paperclip, 
  Moon, 
  Sun,
  Heart,
  ThumbsUp,
  Search,
  MoreVertical,
  Star
} from 'lucide-react';

interface Message {
  text: string;
  type: 'user' | 'model';
  timestamp: Date;
  id: string;
  reactions?: string[];
  isStarred?: boolean;
}

const ModernChatAI = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestedPrompts = [
    { text: "Jelaskan tentang AI", icon: "🤖", category: "Tech" },
    { text: "Tips produktivitas kerja", icon: "⚡", category: "Work" },
    { text: "Resep masakan sederhana", icon: "🍳", category: "Food" },
    { text: "Ide kreatif untuk hobi", icon: "🎨", category: "Creative" },
    { text: "Cara belajar bahasa baru", icon: "🌍", category: "Education" },
    { text: "Tips kesehatan mental", icon: "💚", category: "Health" }
  ];

  useEffect(() => {
    setTimeout(() => {
      contentRef.current?.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  }, [chatHistory, isLoading]);

  // Simulate API call
  const simulateAIResponse = async (input: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const responses = [
      `Terima kasih atas pertanyaan tentang "${input}". Ini adalah respons AI yang mensimulasikan jawaban dari model AI sesungguhnya. Dalam implementasi nyata, ini akan terhubung dengan API AI seperti OpenAI, Gemini, atau Claude.`,
      `Saya memahami pertanyaan Anda tentang "${input}". Sebagai AI assistant, saya siap membantu memberikan informasi dan panduan yang Anda butuhkan. Apakah ada aspek spesifik yang ingin Anda ketahui lebih lanjut?`,
      `Pertanyaan yang menarik tentang "${input}"! Mari saya jelaskan step by step:\n\n1. Pertama, kita perlu memahami konteks\n2. Kemudian menganalisis berbagai aspek\n3. Akhirnya memberikan solusi praktis\n\nApakah ada yang ingin Anda tanyakan lebih lanjut?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (message?: string) => {
    const messageText = message || userInput.trim();
    if (messageText === '' || isLoading) return;

    const newMessage: Message = {
      text: messageText,
      type: 'user',
      timestamp: new Date(),
      id: Date.now().toString()
    };

    setChatHistory(prev => [...prev, newMessage]);
    setUserInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const modelResponse = await simulateAIResponse(messageText);
      const aiMessage: Message = {
        text: modelResponse,
        type: 'model',
        timestamp: new Date(),
        id: (Date.now() + 1).toString()
      };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        text: "Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi dalam beberapa saat.",
        type: 'model',
        timestamp: new Date(),
        id: (Date.now() + 1).toString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleReaction = (messageId: string, reaction: string) => {
    setChatHistory(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const hasReaction = reactions.includes(reaction);
        return {
          ...msg,
          reactions: hasReaction 
            ? reactions.filter(r => r !== reaction)
            : [...reactions, reaction]
        };
      }
      return msg;
    }));
  };

  const toggleStar = (messageId: string) => {
    setChatHistory(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredHistory = chatHistory.filter(message =>
    !searchQuery || message.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-md border-gray-200'} border-b sticky top-0 z-10`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Assistant
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {isLoading ? 'Sedang mengetik...' : 'Online'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <input
              type="text"
              placeholder="Cari dalam percakapan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
        )}
      </header>

      {/* Chat Content */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Welcome Message */}
        {chatHistory.length === 0 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Halo! 👋
            </h2>
            <p className={`mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-md mx-auto`}>
              Saya AI Assistant siap membantu Anda. Pilih topik di bawah atau ketik pertanyaan Anda.
            </p>
            
            {/* Enhanced Suggested Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt.text)}
                  className={`p-4 rounded-xl border text-left transition-all hover:scale-105 hover:shadow-lg ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' 
                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{prompt.icon}</span>
                    <div>
                      <p className="font-medium">{prompt.text}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {prompt.category}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {filteredHistory.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                {message.type === 'model' ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className={`group relative ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`relative p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-800 text-white border border-gray-700'
                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  
                  {/* Message Footer */}
                  <div className={`flex items-center justify-between mt-2 pt-2 border-t ${
                    message.type === 'user'
                      ? 'border-white/20'
                      : isDarkMode
                      ? 'border-gray-700'
                      : 'border-gray-100'
                  }`}>
                    <span className={`text-xs ${
                      message.type === 'user'
                        ? 'text-white/70'
                        : isDarkMode
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>

                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex space-x-1">
                        {message.reactions.map((reaction, idx) => (
                          <span key={idx} className="text-sm">
                            {reaction === 'like' ? '👍' : reaction === 'love' ? '❤️' : '👎'}
                          </span>
                        ))}
                      </div>
                    )}

                    {message.isStarred && (
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>

                {/* Message Actions */}
                <div className={`absolute top-0 ${
                  message.type === 'user' ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                  <div className={`flex flex-col space-y-1 p-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-white shadow-lg border border-gray-200'
                  }`}>
                    <button
                      onClick={() => copyToClipboard(message.text)}
                      className={`p-1 rounded transition-colors ${
                        isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleStar(message.id)}
                      className={`p-1 rounded transition-colors ${
                        message.isStarred ? 'text-yellow-500' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      } ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    {message.type === 'model' && (
                      <>
                        <button
                          onClick={() => toggleReaction(message.id, 'like')}
                          className={`p-1 rounded transition-colors ${
                            isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleReaction(message.id, 'love')}
                          className={`p-1 rounded transition-colors ${
                            isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {(isLoading || isTyping) && (
          <div className="flex justify-start">
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className={`p-4 rounded-2xl ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Input Area */}
      <div className={`flex-shrink-0 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-4 relative z-10`}>
        <div className="flex items-end space-x-3 max-w-4xl mx-auto">
          {/* Attachment Button */}
          <button 
            className={`flex-shrink-0 p-3 rounded-full transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <div className="flex-1 relative min-w-0">
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ketik pesan Anda..."
              rows={1}
              disabled={isLoading}
              className={`w-full px-4 py-3 pr-12 rounded-2xl border resize-none ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
              style={{
                minHeight: '48px',
                maxHeight: '120px'
              }}
            />
          </div>

          {/* Voice Input Button */}
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`flex-shrink-0 p-3 rounded-full transition-all ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Send Button */}
          <button 
            onClick={() => handleSendMessage()}
            disabled={isLoading || userInput.trim() === ''}
            className={`flex-shrink-0 p-3 rounded-full transition-all ${
              isLoading || userInput.trim() === ''
                ? isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Safe area for mobile */}
        <div className="h-safe-area-inset-bottom"></div>
      </div>
    </div>
  );
};

export default ModernChatAI;