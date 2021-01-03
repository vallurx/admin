import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../lib/types';

const userSlice = createSlice({
    name: 'user',
    initialState: null as User | null,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            return action.payload;
        }
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;