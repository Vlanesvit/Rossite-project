
/*
Документация: 
https://gsap.com/
https://gsap.com/docs/v3/Plugins/ScrollTrigger/
https://gsap.com/docs/v3/Plugins/ScrollToPlugin
*/
// Подключаем из node_modules
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger.js";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin.js";

gsap.registerPlugin(
	ScrollTrigger,
	ScrollToPlugin,
	// drawSVGPlugin,
);
// console.clear();

window.addEventListener('load', function () {
	setTimeout(() => {
		ScrollTrigger.refresh(true);
		breakpointGsapAnimChecker();
		window.scrollTo(0, 0);
	}, 300);
})

//========================================================================================================================================================
/* MOVE SVG LINE */
function moveSvgDashed(dashed, mask, trigger, top = 50, end = 500, markers = 0) {
	if (document.querySelector(dashed) && document.querySelector(mask) && document.querySelector(trigger)) {
		gsap.from(mask, {
			drawSVG: "0%",
			scrollTrigger: {
				trigger: trigger,
				start: `top-=50% top`,
				end: `bottom+=50% bottom`,
				scrub: 1,
				// markers: 1,
			},
		});

		gsap.from(dashed, {
			"--dashOffset": 1000,
			delay: 5,
			scrollTrigger: {
				trigger: trigger,
				start: `top-=${top}% top`,
				end: `bottom+=${end}% bottom`,
				scrub: 1,
				// markers: 1,
			}
		});
		ScrollTrigger.refresh()
		document.querySelector(dashed).setAttribute("stroke-dashoffset", "var(--dashOffset)");
	}
}

/* REVEAL ANIMATION */
function showContentOnScroll(elem, duration, delay, direction) {
	if (document.querySelectorAll(elem)) {
		const elems = gsap.utils.toArray(elem);
		elems.forEach((item, i) => {
			let anim;

			switch (true) {
				case direction === 'bottom-up':
					anim = gsap.fromTo(item, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, x: 0, delay: delay, duration: duration });
					break;
				case direction === 'right-left':
					anim = gsap.fromTo(item, { autoAlpha: 0, x: 50 }, { autoAlpha: 1, y: 0, x: 0, delay: delay, duration: duration });
					break;
				case direction === 'up-bottom':
					anim = gsap.fromTo(item, { autoAlpha: 0, y: -50 }, { autoAlpha: 1, y: 0, x: 0, delay: delay, duration: duration });
					break;
				case direction === 'left-right':
					anim = gsap.fromTo(item, { autoAlpha: 0, x: -50 }, { autoAlpha: 1, y: 0, x: 0, delay: delay, duration: duration });
					break;
				case direction === 'fade':
					anim = gsap.fromTo(item, { autoAlpha: 0 }, { autoAlpha: 1, delay: delay, duration: duration });
					break;
				case direction === 'scale':
					anim = gsap.fromTo(item, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, delay: delay, duration: duration });
					break;
				case direction === 'bottom-up--every':
					anim = gsap.fromTo(item, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, x: 0, delay: delay * (i + 1), duration: duration });
					break;
				case direction === 'right-left--every':
					anim = gsap.fromTo(item, { autoAlpha: 0, x: 50 }, { autoAlpha: 1, y: 0, x: 0, delay: delay * (i + 1), duration: duration });
					break;
				case direction === 'up-bottom--every':
					anim = gsap.fromTo(item, { autoAlpha: 0, y: -50 }, { autoAlpha: 1, y: 0, x: 0, delay: delay * (i + 1), duration: duration });
					break;
				case direction === 'left-right--every':
					anim = gsap.fromTo(item, { autoAlpha: 0, x: -50 }, { autoAlpha: 1, y: 0, x: 0, delay: delay * (i + 1), duration: duration });
					break;
				case direction === 'fade--every':
					anim = gsap.fromTo(item, { autoAlpha: 0 }, { autoAlpha: 1, delay: delay * (i + 1), duration: duration });
					break;
				case direction === 'scale--every':
					anim = gsap.fromTo(item, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, delay: delay * (i + 1), duration: duration });
					break;
				case direction === 'width-100':
					anim = gsap.fromTo(item, { width: 0 + '%' }, { width: 100 + '%', delay: delay, duration: duration, ease: 'cubic-1', });
					break;

				default:
					break;
			}

			ScrollTrigger.create({
				trigger: item,
				animation: anim,
				once: true,
				// scrub: true,
				// markers: 1,

				onEnter: () => function () { },
				onLeave: () => function () { },
				onEnterBack: () => function () { },
				onLeaveBack: () => function () { },
			});
		});
	}
}

