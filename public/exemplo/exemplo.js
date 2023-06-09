// Sistema de exemplo para mostrar como funciona a integração com a Prescrição Eletrônica do Conselho Federal de Medicina.
// Copyright (C) 2023 CFM.

var locaisAtendimento = [
    new CfmLocalAtendimento(1, null, 'Sistema Saúde+'),
    new CfmLocalAtendimento(2, null, 'Hospital Santa Casa'),
    null
];

var pacientes = [
    new CfmPaciente(3, 'José da Silva'),
    new CfmPaciente(4, 'Maria de Souza'),
    null
];

var medicamentos = [
    new CfmMedicamento(5, false, 'Amoxilina', '500mg', 21, 'Tomar a cada 8 horas.'),
    new CfmMedicamento(6, false, 'Paracetamol', '750mg', 10, 'Tomar se tiver dor ou febre'),
    new CfmMedicamento(7, false, 'Prednisolona', '20mg', 7, 'Tomar pela manhã, por 7 dias.'),
    null
];

var integracaoPrescricao = new CfmIntegracaoPrescricao(CfmAmbiente.SIMULACAO);

async function toggleIframe() {
    let parent = $('#divParent');
    if (parent.is(':hidden')) {
        await integracaoPrescricao.criarIframe(CfmTipoDocumento.RECEITA_SIMPLES, 'divIframe');
        parent.slideDown();
        sendMessage();
    } else {
        parent.slideUp();
    }
}

async function toggleModal() {
    await integracaoPrescricao.criarIframe(CfmTipoDocumento.RECEITA_SIMPLES, 'modalIframe');
    $('#modalParent').modal();
    sendMessage();
}

async function toggleAba() {
    await integracaoPrescricao.criarAba();
    sendMessage();
}

async function togglePopup() {
    await integracaoPrescricao.criarAba(CfmTipoDocumento.RECEITA_SIMPLES, 'popup,width=1000,height=1010');
    sendMessage();
}

function fecharJanela() {
    $('#divParent').slideUp();
    $('#modalParent').modal('hide');
    integracaoPrescricao.destruirAba();
    integracaoPrescricao.destruirIframe();
}

async function sendMessage() {
    try {
        let localAtendimento = locaisAtendimento[$('#nome_local').val()];
        let paciente = pacientes[$('#nome_paciente').val()];
        let medicamento1 = medicamentos[$('#medicamento_1').val()];
        let medicamento2 = medicamentos[$('#medicamento_2').val()];
        let medicamento3 = medicamentos[$('#medicamento_3').val()];
        let accessToken = 'IntegracaoPrescricaoEletronicaCfmAccessTokenBase64';
        let prescricao = new CfmPrescricao(localAtendimento, paciente, [medicamento1, medicamento2, medicamento3]);
        let requisicao = new CfmRequestMessage(accessToken, prescricao);
        let resposta = await integracaoPrescricao.enviarPrescricao(requisicao);
        console.log(resposta);
        $('#url_pdf').attr('href', resposta.urlDocumento).text(resposta.urlDocumento);
    } catch (error) {
        console.error(error);
        if (error.tipoRetorno) {
            alert(error.tipoRetorno.name + '\n' + error.mensagemErro);
        }
    } finally {
        fecharJanela();
    }
}

