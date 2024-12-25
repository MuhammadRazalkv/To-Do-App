

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../Types/UserTypes';

const initialState: AuthState = {
  isAuthenticated: Boolean(localStorage.getItem('token')),
 
  token: localStorage.getItem('token') || null,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateUser(state, action: PayloadAction<User>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    updateProfilePicture(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.profilePicture = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { loginSuccess, logout, updateUser ,updateProfilePicture  } = authSlice.actions;
export default authSlice.reducer;
