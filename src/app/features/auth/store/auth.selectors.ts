import { AuthState } from '@core/models/auth';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectAuthState = createFeatureSelector<AuthState>('auth');

// Selector kiểm tra đã login chưa
export const selectIsLoggedIn = createSelector(
    selectAuthState,
    (state) => state.loggedIn
);

// Selector Kiểm tra tên login
export const selectFullName = createSelector(
    selectAuthState,
    (state) => state.fullName
)
