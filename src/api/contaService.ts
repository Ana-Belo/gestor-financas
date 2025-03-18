import { supabase } from './supabase'; // Importa a instância do Supabase para conexão com o banco de dados
import { v4 as uuidv4 } from 'uuid'; // Importa a biblioteca UUID para gerar identificadores únicos

// Função para listar todas as contas de um usuário
export async function getContas(usuarioId: string) {
    const { data, error } = await supabase
        .from('contas') // Acessa a tabela 'contas'
        .select('*') // Seleciona todas as colunas
        .eq('usuario_id', usuarioId) // Filtra pelo ID do usuário
        .order('nome', { ascending: true }); // Ordena pelo nome;

    if (error) {
        console.error('Erro ao buscar contas:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados das contas do usuário
}

// Função para buscar uma conta específica pelo ID
export async function getContaById(contaId: string) {
    const { data, error } = await supabase
        .from('contas') // Acessa a tabela 'contas'
        .select('*') // Seleciona todas as colunas
        .eq('id', contaId) // Filtra pelo ID da conta
        .single(); // Retorna um único resultado

    if (error) {
        console.error('Erro ao buscar conta:', error.message);
        throw error;
    }

    return data;
}

// Função para adicionar uma nova conta
export async function addConta(usuarioId: string, nome: string, tipo: string, saldoInicial: number) {
    const id = uuidv4(); // Gera um identificador único para a conta
    const dataCriacao = new Date(); // Define a data de criação como a data atual
    const dataAtualizacao = new Date(); // Define a data de atualização como a data atual

    const { data, error } = await supabase
        .from('contas') // Acessa a tabela 'contas'
        .insert([{ // Insere um novo registro
            id,
            usuario_id: usuarioId,
            nome,
            tipo,
            saldo_inicial: saldoInicial, // Define o saldo inicial
            data_criacao: dataCriacao,
            data_atualizacao: dataAtualizacao
        }]);

    if (error) {
        console.error('Erro ao adicionar conta:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados da conta inserida
}

// Função para atualizar os dados de uma conta
export async function updateConta(contaId: string, nome: string, tipo: string, saldoInicial: number) {
    const dataAtualizacao = new Date(); // Define a nova data de atualização

    const { data, error } = await supabase
        .from('contas') // Acessa a tabela 'contas'
        .update({ // Atualiza os dados da conta
            nome,
            tipo,
            saldo_inicial: saldoInicial,
            data_atualizacao: dataAtualizacao
        })
        .eq('id', contaId); // Filtra pela conta específica a ser atualizada

    if (error) {
        console.error('Erro ao atualizar conta:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados da conta atualizada
}

// Função para excluir uma conta
export async function deleteConta(contaId: string) {
    const { data, error } = await supabase
        .from('contas') // Acessa a tabela 'contas'
        .delete() // Exclui a conta
        .eq('id', contaId); // Filtra pela conta específica a ser removida

    if (error) {
        console.error('Erro ao deletar conta:', error.message); // Loga o erro caso ocorra
        throw error; // Lança o erro para ser tratado externamente
    }

    return data; // Retorna os dados da conta removida (caso necessário)
}
