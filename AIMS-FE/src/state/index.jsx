import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCartOpen: false,
  cart: [],
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },

    addToCart: (state, action) => {
      const itemIds = state.cart.map(item => item.id)
      if (itemIds.includes(action.payload.item.id)) {
        const item = state.cart.find(item => item.id);
        item.count += action.payload.item.count
      } else {
        state.cart = [...state.cart, action.payload.item];
      }
    },

    clearCart: (state, action) => {
      state.cart = [];
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload.id);
    },

    increaseCount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.id === action.payload.id) {
          item.count++;
        }
        return item;
      });
    },

    decreaseCount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.id === action.payload.id && item.count > 1) {
          item.count--;
        }
        return item;
      });
    },

    setIsCartOpen: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const {
  setItems,
  addToCart,
  removeFromCart,
  increaseCount,
  decreaseCount,
  setIsCartOpen,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
