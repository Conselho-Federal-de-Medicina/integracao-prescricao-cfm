// Simulação da página de novo receituário da Prescrição Eletrônica do Conselho Federal de Medicina.
// Copyright (C) 2023 CFM.

// Janela que abriu esta aba ou iframe.
var sourceWindow = window.opener || window.parent;

function toggleAdicionarMedicamento() {
    let adicionarMedicamento = document.getElementById("adicionar-medicamento");
    if (adicionarMedicamento.style.display === "none") {
        adicionarMedicamento.style.display = "block";
    } else {
        adicionarMedicamento.style.display = "none";
    }
}

function adicionarMedicamento() {
    let medicamento = {
        nome: document.getElementById("adicionar_medicamento_nome").value,
        concentracao: document.getElementById("adicionar_medicamento_concentracao").value,
        quantidade: document.getElementById("adicionar_medicamento_quantidade").value,
        informacoes: document.getElementById("adicionar_medicamento_informacoes").value
    };
    _clonarMedicamentoNode(medicamento);
    toggleAdicionarMedicamento();
}

function _clonarMedicamentoNode(medicamento) {
    // clona elemento modelo
    const templateMedicamento = document.getElementById("template_medicamento");
    let novoMedicamento = templateMedicamento.cloneNode(true);
    novoMedicamento.removeAttribute('id');
    novoMedicamento.removeAttribute('style');
    // sobrescreve nome
    let medicamentoNome = novoMedicamento.getElementsByClassName("template_medicamento_nome")[0];
    medicamentoNome.innerText = medicamento.nome;
    // sobrescreve concentração
    let medicamentoConcentracao = novoMedicamento.getElementsByClassName("template_medicamento_concentracao")[0];
    medicamentoConcentracao.innerText = medicamento.concentracao;
    // sobrescreve quantidade
    let medicamentoQuantidade = novoMedicamento.getElementsByClassName("template_medicamento_quantidade")[0];
    medicamentoQuantidade.innerText = medicamento.quantidade;
    // sobrescreve informações
    let medicamentoInformacoes = novoMedicamento.getElementsByClassName("template_medicamento_informacoes")[0];
    medicamentoInformacoes.innerText = medicamento.informacoes;
    // adiciona novo elemento no DOM
    templateMedicamento.parentElement.appendChild(novoMedicamento);
}

function enviarResposta(resposta) {
    if (sourceWindow) {
        sourceWindow.postMessage(resposta, "*");
    } else {
        alert(resposta.tipoRetorno.name + '\n' + resposta.mensagemErro);
    }
}

function enviarCancelar() {
    enviarResposta(new CfmResponseMessage(
        CfmTipoResposta.ERRO_USUARIO_CANCELOU,
        null,
        'Usuário apertou o botão cancelar'));
}

function enviarAssinar() {
    enviarResposta(new CfmResponseMessage(
        CfmTipoResposta.SUCESSO,
        new URL('assets/pdf_de_sucesso.pdf', document.baseURI).href));
}

window.addEventListener("message", function(event) {
    // TODO: validar a origem da mensagem
    console.log(event);
    // mensagem de requisição
    let request = event.data;
    if (!request instanceof CfmRequestMessage) {
        enviarResposta(new CfmResponseMessage(CfmTipoResposta.ERRO_INTEGRACAO, null, "A mensagem enviada não é do tipo CfmRequestMessage"));
        return;
    }
    // token de acesso
    let accessToken = request.accessToken;
    if (accessToken !== 'IntegracaoPrescricaoEletronicaCfmAccessTokenBase64') {
        enviarResposta(new CfmResponseMessage(CfmTipoResposta.ERRO_AUTENTICACAO, null, "O access token enviado é inválido"));
        return;
    }
    // source/opener window
    sourceWindow = event.source;
    // prescricao
    let prescricao = request.prescricao;
    // local de atendimento
    if (prescricao.localAtendimento) {
        let localField = document.getElementById("nome_local");
        localField.value = prescricao.localAtendimento.nome;
        localField.disabled = 'disabled';
    }
    // paciente
    if (prescricao.paciente) {
        let pacienteField = document.getElementById("nome_paciente");
        pacienteField.value = prescricao.paciente.nome;
        pacienteField.disabled = 'disabled';
    }
    // medicamentos
    for (const medicamento of prescricao.medicamentos) {
        if (!medicamento) continue;
        _clonarMedicamentoNode(medicamento);
    }
});

window.onload = function() {
    if (sessionStorage.getItem('user') == null) {
        window.location.href = "../login/login.html";
    } else {
        window._cfmIsLoaded = true;
    }
}
