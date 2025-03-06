import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Função para listar contas
export async function getContas(usuarioId: string) {
    const { data, error } = await supabase
        .from('contas')
        .select('*')
        .eq('usuario_id', usuarioId);

    if (error) {
        console.error('Erro ao buscar contas:', error.message);
        throw error;
    }

    return data;
}

// Função para inserir uma conta
export async function addConta(usuarioId: string, nome: string, tipo: string, saldoInicial: number) {
    const id = uuidv4();
    const dataCriacao = new Date();
    const dataAtualizacao = new Date();

    const { data, error } = await supabase
        .from('contas')
        .insert([{
            id, usuario_id: usuarioId, nome, tipo, saldo_inicial: saldoInicial,
            data_criacao: dataCriacao,
            data_atualizacao: dataAtualizacao
        }]);

    if (error) {
        console.error('Erro ao adicionar conta:', error.message);
        throw error;
    }

    return data;
}

// Função para atualizar uma conta
export async function updateConta(contaId: string, nome: string, tipo: string, saldoInicial: number) {
    const dataAtualizacao = new Date();

    const { data, error } = await supabase
        .from('contas')
        .update({
            nome, tipo, saldo_inicial: saldoInicial,
            data_atualizacao: dataAtualizacao
        })
        .eq('id', contaId);

    if (error) {
        console.error('Erro ao atualizar conta:', error.message);
        throw error;
    }

    return data;
}

// Função para deletar uma conta
export async function deleteConta(contaId: string) {
    const { data, error } = await supabase
        .from('contas')
        .delete()
        .eq('id', contaId);

    if (error) {
        console.error('Erro ao deletar conta:', error.message);
        throw error;
    }

    return data;
}
