# LP — O Poder do Olhar: A Imersão (Lizanne Dantas)

Landing page implementada a partir do Figma **LP - LIZANNE**
(`5cb5G2CPbjeXOmipYZ9FAN`), usando os dois frames do arquivo:

| Frame   | node-id   | Tamanho    |
| ------- | --------- | ---------- |
| DESKTOP | `17:5427` | 1920×5899  |
| MOBILE  | `56:381`  | 390×5604   |

Nada foi alterado no Figma — o arquivo foi apenas lido.

## Como rodar

Não tem build obrigatório. É HTML/CSS/JS puro:

- **Direto:** abra o `index.html` no navegador.
- **Com servidor (opcional):** a pasta já tem um scaffold Vite — `npm run dev`.

## Como publicar

Suba a pasta inteira para a raiz do domínio. Os caminhos são todos relativos:

```
index.html
assets/css/styles.css
assets/js/main.js
assets/img/…
assets/svg/…
```

Não precisa de `npm run build` — o `index.html` funciona como está.

## Estrutura

Uma seção por bloco do Figma, na mesma ordem:

1. **Hero** — arte de fundo + texto, CTA e selo `@lizannedantas`
2. **Marquee** — duas faixas cruzadas (laranja rotacionada −2,07° + escura reta)
3. **Por que estar nessa imersão?** — painel de vidro + composição de fotos
4. **O que você vai aprender?** — card de vidro com 4 cards e CTA
5. **Condições e Bônus Exclusivos** — banda branca com 3 itens
6. **Preço** — card com moldura laranja sobre o chevron
7. **Quem é Lizanne Dantas?**
8. **Perguntas Frequentes** — accordion
9. **Footer**

## Sistema responsivo

**Geometria** — a variável `--u` vale 1px no frame de 1920 e escala com a
viewport (`min(100vw / 1920, 1px)`). Todas as medidas do Figma entram como
`calc(N * var(--u))`, então a página é proporcionalmente idêntica ao frame em
qualquer largura e trava em 1920.

**Tipografia** — tokens `--fs-*` interpolam linearmente entre 390px e 1920px de
viewport, em vez de escalar junto com `--u`. Motivo no ponto 1 abaixo.

**Breakpoint** — abaixo de `900px` a página assume o layout do frame MOBILE:
cards empilhados, texto acima da foto na bio, divisores verticais nos bônus.

**Monitores ultrawide** — a página ocupa a largura toda e os fundos sangram até
as bordas; o conteúdo posicionado vive dentro de `.stage`, travado em 1920 e
centralizado. Assim não sobra faixa preta nas laterais em telas grandes.
No hero, acima de 1920 a arte fica centrada no tamanho natural (sem esticar nem
cortar) e as laterais são preenchidas por dois gradientes verticais amostrados
das bordas da própria imagem, então a emenda não aparece. No mobile o `.stage`
usa `display: contents` e desaparece do layout.

## Movimento

Nenhuma fonte, cor ou medida foi alterada para isso — só animação.

**Entradas ao rolar** — cada bloco entra com fade + deslocamento leve
(0,72s, `cubic-bezier(.22,.61,.36,1)`), em 4 direções conforme o elemento:
`up`, `left` (textos à esquerda), `right` (arte à direita) e `zoom` (cards e
card de preço). Itens irmãos entram em cascata: cards 110ms, bônus 120ms,
FAQ 90ms, lista do hero 80ms.

**Microinterações** — cards sobem 8px com zoom de 1.07 na foto; ícones dos
bônus dão um scale com leve rotação; itens do FAQ clareiam no hover e o aberto
ganha um glow laranja; o selo do hero sobe no hover. O CTA principal do preço
tem um pulso discreto de 2,8s que pausa no hover.

