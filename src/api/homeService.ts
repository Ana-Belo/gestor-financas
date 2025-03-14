import { supabase } from './supabase';

// Função para obter o saldo atual do usuário
export async function getSaldoAtual(usuarioId: string) {
    try {
        // Busca o saldo inicial de todas as contas do usuário
        const { data: contas, error: contasError } = await supabase
            .from('contas')
            .select('id, saldo_inicial')
            .eq('usuario_id', usuarioId);

        if (contasError) {
            console.error('Erro ao buscar contas:', contasError.message);
            throw contasError;
        }

        // Busca todas as transações do usuário
        const { data: transacoes, error: transacoesError } = await supabase
            .from('transacoes')
            .select('tipo, valor')
            .eq('usuario_id', usuarioId);

        if (transacoesError) {
            console.error('Erro ao buscar transações:', transacoesError.message);
            throw transacoesError;
        }

        // Calcula o saldo inicial total somando todos os saldos iniciais das contas
        let saldoTotal = contas.reduce((acc, conta) => acc + parseFloat(conta.saldo_inicial), 0);

        // Ajusta o saldo total somando receitas e subtraindo despesas
        transacoes.forEach(transacao => {
            if (transacao.tipo === 'Receita') {
                saldoTotal += parseFloat(transacao.valor);
            } else if (transacao.tipo === 'Despesa') {
                saldoTotal -= parseFloat(transacao.valor);
            }
        });

        return saldoTotal;
    } catch (error) {
        console.error('Erro ao calcular saldo:', error);
        throw error;
    }
}

// Função para obter a lista de contas com saldo atualizado
export async function getSaldoContas(usuarioId: string) {
    try {
        // Busca as contas do usuário
        const { data: contas, error: contasError } = await supabase
            .from('contas')
            .select('id, nome, saldo_inicial')
            .eq('usuario_id', usuarioId);

        if (contasError) {
            console.error('Erro ao buscar contas:', contasError.message);
            throw contasError;
        }

        // Busca todas as transações do usuário
        const { data: transacoes, error: transacoesError } = await supabase
            .from('transacoes')
            .select('conta_id, tipo, valor')
            .eq('usuario_id', usuarioId);

        if (transacoesError) {
            console.error('Erro ao buscar transações:', transacoesError.message);
            throw transacoesError;
        }

        // Mapeia os saldos das contas corretamente com tipagem explícita
        const saldoContas: Record<string, number> = {};

        contas.forEach(conta => {
            saldoContas[conta.id] = parseFloat(conta.saldo_inicial);
        });

        // Ajusta o saldo de cada conta
        transacoes.forEach(transacao => {
            if (transacao.tipo === 'Receita') {
                saldoContas[transacao.conta_id] = (saldoContas[transacao.conta_id] || 0) + parseFloat(transacao.valor);
            } else if (transacao.tipo === 'Despesa') {
                saldoContas[transacao.conta_id] = (saldoContas[transacao.conta_id] || 0) - parseFloat(transacao.valor);
            }
        });

        // Retorna a lista de contas com saldo atualizado
        return contas.map(conta => ({
            nome: conta.nome,
            saldo: saldoContas[conta.id] || 0
        }));
    } catch (error) {
        console.error('Erro ao obter contas com saldo:', error);
        throw error;
    }
}

// Função para obter as últimas 5 transações do usuário, com categoria associada
export async function getUltimasTransacoes(usuarioId: string) {
    try {
        // Busca as últimas 5 transações do usuário, com os detalhes da categoria, ordenadas pela data mais recente
        const { data: transacoes, error: transacoesError } = await supabase
            .from('transacoes')
            .select(`
                tipo,
                valor,
                descricao,
                categoria:categorias(nome, icone, cor_icone)
            `)  // Fazendo a relação com a tabela 'categorias' usando 'categoria' como alias
            .eq('usuario_id', usuarioId)
            .order('data', { ascending: false })  // Ordena pela data mais recente
            .limit(5);  // Limita a consulta às últimas 5 transações

        if (transacoesError) {
            console.error('Erro ao buscar transações:', transacoesError.message);
            throw transacoesError;
        }

        return transacoes;
    } catch (error) {
        console.error('Erro ao obter últimas transações:', error);
        throw error;
    }
}

// Função para obter o saldo de despesas pendentes do usuário
export async function getSaldoDespesasPendentes(usuarioId: string) {
    try {
        // Busca todas as transações do tipo 'Despesa' e com 'pendente' igual a true
        const { data: transacoes, error: transacoesError } = await supabase
            .from('transacoes')
            .select('valor')
            .eq('usuario_id', usuarioId)
            .eq('tipo', 'Despesa')  // Filtra transações do tipo 'Despesa'
            .eq('pendente', true);  // Filtra transações com pendente = true

        if (transacoesError) {
            console.error('Erro ao buscar transações pendentes:', transacoesError.message);
            throw transacoesError;
        }

        // Calcula o saldo de despesas pendentes somando os valores das transações
        const saldoDespesasPendentes = transacoes.reduce((acc, transacao) => acc + parseFloat(transacao.valor), 0);

        return saldoDespesasPendentes;
    } catch (error) {
        console.error('Erro ao calcular saldo de despesas pendentes:', error);
        throw error;
    }
}

// Função para obter o saldo de receitas pendentes do usuário
export async function getSaldoReceitasPendentes(usuarioId: string) {
    try {
        // Busca todas as transações do tipo 'Receita' e com 'pendente' igual a true
        const { data: transacoes, error: transacoesError } = await supabase
            .from('transacoes')
            .select('valor')
            .eq('usuario_id', usuarioId)
            .eq('tipo', 'Receita')  // Filtra transações do tipo 'Receita'
            .eq('pendente', true);  // Filtra transações com pendente = true

        if (transacoesError) {
            console.error('Erro ao buscar transações pendentes:', transacoesError.message);
            throw transacoesError;
        }

        // Calcula o saldo de receitas pendentes somando os valores das transações
        const saldoReceitasPendentes = transacoes.reduce((acc, transacao) => acc + parseFloat(transacao.valor), 0);

        return saldoReceitasPendentes;
    } catch (error) {
        console.error('Erro ao calcular saldo de receitas pendentes:', error);
        throw error;
    }
}
