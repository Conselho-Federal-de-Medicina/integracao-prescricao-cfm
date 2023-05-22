// Biblioteca de integração com o sistema de Prescrição Eletrônica do Conselho Federal de Medicina do Brasil.
// Copyright (C) 2023 CFM.

/**
 * Ambientes para os quais pode-se apontar.
 */
class CfmAmbiente {

    /** Executando localmente na máquina do desenvolvedor. */
    static LOCAL = new CfmAmbiente('LOCAL',
        ['https://ts4cr4lk4ldiphrbpqrr46hnsu0dheji.lambda-url.us-east-1.on.aws', '/'],
        ['http://localhost:63342', '/poc-prescricao-iframe/public/receita/receita.html']);

    /** Executar apontando para o ambiente de simulação (sem backend real). */
    static SIMULACAO = new CfmAmbiente('SIMULACAO',
        ['https://ts4cr4lk4ldiphrbpqrr46hnsu0dheji.lambda-url.us-east-1.on.aws', '/'],
        ['???', '/poc-prescricao-iframe/public/receita/receita.html']);

    /** Executar apontando para o ambiente de homologação (solicitar credenciais ao CFM). */
    static HOMOLOGACAO = new CfmAmbiente('HOMOLOGACAO',
        ['???', '???'],
        ['???', '???']);

    /** Executar apontando para o ambiente de produção (solicitar credenciais ao CFM). */
    static PRODUCAO = new CfmAmbiente('PRODUCAO',
        ['???', '???'],
        ['???', '???']);

    constructor(nomeAmbiente, urlsAutenticador, urlsPaginaPrescricao) {
        this.nomeAmbiente = nomeAmbiente;
        this.autenticador = {
            domain: urlsAutenticador[0],
            path: urlsAutenticador[1],
            url: urlsAutenticador[0] + urlsAutenticador[1]
        };
        this.paginaPrescricao = {
            domain: urlsPaginaPrescricao[0],
            path: urlsPaginaPrescricao[1],
            url: urlsPaginaPrescricao[0] + urlsPaginaPrescricao[1]
        };
    }

}

/**
 * Tipos de documento que podem ser gerados.
 */
class CfmTipoDocumento {

    /** Será gerado um receituário simples. */
    static RECEITA_SIMPLES = new CfmTipoDocumento('RECEITA_SIMPLES');
    /** Será gerado um receituário de antimicrobiano. */
    static ANTIMICROBIANO = new CfmTipoDocumento('ANTIMICROBIANO');
    /** * Será gerado um receituário de controle especial. */
    static CONTROLE_ESPECIAL = new CfmTipoDocumento('CONTROLE_ESPECIAL');

    constructor(name) {
        this.name = name;
    }

}

/**
 * Tipos de resposta enviados pela janela da Prescrição.
 */
class CfmTipoResposta {

    /** O documento foi assinado com sucesso. */
    static SUCESSO = new CfmTipoResposta('SUCESSO');
    /** Não foi possível processar a mensagem enviada. */
    static ERRO_INTEGRACAO = new CfmTipoResposta('ERRO_INTEGRACAO');
    /** O access token enviado é inválido. */
    static ERRO_AUTENTICACAO = new CfmTipoResposta('ERRO_AUTHENTICACAO');
    /** Erro ao tentar fazer login. */
    static ERRO_FALHA_DE_LOGIN = new CfmTipoResposta('ERRO_FALHA_DE_LOGIN');
    /** Erro ao tentar assinar o documento. */
    static ERRO_FALHA_DE_ASSINATURA = new CfmTipoResposta('ERRO_FALHA_DE_ASSINATURA');
    /** O usuário apertou o botão "Cancelar". */
    static ERRO_USUARIO_CANCELOU = new CfmTipoResposta('ERRO_USUARIO_CANCELOU');
    /** Algum outro erro não mapeado. */
    static ERRO_OUTRO = new CfmTipoResposta('ERRO_OUTRO');

