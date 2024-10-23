import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    addMessage: (state, action) => {
      state.push(action.payload);
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const message = state.find(msg => msg._id === messageId);
      if (message) {
        message.status = status;
      }
    },
  },
});

export const { addMessage, updateMessageStatus } = messageSlice.actions;
export default messageSlice.reducer;
