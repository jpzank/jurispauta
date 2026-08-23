# Privacidade e dados — modo local

Este documento descreve os cuidados técnicos atuais e não substitui um aviso de privacidade, contrato ou análise jurídica.

## Dados tratados pelo protótipo

- conteúdos e metadados editoriais que o usuário cria na interface;
- datas de criação, atualização e publicação escolhidas pelo usuário;
- nenhum email, senha, perfil, cookie de autenticação, analytics ou cadastro é criado pelo app.

Os conteúdos ficam no `localStorage` do navegador sob a chave legada `lexcontent:contents:v1`, mantida para preservar dados criados em versões anteriores. O app não envia esses dados para um backend ou provedor de IA.

## Limitações importantes

`localStorage` é armazenamento do lado do cliente, não é criptografado e pode ser acessado por scripts executados na mesma origem ou por alguém com acesso ao perfil do navegador. Os dados não são sincronizados entre dispositivos e podem ser removidos ao limpar os dados do site.

Não insira informações de processos, clientes, documentos, CPF, endereço, telefone ou qualquer dado sujeito a sigilo. Para apagar os dados, limpe os dados do site/origem no navegador; essa ação pode ser irreversível.

## Antes de produção

- publicar aviso de privacidade e termos adequados ao operador e à jurisdição;
- definir finalidade, base legal, retenção e procedimento de exclusão/exportação;
- substituir o armazenamento local por uma arquitetura de servidor com autenticação, autorização e criptografia;
- implementar minimização/redação antes de qualquer integração com IA;
- definir logs, auditoria, backups, restauração e resposta a incidentes;
- avaliar provedores, residência e transferências internacionais de dados;
- testar isolamento entre usuários e revisar todas as permissões antes de habilitar sincronização.

Até que esses itens sejam concluídos, trate o aplicativo como demonstração e use somente dados fictícios.
