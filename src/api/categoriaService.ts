import { supabase } from './supabase'; // Importa a instância do Supabase para conexão com o banco de dados
import { v4 as uuidv4 } from 'uuid'; // Importa a biblioteca UUID para gerar identificadores únicos

// Função para listar categorias do usuário ou categorias globais (sem usuário associado)
export async function getCategorias(usuarioId: string) {
    const { data, error } = await supabase
        .from('categorias') // Acessa a tabela 'categorias'
        .select('*') // Seleciona todas as colunas
        // Busca categorias do usuário específico ou categorias sem um usuário associado
        .or(`usuario_id.eq.${usuarioId},usuario_id.is.null`)
        .order('nome', { ascending: true });  // Ordena pelo nome;

    if (error) {
        console.error('Erro ao buscar categorias:', error.message);
        throw error;
    }

    return data;
}

// Função para buscar uma categoria específica pelo ID
export async function getCategoriaById(categoriaId: string) {
    const { data, error } = await supabase
        .from('categorias') // Acessa a tabela 'categorias'
        .select('*') // Seleciona todas as colunas
        .eq('id', categoriaId) // Filtra pelo ID da categoria
        .single(); // Retorna um único resultado

    if (error) {
        console.error('Erro ao buscar categoria:', error.message);
        throw error;
    }

    return data;
}

// Função para adicionar uma nova categoria
export async function addCategoria(usuarioId: string, nome: string, tipo: string, icone: string, corIcone: string) {
    const id = uuidv4(); // Gera um ID único para a categoria
    const dataCriacao = new Date(); // Data de criação
    const dataAtualizacao = new Date(); // Data da última atualização

    const { data, error } = await supabase
        .from('categorias')
        .insert([{
            id,
            usuario_id: usuarioId, // Associa a categoria a um usuário específico
            nome,
            tipo,
            icone,
            cor_icone: corIcone,
            data_criacao: dataCriacao,
            data_atualizacao: dataAtualizacao
        }]);

    if (error) {
        console.error('Erro ao adicionar categoria:', error.message);
        throw error;
    }

    return data;
}

// Função para atualizar os dados de uma categoria existente
export async function updateCategoria(categoriaId: string, nome: string, tipo: string, icone: string, corIcone: string) {
    const dataAtualizacao = new Date(); // Registra a data da atualização

    const { data, error } = await supabase
        .from('categorias')
        .update({
            nome,
            tipo,
            icone,
            cor_icone: corIcone,
            data_atualizacao: dataAtualizacao
        })
        .eq('id', categoriaId); // Filtra pela categoria a ser atualizada

    if (error) {
        console.error('Erro ao atualizar categoria:', error.message);
        throw error;
    }

    return data;
}

// Função para excluir uma categoria pelo ID
export async function deleteCategoria(categoriaId: string) {
    const { data, error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', categoriaId); // Filtra a categoria que será removida

    if (error) {
        console.error('Erro ao deletar categoria:', error.message);
        throw error;
    }

    return data;
}
