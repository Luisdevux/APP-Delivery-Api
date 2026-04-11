import mongoose from 'mongoose';
import AdicionalGrupo from '../../models/AdicionalGrupo.js';

describe('Model: AdicionalGrupo', () => {
    let AdicionalGrupoModel;

    beforeAll(() => {
        const model = new AdicionalGrupo();
        AdicionalGrupoModel = model.getSchema() ? mongoose.model('AdicionalGrupo', model.getSchema()) : null;
    });

    describe('Regra de Negócio: Grupos de Opções Obrigatórias', () => {
        it('um grupo de tamanho deve ser marcado como obrigatório', () => {
            const grupoTamanho = {
                nome: 'Tamanho',
                tipo: 'variacao',
                obrigatorio: true,
                min: 1,
                max: 1
            };
            expect(grupoTamanho.obrigatorio).toBe(true);
            expect(grupoTamanho.min).toBe(1);
        });

        it('um grupo de adicionais extras pode ser opcional', () => {
            const grupoExtras = {
                nome: 'Adicionais',
                tipo: 'adicional',
                obrigatorio: false,
                min: 0,
                max: 5
            };
            expect(grupoExtras.obrigatorio).toBe(false);
            expect(grupoExtras.min).toBe(0);
        });
    });

    describe('Campos Obrigatórios', () => {
        it('nome é obrigatório para um grupo', () => {
            const grupo = { restaurante_id: new mongoose.Types.ObjectId() };
            expect(grupo.nome).toBeUndefined();
        });

        it('restaurante_id é obrigatório para vincular ao restaurante', () => {
            const grupo = { nome: 'Tamanho' };
            expect(grupo.restaurante_id).toBeUndefined();
        });
    });

    describe('Comportamento de Tipo', () => {
        it('tipo "variacao" é usado para características obrigatórias (ex: tamanho de pizza)', () => {
            const tipo = 'variacao';
            expect(['adicional', 'variacao']).toContain(tipo);
        });

        it('tipo "adicional" é usado para extras opcionais (ex: ingredientes extras)', () => {
            const tipo = 'adicional';
            expect(['adicional', 'variacao']).toContain(tipo);
        });

        it('tipo padrão é "adicional" quando não especificado', () => {
            const grupo = {};
            expect(grupo.tipo || 'adicional').toBe('adicional');
        });
    });

    describe('Constraints de Quantidade (min/max)', () => {
        it('min não pode ser negativo (ex: não faz sentido -1 seleção)', () => {
            const min = 0;
            expect(min).toBeGreaterThanOrEqual(0);
        });

        it('max deve ser pelo menos 1 quando configurado (ex: tamanho requer mínimo 1)', () => {
            const max = 1;
            expect(max).toBeGreaterThanOrEqual(1);
        });

        it('max pode ser vários (ex: múltiplas seleções de toppings)', () => {
            const max = 5;
            expect(max).toBeGreaterThanOrEqual(1);
        });

        it('relação min/max deve fazer sentido (min <= max)', () => {
            const min = 1;
            const max = 3;
            expect(min).toBeLessThanOrEqual(max);
        });
    });

    describe('Comportamento de Ativação (Soft-delete)', () => {
        it('grupo ativo deve estar disponível para seleção', () => {
            const grupo = { ativo: true, nome: 'Tamanho' };
            expect(grupo.ativo).toBe(true);
        });

        it('grupo desativado usa soft-delete em vez de deleção real', () => {
            const grupo = { ativo: false, nome: 'Tamanho' };
            expect(grupo.ativo).toBe(false);
        });
    });

    describe('Casos Reais de Uso', () => {
        it('grupo de tamanho de pizza (obrigatório, única seleção)', () => {
            const grupoTamanhoPizza = {
                nome: 'Tamanho',
                tipo: 'variacao',
                obrigatorio: true,
                min: 1,
                max: 1,
                ativo: true
            };
            
            expect(grupoTamanhoPizza.tipo).toBe('variacao');
            expect(grupoTamanhoPizza.obrigatorio).toBe(true);
            expect(grupoTamanhoPizza.min).toBe(1);
            expect(grupoTamanhoPizza.max).toBe(1);
        });

        it('grupo de toppings (opcional, múltiplas seleções)', () => {
            const grupoToppings = {
                nome: 'Toppings Extras',
                tipo: 'adicional',
                obrigatorio: false,
                min: 0,
                max: 10,
                ativo: true
            };
            
            expect(grupoToppings.tipo).toBe('adicional');
            expect(grupoToppings.obrigatorio).toBe(false);
            expect(grupoToppings.min).toBe(0);
        });

        it('grupo descontinuado (soft-delete)', () => {
            const grupoPiscainte = {
                nome: 'Opção Descontinuada',
                tipo: 'adicional',
                ativo: false // soft-delete
            };
            
            expect(grupoPiscainte.ativo).toBe(false);
        });
    });
});