/* HORIZONTAL SCROLL */
function horizontalScroll(block, trigger, progress) {
	if (document.querySelector(block) && document.querySelector(trigger) && document.querySelector(progress)) {
		let container = document.querySelector(block);
		let containerTrigger = document.querySelector(trigger);

		gsap.to(container, {
			x: () => -(container.scrollWidth - container.clientWidth) + "px",
			ease: "linear",
			scrollTrigger: {
				trigger: trigger,
				start: "top-=12% top",
				end: "bottom+=200% bottom",
				scrub: true,
				pin: true,
				invalidateOnRefresh: true,
				anticipatePin: 1,
				onUpdate: self => {
				},
			}
		});
		ScrollTrigger.refresh();
		gsap.to(progress, {
			width: 100 + '%',
			duration: 2,
			ease: 'linear',
			scrollTrigger: {
				trigger: trigger,
				start: "top-=12% top",
				end: "bottom+=200% bottom",
				scrub: true,
				invalidateOnRefresh: true,
				anticipatePin: 1,
			}
		});

		// При нажатии на кнопки идет скролл вверх или вниз на 300px
		const arrowNext = containerTrigger.querySelector('.swiper-button-next');
		const arrowPrev = containerTrigger.querySelector('.swiper-button-prev');
		let scrollChange = 300

		if (arrowPrev) {
			arrowNext.addEventListener('click', function (e) {
				e.preventDefault();
				window.scrollBy(0, scrollChange);
			})
		}

		if (arrowPrev) {
			arrowPrev.addEventListener('click', function (e) {
				e.preventDefault();
				window.scrollBy(0, -scrollChange);
			})
		}
	}
}

