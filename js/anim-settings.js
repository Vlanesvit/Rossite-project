
window.onbeforeunload = function () {
	window.scrollTo(0, 0);
};
gsap.config({ trialWarn: false });
gsap.registerPlugin(ScrollTrigger)
// gsap.registerPlugin(drawSVGPlugin);
console.clear();

// /* Smooth Scroll */
// SmoothScroll({
// 	animationTime: 600, // [ms]
// 	stepSize: 100, // [px]
// 	accelerationDelta: 50,  // 50
// 	accelerationMax: 3,   // 3
// 	touchpadSupport: false,
// });

/* COLOR SETTINGS */
let primaryColor = getComputedStyle(document.body).getPropertyValue('--primary-color');
let secondColor = getComputedStyle(document.body).getPropertyValue('--second-color');
let accentSeoColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-seo-color');

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
				markers: 0,
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
				markers: 0,
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
		ease: "none",
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
		ease: 'none',
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

	/* PARALLAX IMG */
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

	/* REVEAL ANIMATION */
	// project
	showContentOnScroll('.rs-project__item', 0.3, 0.15, 'bottom-up--every');


	/* Main pins block anim */
	//========================================================================================================================================================
	const stagger = 0.5;

	gsap.set('.rs-main__project_item', {
		y: (index) => 20 * index,
		zIndex: (index, target, targets) => targets.length - index,
		scale: (index) => 1 - (index * 0.05),
		webkitFilter: "blur(" + 2 + "px)",
	})

	const pinBlock = gsap.timeline({
		defaults: { ease: "none" },
		scrollTrigger: {
			trigger: ".rs-main__project",
			start: "top top",
			end: "bottom top",
			scrub: true,
			pin: true,
			// markers: true,
			invalidateOnRefresh: true,
		}
	});

	pinBlock.to('.rs-main__project_item', {
		scale: 1,
		y: 0,
		webkitFilter: "blur(" + 0 + "px)",
		stagger: stagger,
	})
	pinBlock.to('.rs-main__project_item', {
		yPercent: -125,
		stagger: stagger,
	}, stagger)

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
			// markers: true,
		},
	});

	//========================================================================================================================================================
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
			// markers: true,
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
			// markers: true,
		}
	})

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
			// markers: true,
		},
	});

	const cardsSteps = gsap.utils.toArray(".rs-steps-algorithm .rs-steps__spollers_item");
	cardsSteps.forEach((card, index) => {
		const tween = gsap.to(card, {
			scrollTrigger: {
				trigger: card,
				start: `top-=${index * 20} top+=100px`,
				end: `bottom-=100px bottom-=50%`,
				endTrigger: '.rs-steps-algorithm',
				pin: true,
				pinSpacing: false,
				scrub: true,
				invalidateOnRefresh: true,
				// markers: true,
			},
			ease: "none",
			// scale: () => 1 - (cards.length - index) * 0.025
		});
	});
}

function animMobile() {
	/* REVEAL ANIMATION */
	// project
	showContentOnScroll('.rs-project__slider', 0.5, 0.3, 'bottom-up');
}

