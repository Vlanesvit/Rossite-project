//========================================================================================================================================================
/*
Документация: 
https://barba.js.org/
https://gsap.com/
https://gsap.com/docs/v3/Plugins/ScrollTrigger/
https://gsap.com/docs/v3/Plugins/ScrollToPlugin
*/

// Подключаем из node_modules
import barba from '@barba/core';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import { ScrollToPlugin } from "gsap/ScrollToPlugin.js";
// Импорт библиотек и функций
import { initSliders, destroySliders } from "../files/sliders.js";
import { initComparison, destroyComparison } from "../libs/imagecompare.js";
import { initNoUiField, destroyNoUiField } from "../libs/nouislider.js";
import { filterClear, filterProject, imitationProductLoad } from "../files/project.js";
import { sidebarNavigation } from "../files/steps.js";
import { openFullList } from "../files/tariff.js";
import * as vnvFunctions from "../files/functions.js";
import * as vnvForms from "../files/forms/forms.js";
import * as vnvScroll from "../files/scroll/scroll.js";
import { addCursorHover, addCursorMove } from "../libs/cursor.js";
import { Popup } from '../libs/popup.js';
// Создаем экземпляр класса
const popup = new Popup();
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

//========================================================================================================================================================
// Обработка изменений на странице динамически
const handleReveal = () => {
	requestAnimationFrame(() => {
		ScrollTrigger.refresh()
	});
};

// Экспортируем gsap, ScrollTrigger и barba
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
// Экспорт функций для использования в других модулях
export { handleReveal };

ScrollTrigger.defaults({
	refreshInterval: 60, // Уменьшает интервал обновления
});

const stagger = 0.5;

//========================================================================================================================================================
// Функиця переноса основого цвета страницы
function updatePrimaryColor() {
	const wrapperStyles = window.getComputedStyle(document.querySelector('.wrapper'));
	const primaryColor = wrapperStyles.getPropertyValue('--primary-color');
	document.body.style.setProperty('--primary-color', primaryColor);
}

// Функция для разбиения текста на слова
function splitTextIntoWords(text) {
	const containers = document.querySelectorAll(text);

	containers.forEach(container => {
		const textContent = container.textContent;
		container.textContent = '';

		// Для каждого слова создаем span с классом 'word'
		textContent.split(' ').forEach(word => {
			const span = document.createElement('span');
			span.classList.add('word');
			span.textContent = word;
			container.appendChild(span);

			// Добавляем пробел после каждого слова, кроме последнего
			container.appendChild(document.createTextNode(' '));
		});
	});
}

// Дебаунсинг функции
function debounce(func, wait) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}
// Обработка изменения размера окна и смены ориентации экрана с дебаунсом
const resizeHandler = debounce(initAnimationsBasedOnWidth, 300);

// Функция для удаления анимаций
function clearAnimations() {
	// Удаление всех активных ScrollTrigger
	ScrollTrigger.getAll().forEach(trigger => {
		trigger.kill();
	});

	// Удаление всех pin-spacer, созданных ScrollTrigger
	document.querySelectorAll('.pin-spacer, .gsap-pin-spacer').forEach(spacer => {
		spacer.replaceWith(...spacer.childNodes);
	});

	destroyReveal();
}

// Инициализация анимаций при загрузке страницы
function initPageAnimations() {
	initAnimationsBasedOnWidth();
}

// Инициализация анимаций для разных разрешений
let currentWidthAnimation = null;
function initAnimationsBasedOnWidth() {
	clearAnimations();

	// Инициализация общих анимаций
	initializeCommonAnimations();

	if (window.innerWidth >= 991.98) {
		// Если переключаемся с мобильной версии, очищаем мобильные анимации
		if (currentWidthAnimation === 'mobile') {
			clearAnimations();
		}
		initializeDesktopAnimations();
		currentWidthAnimation = 'desktop';
	} else {
		// Если переключаемся с десктопной версии, очищаем десктопные анимации
		if (currentWidthAnimation === 'desktop') {
			clearAnimations();
		}
		initializeMobileAnimations();
		currentWidthAnimation = 'mobile';
	}

	// Обновляем точки старта/окончания для всех ScrollTrigger
	ScrollTrigger.refresh();
}

// window.addEventListener('resize', resizeHandler);
// window.addEventListener('orientationchange', resizeHandler);

// Обработка при загрузке страницы
window.addEventListener('load', () => {
	updatePrimaryColor();
	videoPlay();
	marquee();
	initPageAnimations();
	manageScripts();

	// Проверяем, есть ли якорь в URL
	if (!window.location.hash) {
		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 100);
	} else if (window.location.hash) {
		const targetElement = document.querySelector(window.location.hash);
		if (targetElement) {
			window.scrollTo(0, 0);
			setTimeout(() => {
				targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
			}, 100);
		}
	}
});

document.addEventListener("scroll", () => {
	const sections = document.querySelectorAll("[data-change-bg-color]");
	if (sections.length > 0) {
		const viewportHeight = window.innerHeight;
		let activeColor = null;

		sections.forEach((section) => {
			const sectionTop = section.getBoundingClientRect().top;
			const sectionBottom = section.getBoundingClientRect().bottom;

			// Проверяем начало и конец секции
			if (sectionTop <= viewportHeight && sectionBottom >= viewportHeight) {
				activeColor = section.getAttribute("data-change-bg-color");
			}
		});

		// Устанавливаем фон или возвращаем его к исходному
		if (activeColor) {
			document.body.style.background = activeColor;
		} else {
			document.body.style.background = "";
		}
	}
});

document.addEventListener('loaderEnd', function () {
	// Запуск анимаций по конфигурации
	animationConfig.forEach(config => {
		revealOnScroll({
			elements: config.elements,
			duration: config.duration || 0.5,
			delay: config.delay || 0.15,
			direction: config.direction || 'bottom-up',
		});
	});

	strokeTextAnimation('.rs-cards__title h1')
	strokeTextAnimation('.rs-cards__title h2')
	strokeTextAnimation('.rs-cards__title h3')
});

