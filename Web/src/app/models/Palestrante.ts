import { Rede } from "./Rede";
import { Evento } from "./Evento";

export interface Palestrante {
    id: number; 
    nome: string;
    descricao: string;
    imagemUrl: string;
    telefone: string;
    email: string;
    redes: Rede[]; 
    palestranteEventos: Evento[]; 
}
