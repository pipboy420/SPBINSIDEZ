(function() {
  'use strict';

  // -------------------- Заглушка: дефолтные экскурсии --------------------
  const defaultToursData = [
    {
      "id": "1",
      "title": "Речная прогулка по каналам",
      "info": "Маршрут: Невский пр., река Мойка, канал Грибоедова.\nДлительность: ~1,5 часа.\nОписание: Прогулка по историческим каналам.",
      "images": ["images/image1.jpeg", "images/image2.jpeg"],
      "priceGroup": 1500,
      "priceIndividual": 2000,
      "shortInfo": "На теплоходе по рекам и каналам",
      "active": true
    },
    {
      "id": "2",
      "title": "Ночной развод мостов",
      "info": "Старт в 00:30, длительность: ~2 часа.\nОписание: Ночная прогулка с видом на развод мостов.",
      "images": ["images/briges_background.jpeg"],
      "priceGroup": 2000,
      "priceIndividual": 2500,
      "shortInfo": "Ночное шоу разводных мостов",
      "active": true
    },
    {
      "id": "3",
      "title": "Дворцовый Петербург",
      "info": "Зимний дворец, Михайловский дворец, особняки на набережной.\nОписание: Экскурсия по дворцовым комплексам Петербурга.",
      "images": ["images/tour3.jpeg"],
      "priceGroup": 1800,
      "priceIndividual": 2300,
      "shortInfo": "Экскурсия по знаменитым дворцам",
      "active": true
    }
  ];

  // -------------------- Дефолтный контент (FAQ, ABOUT, REVIEWS) --------------------
  const defaultContent = {
    aboutText: "",
    contacts: {
      phone: "+7 (999) 123-45-67",
      email: "info@spbinside.ru",
      address: "Невский проспект, д. 10, Санкт-Петербург",
      footerText: ""
    },
    faq: [
      {
        question: "Можно ли оплатить экскурсию онлайн?",
        answer: "Да, мы принимаем онлайн-оплату (карты Visa/MasterCard). После оформления заявки с вами свяжется менеджер и пришлёт ссылку на оплату."
      },
      {
        question: "Есть ли скидки для групп?",
        answer: "Да, при бронировании от 10 человек предусмотрены скидки. Подробности можно уточнить у менеджера."
      },
      {
        question: "Как отменить или перенести экскурсию?",
        answer: "Достаточно связаться с нами по телефону или электронной почте. Перенос возможен при наличии свободных мест."
      }
    ],
    reviews: [
      {
        author: "Мария",
        text: "Очень понравилась экскурсия по рекам и каналам! Гид замечательный, много интересных фактов услышали!",
        social: "instagram"
      },
      {
        author: "Андрей",
        text: "Отличная организация, всё чётко по времени, автобусы комфортные, успели посмотреть весь город!",
        social: "google"
      },
      {
        author: "Светлана",
        text: "Спонтанно решили пойти на ночную экскурсию по разводным мостам – осталось незабываемое впечатление!",
        social: "instagram"
      }
    ]
  };

  // -------------------- LocalStorage: TOURS --------------------
  function getToursFromStorage() {
    const toursStr = localStorage.getItem('spbTours');
    if (!toursStr) {
      localStorage.setItem('spbTours', JSON.stringify(defaultToursData));
      return defaultToursData;
    }
    try {
      return JSON.parse(toursStr);
    } catch (e) {
      console.error('Ошибка парсинга spbTours:', e);
      return defaultToursData;
    }
  }
  function saveToursToStorage(arr) {
    localStorage.setItem('spbTours', JSON.stringify(arr));
  }

  // -------------------- LocalStorage: SITE CONTENT --------------------
  function getSiteContentFromStorage() {
    const contentStr = localStorage.getItem('spbSiteContent');
    if (!contentStr) {
      localStorage.setItem('spbSiteContent', JSON.stringify(defaultContent));
      return defaultContent;
    }
    try {
      return JSON.parse(contentStr);
    } catch (e) {
      console.error('Ошибка парсинга spbSiteContent:', e);
      return defaultContent;
    }
  }
  function saveSiteContentToStorage(obj) {
    localStorage.setItem('spbSiteContent', JSON.stringify(obj));
  }

  const toursData = getToursFromStorage();
  const siteContent = getSiteContentFromStorage();

  // -------------------- Рендер Экскурсий (active -> впереди, inactive -> в конце) --------------------
  const toursContainer = document.getElementById('toursContainer');
  function renderTours() {
    toursContainer.innerHTML = "";

    const activeTours = toursData.filter(t => t.active);
    const inactiveTours = toursData.filter(t => !t.active);

    function drawCard(tour, isActive) {
      const card = document.createElement('div');
      card.className = 'tour__card';
      if (!isActive) {
        card.classList.add('inactive');
      }
      // Image
      const imageDiv = document.createElement('div');
      imageDiv.className = 'tour__image';
      const imgEl = document.createElement('img');
      imgEl.src = (tour.images && tour.images.length) ? tour.images[0] : 'images/placeholder.jpg';
      imgEl.alt = tour.title;
      imageDiv.appendChild(imgEl);

      const contentDiv = document.createElement('div');
      contentDiv.className = 'tour__content';

      const titleEl = document.createElement('h3');
      titleEl.className = 'tour__title';
      titleEl.textContent = tour.title;

      const infoEl = document.createElement('p');
      infoEl.className = 'tour__info';
      infoEl.textContent = tour.shortInfo || "";

      const buttonEl = document.createElement('button');
      buttonEl.className = 'btn btn--primary tour__button';
      if (isActive) {
        buttonEl.textContent = 'Подробнее';
        buttonEl.addEventListener('click', () => {
          openDetailsModal({
            title: tour.title,
            info: tour.info,
            images: tour.images
          });
        });
      } else {
        buttonEl.textContent = 'Не проводится';
        buttonEl.disabled = true;
      }

      contentDiv.appendChild(titleEl);
      contentDiv.appendChild(infoEl);
      contentDiv.appendChild(buttonEl);

      card.appendChild(imageDiv);
      card.appendChild(contentDiv);
      toursContainer.appendChild(card);
    }

    // Активные
    activeTours.forEach(t => drawCard(t, true));
    // Неактивные
    inactiveTours.forEach(t => drawCard(t, false));
  }
  renderTours();

  // -------------------- МОДАЛКА "Подробнее" --------------------
  const detailsModal = document.getElementById('detailsModal');
  const modalImage = document.getElementById('modalImage');
  modalImage.addEventListener('click', () => {
    showImage(currentImageIndex + 1);
  });
  
  let startX = 0;
  modalImage.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  
  modalImage.addEventListener('touchend', (e) => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
      showImage(currentImageIndex + 1);
    } else if (startX - endX < -50) {
      showImage(currentImageIndex - 1);
    }
  });
  const modalTitle = document.getElementById('modalTitle');
  const modalInfo = document.getElementById('modalInfo');
  const modalBookingBtn = document.getElementById('modalBookingBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const carouselDots = document.getElementById('carouselDots');
  let currentImages = [];
  let currentImageIndex = 0;

  function showImage(index) {
    if (index < 0) index = currentImages.length - 1;
    if (index >= currentImages.length) index = 0;
    currentImageIndex = index;
    modalImage.src = currentImages[currentImageIndex];
    updateCarouselDots();
  }
  function updateCarouselDots() {
    carouselDots.innerHTML = '';
    currentImages.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === currentImageIndex) dot.classList.add('active');
      dot.addEventListener('click', () => showImage(i));
      carouselDots.appendChild(dot);
    });
  }

  function openDetailsModal(data) {
    detailsModal.setAttribute('aria-hidden', 'false');
    detailsModal.style.display = 'flex';
    siteOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    modalTitle.textContent = data.title;
    modalInfo.textContent = data.info;
    currentImages = data.images || [];
    if (currentImages.length) {
      showImage(0);
    } else {
      modalImage.src = 'images/placeholder.jpg';
      carouselDots.innerHTML = '';
    }
  }
  function closeDetailsModal() {
    detailsModal.setAttribute('aria-hidden', 'true');
    detailsModal.style.display = 'none';
    siteOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  modalCloseBtn.addEventListener('click', closeDetailsModal);
  detailsModal.addEventListener('click', (e) => {
    if (e.target === detailsModal) {
      closeDetailsModal();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailsModal.getAttribute('aria-hidden') === 'false') {
      closeDetailsModal();
    }
    // Стрелки для переключения картинок
    if (detailsModal.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
      if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
    }
  });

  // Свайп вниз для закрытия на мобильном
  let startY = 0;
  let isDownSwipe = false;
  const modalContent = document.querySelector('.modal-drag-area');
  modalContent.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      startY = e.touches[0].clientY;
      isDownSwipe = true;
    }
  });
  modalContent.addEventListener('touchmove', (e) => {
    if (!isDownSwipe) return;
    let diff = e.touches[0].clientY - startY;
    if (diff > 80) {
      closeDetailsModal();
      isDownSwipe = false;
    }
  });

  // -------------------- САЙДБАР БРОНИРОВАНИЯ --------------------
  const bookingSidebar = document.getElementById('bookingSidebar');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const bookingForm = document.getElementById('bookingForm');
  const bookingTourSelect = document.getElementById('bookingTourSelect');
  const bookingTypeSelect = document.getElementById('bookingTypeSelect');
  const bookingTimeSelect = document.getElementById('bookingTimeSelect');
  const bookingDateField = document.getElementById('bookingDateField');
  const adultCountEl = document.getElementById('adultCount');
  const childCountEl = document.getElementById('childCount');
  const totalPriceEl = document.getElementById('totalPrice');
  const bookingTourTitle = document.getElementById('bookingTourTitle');
  const bookingTourImg = document.getElementById('bookingTourImg');

  // Заполняем select экскурсиями (только активными)
  function fillBookingTourSelect() {
    bookingTourSelect.innerHTML = '<option value="" disabled selected>Выбрать экскурсию</option>';
    toursData.forEach(t => {
      if (t.active) {
        const opt = document.createElement('option');
        opt.value = t.title;
        opt.textContent = t.title;
        bookingTourSelect.appendChild(opt);
      }
    });
  }
  fillBookingTourSelect();

  function findTourByTitle(title) {
    return toursData.find(t => t.title === title && t.active);
  }

  function updateTotalPrice() {
    const adultCount = parseInt(adultCountEl.innerText, 10);
    const childCount = parseInt(childCountEl.innerText, 10);
    let totalPrice = 0;

    const selectedTour = findTourByTitle(bookingTourSelect.value);
    if (selectedTour && bookingTypeSelect.value) {
      if (bookingTypeSelect.value === 'Групповая') {
        totalPrice = selectedTour.priceGroup * adultCount 
                   + Math.round(selectedTour.priceGroup * 0.67) * childCount;
      } else {
        totalPrice = selectedTour.priceIndividual * adultCount
                   + Math.round(selectedTour.priceIndividual * 0.67) * childCount;
      }
    }
    totalPriceEl.innerText = totalPrice;
  }
  document.querySelectorAll('.counter__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const targetId = btn.getAttribute('data-target');
      const countEl = document.getElementById(targetId);
      let count = parseInt(countEl.innerText, 10);
      if (action === 'increase') count++;
      if (action === 'decrease' && count > 0) count--;
      countEl.innerText = count;
      updateTotalPrice();
    });
  });
  bookingTourSelect.addEventListener('change', () => {
    const found = findTourByTitle(bookingTourSelect.value);
    if (found) {
      bookingTourTitle.textContent = found.title;
      bookingTourImg.src = (found.images && found.images.length)
        ? found.images[0]
        : '';
    } else {
      bookingTourTitle.textContent = 'Бронирование';
      bookingTourImg.src = '';
    }
    updateTotalPrice();
  });
  bookingTypeSelect.addEventListener('change', updateTotalPrice);

  function openBookingSidebar(preselectedTour) {
    bookingSidebar.setAttribute('aria-hidden', 'false');
    bookingSidebar.style.right = '0';
    siteOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Сброс
    fillBookingTourSelect();
    bookingTourSelect.value = '';
    bookingTypeSelect.value = '';
    bookingDateField.value = '';
    adultCountEl.innerText = '1';
    childCountEl.innerText = '0';
    totalPriceEl.innerText = '0';
    bookingTourTitle.textContent = 'Бронирование';
    bookingTourImg.src = '';

    if (preselectedTour) {
      const found = findTourByTitle(preselectedTour);
      if (found) {
        bookingTourSelect.value = found.title;
        bookingTourTitle.textContent = found.title;
        bookingTourImg.src = (found.images && found.images.length)
          ? found.images[0]
          : '';
      }
    }
  }
  function closeBookingSidebar() {
    bookingSidebar.setAttribute('aria-hidden', 'true');
    bookingSidebar.style.right = '-100%';
    siteOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  sidebarCloseBtn.addEventListener('click', closeBookingSidebar);
  bookingSidebar.addEventListener('click', (e) => {
    if (e.target === bookingSidebar) {
      closeBookingSidebar();
    }
  });


  // -------------------- Модалка "Подробнее" -> "Забронировать" --------------------
  modalBookingBtn.addEventListener('click', () => {
    const tourName = modalTitle.textContent;
    closeDetailsModal();
    openBookingSidebar(tourName);
  });

  // -------------------- Клик вне сайдбара/модалки => закрыть --------------------
  const siteOverlay = document.getElementById('siteOverlay');
  siteOverlay.addEventListener('click', () => {
    if (detailsModal.getAttribute('aria-hidden') === 'false') {
      closeDetailsModal();
    }
    if (bookingSidebar.getAttribute('aria-hidden') === 'false') {
      closeBookingSidebar();
    }
  });

  // -------------------- Отправка формы --------------------
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Если нужно, делаем проверку обязательных полей
    const nameVal = document.getElementById('bookingNameField').value.trim();
    const phoneVal = document.getElementById('bookingPhoneField').value.trim();
    if (!nameVal || !phoneVal) {
      alert('Заполните имя и телефон!');
      return;
    }
    alert('Спасибо! Ваша заявка отправлена.');
    bookingForm.reset();
    closeBookingSidebar();
  });

  // -------------------- КНОПКА ВВЕРХ --------------------
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > 300) {
      scrollTopBtn.style.opacity = '1';
      scrollTopBtn.style.pointerEvents = 'auto';
    } else {
      scrollTopBtn.style.opacity = '0';
      scrollTopBtn.style.pointerEvents = 'none';
    }
  }, 100));

  // -------------------- БУРГЕР-МЕНЮ --------------------
  const burgerBtn = document.getElementById('burgerBtn');
  const mainNav = document.getElementById('mainNav');
  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('open');
    mainNav.classList.toggle('open');
  });
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burgerBtn.classList.remove('open');
      mainNav.classList.remove('open');
    });
  });

  // -------------------- ЛОГО => ПРОКРУТИТЬ НАВЕРХ --------------------
  const logoEl = document.getElementById('logo');
  logoEl.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // -------------------- ПЛАВНАЯ ПРОКРУТКА data-scroll --------------------
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-scroll');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        window.scrollTo({ top: targetEl.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });

  // -------------------- АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ (IntersectionObserver) --------------------
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.scroll-section').forEach(el => {
    observer.observe(el);
  });

  // -------------------- FAQ --------------------
  const faqContainer = document.getElementById('faqContainer');
  function renderFAQ() {
    faqContainer.innerHTML = "";
    if (!siteContent.faq) return;
    siteContent.faq.forEach(item => {
      const wrap = document.createElement('div');
      wrap.className = 'faq__item';

      const questionBtn = document.createElement('button');
      questionBtn.className = 'faq__question';
      questionBtn.setAttribute('aria-expanded', 'false');
      questionBtn.textContent = item.question;

      const answerDiv = document.createElement('div');
      answerDiv.className = 'faq__answer';
      answerDiv.innerHTML = `<p>${item.answer}</p>`;

      questionBtn.addEventListener('click', () => {
        const expanded = questionBtn.getAttribute('aria-expanded') === 'true';
        questionBtn.setAttribute('aria-expanded', String(!expanded));
        answerDiv.classList.toggle('open', !expanded);
      });

      wrap.appendChild(questionBtn);
      wrap.appendChild(answerDiv);
      faqContainer.appendChild(wrap);
    });
  }
  renderFAQ();

  // -------------------- ABOUT / CONTACTS --------------------
  if (siteContent.aboutText && siteContent.aboutText.trim()) {
    const aboutCompanyText = document.getElementById('aboutCompanyText');
    aboutCompanyText.textContent = siteContent.aboutText;
  }
  const footerPhone = document.getElementById('footerPhone');
  const footerEmail = document.getElementById('footerEmail');
  const footerAddress = document.getElementById('footerAddress');
  const footerAdditionalText = document.getElementById('footerAdditionalText');
  if (siteContent.contacts) {
    if (siteContent.contacts.phone) footerPhone.textContent = siteContent.contacts.phone;
    if (siteContent.contacts.email) footerEmail.textContent = siteContent.contacts.email;
    if (siteContent.contacts.address) footerAddress.textContent = siteContent.contacts.address;
    if (siteContent.contacts.footerText) footerAdditionalText.textContent = siteContent.contacts.footerText;
  }

  // -------------------- ОТЗЫВЫ (несколько карточек) --------------------
  const reviewsContainer = document.getElementById('reviewsContainer');
  function renderReviews() {
    reviewsContainer.innerHTML = "";
    if (!siteContent.reviews || !siteContent.reviews.length) return;
    siteContent.reviews.forEach(rev => {
      const card = document.createElement('div');
      card.className = 'review__card';

      let iconHTML = '';
      if (rev.social === 'instagram') {
        iconHTML = '<i class="fab fa-instagram review__social-icon"></i>';
      } else if (rev.social === 'google') {
        iconHTML = '<i class="fab fa-google review__social-icon"></i>';
      }
      // Автор
      const authorEl = document.createElement('div');
      authorEl.className = 'review__author';
      authorEl.innerHTML = `${iconHTML}${rev.author}`;
      // Текст
      const textEl = document.createElement('div');
      textEl.className = 'review__text';
      textEl.textContent = `«${rev.text}»`;

      card.appendChild(authorEl);
      card.appendChild(textEl);
      reviewsContainer.appendChild(card);
    });
  }
  renderReviews();

  // -------------------- DEBOUNCE --------------------
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

})();
let isAnimating = false;
function showImage(newIndex) {
  if (isAnimating) return;
  isAnimating = true;

  // Определяем направление
  const direction = (newIndex > currentImageIndex) ? 'right' : 'left';

  // Уходящее изображение
  modalImage.classList.remove('slide-in');
  modalImage.classList.add(direction === 'right' ? 'slide-out-left' : 'slide-out-right');

  setTimeout(() => {
    // Меняем src
    currentImageIndex = newIndex;
    if (currentImageIndex < 0) currentImageIndex = currentImages.length - 1;
    if (currentImageIndex >= currentImages.length) currentImageIndex = 0;

    modalImage.src = currentImages[currentImageIndex];
    // Убираем классы slide-out, добавляем slide-in
    modalImage.classList.remove('slide-out-left', 'slide-out-right');
    modalImage.classList.add('slide-in');

    // Обновляем точки
    updateCarouselDots();
    
    setTimeout(() => {
      isAnimating = false;
    }, 300);
  }, 300);
}
// Ищем объявление переменных:
let startY = 0;
let isDragging = false;
let currentY = 0;

