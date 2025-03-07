import { supabase } from './supabase';

export async function login(email: string, password: string) {
    console.log(email, password)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Erro ao fazer login:", error.message);
        throw error;
    }

    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Erro ao sair:", error.message);
        throw error;
    }
}

export async function getUser() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        console.log("Usuário não autenticado.");
        return null;
    }

    return session.user;
}
