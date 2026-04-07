import AdicionalGrupo from '../../models/AdicionalGrupo.js';

describe('Model: AdicionalGrupo', () => {

    it('deve criar um grupo de adicional válido', async () => {

        const data = {
            nome: 'Grupo Bebidas',
            restaurante_id: 'restaurante-123'
        };

        const grupo = await AdicionalGrupo.create(data);

        expect(grupo).toBeDefined();
        expect(grupo.nome).toBe(data.nome);
        expect(grupo.restaurante_id).toBe(data.restaurante_id);
    });

    it('deve falhar ao criar grupo sem nome', async () => {

        const data = {
            descricao: 'Sem nome',
            restaurante_id: 'restaurante-123'
        };

        await expect(
            AdicionalGrupo.create(data)
        ).rejects.toThrow();

    });

    it('deve falhar ao criar grupo sem restaurante_id', async () => {

        const data = {
            nome: 'Grupo Teste'
        };

        await expect(
            AdicionalGrupo.create(data)
        ).rejects.toThrow();

    });

    it('deve atribuir valores padrão aos campos opcionais', async () => {

        const data = {
            nome: 'Grupo Padrão',
            restaurante_id: 'restaurante-123'
        };

        const grupo = await AdicionalGrupo.create(data);

        expect(grupo.tipo).toBe('adicional');
        expect(grupo.obrigatorio).toBe(false);
        expect(grupo.min).toBe(0);
        expect(grupo.max).toBe(3);
        expect(grupo.ativo).toBe(true);
    });

    it('deve criar grupo com tipo variacao', async () => {

        const data = {
            nome: 'Grupo Variações',
            restaurante_id: 'restaurante-123',
            tipo: 'variacao'
        };

        const grupo = await AdicionalGrupo.create(data);

        expect(grupo.tipo).toBe('variacao');
        expect(grupo.nome).toBe(data.nome);
    });

    it('deve criar grupo com obrigatorio true', async () => {

        const data = {
            nome: 'Grupo Obrigatório',
            restaurante_id: 'restaurante-123',
            obrigatorio: true
        };

        const grupo = await AdicionalGrupo.create(data);

        expect(grupo.obrigatorio).toBe(true);
    });

    it('deve criar grupo com min e max customizados', async () => {

        const data = {
            nome: 'Grupo Custom',
            restaurante_id: 'restaurante-123',
            min: 1,
            max: 5
        };

        const grupo = await AdicionalGrupo.create(data);

        expect(grupo.min).toBe(1);
        expect(grupo.max).toBe(5);
    });

    it('deve falhar ao criar grupo com min negativo', async () => {

        const data = {
            nome: 'Grupo Inválido',
            restaurante_id: 'restaurante-123',
            min: -1
        };

        await expect(
            AdicionalGrupo.create(data)
        ).rejects.toThrow();

    });

    it('deve falhar ao criar grupo com max menor que 1', async () => {

        const data = {
            nome: 'Grupo Inválido',
            restaurante_id: 'restaurante-123',
            max: 0
        };

        await expect(
            AdicionalGrupo.create(data)
        ).rejects.toThrow();

    });

    it('deve desativar um grupo existente', async () => {

        const data = {
            nome: 'Grupo Inativo',
            restaurante_id: 'restaurante-123',
            ativo: false
        };

        const grupo = await AdicionalGrupo.create(data);

        expect(grupo.ativo).toBe(false);
        expect(grupo.nome).toBe('Grupo Inativo');

    });

});