import { User } from "@/models/user/user";
import { create, createStore } from "zustand";
type AuthState = {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    
}

type AuthActions = {
    login: (email: string , password: string) => Promise<void>;
    register: (userData: {
        email: string;
        password: string;
        name: string;
      }) => Promise<void>;
      logout: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
}

// export const createAuthStore = (state: AuthState = initialState) => {
//     return createStore<AuthStore>(set => ({
//         ...state,
        
//     }));
// }