//========================================================================================================================================================
function animDesktop() {
	/* HORIZONTAL SCROLL */
	horizontalScroll('.rs-slider-block-pins .rs-slider-block__swiper', '.rs-slider-block-pins', '.rs-slider-block-pins .rs-slider-block__pagination .swiper-pagination-progressbar-fill')

	/* BG-COLOR CHANGER */
	const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
	if (scrollColorElems) {
		scrollColorElems.forEach((colorSection, i) => {
			const prevBg = i === 0 ? "" : scrollColorElems[i - 1].dataset.bgcolor;

			ScrollTrigger.create({
				trigger: colorSection,
				start: "top+=50% top",
				// markers: true,
				endTrigger: ".rs-steps",

				onEnter: () =>
					gsap.to("body", {
						backgroundColor: colorSection.dataset.bgcolor,
					}),
				onLeaveBack: () =>
					gsap.to("body", {
						backgroundColor: prevBg,
					}),
				onLeave: () =>
					gsap.to("body", {
						backgroundColor: "#fff",
					})
			});
		});
	}

	/* PARALLAX IMG - STEPS */
	if (document.querySelector('.rs-steps__column-top')) {
		const parallaxImgTop = gsap.timeline({
			scrollTrigger: {
				trigger: ".rs-steps",
				scrub: 1,
				start: "-50% top",
				end: "bottom+=50% bottom",
				// pin: 1,
				// markers: 1
			}
		});
		parallaxImgTop.from('.rs-steps__column-top', {
			y: '-500px',
		})
	}

	if (document.querySelector('.rs-steps__column-middle')) {
		const parallaxImgSlide = gsap.timeline({
			scrollTrigger: {
				trigger: ".rs-steps",
				scrub: 1,
				start: "-50% top",
				end: "bottom+=50% bottom",
				// pin: 1,
				// markers: 1
			}
		});
		parallaxImgSlide.fromTo('.rs-steps__column-middle', { x: '300px', y: '-100px' }, { x: '-100px', y: '100px' })
	}

	if (document.querySelector('.rs-steps__column-bottom')) {
		const parallaxImgBottom = gsap.timeline({
			scrollTrigger: {
				trigger: ".rs-steps",
				scrub: 1,
				start: "-50% top",
				end: "bottom+=50% bottom",
				// pin: 1,
				// markers: 1
			}
		});
		parallaxImgBottom.from('.rs-steps__column-bottom', {
			y: '500px',
		})
	}

	if (document.querySelector('.rs-steps__navigation_body')) {
		gsap.to('.rs-steps__navigation_body', {
			scrollTrigger: {
				trigger: '.rs-steps__navigation_body',
				start: `top top+=100px`,
				end: `bottom bottom-=50%`,
				endTrigger: '.rs-steps',
				pin: true,
				pinSpacing: false,
				scrub: true,
				invalidateOnRefresh: true,
				// markers: 1,
			},
		});
	}

	/* REVEAL ANIMATION */
	// project
	showContentOnScroll('.rs-project__item', 0.3, 0.15, 'bottom-up--every');

	/* PINS BLOCK - FEATURES */
	if (document.querySelector('.rs-features__slide')) {
		const cards = gsap.utils.toArray(".rs-features__slide");
		const stagger = 0.3;

		setTimeout(() => {
			gsap.set('.rs-features__slide:not(:first-child)', {
				yPercent: (index) => 0,
				scale: (index) => 1,
			})
		}, 100);

		const pinBlock = gsap.timeline({
			defaults: { ease: "none" },
			scrollTrigger: {
				trigger: ".rs-features__swiper",
				start: "top-=10% top",
				end: "bottom+=300% top",
				scrub: true,
				pin: true,
				// markers: 1,
				id: 'pin-block',
				invalidateOnRefresh: true,
			}
		});

		pinBlock.to('.rs-features__slide', {
			yPercent: (index) => -100 * index,
			stagger: stagger,
		})

		pinBlock.to('.rs-features__slide:not(:last-child)', {
			scale: (index) => 1 - (cards.length - index) * 0.025,
			stagger: stagger,
		}, stagger)
	}

	/* PINS BLOCK STACK - MAIN */
	//========================================================================================================================================================
	if (document.querySelector('.rs-main__project_item')) {
		const stagger = 0.5;
		setTimeout(() => {
			gsap.set('.rs-main__project_item', {
				y: (index) => 0 * index,
				zIndex: (index, target, targets) => targets.length - index,
				scale: (index) => 1 - (index * 0.05),
			})
		}, 100);

		const pinBlock = gsap.timeline({
			defaults: { ease: "none" },
			scrollTrigger: {
				trigger: ".rs-main__project",
				start: "top top",
				end: "bottom+=300% top",
				scrub: true,
				pin: true,
				// markers: 1,
				id: 'pin-block',
				invalidateOnRefresh: true,
			}
		});
		pinBlock.to('.rs-main__project_item', {
			scale: 1,
			y: 0,
			webkitFilter: "blur(" + 0 + "px)",
			stagger: stagger,
		})

		pinBlock.to('.rs-main__project_item:not(:last-child)', {
			yPercent: -125,
			stagger: stagger,
		}, stagger)

		ScrollTrigger.refresh(); // Refresh ScrollTrigger settings
		const start = pinBlock.scrollTrigger.start;
		const end = pinBlock.scrollTrigger.end;
		const totalScroll = end - start;
		let links = gsap.utils.toArray(".rs-main__project_nav ul li a");
		const scrollSteps = totalScroll / links.length;

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
		}
	}

	/* PINS BLOCK STACK REVERSE - STEPS ALGORITHM */
	//========================================================================================================================================================
	if (document.querySelector('.rs-steps-algorithm .rs-steps__text')) {
		gsap.to('.rs-steps-algorithm .rs-steps__text', {
			scrollTrigger: {
				trigger: '.rs-steps-algorithm .rs-steps__text',
				start: `top top+=100px`,
				end: `bottom bottom`,
				endTrigger: '.rs-steps-algorithm',
				pin: true,
				pinSpacing: false,
				scrub: true,
				invalidateOnRefresh: true,
				// markers: 1,
			},
		});
		const cardsSteps = gsap.utils.toArray(".rs-steps-algorithm .rs-steps__spollers_item");
		cardsSteps.forEach((card, index) => {
			const tween = gsap.to(card, {
				scrollTrigger: {
					trigger: card,
					start: `top-=${index * 20} top+=100px`,
					end: `bottom+=50px bottom-=50%`,
					endTrigger: '.rs-steps-algorithm',
					pin: true,
					pinSpacing: false,
					scrub: true,
					invalidateOnRefresh: true,
					// markers: 1,
				},
				ease: "none",
				// scale: () => 1 - (cards.length - index) * 0.025
			});
		});
	}

	/* PINS BUTTON IN SERVICER-PRICES */
	//========================================================================================================================================================
	// gsap.to('.rs-services-price__action_body', {
	// 	scrollTrigger: {
	// 		trigger: '.rs-services-price__action_body',
	// 		start: `top top+=100px`,
	// 		end: `bottom bottom-=50%`,
	// 		endTrigger: '.rs-services-price__item',
	// 		pin: true,
	// 		pinSpacing: false,
	// 		scrub: true,
	// 		invalidateOnRefresh: true,
	// 		markers: 1,
	// 	},
	// });
}