// Найдём код, где modalContent.addEventListener('touchstart'...) – замените на следующее:
modalContent.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    startY = e.touches[0].clientY;
    isDragging = true;
    // Отключим transition, чтобы окно могло «следовать» за пальцем
    modalContent.style.transition = 'none';
  }
});

// Затем заменяем touchmove:
modalContent.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  currentY = e.touches[0].clientY;
  const offset = Math.max(0, currentY - startY);
  // Учитывая что изначальное состояние – translateY(0), будем сдвигать вниз
  modalContent.style.transform = `translateY(${offset}px)`;
});

// А touchend – решаем, закрыть ли окно
modalContent.addEventListener('touchend', () => {
  if (!isDragging) return;
  isDragging = false;
  // Возвращаем transition
  modalContent.style.transition = 'transform 0.3s ease';
  // Читаем offset из transform
  const match = /translateY\((\d+)px\)/.exec(modalContent.style.transform);
  const dragged = match ? parseInt(match[1], 10) : 0;

  // Если пользователь «протащил» модалку на 100+ пикселей вниз, закрываем её
  if (dragged > 100) {
    closeDetailsModal(); // или любая нужная функция закрытия
  } else {
    // Возвращаемся к начальному положению
    modalContent.style.transform = 'translateY(0)';
  }
});
// Предположим, вы имеете
const quickBookingModal = document.getElementById('quickBookingModal');
const quickBookingClose = document.getElementById('quickBookingClose');
// ...

// Находим стрелку внутри модалки
const arrowLink = quickBookingModal.querySelector('.hero__scroll-down');
if (arrowLink) {
  arrowLink.addEventListener('click', e => {
    e.preventDefault(); // если хотим управлять скроллом вручную
    // Закрываем окно
    quickBookingClose.click();

    // Скроллим к #tours
    const toursEl = document.getElementById('tours');
    if (toursEl) {
      window.scrollTo({
        top: toursEl.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
}
quickBookingModal.addEventListener('click', (e)=>{
  if(e.target === quickBookingModal){
    quickBookingClose.click();
  }
});