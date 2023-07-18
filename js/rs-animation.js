window.onbeforeunload = function () {
	window.scrollTo(0, 0);
};

// SmoothScroll
SmoothScroll({
	animationTime: 500, // [ms]
	stepSize: 100, // [px]
	accelerationDelta: 50,  // 50
	accelerationMax: 3,   // 3
	touchpadSupport: false,
});

// ScrollReveal
window.sr = ScrollReveal({
	reset: true,
	duration: 500,
});
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
// banner
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
// about-product
sr.reveal(document.querySelector('.rs-about-product__slider'), {
	distance: '150px',
	origin: 'right',
	delay: 300,
})
// project
function animDesktop() {
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
const breakpoint = window.matchMedia('(min-width: 991.98px)');
const breakpointChecker = function () {
	if (breakpoint.matches === true) {
		return animDesktop();
	} else if (breakpoint.matches === false) {
		return animMobile();
	}
};
breakpoint.addListener(breakpointChecker);
breakpointChecker();
sr.reveal(document.querySelector('.rs-project .filter'), {
	distance: '50px',
	origin: 'bottom',
	delay: 300,
})
// steps
sr.reveal(document.querySelector('.rs-steps .mrp-med-45'), {
	distance: '50px',
	origin: 'left',
	delay: 200,
	reset: false,
})
// reviews
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
// about-product
sr.reveal(document.querySelector('.rs-services__slider'), {
	distance: '150px',
	origin: 'right',
	delay: 300,
})

// gsap ScrollTrigger
gsap.config({ trialWarn: false });
gsap.registerPlugin(ScrollTrigger)
// gsap.registerPlugin(drawSVGPlugin);
// console.clear();
/* COLOR CHANGER */
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
const parallaxImgMiddle = gsap.timeline({
	scrollTrigger: {
		trigger: ".rs-steps",
		scrub: 1,
		start: "-50% top",
		end: "bottom+=20% bottom",
		// pin: 1,
		// markers: 1
	}
});
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
parallaxImgTop.from('.rs-steps__column-top', {
	y: '-300px',
})
parallaxImgMiddle.from('.rs-steps__column-middle', {
	x: '300px',
	y: '-100px'
})
parallaxImgBottom.from('.rs-steps__column-bottom', {
	y: '300px',
})

const parallaxIcons = gsap.timeline({
	scrollTrigger: {
		trigger: ".rs-about-product",
		scrub: 1,
		start: "-50% top",
		end: "bottom+=20% bottom",
		// pin: 1,
		// markers: 1
	}
});
parallaxIcons.from('.rs-about-product__icon img', {
	autoAlpha: 0,
	y: '50px'
})

gsap.from(".rs-about-product svg path", {
	"--dashOffset": 300,
	delay: 1,
	scrollTrigger: {
		trigger: ".rs-services",
		start: "-60% 150%",
		end: "bottom+=80% bottom",
		scrub: 1,
		// markers: 1
	}
});

// gsap.from(".rs-reviews__line svg path", {
// 	"--dashOffset": 300,
// 	delay: 1,
// 	scrollTrigger: {
// 		trigger: ".rs-reviews",
// 		start: "-60% 150%",
// 		end: "bottom+=80% bottom",
// 		scrub: 1,
// 		// markers: 1
// 	}
// });

// gsap.from(".rs-services__line svg path", {
// 	"--dashOffset": 300,
// 	delay: 1,
// 	scrollTrigger: {
// 		trigger: ".rs-services",
// 		start: "-60% 150%",
// 		end: "bottom+=80% bottom",
// 		scrub: 1,
// 		// markers: 1
// 	}
// });

// const cards = gsap.utils.toArray(".pin-section");
// const spacer = 20;
// const minScale = 0.8;
// const distributor = gsap.utils.distribute({ base: minScale, amount: 0.2 });
// cards.forEach((card, index) => {
// 	const scaleVal = distributor(index, cards[index], cards);
// 	const tween = gsap.to(card, {
// 		scrollTrigger: {
// 			trigger: card,
// 			start: `top top`,
// 			scrub: true,
// 			// markers: true,
// 			invalidateOnRefresh: true
// 		},
// 		ease: "none",
// 		scale: scaleVal
// 	});
// 	ScrollTrigger.create({
// 		trigger: card,
// 		start: `top+=5% top+=5%`,
// 		endTrigger: '.pin-sections',
// 		end: `bottom bottom-=50%`,
// 		pin: true,
// 		pinSpacing: false,
// 		markers: true,
// 		id: 'pin',
// 		invalidateOnRefresh: true,
// 	});
// });

//========================================================================================================================================================
// Фикс анимации
function fixSR() {
	if (typeof (Event) === 'function') {
		// modern browsers
		window.dispatchEvent(new Event('resize'));
	} else {
		// for IE and other old browsers
		// causes deprecation warning on modern browsers
		var evt = window.document.createEvent('UIEvents');
		evt.initUIEvent('resize', true, false, window, 0);
		window.dispatchEvent(evt);
	}
}
setTimeout(() => {
	fixSR()
}, 100);