import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

const WELCOME = [
  { role: 'assistant', content: 'Hi there! 👋 Welcome to Urban Spoon. How can I help you today?' },
  { role: 'assistant', content: 'Ask me about our menu, dietary needs, opening hours or booking a table!' },
];

export const sendChatMessage = createAsyncThunk('chat/send', async (message, { getState, rejectWithValue }) => {
  try {
    const history = getState().chat.messages.slice(-10);
    const { data } = await api.post('/chat', { message, history });
    return data.reply;
  } catch {
    return rejectWithValue('Sorry, I could not reach the server. Please try again or message us on WhatsApp.');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: { open: false, messages: WELCOME, typing: false },
  reducers: {
    toggleChat: (s, a) => {
      s.open = typeof a.payload === 'boolean' ? a.payload : !s.open;
    },
    addUserMessage: (s, a) => {
      s.messages.push({ role: 'user', content: a.payload });
    },
    addBotMessage: (s, a) => {
      s.messages.push({ role: 'assistant', content: a.payload });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (s) => {
        s.typing = true;
      })
      .addCase(sendChatMessage.fulfilled, (s, a) => {
        s.typing = false;
        s.messages.push({ role: 'assistant', content: a.payload });
      })
      .addCase(sendChatMessage.rejected, (s, a) => {
        s.typing = false;
        s.messages.push({ role: 'assistant', content: a.payload });
      });
  },
});

export const { toggleChat, addUserMessage, addBotMessage } = chatSlice.actions;
export default chatSlice.reducer;
