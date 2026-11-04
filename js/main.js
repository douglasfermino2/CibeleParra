/**
 * Cibele Parra Assessoria - Interactive Logic & WhatsApp Integration
 * Phone: 11974254809 (Int: 5511974254809)
 * Email: cibeleklki@hotmail.com
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuration
  const WA_NUMBER = '5511974254809';

  // --- 1. Sticky Header Blur on Scroll ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    const setMenuState = (open) => {
      navMenu.classList.toggle('active', open);
      mobileToggle.setAttribute('aria-expanded', String(open));
      mobileToggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !open);
        icon.classList.toggle('fa-xmark', open);
      }
    };

    mobileToggle.addEventListener('click', () => {
      setMenuState(!navMenu.classList.contains('active'));
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => setMenuState(false));
    });

    // Close menu with Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        setMenuState(false);
        mobileToggle.focus();
      }
    });
  }

  // Decorative Font Awesome icons are hidden from screen readers
  document.querySelectorAll('i.fa-solid, i.fa-brands, i.fa-regular').forEach(icon => {
    icon.setAttribute('aria-hidden', 'true');
  });

  // --- 3. Filterable Services Grid ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  const activateFilter = (btn) => {
    filterBtns.forEach(b => {
      const isActive = b === btn;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', String(isActive));
      b.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    const filterValue = btn.getAttribute('data-filter');

    serviceCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filterValue === 'all' || category === filterValue) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  };

  filterBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => activateFilter(btn));

    // Arrow-key navigation between tabs (WAI-ARIA Tabs pattern)
    btn.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = filterBtns[(index + 1) % filterBtns.length];
      if (e.key === 'ArrowLeft') next = filterBtns[(index - 1 + filterBtns.length) % filterBtns.length];
      if (e.key === 'Home') next = filterBtns[0];
      if (e.key === 'End') next = filterBtns[filterBtns.length - 1];
      if (next) {
        e.preventDefault();
        next.focus();
        activateFilter(next);
      }
    });
  });

  // --- 4. Interactive Diagnostic / Tax Simulator ---
  const simProfileCards = document.querySelectorAll('.sim-profile-card');
  const simAreaCards = document.querySelectorAll('.sim-area-card');
  const simResultBox = document.getElementById('simResultBox');
  const simWaBtn = document.getElementById('simWaBtn');

  let selectedProfile = 'Empresa (PJ)';
  let selectedArea = 'Planejamento Tributário';

  const selectCard = (group, card) => {
    group.forEach(c => {
      const isSelected = c === card;
      c.classList.toggle('selected', isSelected);
      c.setAttribute('aria-pressed', String(isSelected));
    });
  };

  simProfileCards.forEach(card => {
    card.addEventListener('click', () => {
      selectCard(simProfileCards, card);
      selectedProfile = card.getAttribute('data-profile');
      updateSimulatorOutput();
    });
  });

  simAreaCards.forEach(card => {
    card.addEventListener('click', () => {
      selectCard(simAreaCards, card);
      selectedArea = card.getAttribute('data-area');
      updateSimulatorOutput();
    });
  });

  function updateSimulatorOutput() {
    if (!simResultBox || !simWaBtn) return;

    let messageText = '';
    let waText = '';

    if (selectedProfile === 'Empresa (PJ)') {
      messageText = `Perfeito! Para <strong>${selectedProfile}</strong> com foco em <strong>${selectedArea}</strong>, nós analisamos os regimes fiscais (Simples, Lucro Presumido, Lucro Real) para identificar a menor carga tributária possível e evitar autuações da Receita.`;
      waText = `Olá! Gostaria de um diagnóstico contábil gratuito para minha EMPRESA focado em: ${selectedArea}.`;
    } else {
      messageText = `Ótimo! Para <strong>Pessoa Física / Autônomo</strong> com foco em <strong>${selectedArea}</strong>, garantimos a declaração correta, uso total de deduções legais e suporte na negociação de débitos tributários.`;
      waText = `Olá! Preciso de assessoria contábil para PESSOA FÍSICA referente a: ${selectedArea}.`;
    }

    const resultMsg = simResultBox.querySelector('.sim-message');
    if (resultMsg) {
      resultMsg.innerHTML = messageText;
    }

    const encodedWa = encodeURIComponent(waText);
    simWaBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodedWa}`;
  }

  // --- 5. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  const syncFaqAria = () => {
    faqItems.forEach(i => {
      const btn = i.querySelector('.faq-question');
      if (btn) btn.setAttribute('aria-expanded', String(i.classList.contains('active')));
    });
  };

  faqItems.forEach((item, index) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!questionBtn) return;

    questionBtn.setAttribute('type', 'button');
    questionBtn.id = questionBtn.id || `faq-question-${index + 1}`;
    if (answer) {
      answer.id = answer.id || `faq-answer-${index + 1}`;
      answer.setAttribute('role', 'region');
      answer.setAttribute('aria-labelledby', questionBtn.id);
      questionBtn.setAttribute('aria-controls', answer.id);
    }

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
      syncFaqAria();
    });
  });

  syncFaqAria();

  // --- 6. Contact Form Validation & Bulletproof Input Masking ---
  const phoneInput = document.getElementById('formPhone');
  const phoneError = document.getElementById('phoneError');

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let raw = e.target.value.replace(/\D/g, '').substring(0, 11);
      let formatted = '';

      if (raw.length === 0) {
        formatted = '';
      } else if (raw.length <= 2) {
        formatted = '(' + raw;
      } else if (raw.length <= 6) {
        formatted = '(' + raw.substring(0, 2) + ') ' + raw.substring(2);
      } else if (raw.length <= 10) {
        // (XX) XXXX-XXXX (Telefone Fixo / Incompleto)
        formatted = '(' + raw.substring(0, 2) + ') ' + raw.substring(2, 6) + '-' + raw.substring(6);
      } else {
        // (XX) XXXXX-XXXX (Celular 11 dígitos)
        formatted = '(' + raw.substring(0, 2) + ') ' + raw.substring(2, 7) + '-' + raw.substring(7);
      }

      e.target.value = formatted;
      e.target.classList.remove('input-error');
      if (phoneError) phoneError.textContent = '';
    });

    phoneInput.addEventListener('blur', (e) => {
      const raw = e.target.value.replace(/\D/g, '');
      if (raw.length > 0 && raw.length < 10) {
        e.target.classList.add('input-error');
        if (phoneError) phoneError.textContent = 'Informe um telefone/WhatsApp válido com DDD';
      }
    });
  }

  const emailInput = document.getElementById('formEmail');
  const emailError = document.getElementById('emailError');

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  if (emailInput) {
    emailInput.addEventListener('input', (e) => {
      e.target.classList.remove('input-error');
      if (emailError) emailError.textContent = '';
    });

    emailInput.addEventListener('blur', (e) => {
      const val = e.target.value.trim().toLowerCase();
      e.target.value = val;
      if (val.length > 0 && !validateEmail(val)) {
        e.target.classList.add('input-error');
        if (emailError) emailError.textContent = 'Informe um e-mail válido (ex: nome@dominio.com)';
      } else {
        e.target.classList.remove('input-error');
        if (emailError) emailError.textContent = '';
      }
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const email = document.getElementById('formEmail').value.trim().toLowerCase();
      const profile = document.getElementById('formProfile').value;
      const service = document.getElementById('formService').value;
      const message = document.getElementById('formMessage').value.trim();

      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        if (phoneInput) phoneInput.classList.add('input-error');
        if (phoneError) phoneError.textContent = 'Informe um telefone/WhatsApp válido com DDD';
        if (phoneInput) phoneInput.focus();
        return;
      }

      if (!validateEmail(email)) {
        if (emailInput) emailInput.classList.add('input-error');
        if (emailError) emailError.textContent = 'Informe um e-mail válido (ex: nome@dominio.com)';
        if (emailInput) emailInput.focus();
        return;
      }

      const fullWaMessage = `*Novo Contato via Site - Cibele Parra Assessoria*\n\n` +
        `👤 *Nome:* ${name}\n` +
        `📱 *Telefone:* ${phone}\n` +
        `✉️ *E-mail:* ${email}\n` +
        `📊 *Perfil:* ${profile}\n` +
        `💼 *Serviço de Interesse:* ${service}\n` +
        `📝 *Mensagem:* ${message || 'Gostaria de agendar um atendimento.'}`;

      const encodedMsg = encodeURIComponent(fullWaMessage);
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodedMsg}`, '_blank');
    });
  }

  // --- 7. Quick Service WhatsApp Buttons ---
  document.querySelectorAll('.service-btn-wa').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service-name') || 'Assessoria Contábil';
      const msg = `Olá Cibele Parra Assessoria! Vi no site o serviço de *${serviceName}* e gostaria de solicitar um orçamento/diagnóstico.`;
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });
});
