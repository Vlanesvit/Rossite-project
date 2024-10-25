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
// Лоадер
const loader = document.querySelector('.mg-loader');
const loaderFillv1 = loader.querySelector('.mg-loader-fill.-v1');
const loaderFillv2 = loader.querySelector('.mg-loader-fill.-v2');
const loaderAnim = (element, yPercent, delay) => {
	gsap.to(element, {
		yPercent,
		delay,
		duration: 0.6,
		ease: 'cubic-bezier(0.9, 0, 0.2, 1)',
	});
};

// Обработка изменений на странице динамически
const handleResize = () => {
	requestAnimationFrame(() => {
		ScrollTrigger.refresh(); // Обновление всех триггеров при изменении размера окна
	});
};

const handleReveal = () => {
	if (typeof refreshScrollTrigger === 'function') {
		refreshScrollTrigger();
	}

	initAnimationsBasedOnWidth();
	clearAnimations();
};
// Экспорт функций для использования в других модулях
export { handleReveal };

const matchMedia = gsap.matchMedia();
// let currentWidthAnimation = null;
const stagger = 0.5;

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
function revealOnScroll({ elements, duration = 0.5, delay = 0.15, direction = 'bottom-up' }) {
	const items = gsap.utils.toArray(elements);

	// Функция для определения начальных значений и конечной анимации в зависимости от направления
	const getAnimationProps = (direction, index) => {
		const baseProps = {
			autoAlpha: 0,
			duration,
			delay: direction.includes('--every') ? delay * (index + 1) : delay,
		};

		switch (direction.replace('--every', '')) {
			case 'bottom-up':
				return { ...baseProps, from: { autoAlpha: 0, y: 50 }, to: { autoAlpha: 1, y: 0 } };
			case 'up-bottom':
				return { ...baseProps, from: { autoAlpha: 0, y: -50 }, to: { autoAlpha: 1, y: 0 } };
			case 'left-right':
				return { ...baseProps, from: { autoAlpha: 0, x: -50 }, to: { autoAlpha: 1, x: 0 } };
			case 'right-left':
				return { ...baseProps, from: { autoAlpha: 0, x: 50 }, to: { autoAlpha: 1, x: 0 } };
			case 'fade':
				return { ...baseProps, from: { autoAlpha: 0 }, to: { autoAlpha: 1 } };
			case 'scale':
				return { ...baseProps, from: { scale: 0, autoAlpha: 0 }, to: { scale: 1, autoAlpha: 1 } };
			case 'width-100':
				return { from: { width: '0%' }, to: { width: '100%', ease: 'cubic-bezier(0.4, 0, 0.2, 1)' } };
			default:
				return {};
		}
	};

	items.forEach((item, index) => {
		// Проверяем, есть ли у элемента класс 'animated', чтобы избежать повторной анимации
		if (!item.classList.contains('animated')) {
			const { from, to, duration, delay } = getAnimationProps(direction, index);

			// Создание анимации
			const anim = gsap.fromTo(item, from, { ...to, duration, delay });

			ScrollTrigger.create({
				trigger: item,
				animation: anim,
				once: true, // Анимация выполняется только один раз
				onEnter: () => item.classList.add('animated') // Добавляем класс 'animated' при анимации
			});
		}
	});
}

