import { supabase } from './supabase'; // Importa a instância do Supabase
import { v4 as uuidv4 } from 'uuid'; // Importa para gerar UUID único

// Função para listar conquistas do usuário ou conquistas globais (sem usuário associado)
export async function getConquistas(usuarioId: string) {
    // 1ª requisição: todas as conquistas
    const { data: todasConquistas, error: errorConquistas } = await supabase
        .from('conquistas')
        .select('*')
        .order('nome', { ascending: true });

    if (errorConquistas) {
        console.error('Erro ao buscar conquistas:', errorConquistas.message);
        throw errorConquistas;
    }

    // 2ª requisição: conquistas adquiridas pelo usuário
    const { data: conquistasUsuario, error: errorUsuario } = await supabase
        .from('conquistas_usuarios')
        .select('conquista_id, data_conquista')
        .eq('usuario_id', usuarioId);

    if (errorUsuario) {
        console.error('Erro ao buscar conquistas do usuário:', errorUsuario.message);
        throw errorUsuario;
    }

    // 3ª etapa: cruzar os dados
    const conquistas = todasConquistas.map(conquista => {
        const adquirida = conquistasUsuario.find(c => c.conquista_id === conquista.id);

        return {
            ...conquista,
            conquistado: !!adquirida, // true se encontrou
            data_conquista: adquirida?.data_conquista || null
        };
    });

    return conquistas;
}

// Função para buscar uma conquista específica pelo ID
export async function getConquistaById(conquistaId: string) {
    const { data, error } = await supabase
        .from('conquistas')
        .select('*')
        .eq('id', conquistaId)
        .single(); // Apenas um registro

    if (error) {
        console.error('Erro ao buscar conquista:', error.message);
        throw error;
    }

    return data;
}

// Função para adicionar uma nova conquista
export async function addConquista(
    usuarioId: string,
    titulo: string,
    descricao: string,
    icone: string,
    corIcone: string
) {
    const id = uuidv4(); // Gera ID único
    const dataCriacao = new Date();
    const dataAtualizacao = new Date();

    const { data, error } = await supabase
        .from('conquistas')
        .insert([{
            id,
            usuario_id: usuarioId,
            titulo,
            descricao,
            icone,
            cor_icone: corIcone,
            data_criacao: dataCriacao,
            data_atualizacao: dataAtualizacao
        }]);

    if (error) {
        console.error('Erro ao adicionar conquista:', error.message);
        throw error;
    }

    return data;
}

// Função para atualizar uma conquista
export async function updateConquista(
    conquistaId: string,
    titulo: string,
    descricao: string,
    icone: string,
    corIcone: string
) {
    const dataAtualizacao = new Date();

    const { data, error } = await supabase
        .from('conquistas')
        .update({
            titulo,
            descricao,
            icone,
            cor_icone: corIcone,
            data_atualizacao: dataAtualizacao
        })
        .eq('id', conquistaId);

    if (error) {
        console.error('Erro ao atualizar conquista:', error.message);
        throw error;
    }

    return data;
}

// Função para deletar uma conquista
export async function deleteConquista(conquistaId: string) {
    const { data, error } = await supabase
        .from('conquistas')
        .delete()
        .eq('id', conquistaId);

    if (error) {
        console.error('Erro ao deletar conquista:', error.message);
        throw error;
    }

    return data;
}