    constructor(name) {
        this.name = name;
    }

}

/**
 * Local de atendimento (clínica ou hospital).
 */
class CfmLocalAtendimento {

    /**
     * @param {string} idLocal ID do local de atendimento no seu sistema. Obrigatório.
     * @param {string} logo Imagem PNG ou JPG com no máximo 200kB.
     * @param {string} nome Nome do local de atendimento. Obrigatório.
     * @param {CfmEndereco} endereco Endereço do local de atendimento.
     * @param {string} email Email para contato.
     * @param {string} telefoneCelular Telefone celular para contato.
     * @param {string} telefoneFixo Telefone fixo para contato.
     */
    constructor(
        idLocal,
        logo,
        nome,
        endereco,
        email,
        telefoneCelular,
        telefoneFixo
    ) {
        this.idLocal = idLocal;
        this.logo = logo;
        this.nome = nome;
        this.endereco = endereco;
        this.email = email;
        this.telefoneCelular = telefoneCelular;
        this.telefoneFixo = telefoneFixo;
    }

}

/**
 * Dados do paciente.
 */
class CfmPaciente {

    /**
     * @param {string} idPaciente ID do paciente no seu sistema. Obrigatório.
     * @param {string} nome Nome do paciente. Obrigatório.
     * @param {string} nomeSocial Nome social do paciente.
     * @param {string} cpf CPF do paciente.
     * @param {string} dataNascimento Data de nascimento do paciente (formato ISO: YYYYMMDD).
     * @param {string} sexo Sigla do sexo do paciente ('M' ou 'F').
     * @param {string} email Email para contato (usado para enviar a receita por email).
     * @param {string} telefoneCelular Telefone celular para contato (usado para enviar a receita por WhatsApp).
     * @param {string} telefoneFixo Telefone fixo para contato.
     * @param {CfmEndereco} endereco Endereço do paciente.
     * @param {ResponsavelLegal} responsavelLegal Responsável legal do paciente.
     */
    constructor(
        idPaciente,
        nome,
        nomeSocial,
        cpf,
        dataNascimento,
        sexo,
        email,
        telefoneCelular,
        telefoneFixo,
        endereco,
        responsavelLegal
    ) {
        this.idPaciente = idPaciente;
        this.nome = nome;
        this.nomeSocial = nomeSocial;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.sexo = sexo;
        this.email = email;
        this.telefoneCelular = telefoneCelular;
        this.telefoneFixo = telefoneFixo;
        this.endereco = endereco;
        this.responsavelLegal = responsavelLegal;
    }

}

/**
 * Dados do responsável legal do paciente.
 */
class CfmResponsavelLegal {

    /**
     * @param {string} nome Nome do paciente. Obrigatório.
     * @param {string} cpf CPF do paciente.
     */
    constructor(
        nome,
        cpf
    ) {
        this.nome = nome;
        this.cpf = cpf;
    }

}

/**
 * Endereço do paciente ou do local de atendimento.
 */
class CfmEndereco {

    /**
     * @param {string} cep CEP (somente números).
     * @param {string} uf Sigla do estado. Obrigatório.
     * @param {string} cidade Nome da cidade. Obrigatório.
     * @param {string} bairro Nome do bairro.
     * @param {string} logradouro Logradouro. Obrigatório.
     * @param {string} numero Número.
     * @param {string} complemento Complemento.
     */
    constructor(
        cep,
        uf,
        cidade,
        bairro,
        logradouro,
        numero,
        complemento
    ) {
        this.cep = cep;
        this.uf = uf;
        this.cidade = cidade;
        this.bairro = bairro;
        this.logradouro = logradouro;
        this.numero = numero;
        this.complemento = complemento;
    }

}

/**
 * Informações do medicamento sendo prescrito.
 */
class CfmMedicamento {

