import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleChat, addUserMessage, addBotMessage, sendChatMessage } from '../features/chatSlice';
import { openBookingModal } from '../features/uiSlice';

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '18881234567';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hello Urban Spoon! I have an enquiry about your menu.')}`;

export default function ChatWidget() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { open, messages, typing } = useSelector((s) => s.chat);
  const [text, setText] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, open]);

  const send = (value = text) => {
    const msg = value.trim();
    if (!msg || typing) return;
    dispatch(addUserMessage(msg));
    setText('');
    dispatch(sendChatMessage(msg));
  };

  const quick = (type) => {
    if (type === 'menu') {
      dispatch(addUserMessage('I want to see the menu'));
      dispatch(addBotMessage('Sure! Taking you to our full menu now… 🍽️'));
      setTimeout(() => navigate('/menu'), 700);
    } else if (type === 'book') {
      dispatch(addUserMessage('I want to book a table'));
      dispatch(addBotMessage('Great! Opening the booking form for you. 📅'));
      setTimeout(() => dispatch(openBookingModal()), 600);
    } else {
      send('How do I track my order?');
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-24 right-4 sm:right-20 z-[90] w-[300px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col origin-bottom-right transition-all duration-300 ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
        style={{ height: 420 }}
        aria-hidden={!open}
      >
        <div className="bg-dark p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm"><i className="fa-solid fa-robot" /></div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-dark rounded-full" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Urban Spoon AI Assistant</h4>
              <p className="text-gray-400 text-[9px]">Online now</p>
            </div>
          </div>
          <button onClick={() => dispatch(toggleChat(false))} aria-label="Close chat" className="text-gray-400 hover:text-white"><i className="fa-solid fa-xmark text-base" /></button>
        </div>

        <div className="flex-1 p-3 overflow-y-auto chat-scroll flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className="flex gap-2 items-end">
              {m.role === 'assistant' ? (
                <>
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-[10px] shrink-0"><i className="fa-solid fa-robot" /></div>
                  <div className="chat-message-bot whitespace-pre-wrap">{m.content}</div>
                </>
              ) : (
                <div className="chat-message-user whitespace-pre-wrap">{m.content}</div>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex gap-2 items-end">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-[10px]"><i className="fa-solid fa-robot" /></div>
              <div className="chat-message-bot"><i className="fa-solid fa-ellipsis fa-beat" /></div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="px-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {[['menu', '📋 Menu'], ['book', '📅 Book'], ['track', '🚚 Track']].map(([k, l]) => (
            <button key={k} onClick={() => quick(k)} className="shrink-0 bg-gray-100 hover:bg-primary hover:text-white text-gray-600 text-[9px] font-semibold px-2.5 py-1.5 rounded-full transition">{l}</button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2 bg-lightGray rounded-full px-3 py-1.5 border border-gray-200 focus-within:border-primary transition">
            <input value={text} onChange={(e) => setText(e.target.value)} maxLength={500} placeholder="Type your message..." className="flex-1 bg-transparent outline-none text-xs placeholder-gray-400" />
            <button type="submit" disabled={typing} className="w-7 h-7 bg-primary hover:bg-primaryHover disabled:opacity-60 text-white rounded-full flex items-center justify-center" aria-label="Send">
              <i className="fa-solid fa-paper-plane text-[10px]" />
            </button>
          </div>
        </form>
      </div>

      <button
        onClick={() => dispatch(toggleChat())}
        aria-label="Open chat"
        className={`fixed bottom-6 right-4 sm:right-6 z-[90] w-12 h-12 bg-dark hover:bg-primary text-white rounded-full flex items-center justify-center shadow-2xl transition hover:scale-110 ${open ? 'scale-0 opacity-0' : ''}`}
      >
        <i className="fa-solid fa-comments text-xl" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full border-2 border-white animate-pulse" />
      </button>

      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-20 z-[90] w-12 h-12 bg-whatsapp text-white rounded-full flex items-center justify-center shadow-2xl transition hover:scale-110 animate-pulse-glow"
      >
        <i className="fa-brands fa-whatsapp text-2xl" />
      </a>
    </>
  );
}
