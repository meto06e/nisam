/* Nisam Nakliyat - tek sayfa site etkileşimleri */
(function ($) {
  'use strict';

  const WHATSAPP_NUMBER = '905078894756';

  function trackContact(type) {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'contact_click',
        contact_type: type
      });
    }
  }

  $(function () {
    const $window = $(window);
    const $header = $('#siteHeader');
    const $backToTop = $('#backToTop');
    const $navCollapse = $('#mainNav');

    $('#currentYear').text(new Date().getFullYear());

    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    $('#moveDate').attr('min', localToday);

    function handleScroll() {
      const top = $window.scrollTop();
      $header.toggleClass('is-scrolled', top > 10);
      $backToTop.toggleClass('is-visible', top > 650);
    }

    handleScroll();
    $window.on('scroll', handleScroll);

    $('a[href^="#"]').on('click', function (event) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const $target = $(targetId);
      if (!$target.length) return;

      event.preventDefault();
      const headerOffset = $header.outerHeight() || 0;
      $('html, body').stop().animate({
        scrollTop: Math.max(0, $target.offset().top - headerOffset - 14)
      }, 520);

      if ($navCollapse.hasClass('show')) {
        const collapse = bootstrap.Collapse.getOrCreateInstance($navCollapse[0]);
        collapse.hide();
      }
    });

    $backToTop.on('click', function () {
      $('html, body').stop().animate({ scrollTop: 0 }, 520);
    });

    $('[data-track="phone"]').on('click', function () {
      trackContact('phone');
    });

    $('[data-track="whatsapp"]').on('click', function () {
      trackContact('whatsapp');
    });

    $('[data-service]').on('click', function () {
      const service = $(this).data('service');
      $('#serviceType').val(service).trigger('change');
      const headerOffset = $header.outerHeight() || 0;
      $('html, body').stop().animate({
        scrollTop: Math.max(0, $('#hizli-fiyat').offset().top - headerOffset - 14)
      }, 520, function () {
        $('#pickup').trigger('focus');
      });
    });

    $('#quickQuoteForm').on('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();

      const form = this;
      form.classList.add('was-validated');
      if (!form.checkValidity()) return;

      const values = {
        pickup: $('#pickup').val().trim(),
        delivery: $('#delivery').val().trim(),
        serviceType: $('#serviceType').val(),
        moveDate: $('#moveDate').val(),
        floorInfo: $('#floorInfo').val().trim(),
        phone: $('#phone').val().trim(),
        items: $('#items').val().trim()
      };

      const message = [
        'Merhaba Nisam Nakliyat, taşıma için fiyat almak istiyorum.',
        '',
        '📍 Alınacak yer: ' + values.pickup,
        '📍 Bırakılacak yer: ' + values.delivery,
        '🚚 Taşıma türü: ' + values.serviceType,
        '📦 Eşyalar: ' + values.items,
        values.moveDate ? '📅 Tarih: ' + values.moveDate : '',
        values.floorInfo ? '🏢 Kat / asansör: ' + values.floorInfo : '',
        values.phone ? '📞 Telefon: ' + values.phone : '',
        '',
        'Müsaitlik ve fiyat bilgisi rica ederim.'
      ].filter(Boolean).join('\n');

      trackContact('whatsapp_quote_form');
      const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
      window.open(url, '_blank', 'noopener,noreferrer');
    });

    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observer = new IntersectionObserver(function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -50px', threshold: 0.08 });

      revealElements.forEach(function (element) {
        observer.observe(element);
      });
    } else {
      revealElements.forEach(function (element) {
        element.classList.add('is-visible');
      });
    }

    const sectionIds = ['anasayfa', 'hizmetler', 'bolgeler', 'araclar', 'sss'];
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          $('.navbar-nav .nav-link').removeClass('active');
          $('.navbar-nav .nav-link[href="#' + entry.target.id + '"]').addClass('active');
        });
      }, { rootMargin: '-35% 0px -55%', threshold: 0.01 });

      sectionIds.forEach(function (id) {
        const section = document.getElementById(id);
        if (section) sectionObserver.observe(section);
      });
    }
  });
})(jQuery);
