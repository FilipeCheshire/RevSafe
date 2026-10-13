# Segurança e publicação pública

Revisão realizada em 13/10/2026. Este projeto é uma demonstração estática: não autentica usuários, não processa pagamentos e não autoriza acesso a dados privados.

## Resultado e limites

- Nenhum segredo identificado na inspeção do código e na varredura dos arquivos destinados à publicação. A ferramenta verifica padrões conhecidos; isso não garante a ausência de todo tipo de informação sensível.
- Esta pasta não contém `.git`. Não foi possível examinar commits anteriores, branches, remotos ou arquivos já publicados. A revisão cobre o estado atual dos arquivos.
- A auditoria das dependências de produção retornou zero vulnerabilidades conhecidas. A auditoria completa ainda aponta 11 avisos (7 altos e 4 moderados) na cadeia de desenvolvimento do `firebase-tools`. As correções automáticas compatíveis foram aplicadas; não foram forçadas trocas de versões principais. Detalhes locais em `artifacts/dependency-audit.json`.
- As dependências da CLI não entram no conteúdo estático de `out/`. Os avisos continuam relevantes para quem executa a ferramenta localmente; acompanhe as correções do fornecedor. Não execute em produção o servidor de desenvolvimento.

## Proteções implementadas

O `.gitignore` exclui variáveis de ambiente reais, caches, builds, relatórios locais, diretórios de ferramentas e formatos comuns de credenciais. A varredura usa essas regras e, se houver um repositório Git, também inspeciona arquivos rastreados, mesmo que tenham sido adicionados ao `.gitignore` depois. Não basta ignorar uma credencial que já entrou em um commit: nesse caso, revogue-a e remova-a do histórico antes de tornar o repositório público.

O comando `npm run security:scan` procura padrões conhecidos de chaves, tokens, URLs com credenciais e arquivos sensíveis. Ele relata nomes de arquivos e tipos de ocorrência, sem imprimir os valores encontrados. Arquivos binários e arquivos grandes são sinalizados para revisão manual. A imagem `public/logoRev.png` foi inspecionada visualmente e seus metadados PNG contêm somente informações de cor/resolução e `Software=Figma`. O hash revisado está em `scripts/reviewed-assets.json`; uma alteração no arquivo exige nova revisão. Ele não verifica o histórico Git.

O acesso demonstrativo não pede e-mail ou senha. O perfil de exemplo, favoritos, comparações e tema ficam no navegador. Esses dados não constituem uma sessão autenticada e nunca devem ser usados como permissão para um backend. Valores persistidos são validados antes do uso. Não há segredos ou tokens de autenticação armazenados no cliente.

O chat aceita apenas endpoint HTTPS sem credenciais, query string ou fragmento. As requisições não enviam cookies, não seguem redirecionamentos e não enviam o referer. Respostas e sugestões são verificadas antes do uso; o texto é renderizado por React. A conexão real é opcional. Um backend real deve implementar autenticação quando necessária, limitação de requisições, limites de tamanho e CORS para as origens autorizadas. CORS sozinho não impede abuso do endpoint.

## Cabeçalhos do Firebase Hosting

Cada build calcula hashes SHA-256 dos scripts inline efetivamente exportados e atualiza a política CSP em `firebase.json`. Scripts sem hash autorizado e handlers inline são bloqueados. A política limita imagens ao próprio domínio, `data:` e `images.unsplash.com`; conexões ficam restritas ao próprio domínio e à origem HTTPS do chat configurado no build.

A CSP permite estilos inline porque o projeto usa propriedades de estilo React. Scripts não usam `unsafe-inline` nem `unsafe-eval`. O script inline de tema é texto fixo, sem interpolação de entradas do usuário.

Também são configurados `nosniff`, bloqueio de incorporação em frames, `no-referrer`, restrições a câmera/microfone/localização/pagamentos e HSTS. Os cabeçalhos são aplicados pelo Firebase Hosting, não pelo servidor simples de prévia. Os testes de navegador reproduzem os cabeçalhos configurados. O Firebase controla HSTS nos seus domínios padrão.

Sempre execute `npm run build` antes de publicar; não combine `out/` de um build com hashes de outro. `npm run deploy:hosting` já faz isso. Não edite manualmente os hashes.

## Verificação reproduzível

```bash
npm ci
npm run security:scan
npm audit --omit=dev
npm audit
npm run lint
npm run build
```

Com `npm run preview -- --listen 3000` rodando em outra janela:

```bash
npx playwright install chromium
npm run test:ui
npm run test:flows
npm run test:security
```

O último teste comprova o bloqueio de um script inline não autorizado e o tratamento de dados locais malformados. As imagens externas enviam requisições ao Unsplash; não hospede dados pessoais nessas URLs.

## Publicação e reporte

Antes de tornar um repositório existente público, revise também o histórico e os arquivos rastreados. Nunca coloque chaves de provedor, contas de serviço ou tokens em variáveis `NEXT_PUBLIC_*`: elas entram no JavaScript público. `.env.example` contém somente instruções e uma variável vazia.

Ao relatar uma vulnerabilidade, evite publicar credenciais, dados pessoais ou instruções de exploração com dados reais. Use o canal privado de reporte do provedor do repositório, caso esteja habilitado pelo mantenedor.

Referências: [cabeçalhos do Firebase Hosting](https://firebase.google.com/docs/hosting/full-config), [CSP no Next.js](https://nextjs.org/docs/app/guides/content-security-policy) e [auditoria npm](https://docs.npmjs.com/cli/v11/commands/npm-audit/).
