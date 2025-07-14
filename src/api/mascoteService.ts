import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Função para listar todos os mascotes, vinculando aos mascotes já comprados pelo usuário
export async function getMascotes(usuarioId: string) {
    // 1. Buscar todos os mascotes
    const { data: mascotes, error: mascotesError } = await supabase
        .from('mascotes')
        .select('*')
        .order('nome', { ascending: true });

    if (mascotesError) {
        console.error('Erro ao buscar mascotes:', mascotesError.message);
        throw mascotesError;
    }

    // 2. Buscar os mascotes que o usuário já comprou
    const { data: mascotesUsuario, error: mascotesUsuarioError } = await supabase
        .from('mascotes_usuarios')
        .select('mascote_id')
        .eq('usuario_id', usuarioId);

    if (mascotesUsuarioError) {
        console.error('Erro ao buscar mascotes do usuário:', mascotesUsuarioError.message);
        throw mascotesUsuarioError;
    }

    // Cria um Set com os IDs dos mascotes comprados para facilitar a checagem
    const mascotesCompradosIds = new Set(mascotesUsuario.map(mu => mu.mascote_id));

    // Mapeia os mascotes adicionando o campo comprado
    const mascotesComStatus = mascotes.map(m => ({
        ...m,
        comprado: mascotesCompradosIds.has(m.id)
    }));

    return mascotesComStatus;
}

// Função para buscar um mascote específico pelo ID
export async function getMascoteById(mascoteId: string) {
    const { data, error } = await supabase
        .from('mascotes')
        .select('*')
        .eq('id', mascoteId)
        .single();

    if (error) {
        console.error('Erro ao buscar mascote:', error.message);
        throw error;
    }

    return data;
}

// Função para adicionar um novo mascote
export async function purchaseMascote(usuario_id: string, mascote_id: string) {
    const id = uuidv4();

    const { data, error } = await supabase
        .from('mascotes_usuarios')
        .insert([{
            id,
            usuario_id,
            mascote_id
        }]);

    if (error) {
        console.error('Erro ao adicionar mascote:', error.message);
        throw error;
    }

    return data;
}

// Função para adicionar um novo mascote
export async function addMascote(nome: string, preco_moedas: number) {
    const id = uuidv4();

    const { data, error } = await supabase
        .from('mascotes')
        .insert([{
            id,
            nome,
            preco_moedas
        }]);

    if (error) {
        console.error('Erro ao adicionar mascote:', error.message);
        throw error;
    }

    return data;
}

// Função para atualizar um mascote
export async function updateMascote(
    mascoteId: string,
    nome: string,
    preco_moedas: number
) {
    const { data, error } = await supabase
        .from('mascotes')
        .update({
            nome,
            preco_moedas
        })
        .eq('id', mascoteId);

    if (error) {
        console.error('Erro ao atualizar mascote:', error.message);
        throw error;
    }

    return data;
}

// Função para deletar um mascote
export async function deleteMascote(mascoteId: string) {
    const { data, error } = await supabase
        .from('mascotes')
        .delete()
        .eq('id', mascoteId);

    if (error) {
        console.error('Erro ao deletar mascote:', error.message);
        throw error;
    }

    return data;
}
