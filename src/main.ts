// Biblioteca de integração com o sistema de Prescrição Eletrônica do Conselho Federal de Medicina do Brasil.
// Copyright (C) 2023 CFM.

class UrlParts {
    readonly url: string;
    constructor(readonly origin: string, readonly path: string) {
        this.url = origin + path;
    }
}

/**
 * Ambientes para os quais pode-se apontar.
 */
export class CfmAmbiente {

    /** Executando localmente na máquina do desenvolvedor. */
    static readonly LOCAL = new CfmAmbiente('LOCAL',
        new UrlParts('http://localhost:5173', '/docs/simulacao/receita/receita.html'));

    /** Executar apontando para o ambiente de simulação (sem backend real). */
    static readonly SIMULACAO = new CfmAmbiente('SIMULACAO',
        new UrlParts('https://conselho-federal-de-medicina.github.io', '/integracao-prescricao-cfm/simulacao/receita/receita.html'));

    /** Executar apontando para o ambiente de homologação (solicitar credenciais ao CFM). */
    static readonly HOMOLOGACAO = new CfmAmbiente('HOMOLOGACAO',
        new UrlParts('???', '???'));

    /** Executar apontando para o ambiente de produção (solicitar credenciais ao CFM). */
    static readonly PRODUCAO = new CfmAmbiente('PRODUCAO',
        new UrlParts('???', '???'));

    public constructor(
        readonly nomeAmbiente: string,
        readonly paginaPrescricao: UrlParts) {}

}

/**
 * Tipos de documento que podem ser gerados.
 */
export class CfmTipoDocumento {

    /** Será gerado um receituário simples. */
    static readonly RECEITA_SIMPLES = new CfmTipoDocumento('RECEITA_SIMPLES');
    /** Será gerado um receituário de antimicrobiano. */
    static readonly ANTIMICROBIANO = new CfmTipoDocumento('ANTIMICROBIANO');
    /** * Será gerado um receituário de controle especial. */
    static readonly CONTROLE_ESPECIAL = new CfmTipoDocumento('CONTROLE_ESPECIAL');

    private constructor(readonly nome: string) {}

}

/**
 * Tipos de resposta enviados pela janela da Prescrição.
 */
class CfmTipoResposta {

    /** O documento foi assinado com sucesso. */
    static readonly SUCESSO = new CfmTipoResposta('SUCESSO');
    /** Não foi possível processar a mensagem enviada. */
    static readonly ERRO_INTEGRACAO = new CfmTipoResposta('ERRO_INTEGRACAO');
    /** O access token enviado é inválido. */
    static readonly ERRO_AUTENTICACAO = new CfmTipoResposta('ERRO_AUTHENTICACAO');
    /** Erro ao tentar fazer login. */
    static readonly ERRO_FALHA_DE_LOGIN = new CfmTipoResposta('ERRO_FALHA_DE_LOGIN');
    /** Erro ao tentar assinar o documento. */
    static readonly ERRO_FALHA_DE_ASSINATURA = new CfmTipoResposta('ERRO_FALHA_DE_ASSINATURA');
    /** O usuário apertou o botão "Cancelar". */
    static readonly ERRO_USUARIO_CANCELOU = new CfmTipoResposta('ERRO_USUARIO_CANCELOU');
    /** Algum outro erro não mapeado. */
    static readonly ERRO_OUTRO = new CfmTipoResposta('ERRO_OUTRO');

    private constructor(readonly nome: string) {}

}

/**
 * Local de atendimento (clínica ou hospital).
 */
export class CfmLocalAtendimento {

    /**
     * @param idLocal ID do local de atendimento no seu sistema. Obrigatório.
     * @param logo Imagem PNG ou JPG com no máximo 200kB.
     * @param nome Nome do local de atendimento. Obrigatório.
     * @param endereco Endereço do local de atendimento.
     * @param email Email para contato.
     * @param telefoneCelular Telefone celular para contato.
     * @param telefoneFixo Telefone fixo para contato.
     */
    constructor(
        public idLocal: string,
        public logo: string,
        public nome: string,
        public endereco: CfmEndereco,
        public email: string,
        public telefoneCelular: string,
        public telefoneFixo: string) {}

}

/**
 * Dados do paciente.
 */
export class CfmPaciente {

    /**
     * @param idPaciente ID do paciente no seu sistema. Obrigatório.
     * @param nome Nome do paciente. Obrigatório.
     * @param nomeSocial Nome social do paciente.
     * @param cpf CPF do paciente.
     * @param dataNascimento Data de nascimento do paciente (formato ISO: YYYYMMDD).
     * @param sexo Sigla do sexo do paciente ('M' ou 'F').
     * @param email Email para contato (usado para enviar a receita por email).
     * @param telefoneCelular Telefone celular para contato (usado para enviar a receita por WhatsApp).
     * @param telefoneFixo Telefone fixo para contato.
     * @param endereco Endereço do paciente.
     * @param responsavelLegal Responsável legal do paciente.
     */
    constructor(
        public idPaciente: string,
        public nome: string,
        public nomeSocial: string,
        public cpf: string,
        public dataNascimento: string,
        public sexo: string,
        public email: string,
        public telefoneCelular: string,
        public telefoneFixo: string,
        public endereco: CfmEndereco,
        public responsavelLegal: CfmResponsavelLegal) {}

}

