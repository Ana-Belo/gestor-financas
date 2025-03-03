import { supabase } from './supabase';

export async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function logout() {
    await supabase.auth.signOut();
}

export async function getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        console.error("Erro ao obter usuário:", error.message)
        return null
    }

    return user
}