function animMobile() {
	/* REVEAL ANIMATION */
	// project
	showContentOnScroll('.rs-project__slider', 0.5, 0.3, 'bottom-up');

	/* PINS BLOCK - FEATURES */
	if (document.querySelector('.rs-features__slide')) {
		const cards = gsap.utils.toArray(".rs-features__slide");
		const stagger = 0.5;

		setTimeout(() => {
			gsap.set('.rs-features__slide:not(:first-child)', {
				yPercent: (index) => 0,
				scale: (index) => 1,
			})
		}, 100);

		const pinBlock = gsap.timeline({
			defaults: { ease: "none" },
			scrollTrigger: {
				trigger: ".rs-features__swiper",
				start: "top0 top",
				end: "bottom+=100% top",
				scrub: true,
				pin: true,
				// markers: 1,
				id: 'pin-block',
				invalidateOnRefresh: true,
			}
		});

		pinBlock.to('.rs-features__slide', {
			yPercent: (index) => -100 * index,
			stagger: stagger,
		})

		pinBlock.to('.rs-features__slide:not(:last-child)', {
			scale: (index) => 1 - (cards.length - index) * 0.025,
			stagger: stagger,
		}, stagger)
	}

}

function animCommon() {
	/* MOVE SVG LINE */
	moveSvgDashed(".rs-slider-block__line #dashed-about", ".rs-slider-block__line #mask-about", ".rs-slider-block");
	moveSvgDashed(".rs-slider-block__line #dashed-about-1", ".rs-slider-block__line #mask-about-1", ".rs-slider-block");
	moveSvgDashed(".rs-slider-block__line #dashed-about-2", ".rs-slider-block__line #mask-about-2", ".rs-slider-block");
	moveSvgDashed(".rs-slider-block__line #dashed-about-3", ".rs-slider-block__line #mask-about-3", ".rs-slider-block");
	moveSvgDashed(".rs-slider-block__line #dashed-about-4", ".rs-slider-block__line #mask-about-4", ".rs-slider-block");
	moveSvgDashed(".rs-slider-block__line #dashed-about-5", ".rs-slider-block__line #mask-about-5", ".rs-slider-block");
	moveSvgDashed(".rs-reviews__line #dashed-reviews", ".rs-reviews__line #mask-reviews", ".rs-reviews");
	moveSvgDashed(".rs-services__line #dashed-services-1", ".rs-services__line #mask-services-1", ".rs-services");
	moveSvgDashed(".rs-services__line #dashed-services-2", ".rs-services__line #mask-services-2", ".rs-services");
	moveSvgDashed(".rs-services__line #dashed-services-3", ".rs-services__line #mask-services-3", ".rs-services");
	moveSvgDashed(".rs-services__line #dashed-services-4", ".rs-services__line #mask-services-4", ".rs-services");
	moveSvgDashed(".rs-services__line #dashed-services-5", ".rs-services__line #mask-services-5", ".rs-services");
	moveSvgDashed(".rs-services__line #dashed-services-6", ".rs-services__line #mask-services-6", ".rs-services");
	moveSvgDashed(".rs-services__line #dashed-services-7", ".rs-services__line #mask-services-7", ".rs-services");
	moveSvgDashed(".rs-task__line #dashed-task1", ".rs-task__line #mask-task1", ".rs-task");
	moveSvgDashed(".rs-task__line #dashed-task2", ".rs-task__line #mask-task2", ".rs-task");

	/* REVEAL ANIMATION */
	// text
	showContentOnScroll('.mrp-med-65', 0.8, 0.5, 'bottom-up');
	showContentOnScroll('.mrp-med-50', 0.8, 0.5, 'bottom-up');
	showContentOnScroll('.mrp-med-45', 0.8, 0.5, 'bottom-up');
	showContentOnScroll('.mrp-med-40', 0.8, 0.5, 'bottom-up');
	showContentOnScroll('.mrp-med-25', 0.8, 0.6, 'bottom-up');
	showContentOnScroll('.mrp-med-21', 0.8, 0.7, 'bottom-up');
	showContentOnScroll('.mrp-reg-25', 0.8, 0.5, 'bottom-up');
	showContentOnScroll('.mrp-med-18', 0.8, 0.5, 'bottom-up');
	showContentOnScroll('.mrp-reg-21', 0.8, 0.6, 'bottom-up');
	showContentOnScroll('.mrp-reg-18', 0.8, 0.7, 'bottom-up');
	showContentOnScroll('blockquote', 0.8, 0.5, 'bottom-up');
	// header
	showContentOnScroll('.rs-header__menu', 0.5, 0.5, 'fade');
	showContentOnScroll('.rs-header__logo', 0.5, 0.75, 'fade');
	showContentOnScroll('.rs-header__actions', 0.5, 1, 'fade');
	// banner
	showContentOnScroll('.rs-banner__buttons', 0.5, 0.5, 'bottom-up--every');
	showContentOnScroll('.rs-banner__body ul', 0.5, 0.3, 'bottom-up');
	showContentOnScroll('.rs-banner__bg', 0.5, 0.15, 'width-100');
	// rs-slider-block
	showContentOnScroll('.rs-slider-block__slide', 0.5, 0.2, 'right-left--every');
	showContentOnScroll('.rs-slider-block__slider', 0.5, 0.2, 'right-left');
	showContentOnScroll('.rs-slider-block__icon', 0.5, 0.15, 'bottom-up--every');
	// project
	showContentOnScroll('.rs-project__filter', 0.5, 1, 'fade');
	showContentOnScroll('.rs-project__add', 0.5, 0.5, 'bottom-up--every');
	// steps
	showContentOnScroll('.rs-steps__navigation_list li a ', 0.5, 0.15, 'left-right--every');
	showContentOnScroll('.rs-steps__item', 0.5, 0.3, 'bottom-up--every');
	showContentOnScroll('.rs-steps__footer ul li', 0.5, 0.5, 'bottom-up');
	// compare
	// ScrollTrigger.create({
	// 	trigger: '.rs-comparison',
	// 	animation:
	// 		gsap.fromTo('.icv__control',
	// 			{ x: 'calc(100% - 25px)' },
	// 			{ x: 'calc(46.2% - 25px)', delay: 0.3, duration: 0.5 }),
	// 	once: true,
	// });
	// ScrollTrigger.create({
	// 	trigger: '.rs-comparison',
	// 	animation:
	// 		gsap.fromTo('.icv__wrapper',
	// 			{ clipPath: 'inset(0px 0px 0px 100%)' },
	// 			{ clipPath: 'inset(0px 0px 0px 46.2%)', delay: 0.3, duration: 0.5 }),
	// 	once: true,
	// });
	// calc
	showContentOnScroll('.rs-calc__bg', 0.5, 0.2, 'bottom-up');
	showContentOnScroll('.rs-calc__settings_wrapper', 0.5, 0.3, 'bottom-up');
	showContentOnScroll('.rs-calc__cost_img', 0.5, 0.2, 'right-left');
	showContentOnScroll('.rs-calc__cost_list ul li', 0.5, 0.15, 'bottom-up--every');
	showContentOnScroll('.rs-calc__cost_footer', 0.5, 0.3, 'bottom-up--every');
	// reviews
	showContentOnScroll('.rs-reviews__bg', 0.5, 0.2, 'bottom-up');
	showContentOnScroll('.rs-reviews__slide', 0.5, 0.2, 'bottom-up--every');
	showContentOnScroll('.rs-reviews__sticker', 0.5, 0.2, 'right-left');
	// services
	showContentOnScroll('.rs-services__slide', 0.5, 0.2, 'right-left--every');
	showContentOnScroll('.rs-services__icon', 0.5, 0.15, 'bottom-up--every');
	// footer
	showContentOnScroll('.rs-footer .rs-breadcrumbs', 0.5, 0.2, 'bottom-up');
	showContentOnScroll('.rs-footer__phone', 0.5, 0.2, 'bottom-up');
	showContentOnScroll('.rs-footer__links ul li', 0.5, 0.15, 'bottom-up--every');
	showContentOnScroll('.rs-footer__social', 0.5, 0.5, 'bottom-up');
	showContentOnScroll('.rs-footer__spollers_item', 0.5, 0.2, 'bottom-up--every');
	showContentOnScroll('.rs-footer__city', 0.5, 0.3, 'bottom-up');
	showContentOnScroll('.rs-footer__copyright', 0.5, 0.4, 'left-right');
	// text-block	
	showContentOnScroll('.rs-text-block .rs-text-block__picture .rs-text-block__img-0 img', 0.5, 0.3, 'scale');
	showContentOnScroll('.rs-text-block .rs-text-block__picture .rs-text-block__img-1 img', 0.5, 0.6, 'scale');
	showContentOnScroll('.rs-text-block .rs-text-block__picture .rs-text-block__img-2 img', 0.5, 0.9, 'scale');
	showContentOnScroll('.rs-text-block .rs-text-block__picture .rs-text-block__img-3 img', 0.5, 1.2, 'scale');
	showContentOnScroll('.rs-text-block .rs-text-block__picture .rs-text-block__icons img', 0.5, 0.3, 'scale--every');
	showContentOnScroll('.rs-text-block__description ol li', 0.15, 0.3, 'bottom-up--every');
	showContentOnScroll('.rs-text-block__description ul li', 0.15, 0.3, 'bottom-up--every');
	// tariff
	showContentOnScroll('.rs-tariff__desktop', 1, 1, 'fade');
	showContentOnScroll('.rs-tariff__mobile .rs-tariff__spollers', 1, 1, 'fade');
	// features	
	showContentOnScroll('.rs-features-list__icon', 0.5, 0.3, 'scale--every');
	showContentOnScroll('.rs-features-list__img', 0.5, 0.3, 'left-right');
	// partners	
	showContentOnScroll('.section-bg .section__bg', 1, 0.3, 'width-100');
	showContentOnScroll('.section-bg .section__container', 1, 1, 'fade');
	// services-about
	showContentOnScroll('.rs-about-block__img', 0.5, 0.5, 'bottom-up');
	showContentOnScroll('.rs-about-block__desc', 0.5, 0.3, 'bottom-up');
	// services-price
	showContentOnScroll('.rs-services-price__item', 0.5, 0.3, 'bottom-up');
	// feedback
	showContentOnScroll('.rs-feedback', 0.5, 0.3, 'up-bottom');
	// contact
	showContentOnScroll('.rs-document__spollers_item', 0.5, 0.2, 'bottom-up--every');
	showContentOnScroll('.rs-contact__info_list li', 0.5, 0.2, 'bottom-up--every');
	showContentOnScroll('.rs-contact__map', 0.5, 0.5, 'fade');
	// services-about
	showContentOnScroll('.rs-services-about__text', 0.5, 0.5, 'bottom-up--every');
	showContentOnScroll('.rs-services-about__table', 0.5, 0.5, 'bottom-up');
	showContentOnScroll('.rs-services-about__hint', 0.5, 1, 'bottom-up');
	showContentOnScroll('.rs-services-about__item', 0.5, 0.5, 'bottom-up--every');
	// task
	showContentOnScroll('.rs-task__item', 0.5, 0.5, 'bottom-up--every');
	// parallax
	showContentOnScroll('.rs-why-block__bg', 1, 0.3, 'width-100');
	// main
	showContentOnScroll('.rs-main__title_video', 1, 0.3, 'width-100');
	showContentOnScroll('.rs-main__title h1', 0.5, 1, 'scale');

	// logo
	showContentOnScroll('.rs-logo__slide', 0.5, 0.2, 'right-left--every');
	// 404
	showContentOnScroll('.rs-error-block', 0.8, 0.5, 'bottom-up');

	/* PINS BLOCK - MAIN */
	//========================================================================================================================================================
	if (document.querySelector('.rs-main__title h1')) {
		gsap.to('.rs-main__title h1', {
			scrollTrigger: {
				trigger: '.rs-main__title',
				start: `top top`,
				end: `bottom bottom`,
				endTrigger: '.rs-main__pins',
				pin: true,
				pinSpacing: false,
				scrub: true,
				invalidateOnRefresh: true,
				// markers: 1,
			},
		});
		gsap.set('.rs-main__title h1', { scale: 0, opacity: 0 });
		gsap.to('.rs-main__title h1', {
			scale: 1,
			opacity: 1,
			scrollTrigger: {
				start: `top+=50% top`,
				end: `bottom=+50% bottom`,
				endTrigger: '.rs-main__title',
				scrub: true,
				// markers: 1,
			}
		})
	}
}