**Como é seguro** — os alvos são marcados por JavaScript, não no HTML: a classe
`js-reveal` entra no `<html>` e só então o CSS esconde os elementos. Sem JS,
tudo aparece normalmente. Cada elemento também tem uma rede de segurança de
1,4s: se a animação não rodar (motor sem suporte, evento perdido, aba em
segundo plano), ele aparece de qualquer forma — conteúdo invisível é pior que
conteúdo sem animação. O observer usa `threshold: 0` e margem em pixels, não em
porcentagem, porque com `%` elementos altos ou no fim da página podem nunca
atingir o limite e ficariam encalhados.

**Padronização entre aparelhos** — `prefers-reduced-motion: reduce` é uma
configuração do sistema operacional de cada aparelho (Windows: Acessibilidade →
Efeitos visuais; Android: Remover animações, que a economia de bateria liga
sozinha; iOS/macOS: Reduzir movimento). Na primeira versão a LP respeitava essa
preferência, então quem tinha a opção ligada recebia a página **completamente
estática** — e como a configuração varia de aparelho para aparelho, a LP parecia
animada num PC e parada em outro.

**Por decisão de projeto isso foi removido:** não existe mais bloco
`@media (prefers-reduced-motion: reduce)` no CSS e o `main.js` não consulta a
preferência. A animação é idêntica em qualquer dispositivo — entradas, cascata,
marquee e pulso do CTA rodam para todos.

O custo dessa escolha é que quem ligou "reduzir movimento" por sensibilidade
vestibular recebe o movimento completo de qualquer forma. Para voltar a
respeitar a preferência sem perder a padronização, o meio-termo é reintroduzir o
`@media` trocando só o `animation-name` das entradas por `rv-fade` (fade sem
deslocamento) e desligando `.mq__track` e `.btn--preco` — há um comentário no
fim do `styles.css` com essa receita.

Verificado nos dois modos: `animation-name` do marquee (`mq-left`), do pulso
(`cta-pulse`) e a transição dos cards (0,45s) saem iguais, com zero elementos
presos invisíveis.

**Como testar sem mexer no sistema:** Chrome → F12 → menu ⋮ → More tools →
Rendering → `Emulate CSS prefers-reduced-motion`.

**Preview local:** o `<script>` usa `type="module"`, que o navegador bloqueia por
CORS em `file://` — abrindo o `index.html` direto do disco o JS não roda (sem
animação e o FAQ não abre). Use `npm run dev` ou qualquer servidor local. Em
produção (Vercel, HTTPS) funciona normalmente.

## Decisões que divergem do Figma (de propósito)

**1. Corpo de texto no mobile é maior que no frame.**
O frame MOBILE escala tudo por ~0,53 do desktop, o que joga o corpo de texto
para 10,5px, a legenda dos bônus para 8,6px e o CTA para 8,45px. Isso é
sub-legível num celular real e prejudicaria a conversão. Mantive o layout, a
hierarquia e os títulos do mobile, mas com piso de legibilidade (corpo 14px,
CTA 11px). **Títulos e a estrutura estão fiéis ao frame.**
Exceção: o texto de apoio do hero no mobile é 13,5px, e não 14px — a 14px ele
virava 6 linhas e empurrava a lista de infos para cima da forma laranja do
fundo, que começa em y=378. Com 13,5px fica em 5 linhas e todo o bloco termina
antes disso. A largura é a do frame (252px) justamente para o texto quebrar
antes da foto da Lizanne em vez de escrever por cima dela.
Para voltar ao valor literal do Figma, mexa só nos mínimos dos tokens `--fs-*`
no topo do `styles.css`.

**2. O marquee anima.**
No Figma é estático, mas faixa de texto repetido é convencionalmente animada.
Pausa sozinho fora da viewport e respeita `prefers-reduced-motion`.
Para congelar: remova a `animation` de `.mq__track`.

**3. Ordem dos bônus no mobile.**
O frame MOBILE lista Sorteio → Brindes → Condições; o DESKTOP lista
Brindes → Condições → Sorteio. Usei a ordem do desktop nos dois, por ser a
ordem semântica e porque a inversão parece acidental no arquivo.

