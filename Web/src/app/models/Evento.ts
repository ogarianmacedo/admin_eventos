import { Lote } from "./Lote";
import { Palestrante } from "./Palestrante";
import { Rede } from "./Rede";

export class Evento {

    constructor() {
    }

    id: number; 
    local: string; 
    dataEvento: Date; 
    tema: string; 
    qtdPessoas: number; 
    imagemUrl: string; 
    telefone: string; 
    email: string; 
    lote: string; 
    lotes: Lote[];
    redes: Rede[];
    palestranteEventos: Palestrante[];
}