// Проверка ширины экрана для вызова отдельных анимаций
const breakpoint = window.matchMedia('(min-width: 991.98px)');
const breakpointGsapAnimChecker = function () {
	ScrollTrigger.refresh()

	animCommon()
	if (breakpoint.matches === true) {
		return animDesktop();
	} else if (breakpoint.matches === false) {
		return animMobile();
	}
};
breakpoint.addListener(breakpointGsapAnimChecker);

//========================================================================================================================================================
/*
Документация: https://barba.js.org/
*/
// Подключаем из node_modules
// import barba from '@barba/core';

// Импорт функций инициализации библиотек для повторной инициализации в барбе
import { initSliders } from "../files/sliders.js"
// import { initYaMap } from "../files/map.js"
import { initComparison } from "../libs/imagecompare.js";
import { initNoUiField } from "../libs/nouislider.js";
import { filterClear, filterProject, imitationProductLoad } from "../files/project.js";
import { sidebarNavigation } from "../files/steps.js";
import { openFullList } from "../files/tariff.js";
import * as vnvFunctions from "../files/functions.js";
import * as vnvForms from "../files/forms/forms.js";
import * as vnvScroll from "../files/scroll/scroll.js";
import { addCursorHover, addCursorMove, addCursorDrag } from "../libs/cursor.js";

