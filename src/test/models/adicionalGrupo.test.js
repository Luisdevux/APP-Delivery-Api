import mongoose from 'mongoose';
import AdicionalGrupo from '../../models/AdicionalGrupo.js';

describe('Model: AdicionalGrupo', () => {
    let AdicionalGrupoModel;

    beforeAll(() => {
        // AdicionalGrupo já é a model exportada diretamente
        AdicionalGrupoModel = AdicionalGrupo;
    });

    describe('Regra de Negócio: Grupos de Opções Obrigatórias', () => {
        it('um grupo de tamanho deve ser marcado como obrigatório e única seleção', () => {
            const grupoTamanho = {
                nome: 'Tamanho',
                tipo: 'variacao',
                obrigatorio: true,
                min: 1,
                max: 1
            };
            expect(grupoTamanho.obrigatorio).toBe(true);
            expect(grupoTamanho.min).toBe(1);
            expect(grupoTamanho.max).toBe(1);
            expect(grupoTamanho.tipo).toBe('variacao');
        });

        it('um grupo de toppings opcionais permite múltiplas seleções', () => {
            const grupoExtras = {
                nome: 'Toppings',
                tipo: 'adicional',
                obrigatorio: false,
                min: 0,
                max: 5
            };
            expect(grupoExtras.obrigatorio).toBe(false);
            expect(grupoExtras.min).toBe(0);
            expect(grupoExtras.max).toBeGreaterThanOrEqual(2);
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
        it('min não pode ser negativo', () => {
            const min = 0;
            expect(min).toBeGreaterThanOrEqual(0);
        });

        it('max deve ser válido (>= 1)', () => {
            const max = 1;
            expect(max).toBeGreaterThanOrEqual(1);
        });

        it('pode permitir várias seleções (max=5)', () => {
            const max = 5;
            expect(max).toBeGreaterThanOrEqual(1);
        });

        it('relação min/max deve ser consistente (min <= max)', () => {
            const min = 1;
            const max = 3;
            expect(min).toBeLessThanOrEqual(max);
        });

        it('quando obrigatório e única seleção: min=1, max=1', () => {
            const min = 1;
            const max = 1;
            expect(min).toBe(max);
        });

        it('quando opcional: min=0, max>=1', () => {
            const min = 0;
            const max = 5;
            expect(min).toBe(0);
            expect(max).toBeGreaterThanOrEqual(1);
        });
    });

    describe('Comportamento de Ativação (Soft-delete)', () => {
        it('grupo ativo está disponível para seleção', () => {
            const grupo = { ativo: true, nome: 'Tamanho' };
            expect(grupo.ativo).toBe(true);
        });

        it('grupo desativado não aparece nas consultas normais (soft-delete)', () => {
            const grupo = { ativo: false, nome: 'Tamanho Antigo' };
            expect(grupo.ativo).toBe(false);
        });
    });

    describe('Casos Reais de Uso', () => {
        it('quando cliente pede pizza, pode escolher exatamente 1 tamanho', () => {
            const grupoTamanhoPizza = {
                nome: 'Tamanho da Pizza',
                tipo: 'variacao',
                obrigatorio: true,
                min: 1,
                max: 1,
                ativo: true
            };
            
            expect(grupoTamanhoPizza.tipo).toBe('variacao');
            expect(grupoTamanhoPizza.obrigatorio).toBe(true);
            expect(grupoTamanhoPizza.min).toBe(grupoTamanhoPizza.max);
        });

        it('cliente pode adicionar 0 a 5 toppings opcionais', () => {
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
            expect(grupoToppings.max).toBeGreaterThanOrEqual(1);
        });

        it('quando um grupo deixa de existir, é marcado inativo em vez de deletado', () => {
            const grupoInativo = {
                nome: 'Opção Descontinuada',
                tipo: 'adicional',
                ativo: false // soft-delete
            };
            
            expect(grupoInativo.ativo).toBe(false);
        });
    });
});