//========================================================================================================================================================
// Анимация перемещения пунктирной линии SVG
function animateSvgDashedLine({ dashedSelector, maskSelector, topOffset = 50, endOffset = 500, markers = false }) {
	const dasheds = document.querySelectorAll(dashedSelector);

	dasheds.forEach(dashed => {
		const trigger = dashed.closest('section');
		const mask = dashed.closest('section [class*="__line"]').querySelector('.mask-path');

		if (dashed && mask && trigger) {
			gsap.from(mask, {
				scrollTrigger: {
					trigger: trigger,
					start: `top-=50% top`,
					end: `bottom+=50% bottom`,
					scrub: 1,
					markers: markers,
				},
			});

			gsap.from(dashed, {
				"--dashOffset": 1000,
				scrollTrigger: {
					trigger: trigger,
					start: `top-=${topOffset}% top`,
					end: `bottom+=${endOffset}% bottom`,
					scrub: 1,
					markers: markers,
				}
			});

			dashed.setAttribute("stroke-dashoffset", "var(--dashOffset)");
		}
	});
}

// Анимация появления контента при скролле
let observerInstance; // Хранение текущего экземпляра observer
const animationConfig = [
	// Text
	{ elements: '.mrp-med-65', direction: 'bottom-up' },
	{ elements: '.mrp-med-50', direction: 'bottom-up' },
	{ elements: '.mrp-med-45', direction: 'bottom-up' },
	{ elements: '.mrp-med-40', direction: 'bottom-up' },
	{ elements: '.mrp-med-25', direction: 'bottom-up' },
	{ elements: '.mrp-med-21', direction: 'bottom-up' },
	{ elements: '.mrp-med-18', direction: 'bottom-up' },
	{ elements: '.mrp-reg-25', direction: 'bottom-up' },
	{ elements: '.mrp-reg-21', direction: 'bottom-up' },
	{ elements: '.mrp-reg-18', direction: 'bottom-up' },
	{ elements: 'blockquote', direction: 'bottom-up' },
	// Header
	{ elements: '.rs-header__menu', direction: 'fade' },
	{ elements: '.rs-header__logo', direction: 'fade' },
	{ elements: '.rs-header__actions', delay: 0.45, direction: 'fade' },
	// Banner
	{ elements: '.rs-banner__buttons', direction: 'bottom-up--every' },
	{ elements: '.rs-banner__body ul', direction: 'bottom-up' },
	{ elements: '.rs-banner__bg', delay: 0.15, direction: 'width-100' },
	// Slider Block
	{ elements: '.rs-slider-block__slider', direction: 'right-left' },
	{ elements: '.rs-slider-block__icon', delay: 0.15, direction: 'bottom-up--every' },
	// Project
	{ elements: '.rs-project__slider', duration: 0.3, delay: 0.15, direction: 'bottom-up' },
	{ elements: '.rs-project__filter', delay: 1, direction: 'fade' },
	// Steps
	{ elements: '.rs-steps__navigation_list li a', delay: 0.15, direction: 'left-right--every' },
	{ elements: '.rs-steps__item', direction: 'bottom-up--every' },
	{ elements: '.rs-steps__footer ul li', direction: 'bottom-up' },
	// Calc
	{ elements: '.rs-calc__bg', delay: 0.2 },
	{ elements: '.rs-calc__settings_wrapper', direction: 'bottom-up' },
	{ elements: '.rs-calc__cost_img', delay: 0.2, direction: 'right-left' },
	{ elements: '.rs-calc__cost_list ul li', delay: 0.15, direction: 'bottom-up--every' },
	{ elements: '.rs-calc__cost_footer', direction: 'bottom-up--every' },
	// Reviews
	{ elements: '.rs-reviews__bg', delay: 0.2 },
	{ elements: '.rs-reviews__block', delay: 0.2, direction: 'bottom-up--every' },
	{ elements: '.rs-reviews__sticker', delay: 0.2, direction: 'right-left' },
	// Services
	{ elements: '.rs-services__slider', delay: 0.2, direction: 'right-left' },
	{ elements: '.rs-services__icon', delay: 0.15, direction: 'bottom-up--every' },
	// Footer
	{ elements: '.rs-footer .rs-breadcrumbs', delay: 0.2 },
	{ elements: '.rs-footer__phone', delay: 0.2 },
	{ elements: '.rs-footer__links ul li', delay: 0.15, direction: 'bottom-up--every' },
	{ elements: '.rs-footer__social', direction: 'bottom-up' },
	{ elements: '.rs-footer__spollers_item', delay: 0.15, direction: 'bottom-up--every' },
	{ elements: '.rs-footer__city', direction: 'bottom-up' },
	{ elements: '.rs-footer__copyright', delay: 0.4, direction: 'left-right' },
	// Text Block
	{ elements: '.rs-text-block .rs-text-block__picture .rs-text-block__img-0 img', direction: 'scale' },
	{ elements: '.rs-text-block .rs-text-block__picture .rs-text-block__img-1 img', delay: 0.6, direction: 'scale' },
	{ elements: '.rs-text-block .rs-text-block__picture .rs-text-block__img-2 img', delay: 0.9, direction: 'scale' },
	{ elements: '.rs-text-block .rs-text-block__picture .rs-text-block__img-3 img', delay: 1.2, direction: 'scale' },
	{ elements: '.rs-text-block .rs-text-block__picture .rs-text-block__icons img', direction: 'scale--every' },
	{ elements: '.rs-text-block__description ol', duration: 0.15, direction: 'bottom-up' },
	{ elements: '.rs-text-block__description ul', duration: 0.15, direction: 'bottom-up' },
	// Workflow
	{ elements: '.rs-workflow .rs-workflow__img img', direction: 'scale--every' },
	{ elements: '.rs-workflow .rs-workflow__icon', direction: 'scale--every' },
	// Tariff
	{ elements: '.rs-tariff__desktop', duration: 1, direction: 'fade' },
	{ elements: '.rs-tariff__mobile .rs-tariff__spollers', duration: 1, direction: 'fade' },
	// Features
	{ elements: '.rs-features__icon', direction: 'scale--every' },
	{ elements: '.rs-features__img', direction: 'left-right' },
	{ elements: '.rs-features-list__icon', direction: 'scale--every' },
	{ elements: '.rs-features-list__img', direction: 'left-right' },
	// Partners
	{ elements: '.section-bg .section__bg', duration: 1, direction: 'width-100' },
	{ elements: '.section-bg .section__container', duration: 1, delay: 1, direction: 'fade' },
	// Services About
	// { elements: '.rs-about-block__img', direction: 'bottom-up' },
	// { elements: '.rs-about-block__desc', direction: 'bottom-up' },
	// Services Price
	{ elements: '.rs-services-price__item', direction: 'bottom-up' },
	// Feedback
	{ elements: '.rs-feedback', direction: 'bottom-up' },
	// Contact
	{ elements: '.rs-document__spollers_item', delay: 0.2, direction: 'bottom-up--every' },
	{ elements: '.rs-contact__info', delay: 0.2, direction: 'bottom-up' },
	{ elements: '.rs-contact__map', direction: 'fade' },
	// Services About
	{ elements: '.rs-services-about__text', direction: 'bottom-up--every' },
	{ elements: '.rs-services-about__table', direction: 'bottom-up' },
	{ elements: '.rs-services-about__hint', delay: 1 },
	{ elements: '.rs-services-about__item', direction: 'bottom-up--every' },
	// Task
	{ elements: '.rs-task__item', direction: 'bottom-up--every' },
	// Parallax
	{ elements: '.rs-why-block__bg', duration: 1, direction: 'width-100' },
	// Main
	{ elements: '.rs-main__title_video', duration: 1, direction: 'width-100' },
	{ elements: '.rs-main__title h1', delay: 1, direction: 'scale' },
	// Logo
	{ elements: '.rs-logo__slider', delay: 0.2, direction: 'right-left--every' },
	// 404
	{ elements: '.rs-error-block', duration: 0.8, direction: 'bottom-up' },
	// Text
	{ elements: '.rs-text__left', direction: 'bottom-up' },
	{ elements: '.rs-text__right', delay: 0.3, direction: 'bottom-up' },
	// Result
	{ elements: '.rs-result__img', direction: 'fade--every' },
	// Case-slider
	{ elements: '.rs-case-slider__slide', direction: 'bottom-up--every' },
	// Other-project
	{ elements: '.rs-other-project__slider', direction: 'right-left' },
	// About-case
	{ elements: '.rs-about-case .rs-text__bg', direction: 'fade--repeat', delay: 0.5 },
	{ elements: '.rs-about-case .rs-case-slider__bg', direction: 'fade--repeat', delay: 0.5 },
];
function revealOnScroll({ elements, duration = 0.5, delay = 0.15, direction = 'bottom-up' }) {
	const items = document.querySelectorAll(elements);

	// Карта анимаций
	const animationPropsMap = {
		'bottom-up': { from: { opacity: 0, transform: 'translateY(50px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
		'up-bottom': { from: { opacity: 0, transform: 'translateY(-50px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
		'left-right': { from: { opacity: 0, transform: 'translateX(-50px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
		'right-left': { from: { opacity: 0, transform: 'translateX(50px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
		'fade': { from: { opacity: 0 }, to: { opacity: 1 } },
		'scale': { from: { transform: 'scale(0)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } },
		'width-100': { from: { width: '0%' }, to: { width: '100%' } },
	};

	// Настройки наблюдателя
	const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
	const repeat = direction.includes('--repeat');
	const every = direction.includes('--every');
	const animationType = direction.replace('--repeat', '').replace('--every', '').trim();

	// Проверка существования типа анимации
	if (!animationPropsMap[animationType]) {
		console.error(`Unknown animation type: ${animationType}`);
		return;
	}

	// Инициализация элементов
	items.forEach(item => {
		const { from } = animationPropsMap[animationType];
		Object.assign(item.style, from); // Скрыть элемент изначально
		item.setAttribute('data-animation', 'false');
	});

	// Запуск наблюдателя
	setTimeout(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry, index) => {
				const item = entry.target;
				const isVisible = entry.isIntersecting;
				const animationProps = animationPropsMap[animationType];

				// Сброс при выходе
				if (!isVisible && repeat) {
					item.setAttribute('data-animation', 'false');
					Object.assign(item.style, animationProps.from);
					return;
				}

				// Воспроизведение анимации
				if (isVisible && item.getAttribute('data-animation') === 'false') {
					item.setAttribute('data-animation', 'true');
					const animationDelay = every ? delay * index : delay;

					gsap.fromTo(item, animationProps.from, {
						...animationProps.to,
						duration,
						delay: animationDelay,
						clearProps: "opacity, transform",
					});
				}

				// Остановка наблюдения, если повтор выключен
				if (!repeat && isVisible) {
					observer.unobserve(item);
				}
			});
		}, observerOptions);

		// Наблюдение за элементами
		items.forEach(item => observer.observe(item));
		return observer;
	}, 700);
}


function destroyReveal() {
	// Удаляем предыдущий observer, если он существует
	if (observerInstance) {
		observerInstance.disconnect();
	}
}

// Анимация горизонтального скролла
let refreshScrollTrigger = null; // Объявляем переменную вне функции, чтобы получить к ней доступ позже
function horizontalScroll({ blockSelector, triggerSelector, progressSelector }) {
	gsap.matchMedia().add("(min-width: 991.98px)", () => {
		const block = document.querySelector(blockSelector);
		const trigger = document.querySelector(triggerSelector);
		const progress = document.querySelector(progressSelector);
		let scrollTriggerInstance;

		if (block && trigger) {
			const createScrollTrigger = () => {
				if (scrollTriggerInstance) {
					scrollTriggerInstance.kill(); // Убиваем предыдущий инстанс
				}

				scrollTriggerInstance = ScrollTrigger.create({
					trigger: trigger,
					start: "center center",
					end: () => `+=${trigger.clientHeight + window.innerHeight}`,
					scrub: 1,
					pin: true,
					invalidateOnRefresh: true,
					// anticipatePin: 1,
					// markers: true,
					onUpdate: (self) => {
						gsap.to(block, {
							x: () => -(self.progress * (block.scrollWidth - block.clientWidth)) + "px",
							duration: 0.1,
							ease: "power2.out"
						});

						if (progress) {
							const progressValue = (self.progress * 100).toFixed(2) + "%";
							gsap.to(progress, {
								width: progressValue,
								duration: 0.1,
								ease: "power2.out"
							});
						}
					}
				});
			};

			// Создаем ScrollTrigger при вызове horizontalScroll
			createScrollTrigger();

			// Определяем refreshScrollTrigger
			const refreshScrollTrigger = () => {
				createScrollTrigger(); // Повторно создаем ScrollTrigger для горизонтального скролла
				ScrollTrigger.refresh(); // Обновляем все ScrollTrigger
			};

			const nextButton = trigger.querySelector('.swiper-button-next');
			const prevButton = trigger.querySelector('.swiper-button-prev');
			let nextButtonClickHandler = null;
			let prevButtonClickHandler = null;

			if (nextButton) {
				nextButtonClickHandler = () => {
					let scrollAmount = 300 / document.documentElement.clientHeight;
					let newScrollPosition = scrollTriggerInstance.progress + scrollAmount;
					scrollTriggerInstance.scroll(scrollTriggerInstance.start + (newScrollPosition * (scrollTriggerInstance.end - scrollTriggerInstance.start)));
				};
				nextButton.addEventListener('click', nextButtonClickHandler);
			}

			if (prevButton) {
				prevButtonClickHandler = () => {
					let scrollAmount = 300 / document.documentElement.clientHeight;
					let newScrollPosition = scrollTriggerInstance.progress - scrollAmount;
					scrollTriggerInstance.scroll(scrollTriggerInstance.start + (newScrollPosition * (scrollTriggerInstance.end - scrollTriggerInstance.start)));
				};
				prevButton.addEventListener('click', prevButtonClickHandler);
			}
		}
	});
}

// Бегущая строка
function marquee() {
	// Проверка ширины экрана перед запуском
	if (window.innerWidth <= 991.98) return;

	const marquees = document.querySelectorAll('.marquee');

	marquees.forEach(marquee => {
		const list = marquee.querySelector('ul');
		const items = Array.from(list.querySelectorAll('li'));
		const speed = 1; // Скорость прокрутки бегущей строки
		let scrollAmount = 0; // Переменная для отслеживания текущего смещения

		// Вычисляем общую ширину всех элементов для создания бесшовного эффекта
		const totalWidth = items.reduce((acc, item) => acc + item.offsetWidth, 0);
		const resetOffset = totalWidth + 215; // Добавляем смещение для плавного сброса

		// Дублируем элементы один раз для создания бесшовного эффекта, добавляя их в конец списка
		list.style.width = `${totalWidth * 2}px`;
		items.forEach(item => {
			const clone = item.cloneNode(true);
			list.appendChild(clone);
		});

		function scrollMarquee() {
			// Останавливаем анимацию при изменении ширины окна
			if (window.innerWidth <= 991.98) return;

			// Определяем направление и обновляем смещение
			if (marquee.dataset.direction === "left") {
				scrollAmount -= speed;
			} else if (marquee.dataset.direction === "right") {
				scrollAmount += speed;
			}

			// Применяем трансформацию для плавной прокрутки
			list.style.transform = `translateX(${scrollAmount}px)`;

			// Сбрасываем прокрутку, добавляя смещение 215px для плавного эффекта
			if (Math.abs(scrollAmount) >= resetOffset) {
				scrollAmount = 0; // Смещение после сброса, чтобы избежать резкого скачка
			}

			requestAnimationFrame(scrollMarquee); // Рекурсивный вызов для плавной анимации
		}

		scrollMarquee();
	});
}

// Воспроизведение видео при загрузке страницы
function videoPlay() {
	const videoElements = document.querySelectorAll('video');
	if (videoElements.length > 0) {

		videoElements.forEach(videoElement => {
			videoElement.play().catch(function (error) {
				console.error("Автоматическое воспроизведение видео не удалось: ", error);
				// Можно обработать ошибку, например, показать сообщение пользователю
			});
		});
	}
}

// Функция для анимации параллакса изображения
function parallaxImage(imageSelector) {
	gsap.utils.toArray(imageSelector).forEach(image => {
		if (image) {
			gsap.fromTo(image,
				{ y: '0%' },
				{
					y: '-20%',
					ease: 'none',
					scrollTrigger: {
						trigger: image,
						start: 'top bottom',
						end: 'bottom bottom',
						scrub: 3,
						// markers: true,   
					}
				}
			);
		}
	});
}

// Функция для разделения текста на строки и анимации
function strokeTextAnimation(elem) {
	const text = document.querySelector(elem);

	// Проверка на существование элемента перед манипуляциями
	if (text) {
		const lines = text.innerHTML.split("<br>").map(line => line.trim());

		text.innerHTML = lines.map(line =>
			`<div style="overflow: hidden;">
		  <div class="line" style="opacity: 0; transform: translateY(50px);">${line}</div>
		</div>`
		).join("");

		// Настройка GSAP анимации с использованием ScrollTrigger
		gsap.utils.toArray('.line').forEach((line, index) => {
			gsap.fromTo(line, {
				opacity: 0,
				y: 50
			}, {
				opacity: 1,
				y: 0,
				delay: 0.5 + (index * 0.1),
				duration: 0.9,
				ease: "power2.out",
				scrollTrigger: {
					trigger: line,
					start: "top 80%", // Начало анимации когда элемент станет видимым на 80%
					end: "top 30%",   // Конец анимации, когда элемент прокручен на 30%
					toggleActions: "play none none none" // Устанавливаем действия при попадании в область
				}
			});
		});
	}
}

//========================================================================================================================================================
// Общие анимации
function initializeCommonAnimations() {
	animateSvgDashedLine({ dashedSelector: "section [class*='__line'] .dashed-path" });
	parallaxImage('.rs-parallax .section__bg img');

	if (document.querySelector('.rs-cards__item')) {
		const cards = gsap.utils.toArray(".rs-cards__item");
		// Начальная установка плашек
		cards.forEach((card, i) => {
			gsap.set(card, {
				rotate: -90,  // Все плашки изначально повернуты
				y: 800,       // Уходят вниз
				zIndex: cards.length - i // Устанавливаем порядок наложения
			});
		});

		// Таймлайн анимации
		const stackTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: ".rs-cards",
				start: "top top",
				end: "bottom+=100%",
				pin: true,
				pinSpacing: true,
				scrub: 1,
				invalidateOnRefresh: true,
				// markers: true,
			},
		});

		// Анимация каждой плашки
		cards.forEach((card, i) => {
			// Плашка появляется на месте с `rotate: 0`
			stackTimeline.to(card, {
				y: 0,
				rotate: 0,
				duration: 1.5,
				ease: "power2.out",
				onStart: () => {
					gsap.set(card, { zIndex: cards.length }); // Поднимаем текущую плашку поверх остальных
				},
			}, i * 1.5); // Отступ между появлением плашек

			// Каждая предыдущая плашка поворачивается на нужный угол
			if (i > 0) {
				stackTimeline.to(cards.slice(0, i), {
					rotate: (j) => 5 * (cards.length - 1 - j), // Углы: 10, 5, 0 или 15, 10, 5, 0
					duration: 1,
					ease: "power1.out",
				}, i * 1.5);
			}
		});
	}

	if (document.querySelector('.rs-text-1 .rs-text__right h2')) {
		splitTextIntoWords('.rs-text .rs-text__right h2');
		const words = document.querySelectorAll('.rs-text .rs-text__right h2 .word');
		gsap.fromTo(words,
			{ opacity: 0.2 }, // Начальная прозрачность
			{
				opacity: 1, // Конечная непрозрачность
				stagger: 0.15,
				scrollTrigger: {
					trigger: '.rs-text',
					start: 'top 80%',
					end: 'bottom 20%',
					scrub: 1,
					anticipatePin: 1
					// markers: 1,
				}
			}
		);
	}

	if (document.querySelector('.rs-cards__bg-2')) {
		const timeline = gsap.timeline({
			scrollTrigger: {
				trigger: ".rs-text-1",
				start: "top bottom",
				end: "bottom+=500% top",
				scrub: 3,
				// markers: true, 
				pin: false,
			},
		});

		// Первая часть: движение в правую нижнюю часть
		timeline.to(".rs-cards__bg-2", {
			transform: "translate(70vw, 100vh)",
			ease: "power1.out",
		});

		// Вторая часть: движение в левую нижнюю часть и дальше вниз
		timeline.to(".rs-cards__bg-2", {
			transform: "translate(0vw, 300vh)",
			ease: "power1.out",
			duration: 5,
		});
	}

	if (document.querySelector('.rs-text__right ul li')) {
		// Получаем все блоки rs-text, которые содержат список rs-text__right ul li
		const blocks = gsap.utils.toArray('.rs-text-2');

		// Проходим по каждому найденному блоку
		blocks.forEach((block) => {
			const listItems = gsap.utils.toArray(block.querySelectorAll('.rs-text__right ul li'));

			// Устанавливаем начальное состояние для элементов списка
			listItems.forEach((item, i) => {
				gsap.set(item, {
					opacity: 0,
					x: '100%', // Начальная позиция: за пределами экрана справа
				});
			});

			// Таймлайн анимации с ScrollTrigger
			const listTimeline = gsap.timeline({
				scrollTrigger: {
					trigger: block, // Триггер для текущего блока
					start: 'top 80%', // Начало анимации при достижении 80% от верха блока
					end: 'bottom 20%', // Конец анимации при достижении 20% от низа блока
					toggleActions: 'play reverse play reverse', // Повторение анимации при прокрутке вперед и назад
					scrub: 1, // Синхронизация анимации с прокруткой
					invalidateOnRefresh: true, // Обновление при изменении размера экрана
					refreshPriority: -1,
				},
			});

			// Анимация каждого элемента списка
			listItems.forEach((item, i) => {
				listTimeline.to(item, {
					opacity: 1,    // Делаем элемент видимым
					x: '0%',       // Перемещаем его на исходную позицию
					duration: 1,    // Продолжительность анимации
					ease: 'power2.out', // Тип анимации
				}, i * 0.3); // Задержка между анимациями элементов
			});
		});
	}

	if (document.querySelector('.rs-case-comparison')) {
		const comparisonBlocks = document.querySelectorAll('.rs-case-comparison');

		comparisonBlocks.forEach(block => {
			const imageBefore = block.querySelector('.section__bg .rs-case-comparison__img--before');
			const imageAfter = block.querySelector('.section__bg .rs-case-comparison__img--after');
			const cutLine = block.querySelector('.section__bg .rs-cut-line');
			const imageBg = block.querySelector('.section__bg .rs-case-comparison__img--bg');

			if (!imageBefore || !imageAfter) {
				console.warn('Не найдены необходимые элементы внутри', block);
				return;
			}

			gsap.timeline({
				scrollTrigger: {
					trigger: block,
					scrub: 1,
					start: 'center center',
					end: '+=500px',
					pin: true,
					markers: false,
					refreshPriority: -2,
				},
			})
				.fromTo(
					imageBefore,
					{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, -20% 100%)' },
					{
						clipPath: 'polygon(120% 0, 100% 0, 100% 100%, 100% 100%)',
						duration: 2,
						ease: 'power2.inOut',
					}
				)
				.fromTo(
					cutLine,
					{ clipPath: 'polygon(0px 0px, 0.5% 0px, -19.5% 100%, -20% 100%)' },
					{
						clipPath: 'polygon(119.5% 0px, 120% 0px, 100% 100%, 99.5% 100%)',
						duration: 2,
						ease: 'power2.inOut',
					},
					'<'
				)
				.to(
					imageBg,
					{
						opacity: 0.8,
						duration: 2,
						ease: 'power2.inOut',
					},
					'<'
				);
		});
	}

}

// Десктопные анимаций
function initializeDesktopAnimations() {
	//========================================================================================================================================================
	// Анимация горизонтального скролла
	horizontalScroll({
		blockSelector: '.rs-slider-block-pins .rs-slider-block__swiper',
		triggerSelector: '.rs-slider-block-pins',
		progressSelector: '.rs-slider-block-pins .rs-slider-block__pagination .swiper-pagination-progressbar-fill',
	});

	if (document.querySelector('.rs-services-slider')) {
		const block = document.querySelector('.rs-services-slider .rs-services-slider__wrapper');
		const main = document.querySelector('.rs-services-slider .rs-services-slider__block')
		const trigger = document.querySelector('.rs-services-slider');

		// Установка начального состояния для анимации "выезда"
		gsap.set(main, {
			x: '100%',
		});

		// Анимация "выезда" блока справа налево
		const entryTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: trigger,
				start: "top center", // Начало анимации
				end: "bottom center", // Конец анимации
				scrub: 1,
				toggleActions: "play reverse play reverse",
				invalidateOnRefresh: true, // Пересчёт при изменении экрана
			},
		});

		entryTimeline.to(main, {
			x: '0%',
			duration: 1.5, // Увеличение времени для плавности
			ease: 'power1.inOut', // Более мягкая кривая
		});

		// Горизонтальный скролл с фиксацией
		const scrollTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: trigger,
				start: "center center", // Запуск горизонтального скролла
				end: () => `+=${block.scrollWidth - block.clientWidth}`, // Динамическое вычисление
				pin: true,
				scrub: 0.5, // Уменьшение задержки для плавности
				invalidateOnRefresh: true,
				// markers: true, // Включите для отладки
			},
		});

		scrollTimeline.to(block, {
			x: () => `-${block.scrollWidth - block.clientWidth}px`,
			duration: 1,
			ease: "power1.inOut", // Плавный переход
		});
	}

	if (document.querySelector('.rs-parallax__column')) {
		const parallaxContainers = document.querySelectorAll('.rs-parallax');

		parallaxContainers.forEach(container => {
			const columns = container.querySelectorAll('.rs-parallax__column');

			columns.forEach((column, index) => {
				const isEven = (index + 1) % 2 === 0;
				const animationFrom = isEven ? { y: '-500px' } : { y: '500px' };
				const animationTo = isEven ? { y: '500px' } : { y: '-500px' };

				gsap.timeline({
					scrollTrigger: {
						trigger: container,
						scrub: 10,
						start: "top-=200% top",
						end: "bottom+=200% bottom",
						invalidateOnRefresh: true,
						refreshPriority: -2,
					}
				}).fromTo(column, animationFrom, {
					...animationTo,
					ease: "power2.out",
					duration: 3
				});
			});
		});
	}


	if (document.querySelector(".rs-case-slider")) {
		gsap.utils.toArray('.rs-case-slider').forEach(slider => {
			const slides = gsap.utils.toArray('.rs-case-slider__slide', slider);

			slides.forEach(slide => {
				gsap.fromTo(
					slide,
					{
						y: 200, // Начальное смещение, чтобы мокапы начинали ниже
						opacity: 0, // Скрытые мокапы
					},
					{
						y: 0, // Центральное положение
						opacity: 1, // Полная видимость
						duration: 1, // Плавное, но быстрое появление
						ease: "power3.out", // Легкость анимации
						scrollTrigger: {
							trigger: slide, // Триггер на текущем слайде
							start: "top bottom ", // Триггер срабатывает, когда центр слайда на 70% высоты экрана
							end: "bottom bottom", // Анимация завершается, когда слайд выходит из центральной области
							scrub: true, // Плавное сопоставление скролла и анимации
						}
					}
				);
			});
		});
	}

	//========================================================================================================================================================
	// Закрепление блоков и последующее складывание в стопку
	if (document.querySelector('.rs-features__slide')) {
		gsap.matchMedia().add("(min-width: 991.98px)", () => {
			const stackItems = gsap.utils.toArray('.rs-features__slide');

			gsap.set(stackItems, {
				yPercent: (index) => 0,
				scale: (index) => 1,
			});

			const stackTimeline = gsap.timeline({
				scrollTrigger: {
					trigger: '.rs-features__wrapper',
					start: 'top top',
					// end: () => `+=${(stackItems.length - 1) * 100}vh`,
					end: "bottom+=50% top",
					// endTrigger: '.rs-features',
					pin: true,
					pinSpacing: true,
					scrub: 1,
					// anticipatePin: 1,
					invalidateOnRefresh: true,
					// markers: true,
				}
			});

			stackTimeline
				.to(stackItems, {
					yPercent: (index) => -100 * index,
					duration: 1,
					ease: "power2.inOut",
					stagger: stagger,
				})
				.to(stackItems, {
					scale: (index) => 1 - (stackItems.length - index) * 0.025,
					duration: 1,
					ease: "power2.inOut",
					stagger: stagger,
				}, stagger);

			handleReveal()

		});
	}

	if (document.querySelector('.rs-our-project__item')) {
		gsap.matchMedia().add("(min-width: 991.98px)", () => {
			const stackItems = gsap.utils.toArray('.rs-our-project__item');

			// Начальные настройки для всех блоков, кроме первого
			gsap.set(stackItems, {
				yPercent: (index) => index === 0 ? 0 : 105, // Первый блок уже на месте
				scale: 1,
				opacity: 1,
			});

			const stackTimeline = gsap.timeline({
				scrollTrigger: {
					trigger: '.rs-our-project',
					start: 'top top',
					end: `bottom+=${stackItems.length * 80}% top`, // Более короткий диапазон
					pin: true,
					pinSpacing: true,
					scrub: 1, // Более плавное и быстрое сканирование
					invalidateOnRefresh: true,
				}
			});

			// Анимация для каждой карточки
			stackTimeline
				.to(stackItems, {
					yPercent: (index) => 0,
					ease: "power1.out",
					direction: 0.3,
					stagger: stagger,
				})
				.to(stackItems.slice(0, -1), {
					scale: (index) => 1 - (stackItems.length - index) * 0.025,
					opacity: 0,
					ease: "power1.out",
					direction: 0.3,
					stagger: stagger,
				}, stagger);
		});
	}

	//========================================================================================================================================================
	// Замена фон.цвета при скролле
	if (document.querySelector(".rs-steps .rs-steps__spollers_item")) {
		gsap.matchMedia().add("(min-width: 991.98px)", () => {
			const sections = document.querySelectorAll(".rs-steps .rs-steps__spollers_item");
			sections.forEach((section) => {
				ScrollTrigger.create({
					trigger: section,
					start: "top center",
					end: "bottom center",
					invalidateOnRefresh: true,
					onEnter: () => section.classList.add("_active-step"),
					onLeave: () => section.classList.remove("_active-step"),
					onEnterBack: () => section.classList.add("_active-step"),
					onLeaveBack: () => section.classList.remove("_active-step"),
				});
			});

			// Параллакс-эффект при скролле внутри блоков
			const parallaxItems = [
				{
					selector: '.rs-steps__column-top',
					animation: { from: { y: '200px' }, to: { y: '-200px' } }
				},
				{
					selector: '.rs-steps__column-middle',
					animation: { from: { x: '300px', y: '-100px' }, to: { x: '-100px', y: '100px' } }
				},
				{
					selector: '.rs-steps__column-bottom',
					animation: { from: { y: '-200px' }, to: { y: '200px' } }
				}
			];

			parallaxItems.forEach(item => {
				if (document.querySelector(item.selector)) {
					const parallaxTimeline = gsap.timeline({
						scrollTrigger: {
							trigger: ".rs-steps",
							scrub: 1,
							start: "top-=30% top",
							end: "bottom+=30% bottom",
							// anticipatePin: 1,
							invalidateOnRefresh: true,
							// markers: true,
						}
					});

					if (item.animation.from && item.animation.to) {
						parallaxTimeline.fromTo(item.selector, item.animation.from, item.animation.to);
					} else {
						parallaxTimeline.from(item.selector, item.animation);
					}
				}
			});
		});
	}

	//========================================================================================================================================================
	// Закрепление блоков с текстом при скролле
	if (document.querySelector('.rs-steps-algorithm .rs-steps__text')) {
		gsap.matchMedia().add("(min-width: 991.98px)", () => {
			gsap.to('.rs-steps-algorithm .rs-steps__text', {
				scrollTrigger: {
					trigger: '.rs-steps-algorithm .rs-steps__text',
					start: 'top top+=100px',
					end: 'bottom bottom',
					endTrigger: '.rs-steps-algorithm',
					pin: true,
					pinSpacing: false,
					scrub: 1,
					// anticipatePin: 1,
					invalidateOnRefresh: true,
					// markers: true,
				},
			});

			// Получение всех карточек для алгоритма
			const cardsSteps = gsap.utils.toArray('.rs-steps-algorithm .rs-steps__spollers_item');
			cardsSteps.forEach((card, index) => {
				// Настройка анимации для каждой карточки
				gsap.to(card, {
					scrollTrigger: {
						trigger: card,
						start: `top-=${index * 20} top+=100px`,
						end: 'bottom+=50px bottom-=50%',
						endTrigger: '.rs-steps-algorithm',
						pin: true,
						pinSpacing: false,
						scrub: 1,
						// anticipatePin: 1,
						invalidateOnRefresh: true,
						// markers: true,
					},
					ease: 'none',
					// scale: () => 1 - (cardsSteps.length - index) * 0.025 // Возможное масштабирование элементов
				});
			});
		});
	}

	//========================================================================================================================================================
	if (document.querySelectorAll('.rs-tariff__top')) {
		gsap.matchMedia().add("(min-width: 991.98px)", () => {
			const tariffs = document.querySelectorAll('.rs-tariff');
			tariffs.forEach(tariff => {
				const tariffTops = tariff.querySelectorAll('.rs-tariff__top');
				tariffTops.forEach(tariffTop => {
					gsap.to('.rs-tariff__top', {
						scrollTrigger: {
							trigger: tariffTop,
							start: 'top top',
							end: 'bottom bottom',
							endTrigger: tariff,
							pin: true,
							pinSpacing: false,
							scrub: 1,
							// anticipatePin: 1,
							invalidateOnRefresh: true,
							// markers: 1,
						},
					});
					handleReveal()
				});
			});
		});
	}

	//========================================================================================================================================================
	// Закрепление заголовка с анимацией при скролле
	if (document.querySelector('.rs-main__title_body')) {
		gsap.matchMedia().add("(min-width: 991.98px)", () => {
			// Создаем таймлайн для анимации масштаба и прозрачности
			const titleTimeline = gsap.timeline({
				scrollTrigger: {
					trigger: '.rs-main__title',
					start: "top top",
					end: "bottom+=200px top",
					scrub: 1,
					pin: true,
					pinSpacing: false,
					// anticipatePin: 1,
					invalidateOnRefresh: true,
					refreshPriority: 1,
					// markers: true,
				}
			});

			// Добавляем анимацию масштаба и прозрачности к заголовку h1
			titleTimeline.fromTo('.rs-main__title_body',
				{ scale: 1, opacity: 1 },  // Начальное состояние
				{ scale: 0.5, opacity: 0, duration: 1, ease: "power1.out" }  // Конечное состояние
			);
		});
	}

	//========================================================================================================================================================
	// Закрепление проектов и установка якорных ссылок на каждый проект
	if (document.querySelector('.rs-main__project_item')) {
		gsap.matchMedia().add("(min-width: 991.98px)", () => {
			const projectItems = gsap.utils.toArray('.rs-main__project_item');

			gsap.set(projectItems, {
				y: (index) => 0 * index,
				zIndex: (index, target, targets) => targets.length - index,
			})

			gsap.set(projectItems.slice(1), {
				scale: (index) => 0.9,
			})

			const pinBlock = gsap.timeline({
				defaults: { ease: "none" },
				scrollTrigger: {
					trigger: ".rs-main__project",
					start: "top top",
					end: `bottom+=${projectItems.length * 100}% top`,
					scrub: 1,
					pin: true,
					// markers: 1,
					id: 'pin-block',
					// anticipatePin: 1,
					refreshPriority: -1,
					invalidateOnRefresh: true,
				}
			});

			pinBlock.to(projectItems, {
				scale: 1,
				y: 0,
				webkitFilter: "blur(" + 0 + "px)",
				stagger: stagger,
			})

			pinBlock.to(projectItems.slice(0, -1), {
				yPercent: -125,
				stagger: stagger,
			}, stagger)

			ScrollTrigger.refresh(); // Refresh ScrollTrigger settings
			const start = pinBlock.scrollTrigger.start;
			const end = pinBlock.scrollTrigger.end;
			const totalScroll = end - start;
			let links = gsap.utils.toArray(".rs-main__project_nav ul li a");
			const scrollSteps = totalScroll / links.length;
			let previousActive = null; // Храним предыдущий активный якорь

			links.forEach((a, index) => {
				let element = document.querySelector(a.getAttribute("href"))

				ScrollTrigger.create({
					trigger: element,
					start: `${(scrollSteps * (index + 1))} center`,
					end: `${(scrollSteps * (index + 1)) + (element.clientHeight)} center`,
					// markers: 1,
					onEnter: () => setActive(a),
					onEnterBack: () => setActive(a),
					onLeave: () => setActive(a),
					onLeaveBack: () => setActive(a)
				});

				a.addEventListener("click", (e) => {
					e.preventDefault();

					gsap.to(window, {
						duration: 0.1,
						// onStart: () => setActive(a),
						scrollTo: () => scrollSteps * (index + 1) + start,
						overwrite: "auto"
					});
				});
			});

			function setActive(link) {
				links.forEach((el) => el.classList.remove("_active"));
				link.classList.add("_active");

				const navBody = document.querySelector('.rs-main__project_nav_body');
				const linkRect = link.getBoundingClientRect();
				const navBodyRect = navBody.getBoundingClientRect();
				const scrollTop = navBody.scrollTop;

				// Определяем, насколько элемент выходит за границы видимой области (если выходит)
				if (linkRect.bottom > navBodyRect.bottom) {
					// Если выходит за нижнюю границу, прокручиваем вниз
					gsap.to(navBody, {
						scrollTop: scrollTop + (linkRect.bottom - navBodyRect.bottom),
						duration: 0.3,
						ease: "power2.out"
					});
				} else if (linkRect.top < navBodyRect.top) {
					// Если выходит за верхнюю границу, прокручиваем вверх
					gsap.to(navBody, {
						scrollTop: scrollTop - (navBodyRect.top - linkRect.top),
						duration: 0.3,
						ease: "power2.out"
					});
				}
			}
		})
	}
}

