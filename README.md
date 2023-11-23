# Integração Prescrição-CFM

Biblioteca para integração com o sistema de Prescrição Eletrônica do Conselho Federal de Medicina do Brasil.

## Como usar?

### Opção A - Se você usa NPM (ou equivalente) e a sintaxe de módulos do ES6.

1. Adicione essa biblioteca no seu projeto.

```sh
npm install @conselho-federal-de-medicina/integracao-prescricao-cfm
```

2. Importe as classes no seu módulo.

```js
import {
    CfmAmbiente, 
    CfmIntegracaoPrescricao, 
    CfmLocalAtendimento, 
    CfmMedicamento, 
    CfmPaciente
} from "@conselho-federal-de-medicina/integracao-prescricao-cfm";
```

3. Crie a classe de integração. Note que você deve guardar a instância dessa classe no seu componente ou página.

```js
let integracaoPrescricao = new CfmIntegracaoPrescricao(CfmAmbiente.SIMULACAO);
```

Os possíveis ambiente são:

- **SIMULACAO**: Use esse ambiente para fazer o desenvolvimento inicial.
  Nesse ambiente, você estará interagindo com um _mock_ da nossa API.
  Não é necessário solicitar credenciais ao CFM para usar esse ambiente.
- **HOMOLOGACAO**: Após conseguir integrar com sucesso no ambiente de homologação,
  solicite as credenciais do seu sistema ao CFM para testar a integração com nossa API de homologação.
- **PRODUCAO**: Nesse ambiente, apenas médicos conseguem fazer login e emitir receitas.
  Todos os documentos emitidos são assinados digitalmente com certificados ICP-BR e têm validade legal.

4. Quando o usuário clicar no botão da integração (ou outra ação equivalente), carregue o nosso componente no seu frontend.

```js
await integracaoPrescricao.criarIframe(CfmTipoDocumento.RECEITA_SIMPLES, 'divIframe');
```

Existem dois métodos para carregar o componente:

- **criarIframe()**: Recebe o tipo de documento e o ID do elemento pai do iframe.
  Carrega o componente dentro de um iframe que será criado dinamicamente como filho do elemento indicado.
  O iframe terá a altura e largura de 100% do elemento pai.
- **criarPopup()**: Recebe o tipo de documento e as configurações de criação da nova janela ou aba.
  O segundo parâmetro é uma string no formato [windowFeatures](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#windowfeatures).
  Essa string será passada para `window.open()`.

Os tipos de documento válidos são:

- **RECEITA_SIMPLES**
- **ANTIMICROBIANO**
- **CONTROLE_ESPECIAL**

5. Faça uma chamada ao seu backend para obter o token de acesso.
Esse token autoriza o seu sistema a fazer chamadas ao sistema do CFM.

**IMPORTANTE**: A obtenção do token deve ser feita a partir do seu backend, pois o seu _client_secret_ é confidencial.

```js
let accessToken = backend.getAccessTokenPrescricao();
```

Veja mais abaixo um exemplo de implementação dessa chamada no backend.

6. Recupere, do seu sistema, as informações do paciente, local de atendimento e medicamentos sendo prescritos e envie para o nosso componente.
O componente devolverá uma mensagem de resposta quando o usuário assinar o documento.
Essa mensagem irá conter a URL do PDF assinado.

```js
let localAtendimento = new CfmLocalAtendimento(...);
let paciente = new CfmPaciente(...);
let medicamentos = [new CfmMedicamento(...), ...];
let prescricao = new CfmPrescricao(localAtendimento, paciente, medicamentos);
let requisicao = new CfmRequestMessage(accessToken, prescricao);
let resposta = await integracaoPrescricao.enviarPrescricao(requisicao);
console.log(resposta.urlDocumento);
```

7. Baixe o documento e apresente ao usuário.

### Opção B - Se você importa dependências a partir de CDNs e precisa manter compatibilidade com ES5.

1. Importe a versão compatível com ES5 da nossa biblioteca em seu `index.html`.

```html
<script src="https://unpkg.com/@conselho-federal-de-medicina/integracao-prescricao-cfm></script>"
```

**OBSERVAÇÃO**: Essa opção usa a sintaxe [IIFE](https://developer.mozilla.org/pt-BR/docs/Glossary/IIFE)
e expõe todas as classes a partir do objeto global `integracaoPrescricaoCfm`.
Recomendamos criar um alias para esse objeto, para facilitar a escrita do código.
Exemplo:

```js
var p = integracaoPrescricaoCfm;
```

2. Crie a classe de integração.

```js
let integracaoPrescricao = new p.CfmIntegracaoPrescricao(CfmAmbiente.SIMULACAO);
```

A partir desse ponto, siga as mesmas instruções da Opção A, do passo 3 em diante.

## Como obter o token de acesso do meu sistema?

Para os ambientes de homologação e produção, você precisará entrar em contato com o CFM e solicitar o cadastro da sua aplicação em nosso IAM.
Você receberá as credenciais de acesso e a URL a ser chamada.

Toda vez que seu frontend for enviar uma mensagem para o componente do CFM, ele deverá solicitar o token para o backend.

**IMPORTANTE**: O seu backend não deve obter um novo token toda vez.
Se fizer isso, seu sistema será bloqueado!
O token é válido por alguns minutos e durante esse tempo, ele deve ser reaproveitado, ou seja,
o seu backend deve devolver o mesmo token para todas as chamadas feitas pelo seu frontend, independente do usuário logado.
O backend só deve obter um novo token quando o anterior estiver expirado ou próximo de expirar.

Segue abaixo um exemplo de um backend feito em Node.js, usando Express e Axios, obtendo e devolvendo o token ao frontend.

```js
app.get('/token-prescricao', async (req, res) => {
    if (tokenIsExpired()) {
        let tokenResponse = await axios.post(prescricao_iam_url, new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: my_client_id,
            client_secret: my_client_secret,
            scope: 'openid'
        }));
        token = tokenResponse.data;
    }
    res.send(token);
});
```
