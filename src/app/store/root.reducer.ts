import { authReducer } from "@features/auth/store/auth.reducer";
import { cartReducer } from "@features/auth/store/cart.reducer";

export const rootReducers = {
    auth: authReducer,
    cart: cartReducer
}