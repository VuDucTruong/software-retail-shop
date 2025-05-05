import { apiRequest } from "@/lib/apiClient";

export const authService = {
    login: login,
    register: register,
    logout: logout,
}


function login(email: string, password: string) {
    return apiRequest({
        method: 'POST',
        url: '/accounts/tokens',
        data: { email, password },
    });
}

function register(userData: { email: string; password: string; name: string }) {
    return apiRequest({
        method: 'POST',
        url: '/accounts/register',
        data: userData,
    });
}

function logout() {
    return apiRequest({
        method: 'POST',
        url: '/accounts/logout',
    });
}