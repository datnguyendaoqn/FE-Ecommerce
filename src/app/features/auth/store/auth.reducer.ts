import { createReducer, on } from '@ngrx/store';
import { loginSuccess, logout } from './auth.actions';
import { AuthState } from '@core/models/auth';

export const initialState: AuthState = {
    loggedIn: false,
    fullName: undefined
};

export const authReducer = createReducer(
    initialState,
    on(loginSuccess, (state, { isLogged, fullName }) => ({
        ...state,
        loggedIn: isLogged,
        fullName: fullName
    })),
    on(logout, () => initialState),
);