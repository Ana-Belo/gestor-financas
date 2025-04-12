import { supabase } from './supabase'; // Importa a instância do Supabase para conexão com o banco de dados
import { v4 as uuidv4 } from 'uuid'; // Importa a biblioteca UUID para gerar identificadores únicos

// Função para listar todas as transacoes de um usuário
export async function getTransacao(usuarioId: string) {
    const { data, error } = await supabase
        .from('transacoes') // Acessa a tabela 'transacoes'
        .select(`
            id,
            tipo,
            valor,
            descricao,
            data,
            categoria:categorias(nome, icone, cor_icone)
        `)  // Seleciona todas as colunas
        .eq('usuario_id', usuarioId); // Filtra pelo ID do usuário

    if (error) {
        console.error('Erro ao buscar transacao:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados das transacoes do usuário
}

// Função para buscar uma transacao específica pelo ID
export async function getTransacaoById(transacaoId: string) {
    const { data, error } = await supabase
        .from('transacoes') // Acessa a tabela 'transacoes'
        .select('*') // Seleciona todas as colunas
        .eq('id', transacaoId) // Filtra pelo ID da transacao
        .single(); // Retorna um único resultado

    if (error) {
        console.error('Erro ao buscar transação:', error.message);
        throw error;
    }

    return data;
}

// Função para adicionar uma nova transacao
export async function addTransacao(usuarioId: string, contaId: string, categoriaId: string, descricao: string, tipo: string, valor: number, dataTransacao: string, pendente: boolean) {
    const id = uuidv4(); // Gera um identificador único para a transacao
    const dataCriacao = new Date(); // Define a data de criação como a data atual
    const dataAtualizacao = new Date(); // Define a data de atualização como a data atual

    const { data, error } = await supabase
        .from('transacoes') // Acessa a tabela 'transacoes'
        .insert([{ // Insere um novo registro
            id,
            usuario_id: usuarioId,
            conta_id: contaId,
            categoria_id: categoriaId,
            descricao,
            tipo,
            valor,
            data: dataTransacao,
            pendente,
            data_criacao: dataCriacao,
            data_atualizacao: dataAtualizacao
        }]);

    if (error) {
        console.error('Erro ao adicionar transacao:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados da transacao inserida
}

// Função para atualizar os dados de uma transacao
export async function updateTransacao(transacaoId: string, contaId: string, categoriaId: string, descricao: string, tipo: string, valor: number, dataTransacao: string, pendente: boolean) {
    const dataAtualizacao = new Date(); // Define a nova data de atualização

    const { data, error } = await supabase
        .from('transacoes') // Acessa a tabela 'transacoes'
        .update({ // Atualiza os dados da transacao
            conta_id: contaId,
            categoria_id: categoriaId,
            descricao,
            tipo,
            valor,
            data: dataTransacao,
            pendente,
            data_atualizacao: dataAtualizacao
        })
        .eq('id', transacaoId); // Filtra pela transacao específica a ser atualizada

    if (error) {
        console.error('Erro ao atualizar transação:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados da transacao atualizada
}

// Função para excluir uma transacao
export async function deleteTransacao(transacaoId: string) {
    const { data, error } = await supabase
        .from('transacoes') // Acessa a tabela 'transacoes'
        .delete() // Exclui a transacao
        .eq('id', transacaoId); // Filtra pela transacao específica a ser removida

    if (error) {
        console.error('Erro ao deletar transacao:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados da transacao removida (caso necessário)
}
