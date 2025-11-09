export interface AuthState {
    loggedIn: boolean;
    fullName?: string;
    role?: string;
    isRestored: boolean;
}