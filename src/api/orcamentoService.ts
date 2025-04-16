import { supabase } from './supabase'; // Importa a instância do Supabase para conexão com o banco de dados
import { v4 as uuidv4 } from 'uuid'; // Importa a biblioteca UUID para gerar identificadores únicos

// Função para listar todas as orcamentos de um usuário
export async function getOrcamento(usuarioId: string) {
    const { data, error } = await supabase
        .from('orcamentos') // Acessa a tabela 'orcamentos'
        .select('*, categoria:categorias(nome, icone, cor_icone)') // Seleciona todas as colunas
        .eq('usuario_id', usuarioId); // Filtra pelo ID do usuário

    if (error) {
        console.error('Erro ao buscar orcamento:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados das orcamentos do usuário
}

// Função para buscar uma orcamento específica pelo ID
export async function getOrcamentoById(orcamentoId: string) {
    const { data, error } = await supabase
        .from('orcamentos') // Acessa a tabela 'orcamentos'
        .select('*') // Seleciona todas as colunas
        .eq('id', orcamentoId) // Filtra pelo ID da orcamento
        .single(); // Retorna um único resultado

    if (error) {
        console.error('Erro ao buscar transação:', error.message);
        throw error;
    }

    return data;
}

// Função para adicionar uma nova orcamento
export async function addOrcamento(usuarioId: string, categoriaId: string, valor_limite: number) {
    const id = uuidv4(); // Gera um identificador único para a orcamento
    const dataCriacao = new Date(); // Define a data de criação como a data atual
    const dataAtualizacao = new Date(); // Define a data de atualização como a data atual

    const { data, error } = await supabase
        .from('orcamentos') // Acessa a tabela 'orcamentos'
        .insert([{ // Insere um novo registro
            id,
            usuario_id: usuarioId,
            categoria_id: categoriaId,
            valor_limite,
            data_criacao: dataCriacao,
            data_atualizacao: dataAtualizacao
        }]);

    if (error) {
        console.error('Erro ao adicionar orcamento:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados da orcamento inserida
}

// Função para atualizar os dados de uma orcamento
export async function updateOrcamento(orcamentoId: string, categoriaId: string, valor_limite: number) {
    const dataAtualizacao = new Date(); // Define a nova data de atualização

    const { data, error } = await supabase
        .from('orcamentos') // Acessa a tabela 'orcamentos'
        .update({ // Atualiza os dados da orcamento
            categoria_id: categoriaId,
            valor_limite,
            data_atualizacao: dataAtualizacao
        })
        .eq('id', orcamentoId); // Filtra pela orcamento específica a ser atualizada

    if (error) {
        console.error('Erro ao atualizar transação:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados da orcamento atualizada
}

// Função para excluir uma orcamento
export async function deleteOrcamento(orcamentoId: string) {
    const { data, error } = await supabase
        .from('orcamentos') // Acessa a tabela 'orcamentos'
        .delete() // Exclui a orcamento
        .eq('id', orcamentoId); // Filtra pela orcamento específica a ser removida

    if (error) {
        console.error('Erro ao deletar orcamento:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados da orcamento removida (caso necessário)
}
