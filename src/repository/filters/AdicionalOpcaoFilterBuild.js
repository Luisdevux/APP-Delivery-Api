import mongoose from "mongoose";

class AdicionalOpcaoFilterBuild {
    constructor() {
        this.filtros = {};
    }

    comGrupoId(grupoId) {
        if (grupoId) {
            try {
                this.filtros.grupo_id = new mongoose.Types.ObjectId(grupoId);
            } catch (error) {
                // ID invalido, nao adiciona ao filtro.
            }
        }
        return this;
    }

