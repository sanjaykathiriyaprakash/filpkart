import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    product: any;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<any>) => {
            const existingIndex = state.items.findIndex(
                (item) => item.product.id === action.payload.id
            );
            if (existingIndex >= 0) {
                state.items[existingIndex].quantity += 1;
            } else {
                state.items.push({ product: action.payload, quantity: 1 });
            }
        },
        incrementQuantity: (state, action: PayloadAction<string>) => {
            const item = state.items.find((item) => item.product.id === action.payload);
            if (item) {
                item.quantity += 1;
            }
        },
        decrementQuantity: (state, action: PayloadAction<string>) => {
            const existingIndex = state.items.findIndex((item) => item.product.id === action.payload);
            if (existingIndex >= 0) {
                if (state.items[existingIndex].quantity === 1) {
                    state.items.splice(existingIndex, 1);
                } else {
                    state.items[existingIndex].quantity -= 1;
                }
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(
                (item) => item.product.id !== action.payload
            );
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
