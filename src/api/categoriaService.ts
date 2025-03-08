import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Função para listar categorias
export async function getCategorias(usuarioId: string) {
    const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .or(`usuario_id.eq.${usuarioId},usuario_id.is.null`);

    if (error) {
        console.error('Erro ao buscar categorias:', error.message);
        throw error;
    }

    return data;
}

// Função para buscar categoria pelo id da categoria
export async function getCategoriaById(categoriaId: string) {
    const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', categoriaId)
        .single(); 

    if (error) {
        console.error('Erro ao buscar categoria:', error.message);
        throw error;
    }

    return data;
}

// Função para inserir uma categoria
export async function addCategoria(usuarioId: string, nome: string, tipo: string, icone: string) {
    const id = uuidv4();
    const dataCriacao = new Date();
    const dataAtualizacao = new Date();

    const { data, error } = await supabase
        .from('categorias')
        .insert([{
            id, usuario_id: usuarioId, nome, tipo, icone,
            data_criacao: dataCriacao,
            data_atualizacao: dataAtualizacao
        }]);

    if (error) {
        console.error('Erro ao adicionar categoria:', error.message);
        throw error;
    }

    return data;
}

// Função para atualizar uma categoria
export async function updateCategoria(categoriaId: string, nome: string, tipo: string, icone: string) {
    const dataAtualizacao = new Date();

    const { data, error } = await supabase
        .from('categorias')
        .update({
            nome, tipo, icone,
            data_atualizacao: dataAtualizacao
        })
        .eq('id', categoriaId);

    if (error) {
        console.error('Erro ao atualizar categoria:', error.message);
        throw error;
    }

    return data;
}

// Função para deletar uma categoria
export async function deleteCategoria(categoriaId: string) {
    const { data, error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', categoriaId);

    if (error) {
        console.error('Erro ao deletar categoria:', error.message);
        throw error;
    }

    return data;
}
