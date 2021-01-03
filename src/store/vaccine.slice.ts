import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vaccine } from '../lib/types';

const vaccineSlice = createSlice({
    name: 'vaccine',
    initialState: [] as Vaccine[],
    reducers: {
        setVaccines: (state, action: PayloadAction<Vaccine[]>) => {
            return action.payload
        }
    }
});

export const { setVaccines } = vaccineSlice.actions;
export default vaccineSlice.reducer;