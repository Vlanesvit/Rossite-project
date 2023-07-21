
window.onbeforeunload = function () {
	window.scrollTo(0, 0);
};
gsap.config({ trialWarn: false });
gsap.registerPlugin(ScrollTrigger)
// gsap.registerPlugin(drawSVGPlugin);
// console.clear();

// SmothScroll
// SmoothScroll({
// 	animationTime: 500, // [ms]
// 	stepSize: 100, // [px]
// 	accelerationDelta: 50,  // 50
// 	accelerationMax: 3,   // 3
// 	touchpadSupport: false,
// });

/* MOVE SVG LINE */
function moveSvgDashed(dashed, mask, trigger) {
	gsap.from(mask, {
		drawSVG: "0%",
		scrollTrigger: {
			trigger: trigger,
			start: "top-=25% top",
			end: "bottom+=80% bottom",
			scrub: 1,
			// markers: 1
		},
	});

	gsap.from(dashed, {
		"--dashOffset": 1000,
		delay: 5,
		scrollTrigger: {
			trigger: trigger,
			start: "top-=25% top",
			end: "bottom+=80% bottom",
			scrub: 1,
			// markers: 1
		}
	});

	document.querySelector(dashed).setAttribute("stroke-dashoffset", "var(--dashOffset)");
}

/* REVEAL ANIMATION */
function showContentOnScroll(elem, duration, delay, direction) {
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

function animDesktop() {
	/* BG-COLOR CHANGER */
	const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
	scrollColorElems.forEach((colorSection, i) => {
		const prevBg = i === 0 ? "" : scrollColorElems[i - 1].dataset.bgcolor;

		ScrollTrigger.create({
			trigger: colorSection,
			start: "top 35%",
			// markers: true,
			endTrigger: ".rs-steps",

			onEnter: () =>
				gsap.to("main.page", {
					backgroundColor: colorSection.dataset.bgcolor,
				}),
			onLeaveBack: () =>
				gsap.to("main.page", {
					backgroundColor: prevBg,
				}),
			onLeave: () =>
				gsap.to("main.page", {
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
			end: "bottom+=20% bottom",
			// pin: 1,
			// markers: 1
		}
	});
	parallaxImgTop.from('.rs-steps__column-top', {
		y: '-300px',
	})
	const parallaxImgSlide = gsap.timeline({
		scrollTrigger: {
			trigger: ".rs-steps",
			scrub: 1,
			start: "-50% top",
			end: "bottom+=20% bottom",
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
			end: "bottom+=20% bottom",
			// pin: 1,
			// markers: 1
		}
	});
	parallaxImgBottom.from('.rs-steps__column-bottom', {
		y: '300px',
	})
}

function animMobile() {

}

function animCommon() {
	const homeIntroBtns = document.querySelectorAll('.rs-btn');
	homeIntroBtns.forEach(homeIntroBtn => {
		gsap.to(homeIntroBtn.querySelector('.svg-wrapper svg path'), {
			duration: 1,
			delay: 0.5,
			strokeDashoffset: 0,
			stagger: 0,
			ease: 'linear',
			onComplete: function onComplete() {
				if (homeIntroBtn.classList.contains('_btn-primary')) {
					gsap.to(homeIntroBtn.querySelector('svg path'), {
						duration: 0.3,
						fill: 'rgb(99, 102, 241)',
						ease: 'linear',
						onComplete: function onComplete() {
							homeIntroBtn.classList.add('btn--active');
						}
					});
				}

				if (homeIntroBtn.classList.contains('_btn-gray-border')) {
					gsap.to(homeIntroBtn.querySelector('svg path'), {
						duration: 0.,
						ease: 'linear',
						onComplete: function onComplete() {
							homeIntroBtn.classList.add('btn--active');
						}
					});
				}

				if (homeIntroBtn.classList.contains('_btn-white')) {
					gsap.to(homeIntroBtn.querySelector('svg path'), {
						duration: 0.3,
						fill: 'rgb(255, 255, 255)',
						ease: 'linear',
						onComplete: function onComplete() {
							homeIntroBtn.classList.add('btn--active');
						}
					});
				}

				if (homeIntroBtn.classList.contains('_btn-primary-border')) {
					gsap.to(homeIntroBtn.querySelector('svg path'), {
						duration: 0.,
						ease: 'linear',
						onComplete: function onComplete() {
							homeIntroBtn.classList.add('btn--active');
						}
					});
				}

				gsap.to(homeIntroBtn.querySelector('span'), {
					duration: 0.5,
					autoAlpha: 1,
					ease: 'linear'
				});
			}
		});
	});

	/* MOVE SVG LINE */
	moveSvgDashed(".rs-about-product__line #dashed-about", ".rs-about-product__line #mask-about", ".rs-about-product");
	moveSvgDashed(".rs-reviews__line #dashed-reviews", ".rs-reviews__line #mask-reviews", ".rs-reviews");
	moveSvgDashed(".rs-services__line #dashed-services-1", ".rs-services__line #mask-services-1", ".rs-services");
	moveSvgDashed(".rs-services__line #dashed-services-2", ".rs-services__line #mask-services-2", ".rs-services");
	moveSvgDashed(".rs-services__line #dashed-services-3", ".rs-services__line #mask-services-3", ".rs-services");

	/* REVEAL ANIMATION */
	// text
	showContentOnScroll('.mrp-med-50', 0.5, 0.2, 'bottom-up');
	showContentOnScroll('.mrp-med-45', 0.5, 0.2, 'bottom-up');
	showContentOnScroll('.mrp-med-40', 0.5, 0.2, 'bottom-up');
	showContentOnScroll('.mrp-med-25', 0.5, 0.3, 'bottom-up');
	showContentOnScroll('.mrp-med-21', 0.5, 0.4, 'bottom-up');
	showContentOnScroll('.mrp-reg-25', 0.5, 0.3, 'bottom-up');
	showContentOnScroll('.mrp-reg-21', 0.5, 0.4, 'bottom-up');
	showContentOnScroll('.mrp-reg-18', 0.5, 0.5, 'bottom-up');
	// header
	showContentOnScroll('.rs-header__menu', 0.5, 0.2, 'fade');
	showContentOnScroll('.rs-header__logo', 0.5, 0.35, 'fade');
	showContentOnScroll('.rs-header__actions', 0.5, 0.5, 'fade');
	// banner
	showContentOnScroll('.rs-banner__buttons', 0.5, 0.5, 'bottom-up--every');
	// about
	showContentOnScroll('.rs-about-product__slide', 0.5, 0.2, 'right-left--every');
	showContentOnScroll('.rs-about-product__slider', 0.5, 0.2, 'right-left');
	showContentOnScroll('.rs-about-product__icon', 0.5, 0.15, 'bottom-up--every');
	// project
	showContentOnScroll('.rs-project__filter', 0.5, 1, 'bottom-up');
	showContentOnScroll('.rs-project__item', 0.5, 0.3, 'bottom-up--every');
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
}

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