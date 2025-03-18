import { supabase } from './supabase'; // Importa a instância do Supabase para conexão com o banco de dados
import { v4 as uuidv4 } from 'uuid'; // Importa a biblioteca UUID para gerar identificadores únicos

// Função para listar todas as contas de um usuário
export async function getTransacao(usuarioId: string) {
    const { data, error } = await supabase
        .from('transacoes') // Acessa a tabela 'contas'
        .select('*') // Seleciona todas as colunas
        .eq('usuario_id', usuarioId); // Filtra pelo ID do usuário

    if (error) {
        console.error('Erro ao buscar transacao:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados das contas do usuário
}

// Função para buscar uma conta específica pelo ID
export async function getTransacaoById(transacaoId: string) {
    
}

// Função para adicionar uma nova conta
export async function addTransacao(usuarioId: string, nome: string, tipo: string, saldoInicial: number) {
    
}

// Função para atualizar os dados de uma conta
export async function updateTransacao(transacaId: string, nome: string, tipo: string, saldoInicial: number) {
   
}

// Função para excluir uma conta
export async function deleteTransacao(transacaoId: string) {
    const { data, error } = await supabase
        .from('transacoes') // Acessa a tabela 'contas'
        .delete() // Exclui a conta
        .eq('id', transacaoId); // Filtra pela conta específica a ser removida

    if (error) {
        console.error('Erro ao deletar conta:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados da conta removida (caso necessário)
}
