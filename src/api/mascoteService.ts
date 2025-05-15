import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Função para listar todos os mascotes (sem filtro de usuário)
export async function getMascotes(usuarioId: string) {
    const { data, error } = await supabase
        .from('mascotes')
        .select('*')
        .order('nome', { ascending: true });

    if (error) {
        console.error('Erro ao buscar mascotes:', error.message);
        throw error;
    }

    return data;
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