// Мобильные анимаций
function initializeMobileAnimations() {
	if (document.querySelector('.rs-main__project-all')) {
		// Создаем таймлайн для анимации прозрачности и перемещения
		gsap.matchMedia().add("(max-width: 991.98px)", () => {
			const titleTimeline = gsap.timeline({
				scrollTrigger: {
					trigger: '.rs-main__project',
					start: "top top",
					end: "bottom bottom",
					pinSpacing: false,
					// anticipatePin: 1,
					invalidateOnRefresh: true,
					refreshPriority: 1,
					// markers: true,
					onEnter: () => {
						gsap.set('.rs-main__project-all', { opacity: 1, y: 0 });
					},
					onLeave: () => {
						titleTimeline.to('.rs-main__project-all', {
							opacity: 0,
							y: 100,
						});
					},
					onEnterBack: () => {
						gsap.set('.rs-main__project-all', { opacity: 1, y: 0 });
					},
					onLeaveBack: () => {
						titleTimeline.to('.rs-main__project-all', {
							opacity: 0,
							y: 100,
						});
					}
				}
			});
		});
	}
}

//========================================================================================================================================================
function initBarba() {
	const initializePage = () => {
		vnvFunctions.menuClose();
		// Закрываем все открытые попапы перед переходом
		popup.closeAllPopups();

		// Инициализация функционала
		videoPlay();
		initSliders();
		initComparison('image-compare');
		initNoUiField('styles-page', 'styles-page-count');
		initNoUiField('fill-page', 'fill-page-count');

		vnvFunctions.spollers();
		vnvFunctions.tabs();
		vnvFunctions.menuInit();
		vnvFunctions.menu();
		vnvFunctions.regionMenu();
		vnvFunctions.showMore();

		// vnvForms.formFieldsInit();
		// vnvForms.formSubmit();
		vnvForms.formQuantity();
		vnvForms.formRating();

		vnvScroll.pageNavigation();
		vnvScroll.headerScroll();

		filterClear();
		filterProject();
		imitationProductLoad();
		sidebarNavigation();
		openFullList();

		addCursorHover(".rs-project__slide", ".rs-project .cursor", "cursor__active");
		addCursorMove(".rs-project__slide", ".rs-project .cursor__circle");
		addCursorHover(".rs-comparison__compare", ".rs-comparison .icv__circle", "cursor__active");
		addCursorMove(".rs-comparison__compare", ".icv__circle");
		addCursorHover(".rs-other-project__slide", ".rs-other-project .cursor", "cursor__active");
		addCursorMove(".rs-other-project__slide", ".rs-other-project .cursor__circle")

		// Подключение скриптов
		manageScripts();
	};

	// Уничтожение предыдущей инициализации (если необходимо)
	const destroyPage = () => {
		destroySliders();
		destroyComparison();
		destroyNoUiField();
		// Здесь можно добавить вызовы для уничтожения других компонентов, если это необходимо
	};

	barba.init({
		transitions: [{
			async leave({ current }) {
				showLoader();
				hideLoaderCalled = false;
				resourcesToLoad = 0;
				resourcesLoaded = 0;
				percentageDisplay.textContent = "0%";
				await new Promise(resolve => setTimeout(resolve, 500));

				return gsap.to(current.container, {
					opacity: 0,
					duration: 0.5,
					onComplete: function () {
						destroyPage();
						clearAnimations();
					}
				});
			},

			async after({ next }) {
				await gsap.from(next.container, {
					delay: 0.5,
					opacity: 0,
					onComplete: function () {
						hideLoaderCalled = false;
						window.scrollTo(0, 0);
						loadResources();
						initHeaderHeight();
						updatePrimaryColor();
						initializePage();
						videoPlay();
						marquee();
						initPageAnimations();
						resourcesToLoad = 0;
						resourcesLoaded = 0;
						percentageDisplay.textContent = "0%";

						if (!window.location.hash) {
							setTimeout(() => window.scrollTo(0, 0), 100);
						} else {
							const targetElement = document.querySelector(window.location.hash);
							if (targetElement) {
								setTimeout(() => targetElement.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
							}
						}
					},
				});
			}
		}]
	});

	// Hooks для корректного управления состоянием
	barba.hooks.afterLeave(() => {
		ScrollTrigger.getAll().forEach(trigger => trigger.kill());
	});

	barba.hooks.enter(() => {
		window.scrollTo(0, 0);
	});
}
initBarba();

// Предотвращение перезагрузки страницы при клике на ту же ссылку
document.addEventListener('click', function (event) {
	const link = event.target.closest('a');
	if (link) {
		// Проверяем, что ссылка ведет на текущий URL
		if (link.href === window.location.href) {
			event.preventDefault(); // Блокируем действие перехода
			return false; // Прекращаем выполнение
		}
	}
});

// Функция управления загрузкой скриптов
const themeData = {
	themeUri: "https://rosait.ru/wp-content/themes/rosait/"
};
function manageScripts() {
	const projectElements = document.querySelectorAll('.rs-project:not(.rs-case)');
	const caseElements = document.querySelectorAll('.rs-project.rs-case');

	if (!themeData) {
		console.error("Объект themeData не определён.");
		return;
	}

	if (projectElements.length > 0) {
		loadScriptIfNotLoaded(`${themeData.themeUri}/js/filter.js`, 'rs-filter')
			.then(() => loadScriptIfNotLoaded(`${themeData.themeUri}/js/filter-case.js`, 'rs-filter-case'))
			.then(() => {
				if (typeof window.filter_projects === "function") {
					window.filter_projects();
				} else {
					console.error("Функция filter_projects не загружена.");
				}
			})
			.catch(error => console.error(error));
	} else {
		removeScript('rs-filter-page');
	}

	if (caseElements.length > 0) {
		loadScriptIfNotLoaded(`${themeData.themeUri}/js/filter.js`, 'rs-filter')
			.then(() => loadScriptIfNotLoaded(`${themeData.themeUri}/js/project-filter.js`, 'rs-filter-page'))
			.then(() => {
				if (typeof window.filter_case === "function") {
					window.filter_case();
				} else {
					console.error("Функция filter_case не загружена.");
				}
			})
			.catch(error => console.error(error));
	} else {
		removeScript('rs-filter-case');
	}
}

// Функция для загрузки скрипта с поддержкой обратного вызова и обработкой ошибок
function loadScriptIfNotLoaded(src, id) {
	return new Promise((resolve, reject) => {
		if (!document.getElementById(id)) {
			const script = document.createElement('script');
			script.src = src;
			script.id = id;

			script.onload = () => {
				resolve();
			};

			script.onerror = () => {
				console.error(`Ошибка загрузки скрипта: ${src}`);
				reject(new Error(`Ошибка загрузки скрипта: ${src}`));
			};

			document.body.appendChild(script);
		} else {
			resolve();
		}
	});
}

// Вспомогательная функция для удаления загруженного скрипта
function removeScript(id) {
	const script = document.getElementById(id);
	if (script) {
		script.remove();
	}
}