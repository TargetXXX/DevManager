import { api } from "../api/axios";
import type { LoginResponse } from "../types/dev";

export async function login(email: string, senha: string) {
    const { data } = await api.post<LoginResponse>("/auth/login", { email, senha });

    return data;
}


export async function checkToken(callBack: () => void) {
    try {
        let token: string = localStorage.getItem('token') as string

        if(!token) {
            callBack();
        }

        const {data} = await api.post("/auth/checktoken", {token});


        if(!data || !data.code || data.code !== 'B') {
            callBack();
        }
    } catch {
        callBack();
    }
    
}