    /**
     * @param {string} idMedicamento ID do medicamento no seu sistema. Opcional.
     * @param {boolean} manipulado Se o medicamento é manipulado ou não.
     * @param {string} nome Nome do medicamento. Obrigatório.
     * @param {string} concentracao Concentração (ex: 5mg).
     * @param {number} quantidade Quantidade (ex: 10). Obrigatório para industrializados.
     * @param {string} informacoes Descrição da fórmula, administração, posologia, duração do tratamento e outras informações. Obrigatório para manipulados.
     */
    constructor(
        idMedicamento,
        manipulado,
        nome,
        concentracao,
        quantidade,
        informacoes
    ) {
        this.idMedicamento = idMedicamento;
        this.manipulado = manipulado;
        this.nome = nome;
        this.concentracao = concentracao;
        this.quantidade = quantidade;
        this.informacoes = informacoes;
    }

}

/**
 * Dados da prescrição.
 */
class CfmPrescricao {

    /**
     * @param {CfmLocalAtendimento} localAtendimento Local de atendimento.
     * @param {CfmPaciente} paciente CfmPaciente sendo atendido.
     * @param {CfmMedicamento[]} medicamentos Lista de medicamentos sendo prescritos.
     */
    constructor(
        localAtendimento,
        paciente,
        medicamentos
    ) {
        this.localAtendimento = localAtendimento;
        this.paciente = paciente;
        this.medicamentos = medicamentos;
    }

}

/**
 * Mensagem enviada do seu sistema para o sistema do CFM, para geração do PDF assinado da receita.
 */
class CfmRequestMessage {

    /**
     * @param {string} accessToken Token de acesso, padrão OAuth2, autenticando o seu sistema.
     * @param {CfmPrescricao} prescricao Dados da receita sendo gerada.
     */
    constructor(
        accessToken,
        prescricao
    ) {
        this.accessToken = accessToken;
        this.prescricao = prescricao;
    }

}

/**
 * Mensagem retornada do sistema do CFM para o seu.
 */
class CfmResponseMessage {

    /**
     * @param {CfmTipoResposta} tipo Tipo da resposta sendo retornada (sucesso ou erro).
     * @param {string} urlDocumento URL do PDF assinado (retornado apenas em caso de sucesso).
     * @param {string} mensagemErro Motivo do erro (retornado apenas em caso de erro).
     */
    constructor(
        tipo,
        urlDocumento,
        mensagemErro
    ) {
        this.tipoRetorno = tipo;
        this.urlDocumento = urlDocumento;
        this.mensagemErro = mensagemErro;
    }
}

class CfmIntegracaoPrescricao {

    static _nextInstanceId = 1;

    /**
     * @param {CfmAmbiente} ambiente Ambiente de execução (serve para definir as URLs que serão usadas).
     */
    constructor(ambiente) {
        this.ambiente = ambiente;
        this.instanceId = CfmIntegracaoPrescricao._nextInstanceId++;
        this.idIframe = 'cfm_prescricao_iframe_' + this.instanceId;
        this.nomeAba = 'cfm_prescricao_aba_' + this.instanceId;
    }

