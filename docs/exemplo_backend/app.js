var http = require('http');
var express = require('express');
var axios = require('axios');

var app = express();
app.use(express.json());

// Dados do seu sistema, conforme cadastrado no IAM do CFM
var prescricao_iam_url = 'https://ts4cr4lk4ldiphrbpqrr46hnsu0dheji.lambda-url.us-east-1.on.aws';
var my_client_id = 'Meu ID de cliente, solicitar ao CFM';
var my_client_secret = 'Minha senha de cliente, solicitar ao CFM';

// Exemplo de endpoint no seu sistema que faz a chamada ao IAM do CFM, obtém o token e devolve ao seu frontend
app.get('/token-prescricao', async (req, res) => {
    let tokenResponse = await axios.post(prescricao_iam_url, new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: my_client_id,
        client_secret: my_client_secret,
        scope: 'openid'
    }));
    res.send(tokenResponse.data);
});

var server = http.createServer(app);
server.listen(3000);
console.log("HTTP server listening on port 3000");
