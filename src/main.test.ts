import {test, expect} from "vitest";
import {CfmAmbiente, CfmIntegracaoPrescricao, CfmTipoDocumento} from "./main.ts";

test("deve criar um iframe", async () => {
    document.write(`
        <body>
            <div id="divPai"></div>
        </body>
    `);
    let integracao = new CfmIntegracaoPrescricao(CfmAmbiente.LOCAL);
    await integracao.criarIframe(CfmTipoDocumento.RECEITA_SIMPLES, 'divPai');
    let window = integracao.obterTargetWindow();
    expect(window).toBeDefined();
});

test("deve criar um popup", async () => {
    document.write(`
        <body>
        </body>
    `);
    let integracao = new CfmIntegracaoPrescricao(CfmAmbiente.LOCAL);
    await integracao.criarPopup(CfmTipoDocumento.RECEITA_SIMPLES, 'popup');
    let window = integracao.obterTargetWindow();
    expect(window).toBeDefined();
});
