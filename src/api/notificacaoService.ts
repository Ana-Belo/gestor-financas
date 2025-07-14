import { supabase } from './supabase'; // Importa a instância do Supabase
import { v4 as uuidv4 } from 'uuid'; // Gera identificadores únicos

// Lista todas as notificações de um usuário
export async function getNotificacoes(usuarioId: string) {
    const { data, error } = await supabase
        .from('notificacoes') // Acessa a tabela 'notificacoes'
        .select('*') // Seleciona todas as colunas
        .eq('usuario_id', usuarioId) // Filtra pelo usuário
        .order('data_envio', { ascending: false }); // Mais recentes primeiro

    if (error) {
        console.error('Erro ao buscar notificações:', error.message);
        throw error;
    }

    return data;
}

// Busca uma notificação específica pelo ID
export async function getNotificacaoById(notificacaoId: string) {
    const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('id', notificacaoId)
        .single();

    if (error) {
        console.error('Erro ao buscar notificação:', error.message);
        throw error;
    }

    return data;
}

// Adiciona uma nova notificação
export async function addNotificacao(usuarioId: string, mensagem: string) {
    const id = uuidv4();
    const dataEnvio = new Date();

    const { data, error } = await supabase
        .from('notificacoes')
        .insert([{
            id,
            usuario_id: usuarioId,
            mensagem,
            data_envio: dataEnvio
        }]);

    if (error) {
        console.error('Erro ao adicionar notificação:', error.message);
        throw error;
    }

    return data;
}

// Atualiza uma notificação
export async function updateNotificacao(notificacaoId: string, mensagem: string) {
    const { data, error } = await supabase
        .from('notificacoes')
        .update({
            mensagem
        })
        .eq('id', notificacaoId);

    if (error) {
        console.error('Erro ao atualizar notificação:', error.message);
        throw error;
    }

    return data;
}

// Exclui uma notificação
export async function deleteNotificacao(notificacaoId: string) {
    const { data, error } = await supabase
        .from('notificacoes')
        .delete()
        .eq('id', notificacaoId);

    if (error) {
        console.error('Erro ao deletar notificação:', error.message);
        throw error;
    }

    return data;
}
