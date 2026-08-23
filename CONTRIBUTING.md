# Contribuindo

Obrigado por ajudar a evoluir o projeto.

## Fluxo local

1. Faça um fork e crie uma branch curta a partir de `main`.
2. Instale as dependências com `npm ci`.
3. Inicie o app com `npm run dev`; não é necessário `.env` ou serviço externo.
4. Faça a mudança com o menor escopo possível.
5. Confirme que criar, aprovar, alterar, excluir e recarregar conteúdos preserva o comportamento esperado no navegador.
6. Rode todos os comandos de validação:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

7. Abra um pull request explicando o impacto, os testes executados e qualquer decisão de privacidade.

## Dados e segredos

Não inclua dados reais, dumps, screenshots identificáveis, `.env`, tokens, chaves de provedor, senhas ou configurações privadas. Use dados fictícios e valores claramente inválidos nos exemplos. O `localStorage` não deve ser tratado como armazenamento seguro.

## Conteúdo jurídico

O gerador produz rascunhos. Evite promessas de resultado, urgência artificial, depoimentos inventados ou afirmações que não possam ser verificadas. Toda saída deve ser revisada por profissional habilitado e adequada às regras éticas e à jurisdição aplicável.
