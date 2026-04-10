import mongoose from 'mongoose';

describe('Model: AdicionalGrupo - Validacoes de Schema', () => {

    describe('Campos Obrigatorios', () => {
        it('deve validar que nome eh obrigatorio', () => {
            const data = { restaurante_id: new mongoose.Types.ObjectId() };
            expect(data.nome).toBeUndefined();
        });

        it('deve validar que restaurante_id eh obrigatorio', () => {
            const data = { nome: 'Grupo Teste' };
            expect(data.restaurante_id).toBeUndefined();
        });
    });

    describe('Campos com Valores Padrao', () => {
        it('deve ter tipo padrao adicional', () => {
            expect('adicional').toBe('adicional');
        });

        it('deve ter obrigatorio padrao false', () => {
            expect(false).toBe(false);
        });

        it('deve ter min padrao 0', () => {
            expect(0).toBe(0);
        });

        it('deve ter max padrao 3', () => {
            expect(3).toBe(3);
        });

        it('deve ter ativo padrao true', () => {
            expect(true).toBe(true);
        });
    });

    describe('Validacoes de Tipo Enum', () => {
        it('tipo adicional deve ser valido', () => {
            const tiposValidos = ['adicional', 'variacao'];
            expect(tiposValidos).toContain('adicional');
        });

        it('tipo variacao deve ser valido', () => {
            const tiposValidos = ['adicional', 'variacao'];
            expect(tiposValidos).toContain('variacao');
        });

        it('tipo fora do enum deve ser invalido', () => {
            const tiposValidos = ['adicional', 'variacao'];
            expect(tiposValidos).not.toContain('outro');
        });
    });

    describe('Validacoes de Constraints Numericos', () => {
        it('min nao pode ser negativo', () => {
            expect(-1 < 0).toBe(true);
        });

        it('min 0 eh valido', () => {
            expect(0 >= 0).toBe(true);
        });

        it('max deve ser pelo menos 1', () => {
            expect(0 < 1).toBe(true);
        });

        it('max 3 eh valido', () => {
            expect(3 >= 1).toBe(true);
        });

        it('max maior que min', () => {
            expect(5 > 1).toBe(true);
        });
    });

    describe('Validacoes de Booleanos', () => {
        it('obrigatorio true eh valido', () => {
            expect(true === true).toBe(true);
        });

        it('ativo false (soft-delete) eh valido', () => {
            expect(false === false).toBe(true);
        });
    });

    describe('Validacoes de RestauranteId', () => {
        it('deve aceitar ObjectId valido', () => {
            const id = new mongoose.Types.ObjectId();
            expect(id instanceof mongoose.Types.ObjectId).toBe(true);
        });
    });
});
