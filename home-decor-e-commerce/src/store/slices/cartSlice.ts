import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';

interface CartItem extends Product {
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
        addToCart(state, action: PayloadAction<Product>) {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart(state, action: PayloadAction<number>) {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        clearCart(state) {
            state.items = [];
        },
        changeQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
            const { id, quantity } = action.payload;
            const item = state.items.find(i => i.id === id);
            if (item) {
                item.quantity = quantity;
            }
        }
    },
});

export const { addToCart, removeFromCart, clearCart, changeQuantity } = cartSlice.actions;
export default cartSlice.reducer;