/**
 * Dados do responsável legal do paciente.
 */
export class CfmResponsavelLegal {

    /**
     * @param nome Nome do responsável legal. Obrigatório.
     * @param cpf CPF do responsável legal.
     */
    constructor(
        public nome: string,
        public cpf: string) {}

}

/**
 * Endereço do paciente ou do local de atendimento.
 */
export class CfmEndereco {

    /**
     * @param cep CEP (somente números).
     * @param uf Sigla do estado. Obrigatório.
     * @param cidade Nome da cidade. Obrigatório.
     * @param bairro Nome do bairro.
     * @param logradouro Logradouro. Obrigatório.
     * @param numero Número.
     * @param complemento Complemento.
     */
    constructor(
        public cep: string,
        public uf: string,
        public cidade: string,
        public bairro: string,
        public logradouro: string,
        public numero: string,
        public complemento: string) {}

}

/**
 * Informações do medicamento sendo prescrito.
 */
export class CfmMedicamento {

    /**
     * @param idMedicamento ID do medicamento no seu sistema. Opcional.
     * @param manipulado Se o medicamento é manipulado ou não.
     * @param nome Nome do medicamento. Obrigatório.
     * @param concentracao Concentração (ex: 5mg).
     * @param quantidade Quantidade (ex: 10). Obrigatório para industrializados.
     * @param informacoes Descrição da fórmula, administração, posologia, duração do tratamento e outras informações. Obrigatório para manipulados.
     */
    constructor(
        public idMedicamento: string,
        public manipulado: boolean,
        public nome: string,
        public concentracao: string,
        public quantidade: number,
        public informacoes: string) {}

}

/**
 * Dados da prescrição.
 */
export class CfmPrescricao {

    /**
     * @param localAtendimento Local de atendimento.
     * @param paciente CfmPaciente sendo atendido.
     * @param medicamentos Lista de medicamentos sendo prescritos.
     */
    constructor(
        public localAtendimento: CfmLocalAtendimento,
        public paciente: CfmPaciente,
        public medicamentos: CfmMedicamento[]) {}

}

/**
 * Mensagem enviada do seu sistema para o sistema do CFM, para geração do PDF assinado da receita.
 */
export class CfmRequestMessage {

    /**
     * @param accessToken Token de acesso, padrão OAuth2, autenticando o seu sistema.
     * @param prescricao Dados da receita sendo gerada.
     */
    constructor(
        public accessToken: string,
        public prescricao: CfmPrescricao) {}

}

/**
 * Mensagem retornada do sistema do CFM para o seu.
 */
export class CfmResponseMessage {

    /**
     * @param tipo Tipo da resposta sendo retornada (sucesso ou erro).
     * @param urlDocumento URL do PDF assinado (retornado apenas em caso de sucesso).
     * @param mensagemErro Motivo do erro (retornado apenas em caso de erro).
     */
    constructor(
        public tipo: CfmTipoResposta,
        public urlDocumento: string,
        public mensagemErro: string) {}

}

/**
 * Classe principal da integração.
 * Usada para criar a janela filha (iframe ou popup onde a página da Prescrição CFM será carregada),
 * e trocar mensagens entre a janela pai (janela do seu sistema) e a janela filha.
 */
export class CfmIntegracaoPrescricao {

    private static _nextInstanceId = 1;

    private readonly instanceId: number;
    public readonly idIframe: string;
    public readonly nomePopup: string;

    private iframe: HTMLIFrameElement | null = null;
    private popup: WindowProxy | null = null;
    private responseListener: EventListener | null = null;

    /**
     * @param ambiente Ambiente de execução (serve para definir as URLs que serão usadas).
     */
    constructor(public ambiente: CfmAmbiente) {
        this.instanceId = CfmIntegracaoPrescricao._nextInstanceId++;
        this.idIframe = 'cfm_prescricao_iframe_' + this.instanceId;
        this.nomePopup = 'cfm_prescricao_aba_' + this.instanceId;
    }

