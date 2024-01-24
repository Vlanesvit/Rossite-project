
// После загрузки заново пересчитывать начальное и конечное значения
window.addEventListener('load', function () {
	window.scrollTo(0, 0);
	// setTimeout(() => {
	// 	ScrollTrigger.refresh()
	// }, 1000);
})

gsap.config({ trialWarn: false });
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
// gsap.registerPlugin(drawSVGPlugin);
console.clear();

/* Smooth Scroll */
SmoothScroll({
	animationTime: 600, // [ms]
	stepSize: 100, // [px]
	accelerationDelta: 50,  // 50
	accelerationMax: 3,   // 3
	touchpadSupport: false,
});

/* COLOR SETTINGS */
let primaryColor = getComputedStyle(document.body).getPropertyValue('--primary-color');
let secondColor = getComputedStyle(document.body).getPropertyValue('--second-color');
let accentSeoColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-seo-color');

console.log(accentSeoColor);

/* MOVE SVG LINE */
function moveSvgDashed(dashed, mask, trigger, top = 75, end = 200, markers = 0) {
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
	let container = document.querySelector(block);
	gsap.to(container, {
		x: () => -(container.scrollWidth - container.clientWidth) + "px",
		ease: "linear",
		scrollTrigger: {
			trigger: trigger,
			start: "top-=10% top",
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
			start: "top-=10% top",
			end: "bottom+=200% bottom",
			scrub: true,
			invalidateOnRefresh: true,
			anticipatePin: 1,
		}
	});
}

