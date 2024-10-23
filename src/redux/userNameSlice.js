import { createSlice } from '@reduxjs/toolkit';

const userNameSlice = createSlice({
  name: 'username',
  initialState: {
    username: null,
  },
  reducers: {
    setUser(state, action) {
      state.username = action.payload; // Set the user data
    },
    clearUser(state) {
      state.username = null; // Clear the user data
    },
  },
});

// Export actions
export const { setUser, clearUser } = userNameSlice.actions; // Ensure this matches

// Export the reducer
export default userNameSlice.reducer;
