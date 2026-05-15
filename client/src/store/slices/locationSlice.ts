import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface DeliveryLocation {
    pincode: string;
    city: string;
    state: string;
    line1?: string;
}

interface LocationState {
    delivery: DeliveryLocation | null;
}

const stored = localStorage.getItem('deliveryLocation');
const initialState: LocationState = {
    delivery: stored ? JSON.parse(stored) : null,
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setDeliveryLocation: (state, action: PayloadAction<DeliveryLocation>) => {
            state.delivery = action.payload;
            localStorage.setItem('deliveryLocation', JSON.stringify(action.payload));
        },
        clearDeliveryLocation: (state) => {
            state.delivery = null;
            localStorage.removeItem('deliveryLocation');
        },
    },
});

export const { setDeliveryLocation, clearDeliveryLocation } = locationSlice.actions;
export default locationSlice.reducer;