function animDesktop() {
	/* BG-COLOR CHANGER */
	const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
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

	/* PARALLAX IMG - STEPS */
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

	/* REVEAL ANIMATION */
	// project
	showContentOnScroll('.rs-project__item', 0.3, 0.15, 'bottom-up--every');

	/* PINS BLOCK - FEATURES */
	const cards = gsap.utils.toArray(".rs-features__slide");
	cards.forEach((card, index) => {
		const tween = gsap.to(card, {
			scrollTrigger: {
				trigger: card,
				start: `top-=${index * 20} top+=10px`,
				end: `bottom-=10px bottom`,
				endTrigger: '.rs-features__swiper',
				pin: true,
				pinSpacing: false,
				scrub: true,
				invalidateOnRefresh: true,
				// markers: 1,
			},
			ease: "none",
			scale: () => 1 - (cards.length - index) * 0.025
		});
	});

	/* PINS BLOCK STACK - MAIN */
	//========================================================================================================================================================
	const stagger = 0.5;
	window.addEventListener('load', function () {
		setTimeout(() => {
			gsap.set('.rs-main__project_item', {
				y: (index) => 20 * index,
				zIndex: (index, target, targets) => targets.length - index,
				scale: (index) => 1 - (index * 0.05),
				webkitFilter: "blur(" + 2 + "px)",
			})
		}, 100);
	})

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

	/* PINS BLOCK - MAIN */
	//========================================================================================================================================================
	gsap.to('.rs-main__title', {
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
	gsap.to('.rs-main__video', {
		scrollTrigger: {
			trigger: '.rs-main__video',
			start: `top top`,
			end: `bottom bottom+=1%`,
			endTrigger: '.rs-main__pins',
			pin: true,
			pinSpacing: false,
			scrub: true,
			invalidateOnRefresh: true,
			// markers: 1,
		},
	});
	gsap.set('.rs-main__video', { scale: 0.819, borderRadius: "70px" });
	gsap.to('.rs-main__video', {
		scale: 1,
		borderRadius: "0px",
		scrollTrigger: {
			start: `top+=10% top`,
			end: `bottom bottom`,
			endTrigger: '.rs-main__video',
			scrub: true,
			// markers: 1,
		}
	})

	/* PINS BLOCK STACK REVERSE - STEPS ALGORITHM */
	//========================================================================================================================================================
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
}

function animCommon() {
	/* MOVE SVG LINE */
	moveSvgDashed(".rs-slider-block__line #dashed-about", ".rs-slider-block__line #mask-about", ".rs-slider-block");
	// moveSvgDashed(".rs-slider-block__line #dashed-about-1", ".rs-slider-block__line #mask-about-1", ".rs-slider-block");
	// moveSvgDashed(".rs-slider-block__line #dashed-about-2", ".rs-slider-block__line #mask-about-2", ".rs-slider-block");
	// moveSvgDashed(".rs-slider-block__line #dashed-about-3", ".rs-slider-block__line #mask-about-3", ".rs-slider-block");
	// moveSvgDashed(".rs-slider-block__line #dashed-about-4", ".rs-slider-block__line #mask-about-4", ".rs-slider-block");
	// moveSvgDashed(".rs-slider-block__line #dashed-about-5", ".rs-slider-block__line #mask-about-5", ".rs-slider-block");
	moveSvgDashed(".rs-reviews__line #dashed-reviews", ".rs-reviews__line #mask-reviews", ".rs-reviews", 50, 50);
	// moveSvgDashed(".rs-services__line #dashed-services-1", ".rs-services__line #mask-services-1", ".rs-services");
	// moveSvgDashed(".rs-services__line #dashed-services-2", ".rs-services__line #mask-services-2", ".rs-services");
	// moveSvgDashed(".rs-services__line #dashed-services-3", ".rs-services__line #mask-services-3", ".rs-services");
	// moveSvgDashed(".rs-services__line #dashed-services-4", ".rs-services__line #mask-services-4", ".rs-services");
	// moveSvgDashed(".rs-services__line #dashed-services-5", ".rs-services__line #mask-services-5", ".rs-services");
	// moveSvgDashed(".rs-services__line #dashed-services-6", ".rs-services__line #mask-services-6", ".rs-services");
	// moveSvgDashed(".rs-services__line #dashed-services-7", ".rs-services__line #mask-services-7", ".rs-services");
	// moveSvgDashed(".rs-task__line #dashed-task1", ".rs-task__line #mask-task1", ".rs-task");
	// moveSvgDashed(".rs-task__line #dashed-task2", ".rs-task__line #mask-task2", ".rs-task");

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
	horizontalScroll('.rs-slider-block-pins .rs-slider-block__swiper', '.rs-slider-block-pins', '.rs-slider-block-pins .rs-slider-block__pagination .swiper-pagination-progressbar-fill')
	// project
	showContentOnScroll('.rs-project__filter', 0.5, 1, 'fade');
	showContentOnScroll('.rs-project__add', 0.5, 0.5, 'bottom-up--every');
	// steps
	showContentOnScroll('.rs-steps__navigation_list li a ', 0.5, 0.15, 'left-right--every');
	showContentOnScroll('.rs-steps__item', 0.5, 0.3, 'bottom-up--every');
	showContentOnScroll('.rs-steps__footer ul li', 0.5, 0.5, 'bottom-up');
	// compare
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
	showContentOnScroll('.rs-main__title h1', 0.5, 0.3, 'scale');
	// logo
	showContentOnScroll('.rs-logo__slide', 0.5, 0.2, 'right-left--every');


	// btn anim
	const homeIntroBtns = document.querySelectorAll('.rs-btn');
	homeIntroBtns.forEach(homeIntroBtn => {
		let btnAnim;
		btnAnim = gsap.to(homeIntroBtn.querySelector('.svg-wrapper svg path'), {
			duration: 1,
			delay: 0.5,
			strokeDashoffset: 0,
			stagger: 0,
			ease: 'cubic-1',

			onComplete: function onComplete() {
				if (homeIntroBtn.classList.contains('_btn-primary')) {
					gsap.to(homeIntroBtn.querySelector('svg path'), {
						duration: 0.5,
						delay: 0.5,
						fill: primaryColor,
						ease: 'cubic-1',
						onComplete: function onComplete() {
							homeIntroBtn.classList.add('btn--active');
						}
					});
				}

				if (homeIntroBtn.classList.contains('_btn-second')) {
					gsap.to(homeIntroBtn.querySelector('svg path'), {
						duration: 0.5,
						delay: 0.5,
						fill: secondColor,
						ease: 'cubic-1',
						onComplete: function onComplete() {
							homeIntroBtn.classList.add('btn--active');
						}
					});
				}

				if (homeIntroBtn.classList.contains('_btn-accent-seo')) {
					gsap.to(homeIntroBtn.querySelector('svg path'), {
						duration: 0.5,
						delay: 0.5,
						fill: accentSeoColor,
						ease: 'cubic-1',
						onComplete: function onComplete() {
							homeIntroBtn.classList.add('btn--active');
						}
					});
				}

				if (homeIntroBtn.classList.contains('_btn-gray')) {
					gsap.to(homeIntroBtn.querySelector('svg path'), {
						duration: 0.5,
						delay: 0.5,
						fill: 'rgb(245, 247, 255)',
						ease: 'cubic-1',
						onComplete: function onComplete() {
							homeIntroBtn.classList.add('btn--active');
						}
					});
				}

				if (homeIntroBtn.classList.contains('_btn-gray-border')) {
					gsap.to(homeIntroBtn.querySelector('svg path'), {
						duration: 0.5,
						delay: 0.5,
						ease: 'cubic-1',
						onComplete: function onComplete() {
							homeIntroBtn.classList.add('btn--active');
						}
					});
				}

				if (homeIntroBtn.classList.contains('_btn-white')) {
					gsap.to(homeIntroBtn.querySelector('svg path'), {
						duration: 0.5,
						delay: 0.5,
						fill: 'rgb(255, 255, 255)',
						ease: 'cubic-1',
						onComplete: function onComplete() {
							homeIntroBtn.classList.add('btn--active');
						}
					});
				}

				if (homeIntroBtn.classList.contains('_btn-primary-border')) {
					gsap.to(homeIntroBtn.querySelector('svg path'), {
						duration: 0.5,
						delay: 0.5,
						ease: 'cubic-1',
						onComplete: function onComplete() {
							homeIntroBtn.classList.add('btn--active');
						}
					});
				}

				gsap.to(homeIntroBtn.querySelector('span'), {
					duration: 0.5,
					autoAlpha: 1,
					ease: 'cubic-1'
				});
			}
		});

		ScrollTrigger.create({
			trigger: homeIntroBtn,
			animation: btnAnim,
			once: true,
			// scrub: true,
			// markers: 1,
			start: `top-=50% bottom`,
			end: `bottom+=50% top`,

			onEnter: () => function () { },
			onLeave: () => function () { },
			onEnterBack: () => function () { },
			onLeaveBack: () => function () { },
		});
	});
}

window.addEventListener("DOMContentLoaded", function () {
	const breakpoint = window.matchMedia('(min-width: 991.98px)');
	const breakpointChecker = function () {
		animCommon()
		if (breakpoint.matches === true) {
			return animDesktop();
		} else if (breakpoint.matches === false) {
			return animMobile();
		}
	};
	breakpoint.addListener(breakpointChecker);
	breakpointChecker();
	ScrollTrigger.refresh()
})
