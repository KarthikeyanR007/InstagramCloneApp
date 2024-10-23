// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import usernameReducer from './userNameSlice';
import messageReducer from './messageSlice'; // Add this line

const store = configureStore({
  reducer: {
    user: userReducer,
    userName: usernameReducer,
    messages: messageReducer, // Add messages reducer here
  },
});

export default store;
