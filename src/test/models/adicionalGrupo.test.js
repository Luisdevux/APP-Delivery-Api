import AdicionalGrupo from '../../models/AdicionalGrupo.js';

describe('Model: AdicionalGrupo', () => {

    it('deve criar um grupo de adicional válido', async () => {

        const data = {
            nome: 'Grupo Bebidas',
            descricao: 'Grupo de bebidas adicionais',
            prato_id: 'prato-123'
        };

        const grupo = await AdicionalGrupo.create(data);

        expect(grupo).toBeDefined();
        expect(grupo.nome).toBe(data.nome);
        expect(grupo.descricao).toBe(data.descricao);
        expect(grupo.prato_id).toBe(data.prato_id);
    });

    it('deve falhar ao criar grupo sem nome', async () => {

        const data = {
            descricao: 'Sem nome',
            prato_id: 'prato-123'
        };

        await expect(
            AdicionalGrupo.create(data)
        ).rejects.toThrow();

    });

    it('deve falhar ao criar grupo sem prato_id', async () => {

        const data = {
            nome: 'Grupo Teste'
        };

        await expect(
            AdicionalGrupo.create(data)
        ).rejects.toThrow();

    });

    it('deve permitir descrição opcional', async () => {

        const data = {
            nome: 'Grupo Simples',
            prato_id: 'prato-123'
        };

        const grupo = await AdicionalGrupo.create(data);

        expect(grupo.descricao).toBeUndefined();
        expect(grupo.nome).toBe('Grupo Simples');

    });

});