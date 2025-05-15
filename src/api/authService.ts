import { supabase } from './supabase'; // Importa a instância do Supabase para autenticação

// Função para realizar o login do usuário
export async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Erro ao fazer login:", error.message); // Registra erro caso a autenticação falhe
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados da sessão autenticada
}

// Função para realizar logout do usuário
export async function logout() {
    const { error } = await supabase.auth.signOut(); // Encerra a sessão do usuário autenticado

    if (error) {
        console.error("Erro ao sair:", error.message); // Registra erro caso o logout falhe
        throw error;
    }
}

// Função para obter o usuário autenticado
export async function getUser() {
    const { data: { session }, error } = await supabase.auth.getSession(); // Obtém a sessão atual

    if (error || !session) { // Se houver erro ou não houver sessão ativa
        console.log("Usuário não autenticado."); // Exibe mensagem no console
        return null; // Retorna null indicando que não há usuário autenticado
    }

    return session.user; // Retorna os dados do usuário autenticado
}

// Função para registrar um novo usuário
export async function register(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName, // Armazena o nome completo do usuário nos metadados
            },
        },
    });

    if (error) {
        console.error("Erro ao cadastrar usuário:", error.message); // Registra erro caso o cadastro falhe
        throw error;
    }

    return data; // Retorna os dados da conta criada
}

// Função para login com Google
export async function loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });

    if (error) {
        console.error("Erro ao fazer login com Google:", error.message);
        throw error;
    }

    return data;
}
