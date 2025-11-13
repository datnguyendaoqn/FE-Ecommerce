import { createAction, props } from '@ngrx/store';

export const addCart = createAction('[Auth/Cart] addCart');
export const previousCart = createAction('[Auth/Cart] previousCart');
export const resetCart= createAction('[Auth/Cart] resetCart');

// Action khi load thành công
export const loadCartSuccess = createAction(
    '[Cart] Load Success',
    props<{ cartItemCount: number }>()
);

// Action khi load thất bại (nếu cần)
export const loadCartFailure = createAction('[Auth/Cart] Load Failure');