// Анимация горизонтального скролла
let refreshScrollTrigger = null; // Объявляем переменную вне функции, чтобы получить к ней доступ позже
function horizontalScroll({ blockSelector, triggerSelector, progressSelector }) {
	matchMedia.add("(min-width: 991.98px)", () => {
		const block = document.querySelector(blockSelector);
		const trigger = document.querySelector(triggerSelector);
		const progress = document.querySelector(progressSelector);
		let scrollTriggerInstance;

		if (block && trigger && progress) {
			const createScrollTrigger = () => {
				if (scrollTriggerInstance) {
					scrollTriggerInstance.kill(); // Убиваем предыдущий инстанс
				}

				scrollTriggerInstance = ScrollTrigger.create({
					trigger: trigger,
					start: "top-=10% top",
					end: () => `+=${trigger.clientHeight + window.innerHeight}`,
					scrub: true,
					pin: true,
					invalidateOnRefresh: true,
					anticipatePin: 1,
					onUpdate: (self) => {
						gsap.to(block, {
							x: () => -(self.progress * (block.scrollWidth - block.clientWidth)) + "px",
							duration: 0.1,
							ease: "power1.inOut",
						});

						const progressValue = (self.progress * 100).toFixed(2) + "%";
						gsap.to(progress, {
							width: progressValue,
							duration: 0.1,
							ease: "power1.inOut",
						});
					},
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
	const marquees = document.querySelectorAll('.marquee');

	if (marquees.length > 0) {
		marquees.forEach(marquee => {
			const list = marquee.querySelector('ul');
			const items = list.querySelectorAll('ul li');

			let scrollAmount = 0; // Переменная для отслеживания текущего смещения
			const speed = 1; // Скорость прокрутки бегущей строки

			// Клонируем элементы для создания бесшовного эффекта
			for (let i = 0; i < 5; i++) {
				items.forEach(item => {
					const clone = item.cloneNode(true);
					list.appendChild(clone);
				});
			}

			function scrollMarquee() {
				switch (true) {
					case marquee.dataset.direction === "left":
						scrollAmount -= speed;

						const firstItem = list.firstElementChild;
						const firstItemWidth = firstItem.getBoundingClientRect().width;

						list.style.transform = `translateX(${scrollAmount}px)`;

						if (firstItem.getBoundingClientRect().right <= 0) {
							list.append(firstItem); // Перемещаем первый элемент в конец списка

							// Пересчитываем смещение, чтобы сделать переход плавным
							scrollAmount += firstItemWidth + parseFloat(getComputedStyle(firstItem).marginLeft);
							list.style.transform = `translateX(${scrollAmount}px)`;
						}
						break;

					case marquee.dataset.direction === "right":
						scrollAmount += speed;

						const lastItem = list.lastElementChild;
						const lastItemWidth = lastItem.getBoundingClientRect().width;

						list.style.transform = `translateX(${scrollAmount}px)`;

						if (lastItem.getBoundingClientRect().left >= window.innerWidth) {
							list.prepend(lastItem); // Перемещаем последний элемент в начало списка

							// Пересчитываем смещение, чтобы сделать переход плавным
							scrollAmount -= lastItemWidth + parseFloat(getComputedStyle(lastItem).marginRight);
							list.style.transform = `translateX(${scrollAmount}px)`;
						}
						break;

					default:
				}

				requestAnimationFrame(scrollMarquee); // Рекурсивно вызываем функцию для плавной анимации
			}

			scrollMarquee();
		});
	}
}

//========================================================================================================================================================
// Функция переноса основого цвета страницы
function updatePrimaryColor() {
	const wrapperStyles = window.getComputedStyle(document.querySelector('.wrapper'));
	const primaryColor = wrapperStyles.getPropertyValue('--primary-color');
	document.body.style.setProperty('--primary-color', primaryColor);
}

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

	// console.log("Все анимации и pin-spacer удалены");
}

// Инициализация анимаций для разных разрешений
function initAnimationsBasedOnWidth() {
	// Инициализация декстопных анимаций
	initializeDesktopAnimations();
	// Инициализация мобильных анимаций
	initializeMobileAnimations();
	// Инициализация общих анимаций
	initializeCommonAnimations();

	// Обновляем точки старта/окончания для всех ScrollTrigger
	ScrollTrigger.refresh();
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

//========================================================================================================================================================
// Общие анимации
function initializeCommonAnimations() {
	// console.log("Инициализация общих анимаций");

	//========================================================================================================================================================
	// Закрепление блоков и последующее складывание в стопку
	if (document.querySelector('.rs-features__slide')) {
		setTimeout(() => {
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
					scrub: true,
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

			handleResize()
		}, 100);
	}

	//========================================================================================================================================================
	// Закрепление заголовка с анимацией при скролле
	if (document.querySelector('.rs-main__title h1')) {
		// Создаем таймлайн для анимации масштаба и прозрачности
		const titleTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.rs-main__title',
				start: "top top",
				end: "bottom+=200px top",
				scrub: true,
				pin: '.rs-main__title',
				pinSpacing: false,
				invalidateOnRefresh: true,
				refreshPriority: 1,
				// markers: true,
			}
		});

		// Добавляем анимацию масштаба и прозрачности к заголовку h1
		titleTimeline.fromTo('.rs-main__title h1',
			{ scale: 1, opacity: 1 },  // Начальное состояние
			{ scale: 0.5, opacity: 0, duration: 1, ease: "power1.out" }  // Конечное состояние
		);
	}

	animateSvgDashedLine({ dashedSelector: "section [class*='__line'] .dashed-path" });

	// Text
	revealOnScroll({ elements: '.mrp-med-65', });
	revealOnScroll({ elements: '.mrp-med-50', });
	revealOnScroll({ elements: '.mrp-med-45', });
	revealOnScroll({ elements: '.mrp-med-40', });
	revealOnScroll({ elements: '.mrp-med-25', });
	revealOnScroll({ elements: '.mrp-med-21', });
	revealOnScroll({ elements: '.mrp-med-18', });
	revealOnScroll({ elements: '.mrp-reg-25', });
	revealOnScroll({ elements: '.mrp-reg-21', });
	revealOnScroll({ elements: '.mrp-reg-18', });
	revealOnScroll({ elements: 'blockquote', });
	// Header
	revealOnScroll({ elements: '.rs-header__menu', direction: 'fade', });
	revealOnScroll({ elements: '.rs-header__logo', direction: 'fade', });
	revealOnScroll({ elements: '.rs-header__actions', delay: 0.45, direction: 'fade', });
	// Banner
	revealOnScroll({ elements: '.rs-banner__buttons', direction: 'bottom-up--every' });
	revealOnScroll({ elements: '.rs-banner__body ul', });
	revealOnScroll({ elements: '.rs-banner__bg', delay: 0.15, direction: 'width-100' });
	// Slider Block
	// revealOnScroll({ elements: '.rs-slider-block__slide', direction: 'right-left--every' });
	revealOnScroll({ elements: '.rs-slider-block__slider', direction: 'right-left' });
	revealOnScroll({ elements: '.rs-slider-block__icon', delay: 0.15, direction: 'bottom-up--every' });
	// Project
	// revealOnScroll({ elements: '.rs-project__item', duration: 0.3, delay: 0.15, direction: 'bottom-up--every', });
	// revealOnScroll({ elements: '.rs-project__filter', delay: 1, direction: 'fade' });
	// revealOnScroll({ elements: '.rs-project__add', direction: 'bottom-up--every' });
	// Steps
	revealOnScroll({ elements: '.rs-steps__navigation_list li a', delay: 0.15, direction: 'left-right--every' });
	revealOnScroll({ elements: '.rs-steps__item', direction: 'bottom-up--every' });
	revealOnScroll({ elements: '.rs-steps__footer ul li', });
	// Calc
	revealOnScroll({ elements: '.rs-calc__bg', delay: 0.2, });
	revealOnScroll({ elements: '.rs-calc__settings_wrapper', });
	revealOnScroll({ elements: '.rs-calc__cost_img', delay: 0.2, direction: 'right-left' });
	revealOnScroll({ elements: '.rs-calc__cost_list ul li', delay: 0.15, direction: 'bottom-up--every' });
	revealOnScroll({ elements: '.rs-calc__cost_footer', direction: 'bottom-up--every' });
	// Reviews
	revealOnScroll({ elements: '.rs-reviews__bg', delay: 0.2, });
	revealOnScroll({ elements: '.rs-reviews__slide', delay: 0.2, direction: 'bottom-up--every' });
	revealOnScroll({ elements: '.rs-reviews__sticker', delay: 0.2, direction: 'right-left' });
	// Services
	revealOnScroll({ elements: '.rs-services__slide', delay: 0.2, direction: 'right-left--every' });
	revealOnScroll({ elements: '.rs-services__icon', delay: 0.15, direction: 'bottom-up--every' });
	// Footer
	revealOnScroll({ elements: '.rs-footer .rs-breadcrumbs', delay: 0.2, });
	revealOnScroll({ elements: '.rs-footer__phone', delay: 0.2, });
	revealOnScroll({ elements: '.rs-footer__links ul li', delay: 0.15, direction: 'bottom-up--every' });
	revealOnScroll({ elements: '.rs-footer__social', });
	revealOnScroll({ elements: '.rs-footer__spollers_item', delay: 0.15, direction: 'bottom-up--every' });
	revealOnScroll({ elements: '.rs-footer__city', });
	revealOnScroll({ elements: '.rs-footer__copyright', delay: 0.4, direction: 'left-right' });
	// Text Block
	revealOnScroll({ elements: '.rs-text-block .rs-text-block__picture .rs-text-block__img-0 img', direction: 'scale' });
	revealOnScroll({ elements: '.rs-text-block .rs-text-block__picture .rs-text-block__img-1 img', delay: 0.6, direction: 'scale' });
	revealOnScroll({ elements: '.rs-text-block .rs-text-block__picture .rs-text-block__img-2 img', delay: 0.9, direction: 'scale' });
	revealOnScroll({ elements: '.rs-text-block .rs-text-block__picture .rs-text-block__img-3 img', delay: 1.2, direction: 'scale' });
	revealOnScroll({ elements: '.rs-text-block .rs-text-block__picture .rs-text-block__icons img', direction: 'scale--every' });
	revealOnScroll({ elements: '.rs-text-block__description ol li', duration: 0.15, direction: 'bottom-up--every' });
	revealOnScroll({ elements: '.rs-text-block__description ul li', duration: 0.15, direction: 'bottom-up--every' });
	// Workflow
	revealOnScroll({ elements: '.rs-workflow .rs-workflow__img img', direction: 'scale--every' });
	revealOnScroll({ elements: '.rs-workflow .rs-workflow__icon', direction: 'scale--every' });
	// Tariff
	revealOnScroll({ elements: '.rs-tariff__desktop', duration: 1, direction: 'fade' });
	revealOnScroll({ elements: '.rs-tariff__mobile .rs-tariff__spollers', duration: 1, direction: 'fade' });
	// Features
	revealOnScroll({ elements: '.rs-features__icon', direction: 'scale--every' });
	revealOnScroll({ elements: '.rs-features__img', direction: 'left-right' });
	revealOnScroll({ elements: '.rs-features-list__icon', direction: 'scale--every' });
	revealOnScroll({ elements: '.rs-features-list__img', direction: 'left-right' });
	// Partners
	revealOnScroll({ elements: '.section-bg .section__bg', duration: 1, direction: 'width-100' });
	revealOnScroll({ elements: '.section-bg .section__container', duration: 1, delay: 1, direction: 'fade' });
	// Services About
	revealOnScroll({ elements: '.rs-about-block__img', });
	revealOnScroll({ elements: '.rs-about-block__desc', });
	// Services Price
	revealOnScroll({ elements: '.rs-services-price__item', });
	// Feedback
	revealOnScroll({ elements: '.rs-feedback', });
	// Contact
	revealOnScroll({ elements: '.rs-document__spollers_item', delay: 0.2, direction: 'bottom-up--every' });
	revealOnScroll({ elements: '.rs-contact__info', delay: 0.2, direction: 'bottom-up' });
	revealOnScroll({ elements: '.rs-contact__map', direction: 'fade' });
	// Services About
	revealOnScroll({ elements: '.rs-services-about__text', direction: 'bottom-up--every' });
	revealOnScroll({ elements: '.rs-services-about__table', });
	revealOnScroll({ elements: '.rs-services-about__hint', delay: 1, });
	revealOnScroll({ elements: '.rs-services-about__item', direction: 'bottom-up--every' });
	// Task
	revealOnScroll({ elements: '.rs-task__item', direction: 'bottom-up--every' });
	// Parallax
	revealOnScroll({ elements: '.rs-why-block__bg', duration: 1, direction: 'width-100' });
	// Main
	revealOnScroll({ elements: '.rs-main__title_video', duration: 1, direction: 'width-100' });
	revealOnScroll({ elements: '.rs-main__title h1', delay: 1, direction: 'scale' });
	// Logo
	revealOnScroll({ elements: '.rs-logo__slide', delay: 0.2, direction: 'right-left--every' });
	// 404
	revealOnScroll({ elements: '.rs-error-block', duration: 0.8, });
}

// Десктопные анимаций
function initializeDesktopAnimations() {
	// console.log("Инициализация десктопных анимаций");

	marquee();

	//========================================================================================================================================================
	// Анимация горизонтального скролла
	horizontalScroll({
		blockSelector: '.rs-slider-block-pins .rs-slider-block__swiper',
		triggerSelector: '.rs-slider-block-pins',
		progressSelector: '.rs-slider-block-pins .rs-slider-block__pagination .swiper-pagination-progressbar-fill',
	});

	//========================================================================================================================================================
	// Замена фон.цвета при скролле
	if (document.querySelector(".rs-steps .rs-steps__spollers_item")) {
		const sections = document.querySelectorAll(".rs-steps .rs-steps__spollers_item");
		sections.forEach((section) => {
			ScrollTrigger.create({
				trigger: section,
				start: "top center",
				end: "bottom center",
				invalidateOnRefresh: true,
				onEnter: () => section.classList.add("_active-step"),
				onLeave: () => section.classList.remove("_active-step"),
			});
		});
	}

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
			matchMedia.add("(min-width: 991.98px)", () => {
				const parallaxTimeline = gsap.timeline({
					scrollTrigger: {
						trigger: ".rs-steps",
						scrub: 1,
						start: "top-=30% top",
						end: "bottom+=30% bottom",
						invalidateOnRefresh: true,
						// markers: true,
					}
				});

				// Выбор метода анимации в зависимости от наличия 'from' и 'to' параметров
				if (item.animation.from && item.animation.to) {
					parallaxTimeline.fromTo(item.selector, item.animation.from, item.animation.to);
				} else {
					parallaxTimeline.from(item.selector, item.animation);
				}
			});
		}
	});

	//========================================================================================================================================================
	// Закрепление блоков с текстом при скролле
	if (document.querySelector('.rs-steps-algorithm .rs-steps__text')) {
		matchMedia.add("(min-width: 991.98px)", () => {
			gsap.to('.rs-steps-algorithm .rs-steps__text', {
				scrollTrigger: {
					trigger: '.rs-steps-algorithm .rs-steps__text',
					start: 'top top+=100px',
					end: 'bottom bottom',
					endTrigger: '.rs-steps-algorithm',
					pin: true,
					pinSpacing: false,
					scrub: true,
					invalidateOnRefresh: true,
					// markers: true,
				},
			});
		});

		// Получение всех карточек для алгоритма
		const cardsSteps = gsap.utils.toArray('.rs-steps-algorithm .rs-steps__spollers_item');
		cardsSteps.forEach((card, index) => {
			// Настройка анимации для каждой карточки
			matchMedia.add("(min-width: 991.98px)", () => {
				gsap.to(card, {
					scrollTrigger: {
						trigger: card,
						start: `top-=${index * 20} top+=100px`,
						end: 'bottom+=50px bottom-=50%',
						endTrigger: '.rs-steps-algorithm',
						pin: true,
						pinSpacing: false,
						scrub: true,
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
		setTimeout(() => {
			const tariffs = document.querySelectorAll('.rs-tariff');
			tariffs.forEach(tariff => {
				const tariffTops = tariff.querySelectorAll('.rs-tariff__top');
				tariffTops.forEach(tariffTop => {
					matchMedia.add("(min-width: 991.98px)", () => {
						gsap.to('.rs-tariff__top', {
							scrollTrigger: {
								trigger: tariffTop,
								start: 'top top',
								end: 'bottom bottom',
								endTrigger: tariff,
								pin: true,
								pinSpacing: false,
								scrub: true,
								invalidateOnRefresh: true,
								// markers: 1,
							},
						});
						handleResize()
					});
				});
			});
		}, 200);
	}

	//========================================================================================================================================================
	// Закрепление проектов и установка якорных ссылок на каждый проект
	if (document.querySelector('.rs-main__project_item')) {
		matchMedia.add("(min-width: 991.98px)", () => {
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
					scrub: true,
					pin: true,
					// markers: 1,
					id: 'pin-block',
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
	// console.log("Инициализация мобильных анимаций");

}

//========================================================================================================================================================
function initBarba() {
	const initializePage = () => {
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
		addCursorMove(".rs-project__slide", ".cursor__circle");
		addCursorHover(".rs-comparison__compare", ".rs-comparison .icv__circle", "cursor__active");
		addCursorMove(".rs-comparison__compare", ".icv__circle");
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
			leave({ current }) {
				bodyLock();
				loaderAnim(loaderFillv1, 0, 0.2);
				loaderAnim(loaderFillv2, 0, 0.4);
				destroyPage();  // Уничтожаем предыдущую инициализацию

				setTimeout(() => {
					window.scrollTo(0, 0);
				}, 400);

				return gsap.to(current.container, {
					delay: 0.5,
				});
			},

			after({ next }) {
				setTimeout(() => {
					window.scrollTo(0, 0);
				}, 100);

				return gsap.from(next.container, {
					delay: 0.5,
					onComplete: function () {
						clearAnimations();
						updatePrimaryColor();
						initAnimationsBasedOnWidth();
						initializePage();  // Инициализируем функционал после показа страницы
						bodyUnlock();
						loaderAnim(loaderFillv1, 100, 0.4);
						loaderAnim(loaderFillv2, 100, 0.2);

						ScrollTrigger.refresh();
					},
				});
			},
		}]
	});

	// Hooks для корректного управления состоянием
	barba.hooks.afterLeave(() => {
		ScrollTrigger.getAll().forEach(trigger => trigger.kill());
	});

	barba.hooks.enter(() => {
		window.scrollTo(0, 0);
	});

	barba.hooks.afterEnter(() => {
		// Никаких дополнительных инициализаций здесь не нужно
	});
}
initBarba();

//========================================================================================================================================================
// Обработка изменения размера окна с дебаунсом
window.addEventListener('resize', () => {
	clearAnimations();
	initAnimationsBasedOnWidth();
});

// Обработка смены ориентации экрана
window.addEventListener('orientationchange', () => {
	clearAnimations();
	initAnimationsBasedOnWidth();
});

// Обработка при загрузке страницы
window.addEventListener('load', () => {
	updatePrimaryColor();
	initAnimationsBasedOnWidth();
	videoPlay()
	handleResize();

	// Проверяем, есть ли якорь в URL
	if (!window.location.hash) {
		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 300);
	} else if (window.location.hash) {
		const targetElement = document.querySelector(window.location.hash);
		if (targetElement) {
			window.scrollTo(0, 0);
			setTimeout(() => {
				targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
			}, 300);
		}
	}

	loaderAnim(loaderFillv1, 100, 0.4);
	loaderAnim(loaderFillv2, 100, 0.2);
});
