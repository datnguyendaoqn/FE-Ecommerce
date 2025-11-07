// auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const loginSuccess = createAction(
  '[Auth] LoginSuccess',
  props<{ isLogged: boolean, fullName?: string }>()
);

export const logout = createAction('[Auth] Logout');