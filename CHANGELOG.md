# Changelog

As mudanças relevantes do JurisPauta são documentadas neste arquivo.

## [0.1.1] — 2026-08-23

Versão de manutenção:

- atualização compatível das dependências de produção e desenvolvimento;
- atualização dos runtimes fixados do GitHub Actions;
- remoção da dependência transitiva deprecated `glob`, substituída por `tinyglobby` via `sucrase`;
- redução de 31 pacotes transitivos sem alteração funcional ou no formato dos dados;
- validação completa com lint, TypeScript, testes, build e auditorias sem vulnerabilidades.

## [0.1.0] — 2026-08-23

Primeira versão pública:

- identidade e documentação do JurisPauta;
- criação local de rascunhos jurídicos por área, objetivo e formato;
- calendário, quadro por status e reagendamento;
- persistência local com validação, feedback de erro e consistência entre abas;
- ações principais acessíveis por teclado e suporte a movimento reduzido;
- testes automatizados, CI e configuração segura para hospedagem estática.