function animCommon() {
	// main btn
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

			onEnter: () => function () { },
			onLeave: () => function () { },
			onEnterBack: () => function () { },
			onLeaveBack: () => function () { },
		});
	});

	/* MOVE SVG LINE */
	moveSvgDashed(".rs-about-product__line #dashed-about", ".rs-about-product__line #mask-about", ".rs-about-product");
	// moveSvgDashed(".rs-about-product__line #dashed-about-1", ".rs-about-product__line #mask-about-1", ".rs-about-product");
	// moveSvgDashed(".rs-about-product__line #dashed-about-2", ".rs-about-product__line #mask-about-2", ".rs-about-product");
	// moveSvgDashed(".rs-about-product__line #dashed-about-3", ".rs-about-product__line #mask-about-3", ".rs-about-product");
	// moveSvgDashed(".rs-about-product__line #dashed-about-4", ".rs-about-product__line #mask-about-4", ".rs-about-product");
	// moveSvgDashed(".rs-about-product__line #dashed-about-5", ".rs-about-product__line #mask-about-5", ".rs-about-product");
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
	// showContentOnScroll('blockquote', 0.8, 0.5, 'bottom-up');
	// header
	showContentOnScroll('.rs-header__menu', 0.5, 0.5, 'fade');
	showContentOnScroll('.rs-header__logo', 0.5, 0.75, 'fade');
	showContentOnScroll('.rs-header__actions', 0.5, 1, 'fade');
	// banner
	showContentOnScroll('.rs-banner__buttons', 0.5, 0.5, 'bottom-up--every');
	showContentOnScroll('.rs-banner__body ul', 0.5, 0.3, 'bottom-up');
	showContentOnScroll('.rs-banner__bg', 0.5, 0.15, 'width-100');
	// about
	showContentOnScroll('.rs-about-product__slide', 0.5, 0.2, 'right-left--every');
	showContentOnScroll('.rs-about-product__slider', 0.5, 0.2, 'right-left');
	showContentOnScroll('.rs-about-product__icon', 0.5, 0.15, 'bottom-up--every');
	horizontalScroll('.rs-about-product__list', '.rs-about-product', '.rs-about-product__progress_fill')
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
	// showContentOnScroll('.rs-footer__phone', 0.5, 0.2, 'bottom-up');
	// showContentOnScroll('.rs-footer__links ul li', 0.5, 0.15, 'bottom-up--every');
	// showContentOnScroll('.rs-footer__social', 0.5, 0.5, 'bottom-up');
	// showContentOnScroll('.rs-footer__spollers_item', 0.5, 0.2, 'bottom-up--every');
	// showContentOnScroll('.rs-footer__city', 0.5, 0.3, 'bottom-up');
	// showContentOnScroll('.rs-footer__copyright', 0.5, 0.4, 'left-right');
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
	showContentOnScroll('.rs-features__bg', 1, 0.3, 'width-100');
	showContentOnScroll('.rs-features__container', 1, 1, 'fade');
	showContentOnScroll('.rs-features__icon', 0.5, 0.3, 'scale--every');
	showContentOnScroll('.rs-features__img', 0.5, 0.3, 'left-right');
	showContentOnScroll('.rs-features-list__icon', 0.5, 0.3, 'scale--every');
	// partners	
	showContentOnScroll('.rs-partners__bg', 1, 0.3, 'width-100');
	showContentOnScroll('.rs-partners__container', 1, 1, 'fade');
	// services-about
	showContentOnScroll('.rs-services-about__img', 0.5, 0.5, 'bottom-up');
	showContentOnScroll('.rs-services-about__desc', 0.5, 0.3, 'bottom-up');
	// slider-block
	showContentOnScroll('.rs-slider-block__slide', 0.5, 0.2, 'right-left--every');
	// contact
	showContentOnScroll('.rs-document__spollers_item', 0.5, 0.2, 'bottom-up--every');
	showContentOnScroll('.rs-contact__info_list li', 0.5, 0.2, 'bottom-up--every');
	showContentOnScroll('.rs-contact__map', 0.5, 0.5, 'fade');
	// work-about
	showContentOnScroll('.rs-work-about__text', 0.5, 0.5, 'bottom-up--every');
	showContentOnScroll('.rs-work-about__table', 0.5, 0.5, 'bottom-up');
	showContentOnScroll('.rs-work-about__hint', 0.5, 1, 'bottom-up');
	showContentOnScroll('.rs-work-about__item', 0.5, 0.5, 'bottom-up--every');
	// task
	showContentOnScroll('.rs-task__item', 0.5, 0.5, 'bottom-up--every');
	// parallax
	showContentOnScroll('.rs-why-block__bg', 1, 0.3, 'width-100');
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
