
window.onbeforeunload = function () {
	window.scrollTo(0, 0);
};
gsap.config({ trialWarn: false });
gsap.registerPlugin(ScrollTrigger)
// gsap.registerPlugin(drawSVGPlugin);
// console.clear();

// Scroll show elem
window.sr = ScrollReveal({
	reset: false,
	duration: 500,
});

// SmothScroll
SmoothScroll({
	animationTime: 800, // [ms]
	stepSize: 100, // [px]
	accelerationDelta: 50,  // 50
	accelerationMax: 3,   // 3
	touchpadSupport: false,
});

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

/* FADE ICONS */
function parallaxIcons(trigger, elem) {
	const parallaxIcons = gsap.timeline({
		scrollTrigger: {
			trigger: trigger,
			scrub: 1,
			start: "-50% top",
			end: "bottom+=20% bottom",
			// markers: 1
		}
	});
	parallaxIcons.from(elem, {
		autoAlpha: 0,
		y: '50px',
	})
}

function animDesktop() {
	/* BG-COLOR CHANGER */
	const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
	scrollColorElems.forEach((colorSection, i) => {
		const prevBg = i === 0 ? "" : scrollColorElems[i - 1].dataset.bgcolor;

		ScrollTrigger.create({
			trigger: colorSection,
			start: "top 50%",
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
	parallaxImgSlide.from('.rs-steps__column-middle', {
		x: '300px',
		y: '-100px'
	})
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


	const project_slide = document.querySelectorAll('.rs-project .rs-project__item');
	for (let i = 0; i < project_slide.length; i++) {
		sr.reveal(project_slide[i], {
			distance: '30px',
			origin: 'bottom',
			delay: 100 * i,
		})
	}

	const steps_item = document.querySelectorAll('.rs-steps .rs-steps__spollers_item');
	for (let i = 0; i < steps_item.length; i++) {
		sr.reveal(steps_item[i], {
			distance: '0px',
			opacity: 0,
			delay: 100 * i,
			reset: false,
		})


		const steps_title = steps_item[i].querySelector('.rs-steps__spollers_title');
		sr.reveal(steps_title, {
			distance: '50px',
			origin: 'left',
			delay: 100,
			reset: false,
		})

		const steps_footer = steps_item[i].querySelectorAll('.rs-steps__footer .rs-steps__list li');
		for (let i = 0; i < steps_footer.length; i++) {
			sr.reveal(steps_footer[i], {
				distance: '15px',
				origin: 'top',
				delay: 100 * i,
				reset: false,
			})
		}
	}
}

function animMobile() {
	const project_slider = document.querySelectorAll('.rs-project .rs-project__slider');
	for (let i = 0; i < project_slider.length; i++) {
		sr.reveal(project_slider[i], {
			distance: '30px',
			origin: 'bottom',
			delay: 100 * i,
		})
	}
}

function animCommon() {
	/* MOVE SVG LINE */
	moveSvgDashed(".rs-about-product__line #dashed-about", ".rs-about-product__line #mask-about", ".rs-about-product")
	moveSvgDashed(".rs-reviews__line #dashed-reviews", ".rs-reviews__line #mask-reviews", ".rs-reviews")
	moveSvgDashed(".rs-services__line #dashed-services-1", ".rs-services__line #mask-services-1", ".rs-services")
	moveSvgDashed(".rs-services__line #dashed-services-2", ".rs-services__line #mask-services-2", ".rs-services")
	moveSvgDashed(".rs-services__line #dashed-services-3", ".rs-services__line #mask-services-3", ".rs-services")

	/* FADE ICONS */
	parallaxIcons('.rs-about-product', '.rs-about-product__icon')
	parallaxIcons('.rs-services', '.rs-services__icon')

	// Scroll show elem
	const title45 = document.querySelectorAll('.mrp-med-45');
	for (let i = 0; i < title45.length; i++) {
		sr.reveal(title45[i], {
			distance: '50px',
			origin: 'left',
			delay: 100,
		})
	}

	const title40 = document.querySelectorAll('.mrp-med-40');
	for (let i = 0; i < title40.length; i++) {
		sr.reveal(title40[i], {
			distance: '50px',
			origin: 'left',
			delay: 100,
		})
	}

	sr.reveal(document.querySelector('.rs-banner__bg'), {
		distance: '30px',
		origin: 'top',
		delay: 100,
	})

	sr.reveal(document.querySelector('.rs-banner__body h1'), {
		distance: '50px',
		origin: 'left',
		delay: 200,
	})

	sr.reveal(document.querySelector('.rs-banner__body h5'), {
		distance: '50px',
		origin: 'left',
		delay: 300,
	})

	sr.reveal(document.querySelector('.rs-banner__buttons'), {
		distance: '50px',
		origin: 'left',
		delay: 400,
	})

	sr.reveal(document.querySelector('.rs-about-product__slider'), {
		distance: '150px',
		origin: 'right',
		delay: 300,
	})

	sr.reveal(document.querySelector('.rs-project .filter'), {
		distance: '50px',
		origin: 'bottom',
		delay: 300,
	})

	sr.reveal(document.querySelector('.rs-steps .mrp-med-45'), {
		distance: '50px',
		origin: 'left',
		delay: 200,
		reset: false,
	})

	sr.reveal(document.querySelector('.rs-reviews .rs-reviews__sticker'), {
		distance: '50px',
		origin: 'bottom',
		delay: 300,
	})

	sr.reveal(document.querySelector('.rs-reviews .rs-reviews__slider'), {
		distance: '50px',
		origin: 'left',
		delay: 200,
	})

	sr.reveal(document.querySelector('.rs-services__slider'), {
		distance: '150px',
		origin: 'right',
		delay: 300,
	})
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