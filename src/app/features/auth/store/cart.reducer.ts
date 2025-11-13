import { createReducer, on } from "@ngrx/store";
import { addCart, previousCart, loadCartSuccess, loadCartFailure, resetCart } from "./cart.actions";
import { count } from "rxjs";

export interface CartState {
    count: number;
}

export const initialState: CartState = {
    count: 0,
};

export const cartReducer = createReducer(
    initialState,
    on(addCart, (state) => ({ ...state, count: state.count + 1 })),
    on(previousCart, (state) => ({ ...state, count: state.count - 1 })),
    on(loadCartSuccess, (state, { cartItemCount }) => ({ ...state, count: cartItemCount })),
    on(loadCartFailure, (state) => ({
        ...state,
        count: state.count
    })),
    on(resetCart, (state) => ({
        ...state,
        count: 0
    }))
);
