# Política de segurança

## Escopo

Este repositório é público e o aplicativo é um protótipo executado no navegador. Relatos de exposição de segredos, execução de código, XSS, manipulação indevida do armazenamento local ou vazamento acidental de dados pessoais são prioritários.

## Como reportar

Não abra uma issue pública com um segredo, uma prova que contenha dados reais ou um exploit completo. Use o recurso de **Private vulnerability reporting** do GitHub quando ele estiver habilitado. Se não estiver disponível, entre em contato privado com o proprietário pelo perfil do GitHub e envie somente um exemplo mínimo, sem credenciais.

Ao reportar, inclua versão/commit, impacto, passos mínimos para reproduzir e uma sugestão de correção. Remova tokens, emails, nomes, documentos e dados de clientes.

## Regras para colaboradores

- Nunca faça commit de `.env`, chaves privadas, dumps, tokens, senhas ou dados pessoais.
- Não adicione chaves de IA ou integrações de terceiros ao frontend. Segredos devem ficar em um ambiente de servidor.
- Não use dados reais para testar. Prefira dados fictícios e exemplos claramente inválidos.
- Valide entradas, limite tamanhos e revise qualquer mudança que leia ou escreva no armazenamento do navegador.
- Rode `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` e `npm audit --omit=dev` antes de abrir um PR.
- Na hospedagem de produção, preserve os cabeçalhos anti-iframe definidos em `vercel.json`, incluindo `Content-Security-Policy: frame-ancestors 'none'` e `X-Frame-Options: DENY`. O Vite também aplica esses cabeçalhos no servidor local e no preview.

## Limitações conhecidas

O modo atual grava conteúdos no `localStorage`, que pode ser lido por qualquer script executado na mesma origem e não oferece criptografia ou controle de acesso por usuário. Antes de um uso real, implemente backend, autenticação robusta, autorização, criptografia, exclusão/exportação, retenção, auditoria, rate limiting e uma análise de privacidade. Até lá, não armazene prontuários, documentos ou informações cobertas por sigilo profissional.
