import { AuthState } from '@core/models/auth';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectAuthState = createFeatureSelector<AuthState>('auth');

// Selector kiểm tra đã login chưa
export const selectIsLoggedIn = createSelector(
    selectAuthState,
    (state) => state.loggedIn
);

