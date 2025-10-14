export interface LoginResponseDto {
    user: { id: string; name: string; email: string } | null;
    token: string | null;
    loggedIn: boolean;
}