    /**
     * Cria o iframe da Prescrição dentro do elemento passado como parâmetro.
     *
     * @param {CfmTipoDocumento} tipoDocumento Tipo do documento que será gerado nesse iframe.
     * @param {string} idElementoPai ID do elemento pai do iframe (geralmente uma div vazia).
     * @return {Promise} Promise indicando que o iframe terminou de carregar, portanto, já é possível enviar mensagens para a janela dele.
     */
    criarIframe(tipoDocumento, idElementoPai) {
        if (this.iframe) {
            // iframe já existe, destrói e recria
            this.destruirIframe();
        }
        let parent = document.getElementById(idElementoPai);
        if (!parent) {
            // elemento pai (onde o iframe seria inserido) não existe
            console.error('Elemento pai do iframe não encontrado: ' + idElementoPai);
            return;
        }
        return new Promise((resolve, reject) => {
            // cria o iframe
            this.iframe = document.createElement('iframe');
            this.iframe.setAttribute('id', this.idIframe);
            this.iframe.setAttribute('width', '100%');
            this.iframe.setAttribute('height', '100%');
            this.iframe.setAttribute('frameborder', '0');
            this.iframe.setAttribute('src', this.ambiente.paginaPrescricao.url);
            // adiciona o iframe no DOM (vai iniciar o carregamento)
            parent.appendChild(this.iframe);
            // resolve a promise quando a janela terminar de carregar
            this.iframe.contentWindow.addEventListener('load', event => {
                resolve();
            });
            // mas se a janela carregou antes de adicionarmos o listener, resolve a promise agora
            if (this.iframe.contentWindow._cfmIsLoaded) {
                resolve();
            }
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
        this._removeResponseListener();
    }

    /**
     * Cria a aba da Prescrição com as windowFeatures passadas como parâmetro.
     *
     * @param {CfmTipoDocumento} tipoDocumento Tipo do documento que será gerado nessa aba.
     * @param {string} windowFeatures DOMString para ser passado para window.open().
     * @return {Promise} Promise indicando que a aba terminou de carregar, portanto, já é possível enviar mensagens para a janela dela.
     */
    criarAba(tipoDocumento, windowFeatures) {
        if (this.aba) {
            // aba já existe, destrói e recria
            this.destruirAba();
        }
        return new Promise((resolve, reject) => {
            // cria a aba
            this.aba = window.open(this.ambiente.paginaPrescricao.url, this.nomeAba, windowFeatures);
            // resolve a promise quando a janela terminar de carregar
            this.aba.addEventListener('load', event => {
                resolve();
            });
            // mas se a janela carregou antes de adicionarmos o listener, resolve a promise agora
            if (this.aba._cfmIsLoaded) {
                resolve();
            }
        });
    }

    /**
     * Fecha a aba da Prescrição.
     */
    destruirAba() {
        if (this.aba) {
            this.aba.close();
            this.aba = null;
        }
        this._removeResponseListener();
    }

    /**
     * @return {Window|null} O objeto Window onde a página da Prescrição foi carregada (tanto faz se foi aberta em um iframe ou em uma nova aba).
     */
    obterTargetWindow() {
        if (this.iframe) {
            return this.iframe.contentWindow;
        } else if (this.aba) {
            return this.aba;
        } else {
            return null;
        }
    }

    /**
     * Envia os dados da receita para o iframe ou aba da Prescrição.
     *
     * @param {CfmRequestMessage} requisicao Requisição com os dados da receita.
     * @return {Promise<CfmResponseMessage>} Resposta com a URL do PDF assinado.
     */
    enviarPrescricao(requisicao) {
        let janela = this.obterTargetWindow();
        if (!janela) {
            console.error('Aba ou iframe da Prescrição não encontrados.');
            return;
        }
        // envia mensagem para a janela
        janela.postMessage(requisicao, this.ambiente.paginaPrescricao.domain);
        // retorna promise que vai resolver quando a resposta chegar
        return new Promise((resolve, reject) => {
            // cria o listener para receber a resposta
            this.responseListener = (event) => {
                if (event.origin !== this.ambiente.paginaPrescricao.domain) {
                    console.error('Evento de origem não confiável: ' + event.origin);
                    return;
                }
                if (!event.data instanceof CfmResponseMessage) {
                    console.error('Janela da Prescrição enviou uma resposta inválida: ' + event.data);
                    return;
                }
                // resolve a promise em caso de sucesso, rejeita em caso de erro
                if (event.data.tipoRetorno.name === CfmTipoResposta.SUCESSO.name) {
                    resolve(event.data);
                } else {
                    reject(event.data);
                }
                // a resposta é enviada apenas 1 vez, então, após receber, o listener pode ser removido
                this._removeResponseListener();
            }
            // registra o listener na janela atual
            window.addEventListener('message', this.responseListener);
        })
    }

    _removeResponseListener() {
        if (this.responseListener) {
            window.removeEventListener('message', this.responseListener);
            this.responseListener = null;
        }
    }
}

