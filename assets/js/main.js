/* =============================================================
   O Poder do Olhar: A Imersão — interações
   ============================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------
     FAQ — accordion
     ----------------------------------------------------------- */
  var items = document.querySelectorAll('.faq__item');

  Array.prototype.forEach.call(items, function (item) {
    var btn = item.querySelector('.faq__q');
    var panel = item.querySelector('.faq__a');
    if (!btn || !panel) return;

    // Item sem resposta preenchida fica estático, como no design.
    if (panel.textContent.trim() === '' && panel.children.length === 0) {
      btn.setAttribute('aria-disabled', 'true');
      return;
    }

    // Envolve o conteúdo para o grid-template-rows animar a altura.
    if (!panel.querySelector('.faq__a-inner')) {
      var inner = document.createElement('div');
      inner.className = 'faq__a-inner';
      while (panel.firstChild) inner.appendChild(panel.firstChild);
      panel.appendChild(inner);
    }

    item.classList.add('is-interactive');
    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', function () {
      var isOpen = item.hasAttribute('data-open');

      // Um item aberto por vez.
      Array.prototype.forEach.call(items, function (other) {
        if (other === item) return;
        other.removeAttribute('data-open');
        var otherBtn = other.querySelector('.faq__q');
        if (otherBtn && otherBtn.hasAttribute('aria-expanded')) {
          otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.removeAttribute('data-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.setAttribute('data-open', '');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* -----------------------------------------------------------
     Entradas ao rolar
     Os alvos são marcados por JS (não no HTML) para que, sem
     JavaScript, nada fique escondido. Ao terminar a animação o
     atributo é removido, devolvendo o elemento ao estado normal
     — assim os :hover com transform continuam funcionando.
     ----------------------------------------------------------- */
  var GROUPS = [
    // [seletor, direção, atraso entre irmãos em ms]
    ['.hero__logo',      'up',    0],
    ['.hero__title',     'left',  0],
    ['.hero__lead',      'left',  0],
    ['.btn--hero',       'up',    0],
    ['.infolist li',     'up',    80],
    ['.badge',           'right', 0],
    ['.porque__title',   'left',  0],
    ['.porque__copy p',  'left',  90],
    ['.aprender__title', 'up',    0],
    ['.card',            'zoom',  110],
    ['.bonus__title',    'up',    0],
    ['.bonus__item',     'up',    120],
    ['.preco__frame',    'zoom',  0],
    ['.bio__mark',       'zoom',  0],
    ['.bio__title',      'up',    0],
    ['.bio__copy',       'left',  0],
    ['.bio__art',        'right', 0],
    ['.faq__title',      'up',    0],
    ['.faq__item',       'up',    90],
    ['.btn--faq',        'up',    0],
    ['.footer__inner',   'up',    0]
  ];

  var supported = 'IntersectionObserver' in window;

  if (!reduced && supported) {
    document.documentElement.classList.add('js-reveal');

    var targets = [];
    GROUPS.forEach(function (group) {
      var els = document.querySelectorAll(group[0]);
      Array.prototype.forEach.call(els, function (el, i) {
        el.setAttribute('data-reveal', group[1]);
        if (group[2]) el.style.animationDelay = (i * group[2]) + 'ms';
        targets.push(el);
      });
    });

    // Devolve o elemento ao estado normal (visível, sem transform),
    // liberando os :hover que usam transform.
    function settle(el) {
      if (!el.hasAttribute('data-reveal')) return;
      el.removeAttribute('data-reveal');
      el.classList.remove('is-in');
      el.style.animationDelay = '';
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-in');
        io.unobserve(el);

        el.addEventListener('animationend', function handler() {
          el.removeEventListener('animationend', handler);
          settle(el);
        });

        // Rede de segurança: se a animação não rodar (motor sem suporte,
        // aba em segundo plano, evento perdido), o elemento aparece de
        // qualquer forma. Conteúdo invisível é pior que sem animação.
        var delay = parseFloat(el.style.animationDelay) || 0;
        setTimeout(function () { settle(el); }, delay + 1400);
      });
      // threshold 0 + margem em px (não em %): com porcentagem, elementos
      // altos ou no fim da página podem nunca atingir o limite e ficariam
      // encalhados invisíveis.
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* -----------------------------------------------------------
     Marquee — pausa fora da viewport (economiza bateria)
     ----------------------------------------------------------- */
  var mq = document.querySelector('.mq');
  if (mq && supported) {
    var tracks = mq.querySelectorAll('.mq__track');
    var mqIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        Array.prototype.forEach.call(tracks, function (t) {
          t.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        });
      });
    }, { threshold: 0 });
    mqIo.observe(mq);
  }

  /* -----------------------------------------------------------
     CTA de checkout
     Os links já apontam para o checkout no HTML. Definir
     window.CHECKOUT_URL antes deste script sobrescreve todos.
     ----------------------------------------------------------- */
  var checkoutUrl = window.CHECKOUT_URL || '';
  if (checkoutUrl) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-checkout], .btn'), function (a) {
      if (a.tagName !== 'A') return;
      a.setAttribute('href', checkoutUrl);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  }
})();
