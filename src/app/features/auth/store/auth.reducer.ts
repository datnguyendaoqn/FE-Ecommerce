import { createReducer, on } from '@ngrx/store';
import { loginSuccess, logout } from './auth.actions';
import { AuthState } from '@core/models/auth';

export const initialState: AuthState = {
    loggedIn: false,
    fullName: undefined,
    role: undefined, 
    isRestored: false
};

export const authReducer = createReducer(
    initialState,
    on(loginSuccess, (state, { isLogged, fullName, role }) => ({ 
        ...state,
        loggedIn: isLogged,
        fullName: fullName,
        role: role,
        isRestored: true
    })),
    on(logout, (state) => ({
        ...initialState,
        isRestored: true
    })),
);