    /**
     * Cria o iframe da Prescrição dentro do elemento passado como parâmetro.
     *
     * @param tipoDocumento Tipo do documento que será gerado nesse iframe.
     * @param idElementoPai ID do elemento pai do iframe (geralmente uma div vazia).
     * @return Promise indicando que o iframe terminou de carregar, portanto, já é possível enviar mensagens para a janela dele.
     */
    criarIframe(tipoDocumento: CfmTipoDocumento, idElementoPai: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.iframe) {
                // iframe já existe, destrói e recria
                this.destruirIframe();
            }
            let parent = document.getElementById(idElementoPai);
            if (!parent) {
                // elemento pai (onde o iframe seria inserido) não existe
                return reject(new Error("Não foi possível carrega a Prescrição Eletrônica do CFM. Motivo: elemento pai do iframe não encontrado; idElementoPai: " + idElementoPai));
            }
            // cria o iframe
            this.iframe = document.createElement('iframe');
            this.iframe.setAttribute('id', this.idIframe);
            this.iframe.setAttribute('width', '100%');
            this.iframe.setAttribute('height', '100%');
            this.iframe.setAttribute('frameborder', '0');
            this.iframe.setAttribute('src', this.ambiente.paginaPrescricao.url + `?tipoDocumento=${tipoDocumento.nome}`);
            // resolve a promise quando a janela terminar de carregar
            this.iframe.addEventListener('load', _event => {
                resolve();
            });
            // adiciona o iframe no DOM (vai iniciar o carregamento)
            parent.appendChild(this.iframe);
        });
    }

    /**
     * Remove o iframe da Prescrição do DOM.
     */
    destruirIframe() {
        if (this.iframe) {
            this.iframe.remove();
            this.iframe = null;
        }
        this.removeResponseListener();
    }

    /**
     * Cria a popup da Prescrição com as windowFeatures passadas como parâmetro.
     *
     * @param tipoDocumento Tipo do documento que será gerado nessa popup.
     * @param windowFeatures DOMString para ser passado para window.open().
     * @return Promise indicando que a popup terminou de carregar, portanto, já é possível enviar mensagens para a janela dela.
     */
    criarPopup(tipoDocumento: CfmTipoDocumento, windowFeatures: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.popup) {
                // popup já existe, destrói e recria
                this.destruirPopup();
            }
            // cria a popup
            this.popup = window.open(this.ambiente.paginaPrescricao.url + `?tipoDocumento=${tipoDocumento.nome}`, this.nomePopup, windowFeatures);
            if (!this.popup) {
                return reject(new Error("Não foi possível carrega a Prescrição Eletrônica do CFM. Motivo: a janela popup não pôde ser aberta."));
            }
            // TODO: detectar que a popup terminou de carregar usando postMessage e setInterval
            setTimeout(resolve, 1000);
        });
    }

    /**
     * Fecha a popup da Prescrição.
     */
    destruirPopup() {
        if (this.popup) {
            this.popup.close();
            this.popup = null;
        }
        this.removeResponseListener();
    }

    /**
     * @return O objeto Window onde a página da Prescrição foi carregada (tanto faz se foi aberta em um iframe ou em uma popup).
     */
    obterTargetWindow(): Window | null {
        if (this.iframe) {
            return this.iframe.contentWindow;
        } else if (this.popup) {
            return this.popup;
        } else {
            return null;
        }
    }

    /**
     * Envia os dados da receita para o iframe ou popup da Prescrição.
     *
     * @param requisicao Requisição com os dados da receita.
     * @return Resposta com a URL do PDF assinado.
     */
    enviarPrescricao(requisicao: CfmRequestMessage): Promise<CfmResponseMessage> {
        return new Promise((resolve, reject) => {
            // recupera a janela-alvo (popup ou iframe)
            let janela = this.obterTargetWindow();
            if (!janela) {
                return reject(new Error("Não foi possível enviar os dados para a Prescrição Eletrônica do CFM. Motivo: popup/iframe da Prescrição não encontrado."));
            }
            // envia mensagem para a janela
            janela.postMessage(requisicao, this.ambiente.paginaPrescricao.origin);
            // cria o listener para receber a resposta
            // @ts-ignore
            this.responseListener = (event: MessageEvent<CfmResponseMessage>) => {
                // a resposta é enviada apenas 1 vez, então, após receber, o listener pode ser removido
                this.removeResponseListener();
                // verifica origem e formato da resposta
                if (event.origin !== this.ambiente.paginaPrescricao.origin) {
                    return reject(new Error("Não foi possível receber os dados para a Prescrição Eletrônica do CFM. Motivo: evento de origem não confiável: " + event.origin));
                }
                if (!event.data?.tipo?.nome) {
                    return reject(new Error("Não foi possível receber os dados para a Prescrição Eletrônica do CFM. Motivo: janela da Prescrição enviou uma resposta inválida: " + event.data));
                }
                // resolve a promise em caso de sucesso, rejeita em caso de erro
                if (event.data.tipo.nome === CfmTipoResposta.SUCESSO.nome) {
                    resolve(event.data);
                } else {
                    reject(event.data);
                }
            };
            // registra o listener na janela atual
            // @ts-ignore
            window.addEventListener('message', this.responseListener);
        })
    }

    private removeResponseListener() {
        if (this.responseListener) {
            window.removeEventListener('message', this.responseListener);
            this.responseListener = null;
        }
    }
}

