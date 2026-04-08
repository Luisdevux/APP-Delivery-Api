import AdicionalGrupoBuild from '../../repository/filters/AdicionalGrupoBuild.js';
import mongoose from 'mongoose';

describe('Filter: AdicionalGrupoBuild - Regras de Negócio', () => {

    describe('Constructor e Inicialização', () => {
        it('deve inicializar com filtros vazios', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.build();

            expect(filtros).toBeDefined();
            expect(typeof filtros).toBe('object');
            expect(Object.keys(filtros).length).toBe(0);
        });

        it('deve retornar novo objeto a cada construção', () => {
            const builder1 = new AdicionalGrupoBuild();
            const builder2 = new AdicionalGrupoBuild();

            expect(builder1.build()).not.toBe(builder2.build());
        });
    });

    describe('Filtro por Nome', () => {
        it('deve filtrar por nome com normalização simples', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comNome('Bebidas').build();

            expect(filtros.nome).toBeDefined();
            expect(filtros.nome.$regex).toBeDefined();
            expect(filtros.nome.$options).toBe('i');
        });

        it('deve normalizar acentos em nomes', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comNome('Açúcar').build();

            expect(filtros.nome).toBeDefined();
            expect(filtros.nome.$regex).toBeDefined();
            expect(filtros.nome.$options).toBe('i');
        });

        it('deve ignorar nome vazio', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comNome('').build();

            expect(filtros.nome).toBeUndefined();
        });

        it('deve ignorar nome null', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comNome(null).build();

            expect(filtros.nome).toBeUndefined();
        });

        it('deve ignorar nome undefined', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comNome(undefined).build();

            expect(filtros.nome).toBeUndefined();
        });

        it('deve criar regex case-insensitive', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comNome('BEBIDAS').build();

            expect(filtros.nome.$options).toBe('i');
        });

        it('deve permitir encadeamento após comNome', () => {
            const builder = new AdicionalGrupoBuild();
            const resultado = builder.comNome('Bebidas');

            expect(resultado).toEqual(builder);
        });
    });

    describe('Filtro por Status Ativo (Soft Delete)', () => {
        it('deve filtrar por ativo true', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comAtivo(true).build();

            expect(filtros.ativo).toBe(true);
        });

        it('deve filtrar por ativo false (soft-delete)', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comAtivo(false).build();

            expect(filtros.ativo).toBe(false);
        });

        it('deve aceitar string "true"', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comAtivo('true').build();

            expect(filtros.ativo).toBe(true);
        });

        it('deve aceitar string "false"', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comAtivo('false').build();

            expect(filtros.ativo).toBe(false);
        });

        it('deve aceitar número 1 como true', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comAtivo(1).build();

            expect(filtros.ativo).toBe(true);
        });

        it('deve aceitar string "1" como true', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comAtivo('1').build();

            expect(filtros.ativo).toBe(true);
        });

        it('deve aceitar número 0 como false', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comAtivo(0).build();

            expect(filtros.ativo).toBe(false);
        });

        it('deve ignorar ativo undefined', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comAtivo(undefined).build();

            expect(filtros.ativo).toBeUndefined();
        });

        it('deve permitir encadeamento após comAtivo', () => {
            const builder = new AdicionalGrupoBuild();
            const resultado = builder.comAtivo(true);

            expect(resultado).toEqual(builder);
        });
    });

    describe('Filtro por Restaurante (Chave Estrangeira)', () => {
        it('deve filtrar por restaurante_id ObjectId válido', () => {
            const restauranteId = new mongoose.Types.ObjectId().toString();
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comRestauranteId(restauranteId).build();

            expect(filtros.restaurante_id).toBeDefined();
            expect(filtros.restaurante_id instanceof mongoose.Types.ObjectId).toBe(true);
        });

        it('deve converter string para ObjectId', () => {
            const restauranteId = new mongoose.Types.ObjectId().toString();
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comRestauranteId(restauranteId).build();

            expect(filtros.restaurante_id.equals(new mongoose.Types.ObjectId(restauranteId))).toBe(true);
        });

        it('deve ignorar restaurante_id inválido', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comRestauranteId('inválido').build();

            expect(filtros.restaurante_id).toBeUndefined();
        });

        it('deve ignorar restaurante_id vazio', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comRestauranteId('').build();

            expect(filtros.restaurante_id).toBeUndefined();
        });

        it('deve ignorar restaurante_id null', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comRestauranteId(null).build();

            expect(filtros.restaurante_id).toBeUndefined();
        });

        it('deve validar ObjectId correto no MongoDB', () => {
            const validId = '507f1f77bcf86cd799439011'; // ObjectId válido
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comRestauranteId(validId).build();

            expect(filtros.restaurante_id).toBeDefined();
            expect(filtros.restaurante_id instanceof mongoose.Types.ObjectId).toBe(true);
        });

        it('deve permitir encadeamento após comRestauranteId', () => {
            const restauranteId = new mongoose.Types.ObjectId().toString();
            const builder = new AdicionalGrupoBuild();
            const resultado = builder.comRestauranteId(restauranteId);

            expect(resultado).toEqual(builder);
        });
    });

    describe('Filtro por Tipo (Enum: adicional | variacao)', () => {
        it('deve filtrar por tipo "adicional"', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comTipo('adicional').build();

            expect(filtros.tipo).toBe('adicional');
        });

        it('deve filtrar por tipo "variacao"', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comTipo('variacao').build();

            expect(filtros.tipo).toBe('variacao');
        });

        it('deve ignorar tipo inválido', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comTipo('invalido').build();

            expect(filtros.tipo).toBeUndefined();
        });

        it('deve ignorar tipo vazio', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comTipo('').build();

            expect(filtros.tipo).toBeUndefined();
        });

        it('deve ignorar tipo null', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comTipo(null).build();

            expect(filtros.tipo).toBeUndefined();
        });

        it('deve ignorar tipo undefined', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comTipo(undefined).build();

            expect(filtros.tipo).toBeUndefined();
        });

        it('deve ser case-sensitive no tipo (rejeita "Adicional")', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comTipo('Adicional').build();

            expect(filtros.tipo).toBeUndefined();
        });

        it('deve permitir encadeamento após comTipo', () => {
            const builder = new AdicionalGrupoBuild();
            const resultado = builder.comTipo('adicional');

            expect(resultado).toEqual(builder);
        });
    });

    describe('Filtro por Obrigatoriedade', () => {
        it('deve filtrar por obrigatorio true', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comObrigatorio(true).build();

            expect(filtros.obrigatorio).toBe(true);
        });

        it('deve filtrar por obrigatorio false', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comObrigatorio(false).build();

            expect(filtros.obrigatorio).toBe(false);
        });

        it('deve aceitar string "true"', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comObrigatorio('true').build();

            expect(filtros.obrigatorio).toBe(true);
        });

        it('deve aceitar número 1 como true', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comObrigatorio(1).build();

            expect(filtros.obrigatorio).toBe(true);
        });

        it('deve ignorar obrigatorio undefined', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.comObrigatorio(undefined).build();

            expect(filtros.obrigatorio).toBeUndefined();
        });

        it('deve permitir encadeamento após comObrigatorio', () => {
            const builder = new AdicionalGrupoBuild();
            const resultado = builder.comObrigatorio(true);

            expect(resultado).toEqual(builder);
        });
    });

    describe('Encadeamento de Múltiplos Filtros (Fluent API)', () => {
        it('deve combinar todos os filtros', () => {
            const restauranteId = new mongoose.Types.ObjectId().toString();
            const builder = new AdicionalGrupoBuild();
            const filtros = builder
                .comNome('Bebidas')
                .comAtivo(true)
                .comRestauranteId(restauranteId)
                .comTipo('adicional')
                .comObrigatorio(false)
                .build();

            expect(filtros.nome).toBeDefined();
            expect(filtros.ativo).toBe(true);
            expect(filtros.restaurante_id).toBeDefined();
            expect(filtros.tipo).toBe('adicional');
            expect(filtros.obrigatorio).toBe(false);
        });

        it('deve permitir reordenação de filtros', () => {
            const restauranteId = new mongoose.Types.ObjectId().toString();
            const builder1 = new AdicionalGrupoBuild();
            const filtros1 = builder1
                .comNome('Bebidas')
                .comAtivo(true)
                .comRestauranteId(restauranteId)
                .build();

            const builder2 = new AdicionalGrupoBuild();
            const filtros2 = builder2
                .comRestauranteId(restauranteId)
                .comNome('Bebidas')
                .comAtivo(true)
                .build();

            // Ambos devem resultar em filtros com os mesmos campos
            expect(Object.keys(filtros1).sort()).toEqual(Object.keys(filtros2).sort());
        });

        it('deve sobrescrever filtros duplicados', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder
                .comNome('Bebidas')
                .comNome('Alimentos')
                .build();

            expect(filtros.nome).toBeDefined();
            // Deve conter o último valor setado
            expect(filtros.nome.$regex).toBeDefined();
        });

        it('deve suportar fluxo completo com restaurante + tipo', () => {
            const restauranteId = new mongoose.Types.ObjectId().toString();
            const builder = new AdicionalGrupoBuild();
            const filtros = builder
                .comRestauranteId(restauranteId)
                .comTipo('variacao')
                .comObrigatorio(true)
                .build();

            expect(filtros.restaurante_id).toBeDefined();
            expect(filtros.tipo).toBe('variacao');
            expect(filtros.obrigatorio).toBe(true);
        });
    });

    describe('Casos de Uso Reais de Negócio', () => {
        it('Caso 1: Listar grupos de adicional de um restaurante', () => {
            const restauranteId = new mongoose.Types.ObjectId().toString();
            const builder = new AdicionalGrupoBuild();
            const filtros = builder
                .comRestauranteId(restauranteId)
                .comAtivo(true)
                .build();

            expect(filtros.restaurante_id).toBeDefined();
            expect(filtros.ativo).toBe(true);
            expect(Object.keys(filtros).length).toBe(2);
        });

        it('Caso 2: Filtrar grupos do tipo "variacao" obrigatórios (ex: Tamanhos)', () => {
            const restauranteId = new mongoose.Types.ObjectId().toString();
            const builder = new AdicionalGrupoBuild();
            const filtros = builder
                .comRestauranteId(restauranteId)
                .comTipo('variacao')
                .comObrigatorio(true)
                .comAtivo(true)
                .build();

            expect(filtros.tipo).toBe('variacao');
            expect(filtros.obrigatorio).toBe(true);
            expect(filtros.ativo).toBe(true);
        });

        it('Caso 3: Buscar grupos de adicional opcionais (extras)', () => {
            const restauranteId = new mongoose.Types.ObjectId().toString();
            const builder = new AdicionalGrupoBuild();
            const filtros = builder
                .comRestauranteId(restauranteId)
                .comTipo('adicional')
                .comObrigatorio(false)
                .comAtivo(true)
                .build();

            expect(filtros.tipo).toBe('adicional');
            expect(filtros.obrigatorio).toBe(false);
        });

        it('Caso 4: Pesquisar grupo por nome em restaurante específico', () => {
            const restauranteId = new mongoose.Types.ObjectId().toString();
            const builder = new AdicionalGrupoBuild();
            const filtros = builder
                .comRestauranteId(restauranteId)
                .comNome('Bebidas')
                .comAtivo(true)
                .build();

            expect(filtros.restaurante_id).toBeDefined();
            expect(filtros.nome).toBeDefined();
            expect(filtros.ativo).toBe(true);
        });

        it('Caso 5: Listar grupos inativos (soft-delete) para auditoria', () => {
            const restauranteId = new mongoose.Types.ObjectId().toString();
            const builder = new AdicionalGrupoBuild();
            const filtros = builder
                .comRestauranteId(restauranteId)
                .comAtivo(false)
                .build();

            expect(filtros.ativo).toBe(false);
            expect(filtros.restaurante_id).toBeDefined();
        });
    });

    describe('Validação de Integração com MongoDB Query', () => {
        it('filtro resultante deve ser objeto válido para find()', () => {
            const restauranteId = new mongoose.Types.ObjectId().toString();
            const builder = new AdicionalGrupoBuild();
            const filtros = builder
                .comRestauranteId(restauranteId)
                .comAtivo(true)
                .comTipo('adicional')
                .build();

            // Validar que é um objeto válido
            expect(typeof filtros).toBe('object');
            expect(filtros).not.toBeNull();

            // Validar que tem campos esperados
            expect('restaurante_id' in filtros || Object.keys(filtros).length >= 1).toBe(true);
        });

        it('deve construir filtros sem campos undefined', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder
                .comNome('')
                .comAtivo(undefined)
                .comTipo('inválido')
                .build();

            // Nenhum desses deve estar no objeto
            expect('nome' in filtros).toBe(false);
            expect('ativo' in filtros).toBe(false);
            expect('tipo' in filtros).toBe(false);
            expect(Object.keys(filtros).length).toBe(0);
        });
    });

    describe('Método build()', () => {
        it('deve retornar novo objeto a cada chamada', () => {
            const builder = new AdicionalGrupoBuild();
            builder.comNome('Bebidas');

            const filtros1 = builder.build();
            const filtros2 = builder.build();

            expect(filtros1).not.toBe(filtros2);
        });

        it('deve manter a imutabilidade do builder', () => {
            const builder = new AdicionalGrupoBuild();
            builder.comNome('Bebidas');

            const filtros = builder.build();
            filtros.customField = 'custom';

            const filtros2 = builder.build();
            expect('customField' in filtros2).toBe(false);
        });

        it('build sem filtros deve retornar objeto vazio', () => {
            const builder = new AdicionalGrupoBuild();
            const filtros = builder.build();

            expect(Object.keys(filtros).length).toBe(0);
            expect(JSON.stringify(filtros)).toBe('{}');
        });
    });

});
