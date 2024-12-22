import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '@/types';

interface ProductsState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    products: [],
    loading: false,
    error: null,
};

export const fetchProducts = createAsyncThunk<Product[]>(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Failed to fetch products');
            return await res.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchProducts.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.products = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default productsSlice.reducer;
