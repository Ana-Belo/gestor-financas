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

    const { data: userCoin, error: errorCoin } = await supabase
        .from('usuario_moedas')
        .select('*')
        .eq('usuario_id', session?.user?.id);

    if (errorCoin) {
        console.error('Erro ao buscar moedas do usuário:', errorCoin.message);
        throw error;
    }
    const coinData = userCoin && userCoin.length > 0 ? userCoin[0] : { moedas_usadas: 0, total_moedas: 0 };

    return { ...session.user, ...coinData } // Retorna os dados do usuário autenticado
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

// Função para enviar e-mail de recuperação de senha
export async function resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/redefinirsenha'
    });

    if (error) {
        console.error("Erro ao enviar e-mail de redefinição:", error.message);
        throw error;
    }

    return data;
}

// Função para alterar a senha do usuário
export async function updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        console.error("Erro ao atualizar senha:", error.message);
        throw error;
    }

    return data;
}