//========================================================================================================================================================
function initBarba() {
	const loader = document.querySelector('.mg-loader');
	const loaderFill = loader.querySelectorAll('.mg-loader-fill');
	const loaderFillv1 = document.querySelector('.mg-loader-fill.-v1');
	const loaderFillv2 = document.querySelector('.mg-loader-fill.-v2');

	loaderFill.forEach((fill, index) => {
		setTimeout(() => {
			gsap.set(fill, {
				yPercent: 100,
				// zIndex: loaderFill.length - index,
			})
		}, 100);
	});

	function loaderAnimFrom() {
		gsap.to(loaderFillv1, {
			yPercent: 0,
			delay: 0.2,
			duration: 0.6,
			ease: 'cubic-bezier(0.9, 0, 0.2, 1)',
		});

		gsap.to(loaderFillv2, {
			yPercent: 0,
			delay: 0.4,
			duration: 0.6,
			ease: 'cubic-bezier(0.9, 0, 0.2, 1)',
		});
	}

	function loaderAnimTo() {
		gsap.to(loaderFillv1, {
			yPercent: 100,
			delay: 0.4,
			duration: 0.6,
			ease: 'cubic-bezier(0.9, 0, 0.2, 1)',
		});

		gsap.to(loaderFillv2, {
			yPercent: 100,
			delay: 0.2,
			duration: 0.6,
			ease: 'cubic-bezier(0.9, 0, 0.2, 1)',
		});
	}
	loaderAnimTo()

	barba.init({
		transitions: [{
			leave({ current }) {
				// Переход
				loaderAnimFrom()

				return gsap.to(current.container, {
					// opacity: 0,
					delay: 0.5,
				});
			},

			after({ next }) {
				window.scrollTo(0, 0);
				ScrollTrigger.refresh(true);

				// Переход
				loaderAnimTo()
				ScrollTrigger.refresh(true);
				breakpointGsapAnimChecker();

				return gsap.from(next.container, {
					// opacity: 0,
					delay: 0.5,

					onComplete: function () {
						// Получаем цвет страницы из блока, который меняется с помощью барбы, и переносим его в body
						let wrapper = window.getComputedStyle(document.querySelector('.wrapper'));
						let primaryColor = wrapper.getPropertyValue('--primary-color');
						document.body.style.setProperty('--primary-color', primaryColor);

						ScrollTrigger.refresh(true);
						setTimeout(() => {
							// Повторная инициализация библиотек
							initSliders();
							// initYaMap();
							initComparison('image-compare');
							initNoUiField('styles-page', 'styles-page-count')
							initNoUiField('fill-page', 'fill-page-count')
							// Инициализация отдельного функицонала на сайте
							vnvFunctions.spollers();
							vnvFunctions.tabs();
							vnvFunctions.menuInit();
							vnvFunctions.menu();
							vnvFunctions.regionMenu();
							vnvFunctions.showMore();
							vnvForms.formFieldsInit();
							vnvForms.formSubmit();
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
						}, 100);
					}
				});
			},
		}]
	});

	barba.hooks.afterLeave((data) => {
		let triggers = ScrollTrigger.getAll();
		triggers.forEach(trigger => {
			trigger.kill();
		});
	});

	barba.hooks.leave((data) => {
	});

	barba.hooks.enter((data) => {
		window.scrollTo(0, 0);
		ScrollTrigger.refresh(true);
	});

	barba.hooks.afterEnter((data) => {
		// Повторная инициализация библиотек
		setTimeout(() => {

		}, 100);
	});
}
initBarba();