**4. Blocos de arte compostos vieram como imagem única.**
Hero (`hero-bg.png`), arte da bio (`bio-art.png`) e arte do "Por que" no mobile
(`porque-art-mobile.png`) são composições de máscaras e formas sobrepostas.
Exportá-las prontas do Figma dá fidelidade exata; refazer o empilhamento em CSS
estava distorcendo as máscaras.

**5. O chevron laranja no mobile foi ampliado (524 → 660px).**
Como o corpo de texto no mobile é maior (ponto 1), o card de preço fica mais
alto que no frame. No tamanho original o chevron ficava escondido atrás do card;
ampliado, ele aparece abaixo dele como no design.

## Já configurado

**Checkout** — todos os CTAs apontam para
`https://pay.cakto.com.br/3gkt8z6_1033282`, abrindo em
nova aba. São 4 botões: hero, card "O que você vai aprender?", card de preço e
FAQ. Para trocar depois, é o mesmo link nos 4 lugares (ou defina
`window.CHECKOUT_URL` antes do `main.js`, que sobrescreve o botão de preço).

**FAQ** — as 4 respostas estão preenchidas e o accordion funciona: fechado
mostra só a pergunta, e abrir um item fecha os outros. O prazo de acesso às
gravações está definido como **6 meses** (resposta 1).

## Logo e favicon

O monograma **LD** veio de `Desktop/LOGO EM SVG` (130×114, dois paths: o "L" e o
"D"). As duas variantes estão em `assets/svg/`:

- `logo-ld-branca.svg` — usada na página, abrindo a seção "Quem é Lizanne
  Dantas?" (fundo escuro)
- `logo-ld-laranja.svg` — não usada na página, guardada para fundo claro

**Atenção ao tom:** o laranja do arquivo é `#D97940` (terracota), diferente do
laranja da marca usado em toda a LP, que é `#FF701E`. Por isso na página entrou
a versão branca e no favicon o monograma branco sobre o laranja da marca —
assim não há dois laranjas conflitando. Se o `#D97940` for o tom correto da
identidade, me avise que eu alinho a LP inteira a ele.

**Favicon** — o monograma tem traço fino e sozinho fica quase invisível a 16px.
Então o ícone é o monograma **branco sobre quadrado laranja da marca**, que
mantém contraste em qualquer tamanho e em abas claras ou escuras:

| Arquivo                       | Uso                                            |
| ----------------------------- | ---------------------------------------------- |
| `assets/favicon.svg`          | navegadores modernos, cantos arredondados       |
| `assets/favicon-32.png`       | fallback 32×32, quadrado                        |
| `assets/apple-touch-icon.png` | 180×180 para iOS (o sistema arredonda sozinho)  |

Há também `<meta name="theme-color" content="#ff701e">` para a barra do
navegador no mobile.

## Fontes

**Sora** e **Poppins** vêm do Google Fonts. A fonte manuscrita do "A Imersão"
é **Black Signature (Personal Use Only)** — não está no Google Fonts e a
licença é de uso pessoal. Por isso os dois lockups do logo
(`logo-lockup.svg`, `logo-footer.svg`) foram exportados como SVG vetorizado:
o traço fica idêntico ao Figma, sem depender de carregar a fonte nem de licença
de webfont.

## Verificação

Renderizado em Chrome headless e comparado com o export do Figma:

| Seção        | Figma       | Implementado |
| ------------ | ----------- | ------------ |
| Hero         | 0–860       | 0–853        |
| Banda branca | 2391–3086   | 2401–3085    |
| Card de preço| início 3007 | início 3007  |
| **Total**    | **5899**    | **5811**     |

A diferença de ~1,5% é o viewport real do headless (~1907px em vez de 1920).
Sem overflow horizontal em nenhuma largura (`scrollWidth == clientWidth`).
