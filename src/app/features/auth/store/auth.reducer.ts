import { createReducer, on } from '@ngrx/store';
import { loginSuccess, logout } from './auth.actions';
import { AuthState } from '@core/models/auth';

export const initialState: AuthState = {
    loggedIn: false,
};

export const authReducer = createReducer(
    initialState,
    on(loginSuccess, (state, { isLogged }) => ({
        ...state,
        loggedIn: isLogged,
    })),
    on(logout, () => initialState),
);