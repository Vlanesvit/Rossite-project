(() => {
	"use strict";
	const modules_vnvModules = {};
	function ssr_window_esm_isObject(obj) {
		return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
	}
	function extend(target, src) {
		if (target === void 0) target = {};
		if (src === void 0) src = {};
		Object.keys(src).forEach((key => {
			if (typeof target[key] === "undefined") target[key] = src[key]; else if (ssr_window_esm_isObject(src[key]) && ssr_window_esm_isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
		}));
	}
	const ssrDocument = {
		body: {},
		addEventListener() { },
		removeEventListener() { },
		activeElement: {
			blur() { },
			nodeName: ""
		},
		querySelector() {
			return null;
		},
		querySelectorAll() {
			return [];
		},
		getElementById() {
			return null;
		},
		createEvent() {
			return {
				initEvent() { }
			};
		},
		createElement() {
			return {
				children: [],
				childNodes: [],
				style: {},
				setAttribute() { },
				getElementsByTagName() {
					return [];
				}
			};
		},
		createElementNS() {
			return {};
		},
		importNode() {
			return null;
		},
		location: {
			hash: "",
			host: "",
			hostname: "",
			href: "",
			origin: "",
			pathname: "",
			protocol: "",
			search: ""
		}
	};
	function ssr_window_esm_getDocument() {
		const doc = typeof document !== "undefined" ? document : {};
		extend(doc, ssrDocument);
		return doc;
	}
	const ssrWindow = {
		document: ssrDocument,
		navigator: {
			userAgent: ""
		},
		location: {
			hash: "",
			host: "",
			hostname: "",
			href: "",
			origin: "",
			pathname: "",
			protocol: "",
			search: ""
		},
		history: {
			replaceState() { },
			pushState() { },
			go() { },
			back() { }
		},
		CustomEvent: function CustomEvent() {
			return this;
		},
		addEventListener() { },
		removeEventListener() { },
		getComputedStyle() {
			return {
				getPropertyValue() {
					return "";
				}
			};
		},
		Image() { },
		Date() { },
		screen: {},
		setTimeout() { },
		clearTimeout() { },
		matchMedia() {
			return {};
		},
		requestAnimationFrame(callback) {
			if (typeof setTimeout === "undefined") {
				callback();
				return null;
			}
			return setTimeout(callback, 0);
		},
		cancelAnimationFrame(id) {
			if (typeof setTimeout === "undefined") return;
			clearTimeout(id);
		}
	};
	function ssr_window_esm_getWindow() {
		const win = typeof window !== "undefined" ? window : {};
		extend(win, ssrWindow);
		return win;
	}
	function utils_classesToTokens(classes) {
		if (classes === void 0) classes = "";
		return classes.trim().split(" ").filter((c => !!c.trim()));
	}
	function deleteProps(obj) {
		const object = obj;
		Object.keys(object).forEach((key => {
			try {
				object[key] = null;
			} catch (e) { }
			try {
				delete object[key];
			} catch (e) { }
		}));
	}
	function utils_nextTick(callback, delay) {
		if (delay === void 0) delay = 0;
		return setTimeout(callback, delay);
	}
	function utils_now() {
		return Date.now();
	}
	function utils_getComputedStyle(el) {
		const window = ssr_window_esm_getWindow();
		let style;
		if (window.getComputedStyle) style = window.getComputedStyle(el, null);
		if (!style && el.currentStyle) style = el.currentStyle;
		if (!style) style = el.style;
		return style;
	}
	function utils_getTranslate(el, axis) {
		if (axis === void 0) axis = "x";
		const window = ssr_window_esm_getWindow();
		let matrix;
		let curTransform;
		let transformMatrix;
		const curStyle = utils_getComputedStyle(el);
		if (window.WebKitCSSMatrix) {
			curTransform = curStyle.transform || curStyle.webkitTransform;
			if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
			transformMatrix = new window.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
		} else {
			transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
			matrix = transformMatrix.toString().split(",");
		}
		if (axis === "x") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
		if (axis === "y") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
		return curTransform || 0;
	}
	function utils_isObject(o) {
		return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
	}
	function isNode(node) {
		if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") return node instanceof HTMLElement;
		return node && (node.nodeType === 1 || node.nodeType === 11);
	}
	function utils_extend() {
		const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
		const noExtend = ["__proto__", "constructor", "prototype"];
		for (let i = 1; i < arguments.length; i += 1) {
			const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
			if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
				const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
				for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
					const nextKey = keysArray[nextIndex];
					const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
					if (desc !== void 0 && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
						to[nextKey] = {};
						if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
					} else to[nextKey] = nextSource[nextKey];
				}
			}
		}
		return to;
	}
	function utils_setCSSProperty(el, varName, varValue) {
		el.style.setProperty(varName, varValue);
	}
	function animateCSSModeScroll(_ref) {
		let { swiper, targetPosition, side } = _ref;
		const window = ssr_window_esm_getWindow();
		const startPosition = -swiper.translate;
		let startTime = null;
		let time;
		const duration = swiper.params.speed;
		swiper.wrapperEl.style.scrollSnapType = "none";
		window.cancelAnimationFrame(swiper.cssModeFrameID);
		const dir = targetPosition > startPosition ? "next" : "prev";
		const isOutOfBound = (current, target) => dir === "next" && current >= target || dir === "prev" && current <= target;
		const animate = () => {
			time = (new Date).getTime();
			if (startTime === null) startTime = time;
			const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
			const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
			let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
			if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
			swiper.wrapperEl.scrollTo({
				[side]: currentPosition
			});
			if (isOutOfBound(currentPosition, targetPosition)) {
				swiper.wrapperEl.style.overflow = "hidden";
				swiper.wrapperEl.style.scrollSnapType = "";
				setTimeout((() => {
					swiper.wrapperEl.style.overflow = "";
					swiper.wrapperEl.scrollTo({
						[side]: currentPosition
					});
				}));
				window.cancelAnimationFrame(swiper.cssModeFrameID);
				return;
			}
			swiper.cssModeFrameID = window.requestAnimationFrame(animate);
		};
		animate();
	}
	function utils_elementChildren(element, selector) {
		if (selector === void 0) selector = "";
		return [...element.children].filter((el => el.matches(selector)));
	}
	function showWarning(text) {
		try {
			console.warn(text);
			return;
		} catch (err) { }
	}
	function utils_createElement(tag, classes) {
		if (classes === void 0) classes = [];
		const el = document.createElement(tag);
		el.classList.add(...Array.isArray(classes) ? classes : utils_classesToTokens(classes));
		return el;
	}
	function elementPrevAll(el, selector) {
		const prevEls = [];
		while (el.previousElementSibling) {
			const prev = el.previousElementSibling;
			if (selector) {
				if (prev.matches(selector)) prevEls.push(prev);
			} else prevEls.push(prev);
			el = prev;
		}
		return prevEls;
	}
	function elementNextAll(el, selector) {
		const nextEls = [];
		while (el.nextElementSibling) {
			const next = el.nextElementSibling;
			if (selector) {
				if (next.matches(selector)) nextEls.push(next);
			} else nextEls.push(next);
			el = next;
		}
		return nextEls;
	}
	function elementStyle(el, prop) {
		const window = ssr_window_esm_getWindow();
		return window.getComputedStyle(el, null).getPropertyValue(prop);
	}
	function utils_elementIndex(el) {
		let child = el;
		let i;
		if (child) {
			i = 0;
			while ((child = child.previousSibling) !== null) if (child.nodeType === 1) i += 1;
			return i;
		}
		return;
	}
	function utils_elementParents(el, selector) {
		const parents = [];
		let parent = el.parentElement;
		while (parent) {
			if (selector) {
				if (parent.matches(selector)) parents.push(parent);
			} else parents.push(parent);
			parent = parent.parentElement;
		}
		return parents;
	}
	function elementOuterSize(el, size, includeMargins) {
		const window = ssr_window_esm_getWindow();
		if (includeMargins) return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
		return el.offsetWidth;
	}
	function utils_makeElementsArray(el) {
		return (Array.isArray(el) ? el : [el]).filter((e => !!e));
	}
	let support;
	function calcSupport() {
		const window = ssr_window_esm_getWindow();
		const document = ssr_window_esm_getDocument();
		return {
			smoothScroll: document.documentElement && document.documentElement.style && "scrollBehavior" in document.documentElement.style,
			touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch)
		};
	}
	function getSupport() {
		if (!support) support = calcSupport();
		return support;
	}
	let deviceCached;
	function calcDevice(_temp) {
		let { userAgent } = _temp === void 0 ? {} : _temp;
		const support = getSupport();
		const window = ssr_window_esm_getWindow();
		const platform = window.navigator.platform;
		const ua = userAgent || window.navigator.userAgent;
		const device = {
			ios: false,
			android: false
		};
		const screenWidth = window.screen.width;
		const screenHeight = window.screen.height;
		const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
		let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
		const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
		const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
		const windows = platform === "Win32";
		let macos = platform === "MacIntel";
		const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
		if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
			ipad = ua.match(/(Version)\/([\d.]+)/);
			if (!ipad) ipad = [0, 1, "13_0_0"];
			macos = false;
		}
		if (android && !windows) {
			device.os = "android";
			device.android = true;
		}
		if (ipad || iphone || ipod) {
			device.os = "ios";
			device.ios = true;
		}
		return device;
	}
	function getDevice(overrides) {
		if (overrides === void 0) overrides = {};
		if (!deviceCached) deviceCached = calcDevice(overrides);
		return deviceCached;
	}
	let browser;
	function calcBrowser() {
		const window = ssr_window_esm_getWindow();
		const device = getDevice();
		let needPerspectiveFix = false;
		function isSafari() {
			const ua = window.navigator.userAgent.toLowerCase();
			return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
		}
		if (isSafari()) {
			const ua = String(window.navigator.userAgent);
			if (ua.includes("Version/")) {
				const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num => Number(num)));
				needPerspectiveFix = major < 16 || major === 16 && minor < 2;
			}
		}
		const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent);
		const isSafariBrowser = isSafari();
		const need3dFix = isSafariBrowser || isWebView && device.ios;
		return {
			isSafari: needPerspectiveFix || isSafariBrowser,
			needPerspectiveFix,
			need3dFix,
			isWebView
		};
	}
	function getBrowser() {
		if (!browser) browser = calcBrowser();
		return browser;
	}
	function Resize(_ref) {
		let { swiper, on, emit } = _ref;
		const window = ssr_window_esm_getWindow();
		let observer = null;
		let animationFrame = null;
		const resizeHandler = () => {
			if (!swiper || swiper.destroyed || !swiper.initialized) return;
			emit("beforeResize");
			emit("resize");
		};
		const createObserver = () => {
			if (!swiper || swiper.destroyed || !swiper.initialized) return;
			observer = new ResizeObserver((entries => {
				animationFrame = window.requestAnimationFrame((() => {
					const { width, height } = swiper;
					let newWidth = width;
					let newHeight = height;
					entries.forEach((_ref2 => {
						let { contentBoxSize, contentRect, target } = _ref2;
						if (target && target !== swiper.el) return;
						newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
						newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
					}));
					if (newWidth !== width || newHeight !== height) resizeHandler();
				}));
			}));
			observer.observe(swiper.el);
		};
		const removeObserver = () => {
			if (animationFrame) window.cancelAnimationFrame(animationFrame);
			if (observer && observer.unobserve && swiper.el) {
				observer.unobserve(swiper.el);
				observer = null;
			}
		};
		const orientationChangeHandler = () => {
			if (!swiper || swiper.destroyed || !swiper.initialized) return;
			emit("orientationchange");
		};
		on("init", (() => {
			if (swiper.params.resizeObserver && typeof window.ResizeObserver !== "undefined") {
				createObserver();
				return;
			}
			window.addEventListener("resize", resizeHandler);
			window.addEventListener("orientationchange", orientationChangeHandler);
		}));
		on("destroy", (() => {
			removeObserver();
			window.removeEventListener("resize", resizeHandler);
			window.removeEventListener("orientationchange", orientationChangeHandler);
		}));
	}
	function Observer(_ref) {
		let { swiper, extendParams, on, emit } = _ref;
		const observers = [];
		const window = ssr_window_esm_getWindow();
		const attach = function (target, options) {
			if (options === void 0) options = {};
			const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
			const observer = new ObserverFunc((mutations => {
				if (swiper.__preventObserver__) return;
				if (mutations.length === 1) {
					emit("observerUpdate", mutations[0]);
					return;
				}
				const observerUpdate = function observerUpdate() {
					emit("observerUpdate", mutations[0]);
				};
				if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
			}));
			observer.observe(target, {
				attributes: typeof options.attributes === "undefined" ? true : options.attributes,
				childList: typeof options.childList === "undefined" ? true : options.childList,
				characterData: typeof options.characterData === "undefined" ? true : options.characterData
			});
			observers.push(observer);
		};
		const init = () => {
			if (!swiper.params.observer) return;
			if (swiper.params.observeParents) {
				const containerParents = utils_elementParents(swiper.hostEl);
				for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
			}
			attach(swiper.hostEl, {
				childList: swiper.params.observeSlideChildren
			});
			attach(swiper.wrapperEl, {
				attributes: false
			});
		};
		const destroy = () => {
			observers.forEach((observer => {
				observer.disconnect();
			}));
			observers.splice(0, observers.length);
		};
		extendParams({
			observer: false,
			observeParents: false,
			observeSlideChildren: false
		});
		on("init", init);
		on("destroy", destroy);
	}
	var eventsEmitter = {
		on(events, handler, priority) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (typeof handler !== "function") return self;
			const method = priority ? "unshift" : "push";
			events.split(" ").forEach((event => {
				if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
				self.eventsListeners[event][method](handler);
			}));
			return self;
		},
		once(events, handler, priority) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (typeof handler !== "function") return self;
			function onceHandler() {
				self.off(events, onceHandler);
				if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
				for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
				handler.apply(self, args);
			}
			onceHandler.__emitterProxy = handler;
			return self.on(events, onceHandler, priority);
		},
		onAny(handler, priority) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (typeof handler !== "function") return self;
			const method = priority ? "unshift" : "push";
			if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
			return self;
		},
		offAny(handler) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (!self.eventsAnyListeners) return self;
			const index = self.eventsAnyListeners.indexOf(handler);
			if (index >= 0) self.eventsAnyListeners.splice(index, 1);
			return self;
		},
		off(events, handler) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (!self.eventsListeners) return self;
			events.split(" ").forEach((event => {
				if (typeof handler === "undefined") self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
					if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
				}));
			}));
			return self;
		},
		emit() {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (!self.eventsListeners) return self;
			let events;
			let data;
			let context;
			for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
			if (typeof args[0] === "string" || Array.isArray(args[0])) {
				events = args[0];
				data = args.slice(1, args.length);
				context = self;
			} else {
				events = args[0].events;
				data = args[0].data;
				context = args[0].context || self;
			}
			data.unshift(context);
			const eventsArray = Array.isArray(events) ? events : events.split(" ");
			eventsArray.forEach((event => {
				if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
					eventHandler.apply(context, [event, ...data]);
				}));
				if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
					eventHandler.apply(context, data);
				}));
			}));
			return self;
		}
	};
	function updateSize() {
		const swiper = this;
		let width;
		let height;
		const el = swiper.el;
		if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) width = swiper.params.width; else width = el.clientWidth;
		if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) height = swiper.params.height; else height = el.clientHeight;
		if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) return;
		width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
		height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
		if (Number.isNaN(width)) width = 0;
		if (Number.isNaN(height)) height = 0;
		Object.assign(swiper, {
			width,
			height,
			size: swiper.isHorizontal() ? width : height
		});
	}
	function updateSlides() {
		const swiper = this;
		function getDirectionPropertyValue(node, label) {
			return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
		}
		const params = swiper.params;
		const { wrapperEl, slidesEl, size: swiperSize, rtlTranslate: rtl, wrongRTL } = swiper;
		const isVirtual = swiper.virtual && params.virtual.enabled;
		const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
		const slides = utils_elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
		const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
		let snapGrid = [];
		const slidesGrid = [];
		const slidesSizesGrid = [];
		let offsetBefore = params.slidesOffsetBefore;
		if (typeof offsetBefore === "function") offsetBefore = params.slidesOffsetBefore.call(swiper);
		let offsetAfter = params.slidesOffsetAfter;
		if (typeof offsetAfter === "function") offsetAfter = params.slidesOffsetAfter.call(swiper);
		const previousSnapGridLength = swiper.snapGrid.length;
		const previousSlidesGridLength = swiper.slidesGrid.length;
		let spaceBetween = params.spaceBetween;
		let slidePosition = -offsetBefore;
		let prevSlideSize = 0;
		let index = 0;
		if (typeof swiperSize === "undefined") return;
		if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize; else if (typeof spaceBetween === "string") spaceBetween = parseFloat(spaceBetween);
		swiper.virtualSize = -spaceBetween;
		slides.forEach((slideEl => {
			if (rtl) slideEl.style.marginLeft = ""; else slideEl.style.marginRight = "";
			slideEl.style.marginBottom = "";
			slideEl.style.marginTop = "";
		}));
		if (params.centeredSlides && params.cssMode) {
			utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
			utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
		}
		const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
		if (gridEnabled) swiper.grid.initSlides(slides); else if (swiper.grid) swiper.grid.unsetSlides();
		let slideSize;
		const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key => typeof params.breakpoints[key].slidesPerView !== "undefined")).length > 0;
		for (let i = 0; i < slidesLength; i += 1) {
			slideSize = 0;
			let slide;
			if (slides[i]) slide = slides[i];
			if (gridEnabled) swiper.grid.updateSlide(i, slide, slides);
			if (slides[i] && elementStyle(slide, "display") === "none") continue;
			if (params.slidesPerView === "auto") {
				if (shouldResetSlideSize) slides[i].style[swiper.getDirectionLabel("width")] = ``;
				const slideStyles = getComputedStyle(slide);
				const currentTransform = slide.style.transform;
				const currentWebKitTransform = slide.style.webkitTransform;
				if (currentTransform) slide.style.transform = "none";
				if (currentWebKitTransform) slide.style.webkitTransform = "none";
				if (params.roundLengths) slideSize = swiper.isHorizontal() ? elementOuterSize(slide, "width", true) : elementOuterSize(slide, "height", true); else {
					const width = getDirectionPropertyValue(slideStyles, "width");
					const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
					const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
					const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
					const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
					const boxSizing = slideStyles.getPropertyValue("box-sizing");
					if (boxSizing && boxSizing === "border-box") slideSize = width + marginLeft + marginRight; else {
						const { clientWidth, offsetWidth } = slide;
						slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
					}
				}
				if (currentTransform) slide.style.transform = currentTransform;
				if (currentWebKitTransform) slide.style.webkitTransform = currentWebKitTransform;
				if (params.roundLengths) slideSize = Math.floor(slideSize);
			} else {
				slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
				if (params.roundLengths) slideSize = Math.floor(slideSize);
				if (slides[i]) slides[i].style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
			}
			if (slides[i]) slides[i].swiperSlideSize = slideSize;
			slidesSizesGrid.push(slideSize);
			if (params.centeredSlides) {
				slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
				if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
				if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
				if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
				if (params.roundLengths) slidePosition = Math.floor(slidePosition);
				if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
				slidesGrid.push(slidePosition);
			} else {
				if (params.roundLengths) slidePosition = Math.floor(slidePosition);
				if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
				slidesGrid.push(slidePosition);
				slidePosition = slidePosition + slideSize + spaceBetween;
			}
			swiper.virtualSize += slideSize + spaceBetween;
			prevSlideSize = slideSize;
			index += 1;
		}
		swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
		if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
		if (params.setWrapperSize) wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
		if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid);
		if (!params.centeredSlides) {
			const newSlidesGrid = [];
			for (let i = 0; i < snapGrid.length; i += 1) {
				let slidesGridItem = snapGrid[i];
				if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
				if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
			}
			snapGrid = newSlidesGrid;
			if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
		}
		if (isVirtual && params.loop) {
			const size = slidesSizesGrid[0] + spaceBetween;
			if (params.slidesPerGroup > 1) {
				const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
				const groupSize = size * params.slidesPerGroup;
				for (let i = 0; i < groups; i += 1) snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
			}
			for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
				if (params.slidesPerGroup === 1) snapGrid.push(snapGrid[snapGrid.length - 1] + size);
				slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
				swiper.virtualSize += size;
			}
		}
		if (snapGrid.length === 0) snapGrid = [0];
		if (spaceBetween !== 0) {
			const key = swiper.isHorizontal() && rtl ? "marginLeft" : swiper.getDirectionLabel("marginRight");
			slides.filter(((_, slideIndex) => {
				if (!params.cssMode || params.loop) return true;
				if (slideIndex === slides.length - 1) return false;
				return true;
			})).forEach((slideEl => {
				slideEl.style[key] = `${spaceBetween}px`;
			}));
		}
		if (params.centeredSlides && params.centeredSlidesBounds) {
			let allSlidesSize = 0;
			slidesSizesGrid.forEach((slideSizeValue => {
				allSlidesSize += slideSizeValue + (spaceBetween || 0);
			}));
			allSlidesSize -= spaceBetween;
			const maxSnap = allSlidesSize - swiperSize;
			snapGrid = snapGrid.map((snap => {
				if (snap <= 0) return -offsetBefore;
				if (snap > maxSnap) return maxSnap + offsetAfter;
				return snap;
			}));
		}
		if (params.centerInsufficientSlides) {
			let allSlidesSize = 0;
			slidesSizesGrid.forEach((slideSizeValue => {
				allSlidesSize += slideSizeValue + (spaceBetween || 0);
			}));
			allSlidesSize -= spaceBetween;
			if (allSlidesSize < swiperSize) {
				const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
				snapGrid.forEach(((snap, snapIndex) => {
					snapGrid[snapIndex] = snap - allSlidesOffset;
				}));
				slidesGrid.forEach(((snap, snapIndex) => {
					slidesGrid[snapIndex] = snap + allSlidesOffset;
				}));
			}
		}
		Object.assign(swiper, {
			slides,
			snapGrid,
			slidesGrid,
			slidesSizesGrid
		});
		if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
			utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
			utils_setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
			const addToSnapGrid = -swiper.snapGrid[0];
			const addToSlidesGrid = -swiper.slidesGrid[0];
			swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
			swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
		}
		if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
		if (snapGrid.length !== previousSnapGridLength) {
			if (swiper.params.watchOverflow) swiper.checkOverflow();
			swiper.emit("snapGridLengthChange");
		}
		if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
		if (params.watchSlidesProgress) swiper.updateSlidesOffset();
		swiper.emit("slidesUpdated");
		if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
			const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
			const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
			if (slidesLength <= params.maxBackfaceHiddenSlides) {
				if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
			} else if (hasClassBackfaceClassAdded) swiper.el.classList.remove(backFaceHiddenClass);
		}
	}
	function updateAutoHeight(speed) {
		const swiper = this;
		const activeSlides = [];
		const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
		let newHeight = 0;
		let i;
		if (typeof speed === "number") swiper.setTransition(speed); else if (speed === true) swiper.setTransition(swiper.params.speed);
		const getSlideByIndex = index => {
			if (isVirtual) return swiper.slides[swiper.getSlideIndexByData(index)];
			return swiper.slides[index];
		};
		if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || []).forEach((slide => {
			activeSlides.push(slide);
		})); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
			const index = swiper.activeIndex + i;
			if (index > swiper.slides.length && !isVirtual) break;
			activeSlides.push(getSlideByIndex(index));
		} else activeSlides.push(getSlideByIndex(swiper.activeIndex));
		for (i = 0; i < activeSlides.length; i += 1) if (typeof activeSlides[i] !== "undefined") {
			const height = activeSlides[i].offsetHeight;
			newHeight = height > newHeight ? height : newHeight;
		}
		if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
	}
	function updateSlidesOffset() {
		const swiper = this;
		const slides = swiper.slides;
		const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
		for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
	}
	function updateSlidesProgress(translate) {
		if (translate === void 0) translate = this && this.translate || 0;
		const swiper = this;
		const params = swiper.params;
		const { slides, rtlTranslate: rtl, snapGrid } = swiper;
		if (slides.length === 0) return;
		if (typeof slides[0].swiperSlideOffset === "undefined") swiper.updateSlidesOffset();
		let offsetCenter = -translate;
		if (rtl) offsetCenter = translate;
		slides.forEach((slideEl => {
			slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass);
		}));
		swiper.visibleSlidesIndexes = [];
		swiper.visibleSlides = [];
		let spaceBetween = params.spaceBetween;
		if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size; else if (typeof spaceBetween === "string") spaceBetween = parseFloat(spaceBetween);
		for (let i = 0; i < slides.length; i += 1) {
			const slide = slides[i];
			let slideOffset = slide.swiperSlideOffset;
			if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
			const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
			const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
			const slideBefore = -(offsetCenter - slideOffset);
			const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
			const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
			const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
			if (isVisible) {
				swiper.visibleSlides.push(slide);
				swiper.visibleSlidesIndexes.push(i);
				slides[i].classList.add(params.slideVisibleClass);
			}
			if (isFullyVisible) slides[i].classList.add(params.slideFullyVisibleClass);
			slide.progress = rtl ? -slideProgress : slideProgress;
			slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
		}
	}
	function updateProgress(translate) {
		const swiper = this;
		if (typeof translate === "undefined") {
			const multiplier = swiper.rtlTranslate ? -1 : 1;
			translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
		}
		const params = swiper.params;
		const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
		let { progress, isBeginning, isEnd, progressLoop } = swiper;
		const wasBeginning = isBeginning;
		const wasEnd = isEnd;
		if (translatesDiff === 0) {
			progress = 0;
			isBeginning = true;
			isEnd = true;
		} else {
			progress = (translate - swiper.minTranslate()) / translatesDiff;
			const isBeginningRounded = Math.abs(translate - swiper.minTranslate()) < 1;
			const isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
			isBeginning = isBeginningRounded || progress <= 0;
			isEnd = isEndRounded || progress >= 1;
			if (isBeginningRounded) progress = 0;
			if (isEndRounded) progress = 1;
		}
		if (params.loop) {
			const firstSlideIndex = swiper.getSlideIndexByData(0);
			const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
			const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
			const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
			const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
			const translateAbs = Math.abs(translate);
			if (translateAbs >= firstSlideTranslate) progressLoop = (translateAbs - firstSlideTranslate) / translateMax; else progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
			if (progressLoop > 1) progressLoop -= 1;
		}
		Object.assign(swiper, {
			progress,
			progressLoop,
			isBeginning,
			isEnd
		});
		if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
		if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
		if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
		if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
		swiper.emit("progress", progress);
	}
	function updateSlidesClasses() {
		const swiper = this;
		const { slides, params, slidesEl, activeIndex } = swiper;
		const isVirtual = swiper.virtual && params.virtual.enabled;
		const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
		const getFilteredSlide = selector => utils_elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
		slides.forEach((slideEl => {
			slideEl.classList.remove(params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
		}));
		let activeSlide;
		let prevSlide;
		let nextSlide;
		if (isVirtual) if (params.loop) {
			let slideIndex = activeIndex - swiper.virtual.slidesBefore;
			if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
			if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
			activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
		} else activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`); else if (gridEnabled) {
			activeSlide = slides.filter((slideEl => slideEl.column === activeIndex))[0];
			nextSlide = slides.filter((slideEl => slideEl.column === activeIndex + 1))[0];
			prevSlide = slides.filter((slideEl => slideEl.column === activeIndex - 1))[0];
		} else activeSlide = slides[activeIndex];
		if (activeSlide) {
			activeSlide.classList.add(params.slideActiveClass);
			if (gridEnabled) {
				if (nextSlide) nextSlide.classList.add(params.slideNextClass);
				if (prevSlide) prevSlide.classList.add(params.slidePrevClass);
			} else {
				nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
				if (params.loop && !nextSlide) nextSlide = slides[0];
				if (nextSlide) nextSlide.classList.add(params.slideNextClass);
				prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
				if (params.loop && !prevSlide === 0) prevSlide = slides[slides.length - 1];
				if (prevSlide) prevSlide.classList.add(params.slidePrevClass);
			}
		}
		swiper.emitSlidesClasses();
	}
	const processLazyPreloader = (swiper, imageEl) => {
		if (!swiper || swiper.destroyed || !swiper.params) return;
		const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
		const slideEl = imageEl.closest(slideSelector());
		if (slideEl) {
			let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
			if (!lazyEl && swiper.isElement) if (slideEl.shadowRoot) lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`); else requestAnimationFrame((() => {
				if (slideEl.shadowRoot) {
					lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
					if (lazyEl) lazyEl.remove();
				}
			}));
			if (lazyEl) lazyEl.remove();
		}
	};
	const unlazy = (swiper, index) => {
		if (!swiper.slides[index]) return;
		const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
		if (imageEl) imageEl.removeAttribute("loading");
	};
	const preload = swiper => {
		if (!swiper || swiper.destroyed || !swiper.params) return;
		let amount = swiper.params.lazyPreloadPrevNext;
		const len = swiper.slides.length;
		if (!len || !amount || amount < 0) return;
		amount = Math.min(amount, len);
		const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
		const activeIndex = swiper.activeIndex;
		if (swiper.params.grid && swiper.params.grid.rows > 1) {
			const activeColumn = activeIndex;
			const preloadColumns = [activeColumn - amount];
			preloadColumns.push(...Array.from({
				length: amount
			}).map(((_, i) => activeColumn + slidesPerView + i)));
			swiper.slides.forEach(((slideEl, i) => {
				if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i);
			}));
			return;
		}
		const slideIndexLastInView = activeIndex + slidesPerView - 1;
		if (swiper.params.rewind || swiper.params.loop) for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
			const realIndex = (i % len + len) % len;
			if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
		} else for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) unlazy(swiper, i);
	};
	function getActiveIndexByTranslate(swiper) {
		const { slidesGrid, params } = swiper;
		const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
		let activeIndex;
		for (let i = 0; i < slidesGrid.length; i += 1) if (typeof slidesGrid[i + 1] !== "undefined") {
			if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
		} else if (translate >= slidesGrid[i]) activeIndex = i;
		if (params.normalizeSlideIndex) if (activeIndex < 0 || typeof activeIndex === "undefined") activeIndex = 0;
		return activeIndex;
	}
	function updateActiveIndex(newActiveIndex) {
		const swiper = this;
		const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
		const { snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex } = swiper;
		let activeIndex = newActiveIndex;
		let snapIndex;
		const getVirtualRealIndex = aIndex => {
			let realIndex = aIndex - swiper.virtual.slidesBefore;
			if (realIndex < 0) realIndex = swiper.virtual.slides.length + realIndex;
			if (realIndex >= swiper.virtual.slides.length) realIndex -= swiper.virtual.slides.length;
			return realIndex;
		};
		if (typeof activeIndex === "undefined") activeIndex = getActiveIndexByTranslate(swiper);
		if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
			const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
			snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
		}
		if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
		if (activeIndex === previousIndex && !swiper.params.loop) {
			if (snapIndex !== previousSnapIndex) {
				swiper.snapIndex = snapIndex;
				swiper.emit("snapIndexChange");
			}
			return;
		}
		if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
			swiper.realIndex = getVirtualRealIndex(activeIndex);
			return;
		}
		const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
		let realIndex;
		if (swiper.virtual && params.virtual.enabled && params.loop) realIndex = getVirtualRealIndex(activeIndex); else if (gridEnabled) {
			const firstSlideInColumn = swiper.slides.filter((slideEl => slideEl.column === activeIndex))[0];
			let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute("data-swiper-slide-index"), 10);
			if (Number.isNaN(activeSlideIndex)) activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
			realIndex = Math.floor(activeSlideIndex / params.grid.rows);
		} else if (swiper.slides[activeIndex]) {
			const slideIndex = swiper.slides[activeIndex].getAttribute("data-swiper-slide-index");
			if (slideIndex) realIndex = parseInt(slideIndex, 10); else realIndex = activeIndex;
		} else realIndex = activeIndex;
		Object.assign(swiper, {
			previousSnapIndex,
			snapIndex,
			previousRealIndex,
			realIndex,
			previousIndex,
			activeIndex
		});
		if (swiper.initialized) preload(swiper);
		swiper.emit("activeIndexChange");
		swiper.emit("snapIndexChange");
		if (swiper.initialized || swiper.params.runCallbacksOnInit) {
			if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
			swiper.emit("slideChange");
		}
	}
	function updateClickedSlide(el, path) {
		const swiper = this;
		const params = swiper.params;
		let slide = el.closest(`.${params.slideClass}, swiper-slide`);
		if (!slide && swiper.isElement && path && path.length > 1 && path.includes(el)) [...path.slice(path.indexOf(el) + 1, path.length)].forEach((pathEl => {
			if (!slide && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) slide = pathEl;
		}));
		let slideFound = false;
		let slideIndex;
		if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
			slideFound = true;
			slideIndex = i;
			break;
		}
		if (slide && slideFound) {
			swiper.clickedSlide = slide;
			if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(slide.getAttribute("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
		} else {
			swiper.clickedSlide = void 0;
			swiper.clickedIndex = void 0;
			return;
		}
		if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
	}
	var update = {
		updateSize,
		updateSlides,
		updateAutoHeight,
		updateSlidesOffset,
		updateSlidesProgress,
		updateProgress,
		updateSlidesClasses,
		updateActiveIndex,
		updateClickedSlide
	};
	function getSwiperTranslate(axis) {
		if (axis === void 0) axis = this.isHorizontal() ? "x" : "y";
		const swiper = this;
		const { params, rtlTranslate: rtl, translate, wrapperEl } = swiper;
		if (params.virtualTranslate) return rtl ? -translate : translate;
		if (params.cssMode) return translate;
		let currentTranslate = utils_getTranslate(wrapperEl, axis);
		currentTranslate += swiper.cssOverflowAdjustment();
		if (rtl) currentTranslate = -currentTranslate;
		return currentTranslate || 0;
	}
	function setTranslate(translate, byController) {
		const swiper = this;
		const { rtlTranslate: rtl, params, wrapperEl, progress } = swiper;
		let x = 0;
		let y = 0;
		const z = 0;
		if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
		if (params.roundLengths) {
			x = Math.floor(x);
			y = Math.floor(y);
		}
		swiper.previousTranslate = swiper.translate;
		swiper.translate = swiper.isHorizontal() ? x : y;
		if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) {
			if (swiper.isHorizontal()) x -= swiper.cssOverflowAdjustment(); else y -= swiper.cssOverflowAdjustment();
			wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
		}
		let newProgress;
		const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
		if (translatesDiff === 0) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
		if (newProgress !== progress) swiper.updateProgress(translate);
		swiper.emit("setTranslate", swiper.translate, byController);
	}
	function minTranslate() {
		return -this.snapGrid[0];
	}
	function maxTranslate() {
		return -this.snapGrid[this.snapGrid.length - 1];
	}
	function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
		if (translate === void 0) translate = 0;
		if (speed === void 0) speed = this.params.speed;
		if (runCallbacks === void 0) runCallbacks = true;
		if (translateBounds === void 0) translateBounds = true;
		const swiper = this;
		const { params, wrapperEl } = swiper;
		if (swiper.animating && params.preventInteractionOnTransition) return false;
		const minTranslate = swiper.minTranslate();
		const maxTranslate = swiper.maxTranslate();
		let newTranslate;
		if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
		swiper.updateProgress(newTranslate);
		if (params.cssMode) {
			const isH = swiper.isHorizontal();
			if (speed === 0) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
				if (!swiper.support.smoothScroll) {
					animateCSSModeScroll({
						swiper,
						targetPosition: -newTranslate,
						side: isH ? "left" : "top"
					});
					return true;
				}
				wrapperEl.scrollTo({
					[isH ? "left" : "top"]: -newTranslate,
					behavior: "smooth"
				});
			}
			return true;
		}
		if (speed === 0) {
			swiper.setTransition(0);
			swiper.setTranslate(newTranslate);
			if (runCallbacks) {
				swiper.emit("beforeTransitionStart", speed, internal);
				swiper.emit("transitionEnd");
			}
		} else {
			swiper.setTransition(speed);
			swiper.setTranslate(newTranslate);
			if (runCallbacks) {
				swiper.emit("beforeTransitionStart", speed, internal);
				swiper.emit("transitionStart");
			}
			if (!swiper.animating) {
				swiper.animating = true;
				if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
					if (!swiper || swiper.destroyed) return;
					if (e.target !== this) return;
					swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
					swiper.onTranslateToWrapperTransitionEnd = null;
					delete swiper.onTranslateToWrapperTransitionEnd;
					if (runCallbacks) swiper.emit("transitionEnd");
				};
				swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
			}
		}
		return true;
	}
	var translate = {
		getTranslate: getSwiperTranslate,
		setTranslate,
		minTranslate,
		maxTranslate,
		translateTo
	};
	function setTransition(duration, byController) {
		const swiper = this;
		if (!swiper.params.cssMode) {
			swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
			swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : "";
		}
		swiper.emit("setTransition", duration, byController);
	}
	function transitionEmit(_ref) {
		let { swiper, runCallbacks, direction, step } = _ref;
		const { activeIndex, previousIndex } = swiper;
		let dir = direction;
		if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
		swiper.emit(`transition${step}`);
		if (runCallbacks && activeIndex !== previousIndex) {
			if (dir === "reset") {
				swiper.emit(`slideResetTransition${step}`);
				return;
			}
			swiper.emit(`slideChangeTransition${step}`);
			if (dir === "next") swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
		}
	}
	function transitionStart(runCallbacks, direction) {
		if (runCallbacks === void 0) runCallbacks = true;
		const swiper = this;
		const { params } = swiper;
		if (params.cssMode) return;
		if (params.autoHeight) swiper.updateAutoHeight();
		transitionEmit({
			swiper,
			runCallbacks,
			direction,
			step: "Start"
		});
	}
	function transitionEnd(runCallbacks, direction) {
		if (runCallbacks === void 0) runCallbacks = true;
		const swiper = this;
		const { params } = swiper;
		swiper.animating = false;
		if (params.cssMode) return;
		swiper.setTransition(0);
		transitionEmit({
			swiper,
			runCallbacks,
			direction,
			step: "End"
		});
	}
	var transition = {
		setTransition,
		transitionStart,
		transitionEnd
	};
	function slideTo(index, speed, runCallbacks, internal, initial) {
		if (index === void 0) index = 0;
		if (speed === void 0) speed = this.params.speed;
		if (runCallbacks === void 0) runCallbacks = true;
		if (typeof index === "string") index = parseInt(index, 10);
		const swiper = this;
		let slideIndex = index;
		if (slideIndex < 0) slideIndex = 0;
		const { params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled } = swiper;
		if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial || swiper.destroyed) return false;
		const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
		let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
		if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
		const translate = -snapGrid[snapIndex];
		if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
			const normalizedTranslate = -Math.floor(translate * 100);
			const normalizedGrid = Math.floor(slidesGrid[i] * 100);
			const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
			if (typeof slidesGrid[i + 1] !== "undefined") {
				if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
			} else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
		}
		if (swiper.initialized && slideIndex !== activeIndex) {
			if (!swiper.allowSlideNext && (rtl ? translate > swiper.translate && translate > swiper.minTranslate() : translate < swiper.translate && translate < swiper.minTranslate())) return false;
			if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
		}
		if (slideIndex !== (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
		swiper.updateProgress(translate);
		let direction;
		if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
		if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
			swiper.updateActiveIndex(slideIndex);
			if (params.autoHeight) swiper.updateAutoHeight();
			swiper.updateSlidesClasses();
			if (params.effect !== "slide") swiper.setTranslate(translate);
			if (direction !== "reset") {
				swiper.transitionStart(runCallbacks, direction);
				swiper.transitionEnd(runCallbacks, direction);
			}
			return false;
		}
		if (params.cssMode) {
			const isH = swiper.isHorizontal();
			const t = rtl ? translate : -translate;
			if (speed === 0) {
				const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
				if (isVirtual) {
					swiper.wrapperEl.style.scrollSnapType = "none";
					swiper._immediateVirtual = true;
				}
				if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
					swiper._cssModeVirtualInitialSet = true;
					requestAnimationFrame((() => {
						wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
					}));
				} else wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
				if (isVirtual) requestAnimationFrame((() => {
					swiper.wrapperEl.style.scrollSnapType = "";
					swiper._immediateVirtual = false;
				}));
			} else {
				if (!swiper.support.smoothScroll) {
					animateCSSModeScroll({
						swiper,
						targetPosition: t,
						side: isH ? "left" : "top"
					});
					return true;
				}
				wrapperEl.scrollTo({
					[isH ? "left" : "top"]: t,
					behavior: "smooth"
				});
			}
			return true;
		}
		swiper.setTransition(speed);
		swiper.setTranslate(translate);
		swiper.updateActiveIndex(slideIndex);
		swiper.updateSlidesClasses();
		swiper.emit("beforeTransitionStart", speed, internal);
		swiper.transitionStart(runCallbacks, direction);
		if (speed === 0) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
			swiper.animating = true;
			if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
				if (!swiper || swiper.destroyed) return;
				if (e.target !== this) return;
				swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
				swiper.onSlideToWrapperTransitionEnd = null;
				delete swiper.onSlideToWrapperTransitionEnd;
				swiper.transitionEnd(runCallbacks, direction);
			};
			swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
		}
		return true;
	}
	function slideToLoop(index, speed, runCallbacks, internal) {
		if (index === void 0) index = 0;
		if (speed === void 0) speed = this.params.speed;
		if (runCallbacks === void 0) runCallbacks = true;
		if (typeof index === "string") {
			const indexAsNumber = parseInt(index, 10);
			index = indexAsNumber;
		}
		const swiper = this;
		if (swiper.destroyed) return;
		const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
		let newIndex = index;
		if (swiper.params.loop) if (swiper.virtual && swiper.params.virtual.enabled) newIndex += swiper.virtual.slidesBefore; else {
			let targetSlideIndex;
			if (gridEnabled) {
				const slideIndex = newIndex * swiper.params.grid.rows;
				targetSlideIndex = swiper.slides.filter((slideEl => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex))[0].column;
			} else targetSlideIndex = swiper.getSlideIndexByData(newIndex);
			const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
			const { centeredSlides } = swiper.params;
			let slidesPerView = swiper.params.slidesPerView;
			if (slidesPerView === "auto") slidesPerView = swiper.slidesPerViewDynamic(); else {
				slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
				if (centeredSlides && slidesPerView % 2 === 0) slidesPerView += 1;
			}
			let needLoopFix = cols - targetSlideIndex < slidesPerView;
			if (centeredSlides) needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
			if (needLoopFix) {
				const direction = centeredSlides ? targetSlideIndex < swiper.activeIndex ? "prev" : "next" : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? "next" : "prev";
				swiper.loopFix({
					direction,
					slideTo: true,
					activeSlideIndex: direction === "next" ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
					slideRealIndex: direction === "next" ? swiper.realIndex : void 0
				});
			}
			if (gridEnabled) {
				const slideIndex = newIndex * swiper.params.grid.rows;
				newIndex = swiper.slides.filter((slideEl => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex))[0].column;
			} else newIndex = swiper.getSlideIndexByData(newIndex);
		}
		requestAnimationFrame((() => {
			swiper.slideTo(newIndex, speed, runCallbacks, internal);
		}));
		return swiper;
	}
	function slideNext(speed, runCallbacks, internal) {
		if (speed === void 0) speed = this.params.speed;
		if (runCallbacks === void 0) runCallbacks = true;
		const swiper = this;
		const { enabled, params, animating } = swiper;
		if (!enabled || swiper.destroyed) return swiper;
		let perGroup = params.slidesPerGroup;
		if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
		const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
		const isVirtual = swiper.virtual && params.virtual.enabled;
		if (params.loop) {
			if (animating && !isVirtual && params.loopPreventsSliding) return false;
			swiper.loopFix({
				direction: "next"
			});
			swiper._clientLeft = swiper.wrapperEl.clientLeft;
			if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
				requestAnimationFrame((() => {
					swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
				}));
				return true;
			}
		}
		if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
		return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
	}
	function slidePrev(speed, runCallbacks, internal) {
		if (speed === void 0) speed = this.params.speed;
		if (runCallbacks === void 0) runCallbacks = true;
		const swiper = this;
		const { params, snapGrid, slidesGrid, rtlTranslate, enabled, animating } = swiper;
		if (!enabled || swiper.destroyed) return swiper;
		const isVirtual = swiper.virtual && params.virtual.enabled;
		if (params.loop) {
			if (animating && !isVirtual && params.loopPreventsSliding) return false;
			swiper.loopFix({
				direction: "prev"
			});
			swiper._clientLeft = swiper.wrapperEl.clientLeft;
		}
		const translate = rtlTranslate ? swiper.translate : -swiper.translate;
		function normalize(val) {
			if (val < 0) return -Math.floor(Math.abs(val));
			return Math.floor(val);
		}
		const normalizedTranslate = normalize(translate);
		const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
		let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
		if (typeof prevSnap === "undefined" && params.cssMode) {
			let prevSnapIndex;
			snapGrid.forEach(((snap, snapIndex) => {
				if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
			}));
			if (typeof prevSnapIndex !== "undefined") prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
		}
		let prevIndex = 0;
		if (typeof prevSnap !== "undefined") {
			prevIndex = slidesGrid.indexOf(prevSnap);
			if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
			if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
				prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
				prevIndex = Math.max(prevIndex, 0);
			}
		}
		if (params.rewind && swiper.isBeginning) {
			const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
			return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
		} else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
			requestAnimationFrame((() => {
				swiper.slideTo(prevIndex, speed, runCallbacks, internal);
			}));
			return true;
		}
		return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
	}
	function slideReset(speed, runCallbacks, internal) {
		if (speed === void 0) speed = this.params.speed;
		if (runCallbacks === void 0) runCallbacks = true;
		const swiper = this;
		if (swiper.destroyed) return;
		return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
	}
	function slideToClosest(speed, runCallbacks, internal, threshold) {
		if (speed === void 0) speed = this.params.speed;
		if (runCallbacks === void 0) runCallbacks = true;
		if (threshold === void 0) threshold = .5;
		const swiper = this;
		if (swiper.destroyed) return;
		let index = swiper.activeIndex;
		const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
		const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
		const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
		if (translate >= swiper.snapGrid[snapIndex]) {
			const currentSnap = swiper.snapGrid[snapIndex];
			const nextSnap = swiper.snapGrid[snapIndex + 1];
			if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
		} else {
			const prevSnap = swiper.snapGrid[snapIndex - 1];
			const currentSnap = swiper.snapGrid[snapIndex];
			if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
		}
		index = Math.max(index, 0);
		index = Math.min(index, swiper.slidesGrid.length - 1);
		return swiper.slideTo(index, speed, runCallbacks, internal);
	}
	function slideToClickedSlide() {
		const swiper = this;
		if (swiper.destroyed) return;
		const { params, slidesEl } = swiper;
		const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
		let slideToIndex = swiper.clickedIndex;
		let realIndex;
		const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
		if (params.loop) {
			if (swiper.animating) return;
			realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
			if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
				swiper.loopFix();
				slideToIndex = swiper.getSlideIndex(utils_elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
				utils_nextTick((() => {
					swiper.slideTo(slideToIndex);
				}));
			} else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
				swiper.loopFix();
				slideToIndex = swiper.getSlideIndex(utils_elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
				utils_nextTick((() => {
					swiper.slideTo(slideToIndex);
				}));
			} else swiper.slideTo(slideToIndex);
		} else swiper.slideTo(slideToIndex);
	}
	var slide = {
		slideTo,
		slideToLoop,
		slideNext,
		slidePrev,
		slideReset,
		slideToClosest,
		slideToClickedSlide
	};
	function loopCreate(slideRealIndex) {
		const swiper = this;
		const { params, slidesEl } = swiper;
		if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
		const initSlides = () => {
			const slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
			slides.forEach(((el, index) => {
				el.setAttribute("data-swiper-slide-index", index);
			}));
		};
		const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
		const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
		const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
		const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
		const addBlankSlides = amountOfSlides => {
			for (let i = 0; i < amountOfSlides; i += 1) {
				const slideEl = swiper.isElement ? utils_createElement("swiper-slide", [params.slideBlankClass]) : utils_createElement("div", [params.slideClass, params.slideBlankClass]);
				swiper.slidesEl.append(slideEl);
			}
		};
		if (shouldFillGroup) {
			if (params.loopAddBlankSlides) {
				const slidesToAdd = slidesPerGroup - swiper.slides.length % slidesPerGroup;
				addBlankSlides(slidesToAdd);
				swiper.recalcSlides();
				swiper.updateSlides();
			} else showWarning("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
			initSlides();
		} else if (shouldFillGrid) {
			if (params.loopAddBlankSlides) {
				const slidesToAdd = params.grid.rows - swiper.slides.length % params.grid.rows;
				addBlankSlides(slidesToAdd);
				swiper.recalcSlides();
				swiper.updateSlides();
			} else showWarning("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
			initSlides();
		} else initSlides();
		swiper.loopFix({
			slideRealIndex,
			direction: params.centeredSlides ? void 0 : "next"
		});
	}
	function loopFix(_temp) {
		let { slideRealIndex, slideTo = true, direction, setTranslate, activeSlideIndex, byController, byMousewheel } = _temp === void 0 ? {} : _temp;
		const swiper = this;
		if (!swiper.params.loop) return;
		swiper.emit("beforeLoopFix");
		const { slides, allowSlidePrev, allowSlideNext, slidesEl, params } = swiper;
		const { centeredSlides } = params;
		swiper.allowSlidePrev = true;
		swiper.allowSlideNext = true;
		if (swiper.virtual && params.virtual.enabled) {
			if (slideTo) if (!params.centeredSlides && swiper.snapIndex === 0) swiper.slideTo(swiper.virtual.slides.length, 0, false, true); else if (params.centeredSlides && swiper.snapIndex < params.slidesPerView) swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true); else if (swiper.snapIndex === swiper.snapGrid.length - 1) swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
			swiper.allowSlidePrev = allowSlidePrev;
			swiper.allowSlideNext = allowSlideNext;
			swiper.emit("loopFix");
			return;
		}
		let slidesPerView = params.slidesPerView;
		if (slidesPerView === "auto") slidesPerView = swiper.slidesPerViewDynamic(); else {
			slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
			if (centeredSlides && slidesPerView % 2 === 0) slidesPerView += 1;
		}
		const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
		let loopedSlides = slidesPerGroup;
		if (loopedSlides % slidesPerGroup !== 0) loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
		loopedSlides += params.loopAdditionalSlides;
		swiper.loopedSlides = loopedSlides;
		const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
		if (slides.length < slidesPerView + loopedSlides) showWarning("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled and not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters"); else if (gridEnabled && params.grid.fill === "row") showWarning("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
		const prependSlidesIndexes = [];
		const appendSlidesIndexes = [];
		let activeIndex = swiper.activeIndex;
		if (typeof activeSlideIndex === "undefined") activeSlideIndex = swiper.getSlideIndex(slides.filter((el => el.classList.contains(params.slideActiveClass)))[0]); else activeIndex = activeSlideIndex;
		const isNext = direction === "next" || !direction;
		const isPrev = direction === "prev" || !direction;
		let slidesPrepended = 0;
		let slidesAppended = 0;
		const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
		const activeColIndex = gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex;
		const activeColIndexWithShift = activeColIndex + (centeredSlides && typeof setTranslate === "undefined" ? -slidesPerView / 2 + .5 : 0);
		if (activeColIndexWithShift < loopedSlides) {
			slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
			for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
				const index = i - Math.floor(i / cols) * cols;
				if (gridEnabled) {
					const colIndexToPrepend = cols - index - 1;
					for (let i = slides.length - 1; i >= 0; i -= 1) if (slides[i].column === colIndexToPrepend) prependSlidesIndexes.push(i);
				} else prependSlidesIndexes.push(cols - index - 1);
			}
		} else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
			slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
			for (let i = 0; i < slidesAppended; i += 1) {
				const index = i - Math.floor(i / cols) * cols;
				if (gridEnabled) slides.forEach(((slide, slideIndex) => {
					if (slide.column === index) appendSlidesIndexes.push(slideIndex);
				})); else appendSlidesIndexes.push(index);
			}
		}
		swiper.__preventObserver__ = true;
		requestAnimationFrame((() => {
			swiper.__preventObserver__ = false;
		}));
		if (isPrev) prependSlidesIndexes.forEach((index => {
			slides[index].swiperLoopMoveDOM = true;
			slidesEl.prepend(slides[index]);
			slides[index].swiperLoopMoveDOM = false;
		}));
		if (isNext) appendSlidesIndexes.forEach((index => {
			slides[index].swiperLoopMoveDOM = true;
			slidesEl.append(slides[index]);
			slides[index].swiperLoopMoveDOM = false;
		}));
		swiper.recalcSlides();
		if (params.slidesPerView === "auto") swiper.updateSlides(); else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) swiper.slides.forEach(((slide, slideIndex) => {
			swiper.grid.updateSlide(slideIndex, slide, swiper.slides);
		}));
		if (params.watchSlidesProgress) swiper.updateSlidesOffset();
		if (slideTo) if (prependSlidesIndexes.length > 0 && isPrev) {
			if (typeof slideRealIndex === "undefined") {
				const currentSlideTranslate = swiper.slidesGrid[activeIndex];
				const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
				const diff = newSlideTranslate - currentSlideTranslate;
				if (byMousewheel) swiper.setTranslate(swiper.translate - diff); else {
					swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
					if (setTranslate) {
						swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
						swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
					}
				}
			} else if (setTranslate) {
				const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
				swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
				swiper.touchEventsData.currentTranslate = swiper.translate;
			}
		} else if (appendSlidesIndexes.length > 0 && isNext) if (typeof slideRealIndex === "undefined") {
			const currentSlideTranslate = swiper.slidesGrid[activeIndex];
			const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
			const diff = newSlideTranslate - currentSlideTranslate;
			if (byMousewheel) swiper.setTranslate(swiper.translate - diff); else {
				swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
				if (setTranslate) {
					swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
					swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
				}
			}
		} else {
			const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
			swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
		}
		swiper.allowSlidePrev = allowSlidePrev;
		swiper.allowSlideNext = allowSlideNext;
		if (swiper.controller && swiper.controller.control && !byController) {
			const loopParams = {
				slideRealIndex,
				direction,
				setTranslate,
				activeSlideIndex,
				byController: true
			};
			if (Array.isArray(swiper.controller.control)) swiper.controller.control.forEach((c => {
				if (!c.destroyed && c.params.loop) c.loopFix({
					...loopParams,
					slideTo: c.params.slidesPerView === params.slidesPerView ? slideTo : false
				});
			})); else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) swiper.controller.control.loopFix({
				...loopParams,
				slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo : false
			});
		}
		swiper.emit("loopFix");
	}
	function loopDestroy() {
		const swiper = this;
		const { params, slidesEl } = swiper;
		if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
		swiper.recalcSlides();
		const newSlidesOrder = [];
		swiper.slides.forEach((slideEl => {
			const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
			newSlidesOrder[index] = slideEl;
		}));
		swiper.slides.forEach((slideEl => {
			slideEl.removeAttribute("data-swiper-slide-index");
		}));
		newSlidesOrder.forEach((slideEl => {
			slidesEl.append(slideEl);
		}));
		swiper.recalcSlides();
		swiper.slideTo(swiper.realIndex, 0);
	}
	var loop = {
		loopCreate,
		loopFix,
		loopDestroy
	};
	function setGrabCursor(moving) {
		const swiper = this;
		if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
		const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
		if (swiper.isElement) swiper.__preventObserver__ = true;
		el.style.cursor = "move";
		el.style.cursor = moving ? "grabbing" : "grab";
		if (swiper.isElement) requestAnimationFrame((() => {
			swiper.__preventObserver__ = false;
		}));
	}
	function unsetGrabCursor() {
		const swiper = this;
		if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
		if (swiper.isElement) swiper.__preventObserver__ = true;
		swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
		if (swiper.isElement) requestAnimationFrame((() => {
			swiper.__preventObserver__ = false;
		}));
	}
	var grabCursor = {
		setGrabCursor,
		unsetGrabCursor
	};
	function closestElement(selector, base) {
		if (base === void 0) base = this;
		function __closestFrom(el) {
			if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
			if (el.assignedSlot) el = el.assignedSlot;
			const found = el.closest(selector);
			if (!found && !el.getRootNode) return null;
			return found || __closestFrom(el.getRootNode().host);
		}
		return __closestFrom(base);
	}
	function preventEdgeSwipe(swiper, event, startX) {
		const window = ssr_window_esm_getWindow();
		const { params } = swiper;
		const edgeSwipeDetection = params.edgeSwipeDetection;
		const edgeSwipeThreshold = params.edgeSwipeThreshold;
		if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
			if (edgeSwipeDetection === "prevent") {
				event.preventDefault();
				return true;
			}
			return false;
		}
		return true;
	}
	function onTouchStart(event) {
		const swiper = this;
		const document = ssr_window_esm_getDocument();
		let e = event;
		if (e.originalEvent) e = e.originalEvent;
		const data = swiper.touchEventsData;
		if (e.type === "pointerdown") {
			if (data.pointerId !== null && data.pointerId !== e.pointerId) return;
			data.pointerId = e.pointerId;
		} else if (e.type === "touchstart" && e.targetTouches.length === 1) data.touchId = e.targetTouches[0].identifier;
		if (e.type === "touchstart") {
			preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
			return;
		}
		const { params, touches, enabled } = swiper;
		if (!enabled) return;
		if (!params.simulateTouch && e.pointerType === "mouse") return;
		if (swiper.animating && params.preventInteractionOnTransition) return;
		if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
		let targetEl = e.target;
		if (params.touchEventsTarget === "wrapper") if (!swiper.wrapperEl.contains(targetEl)) return;
		if ("which" in e && e.which === 3) return;
		if ("button" in e && e.button > 0) return;
		if (data.isTouched && data.isMoved) return;
		const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
		const eventPath = e.composedPath ? e.composedPath() : e.path;
		if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) targetEl = eventPath[0];
		const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
		const isTargetShadow = !!(e.target && e.target.shadowRoot);
		if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
			swiper.allowClick = true;
			return;
		}
		if (params.swipeHandler) if (!targetEl.closest(params.swipeHandler)) return;
		touches.currentX = e.pageX;
		touches.currentY = e.pageY;
		const startX = touches.currentX;
		const startY = touches.currentY;
		if (!preventEdgeSwipe(swiper, e, startX)) return;
		Object.assign(data, {
			isTouched: true,
			isMoved: false,
			allowTouchCallbacks: true,
			isScrolling: void 0,
			startMoving: void 0
		});
		touches.startX = startX;
		touches.startY = startY;
		data.touchStartTime = utils_now();
		swiper.allowClick = true;
		swiper.updateSize();
		swiper.swipeDirection = void 0;
		if (params.threshold > 0) data.allowThresholdMove = false;
		let preventDefault = true;
		if (targetEl.matches(data.focusableElements)) {
			preventDefault = false;
			if (targetEl.nodeName === "SELECT") data.isTouched = false;
		}
		if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== targetEl) document.activeElement.blur();
		const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
		if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) e.preventDefault();
		if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
		swiper.emit("touchStart", e);
	}
	function onTouchMove(event) {
		const document = ssr_window_esm_getDocument();
		const swiper = this;
		const data = swiper.touchEventsData;
		const { params, touches, rtlTranslate: rtl, enabled } = swiper;
		if (!enabled) return;
		if (!params.simulateTouch && event.pointerType === "mouse") return;
		let e = event;
		if (e.originalEvent) e = e.originalEvent;
		if (e.type === "pointermove") {
			if (data.touchId !== null) return;
			const id = e.pointerId;
			if (id !== data.pointerId) return;
		}
		let targetTouch;
		if (e.type === "touchmove") {
			targetTouch = [...e.changedTouches].filter((t => t.identifier === data.touchId))[0];
			if (!targetTouch || targetTouch.identifier !== data.touchId) return;
		} else targetTouch = e;
		if (!data.isTouched) {
			if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
			return;
		}
		const pageX = targetTouch.pageX;
		const pageY = targetTouch.pageY;
		if (e.preventedByNestedSwiper) {
			touches.startX = pageX;
			touches.startY = pageY;
			return;
		}
		if (!swiper.allowTouchMove) {
			if (!e.target.matches(data.focusableElements)) swiper.allowClick = false;
			if (data.isTouched) {
				Object.assign(touches, {
					startX: pageX,
					startY: pageY,
					currentX: pageX,
					currentY: pageY
				});
				data.touchStartTime = utils_now();
			}
			return;
		}
		if (params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
			if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
				data.isTouched = false;
				data.isMoved = false;
				return;
			}
		} else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
		if (document.activeElement) if (e.target === document.activeElement && e.target.matches(data.focusableElements)) {
			data.isMoved = true;
			swiper.allowClick = false;
			return;
		}
		if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
		touches.previousX = touches.currentX;
		touches.previousY = touches.currentY;
		touches.currentX = pageX;
		touches.currentY = pageY;
		const diffX = touches.currentX - touches.startX;
		const diffY = touches.currentY - touches.startY;
		if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
		if (typeof data.isScrolling === "undefined") {
			let touchAngle;
			if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
				touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
				data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
			}
		}
		if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
		if (typeof data.startMoving === "undefined") if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
		if (data.isScrolling) {
			data.isTouched = false;
			return;
		}
		if (!data.startMoving) return;
		swiper.allowClick = false;
		if (!params.cssMode && e.cancelable) e.preventDefault();
		if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
		let diff = swiper.isHorizontal() ? diffX : diffY;
		let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
		if (params.oneWayMovement) {
			diff = Math.abs(diff) * (rtl ? 1 : -1);
			touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
		}
		touches.diff = diff;
		diff *= params.touchRatio;
		if (rtl) {
			diff = -diff;
			touchesDiff = -touchesDiff;
		}
		const prevTouchesDirection = swiper.touchesDirection;
		swiper.swipeDirection = diff > 0 ? "prev" : "next";
		swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
		const isLoop = swiper.params.loop && !params.cssMode;
		const allowLoopFix = swiper.touchesDirection === "next" && swiper.allowSlideNext || swiper.touchesDirection === "prev" && swiper.allowSlidePrev;
		if (!data.isMoved) {
			if (isLoop && allowLoopFix) swiper.loopFix({
				direction: swiper.swipeDirection
			});
			data.startTranslate = swiper.getTranslate();
			swiper.setTransition(0);
			if (swiper.animating) {
				const evt = new window.CustomEvent("transitionend", {
					bubbles: true,
					cancelable: true
				});
				swiper.wrapperEl.dispatchEvent(evt);
			}
			data.allowMomentumBounce = false;
			if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(true);
			swiper.emit("sliderFirstMove", e);
		}
		let loopFixed;
		(new Date).getTime();
		if (data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
			Object.assign(touches, {
				startX: pageX,
				startY: pageY,
				currentX: pageX,
				currentY: pageY,
				startTranslate: data.currentTranslate
			});
			data.loopSwapReset = true;
			data.startTranslate = data.currentTranslate;
			return;
		}
		swiper.emit("sliderMove", e);
		data.isMoved = true;
		data.currentTranslate = diff + data.startTranslate;
		let disableParentSwiper = true;
		let resistanceRatio = params.resistanceRatio;
		if (params.touchReleaseOnEdges) resistanceRatio = 0;
		if (diff > 0) {
			if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] : swiper.minTranslate())) swiper.loopFix({
				direction: "prev",
				setTranslate: true,
				activeSlideIndex: 0
			});
			if (data.currentTranslate > swiper.minTranslate()) {
				disableParentSwiper = false;
				if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
			}
		} else if (diff < 0) {
			if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] : swiper.maxTranslate())) swiper.loopFix({
				direction: "next",
				setTranslate: true,
				activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
			});
			if (data.currentTranslate < swiper.maxTranslate()) {
				disableParentSwiper = false;
				if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
			}
		}
		if (disableParentSwiper) e.preventedByNestedSwiper = true;
		if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
		if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
		if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
		if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
			if (!data.allowThresholdMove) {
				data.allowThresholdMove = true;
				touches.startX = touches.currentX;
				touches.startY = touches.currentY;
				data.currentTranslate = data.startTranslate;
				touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
				return;
			}
		} else {
			data.currentTranslate = data.startTranslate;
			return;
		}
		if (!params.followFinger || params.cssMode) return;
		if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
			swiper.updateActiveIndex();
			swiper.updateSlidesClasses();
		}
		if (params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
		swiper.updateProgress(data.currentTranslate);
		swiper.setTranslate(data.currentTranslate);
	}
	function onTouchEnd(event) {
		const swiper = this;
		const data = swiper.touchEventsData;
		let e = event;
		if (e.originalEvent) e = e.originalEvent;
		let targetTouch;
		const isTouchEvent = e.type === "touchend" || e.type === "touchcancel";
		if (!isTouchEvent) {
			if (data.touchId !== null) return;
			if (e.pointerId !== data.pointerId) return;
			targetTouch = e;
		} else {
			targetTouch = [...e.changedTouches].filter((t => t.identifier === data.touchId))[0];
			if (!targetTouch || targetTouch.identifier !== data.touchId) return;
		}
		if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(e.type)) {
			const proceed = ["pointercancel", "contextmenu"].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView);
			if (!proceed) return;
		}
		data.pointerId = null;
		data.touchId = null;
		const { params, touches, rtlTranslate: rtl, slidesGrid, enabled } = swiper;
		if (!enabled) return;
		if (!params.simulateTouch && e.pointerType === "mouse") return;
		if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
		data.allowTouchCallbacks = false;
		if (!data.isTouched) {
			if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
			data.isMoved = false;
			data.startMoving = false;
			return;
		}
		if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(false);
		const touchEndTime = utils_now();
		const timeDiff = touchEndTime - data.touchStartTime;
		if (swiper.allowClick) {
			const pathTree = e.path || e.composedPath && e.composedPath();
			swiper.updateClickedSlide(pathTree && pathTree[0] || e.target, pathTree);
			swiper.emit("tap click", e);
			if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
		}
		data.lastClickTime = utils_now();
		utils_nextTick((() => {
			if (!swiper.destroyed) swiper.allowClick = true;
		}));
		if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
			data.isTouched = false;
			data.isMoved = false;
			data.startMoving = false;
			return;
		}
		data.isTouched = false;
		data.isMoved = false;
		data.startMoving = false;
		let currentPos;
		if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
		if (params.cssMode) return;
		if (params.freeMode && params.freeMode.enabled) {
			swiper.freeMode.onTouchEnd({
				currentPos
			});
			return;
		}
		const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
		let stopIndex = 0;
		let groupSize = swiper.slidesSizesGrid[0];
		for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
			const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
			if (typeof slidesGrid[i + increment] !== "undefined") {
				if (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
					stopIndex = i;
					groupSize = slidesGrid[i + increment] - slidesGrid[i];
				}
			} else if (swipeToLast || currentPos >= slidesGrid[i]) {
				stopIndex = i;
				groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
			}
		}
		let rewindFirstIndex = null;
		let rewindLastIndex = null;
		if (params.rewind) if (swiper.isBeginning) rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
		const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
		const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
		if (timeDiff > params.longSwipesMs) {
			if (!params.longSwipes) {
				swiper.slideTo(swiper.activeIndex);
				return;
			}
			if (swiper.swipeDirection === "next") if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
			if (swiper.swipeDirection === "prev") if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
		} else {
			if (!params.shortSwipes) {
				swiper.slideTo(swiper.activeIndex);
				return;
			}
			const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
			if (!isNavButtonTarget) {
				if (swiper.swipeDirection === "next") swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
				if (swiper.swipeDirection === "prev") swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
			} else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
		}
	}
	function onResize() {
		const swiper = this;
		const { params, el } = swiper;
		if (el && el.offsetWidth === 0) return;
		if (params.breakpoints) swiper.setBreakpoint();
		const { allowSlideNext, allowSlidePrev, snapGrid } = swiper;
		const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
		swiper.allowSlideNext = true;
		swiper.allowSlidePrev = true;
		swiper.updateSize();
		swiper.updateSlides();
		swiper.updateSlidesClasses();
		const isVirtualLoop = isVirtual && params.loop;
		if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else if (swiper.params.loop && !isVirtual) swiper.slideToLoop(swiper.realIndex, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
		if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
			clearTimeout(swiper.autoplay.resizeTimeout);
			swiper.autoplay.resizeTimeout = setTimeout((() => {
				if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.resume();
			}), 500);
		}
		swiper.allowSlidePrev = allowSlidePrev;
		swiper.allowSlideNext = allowSlideNext;
		if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
	}
	function onClick(e) {
		const swiper = this;
		if (!swiper.enabled) return;
		if (!swiper.allowClick) {
			if (swiper.params.preventClicks) e.preventDefault();
			if (swiper.params.preventClicksPropagation && swiper.animating) {
				e.stopPropagation();
				e.stopImmediatePropagation();
			}
		}
	}
	function onScroll() {
		const swiper = this;
		const { wrapperEl, rtlTranslate, enabled } = swiper;
		if (!enabled) return;
		swiper.previousTranslate = swiper.translate;
		if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
		if (swiper.translate === 0) swiper.translate = 0;
		swiper.updateActiveIndex();
		swiper.updateSlidesClasses();
		let newProgress;
		const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
		if (translatesDiff === 0) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
		if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
		swiper.emit("setTranslate", swiper.translate, false);
	}
	function onLoad(e) {
		const swiper = this;
		processLazyPreloader(swiper, e.target);
		if (swiper.params.cssMode || swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight) return;
		swiper.update();
	}
	function onDocumentTouchStart() {
		const swiper = this;
		if (swiper.documentTouchHandlerProceeded) return;
		swiper.documentTouchHandlerProceeded = true;
		if (swiper.params.touchReleaseOnEdges) swiper.el.style.touchAction = "auto";
	}
	const events = (swiper, method) => {
		const document = ssr_window_esm_getDocument();
		const { params, el, wrapperEl, device } = swiper;
		const capture = !!params.nested;
		const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
		const swiperMethod = method;
		document[domMethod]("touchstart", swiper.onDocumentTouchStart, {
			passive: false,
			capture
		});
		el[domMethod]("touchstart", swiper.onTouchStart, {
			passive: false
		});
		el[domMethod]("pointerdown", swiper.onTouchStart, {
			passive: false
		});
		document[domMethod]("touchmove", swiper.onTouchMove, {
			passive: false,
			capture
		});
		document[domMethod]("pointermove", swiper.onTouchMove, {
			passive: false,
			capture
		});
		document[domMethod]("touchend", swiper.onTouchEnd, {
			passive: true
		});
		document[domMethod]("pointerup", swiper.onTouchEnd, {
			passive: true
		});
		document[domMethod]("pointercancel", swiper.onTouchEnd, {
			passive: true
		});
		document[domMethod]("touchcancel", swiper.onTouchEnd, {
			passive: true
		});
		document[domMethod]("pointerout", swiper.onTouchEnd, {
			passive: true
		});
		document[domMethod]("pointerleave", swiper.onTouchEnd, {
			passive: true
		});
		document[domMethod]("contextmenu", swiper.onTouchEnd, {
			passive: true
		});
		if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
		if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
		if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
		el[domMethod]("load", swiper.onLoad, {
			capture: true
		});
	};
	function attachEvents() {
		const swiper = this;
		const { params } = swiper;
		swiper.onTouchStart = onTouchStart.bind(swiper);
		swiper.onTouchMove = onTouchMove.bind(swiper);
		swiper.onTouchEnd = onTouchEnd.bind(swiper);
		swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
		if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
		swiper.onClick = onClick.bind(swiper);
		swiper.onLoad = onLoad.bind(swiper);
		events(swiper, "on");
	}
	function detachEvents() {
		const swiper = this;
		events(swiper, "off");
	}
	var events$1 = {
		attachEvents,
		detachEvents
	};
	const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
	function setBreakpoint() {
		const swiper = this;
		const { realIndex, initialized, params, el } = swiper;
		const breakpoints = params.breakpoints;
		if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return;
		const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
		if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
		const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
		const breakpointParams = breakpointOnlyParams || swiper.originalParams;
		const wasMultiRow = isGridEnabled(swiper, params);
		const isMultiRow = isGridEnabled(swiper, breakpointParams);
		const wasEnabled = params.enabled;
		if (wasMultiRow && !isMultiRow) {
			el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
			swiper.emitContainerClasses();
		} else if (!wasMultiRow && isMultiRow) {
			el.classList.add(`${params.containerModifierClass}grid`);
			if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") el.classList.add(`${params.containerModifierClass}grid-column`);
			swiper.emitContainerClasses();
		}
		["navigation", "pagination", "scrollbar"].forEach((prop => {
			if (typeof breakpointParams[prop] === "undefined") return;
			const wasModuleEnabled = params[prop] && params[prop].enabled;
			const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
			if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
			if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
		}));
		const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
		const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
		const wasLoop = params.loop;
		if (directionChanged && initialized) swiper.changeDirection();
		utils_extend(swiper.params, breakpointParams);
		const isEnabled = swiper.params.enabled;
		const hasLoop = swiper.params.loop;
		Object.assign(swiper, {
			allowTouchMove: swiper.params.allowTouchMove,
			allowSlideNext: swiper.params.allowSlideNext,
			allowSlidePrev: swiper.params.allowSlidePrev
		});
		if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
		swiper.currentBreakpoint = breakpoint;
		swiper.emit("_beforeBreakpoint", breakpointParams);
		if (initialized) if (needsReLoop) {
			swiper.loopDestroy();
			swiper.loopCreate(realIndex);
			swiper.updateSlides();
		} else if (!wasLoop && hasLoop) {
			swiper.loopCreate(realIndex);
			swiper.updateSlides();
		} else if (wasLoop && !hasLoop) swiper.loopDestroy();
		swiper.emit("breakpoint", breakpointParams);
	}
	function getBreakpoint(breakpoints, base, containerEl) {
		if (base === void 0) base = "window";
		if (!breakpoints || base === "container" && !containerEl) return;
		let breakpoint = false;
		const window = ssr_window_esm_getWindow();
		const currentHeight = base === "window" ? window.innerHeight : containerEl.clientHeight;
		const points = Object.keys(breakpoints).map((point => {
			if (typeof point === "string" && point.indexOf("@") === 0) {
				const minRatio = parseFloat(point.substr(1));
				const value = currentHeight * minRatio;
				return {
					value,
					point
				};
			}
			return {
				value: point,
				point
			};
		}));
		points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
		for (let i = 0; i < points.length; i += 1) {
			const { point, value } = points[i];
			if (base === "window") {
				if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
			} else if (value <= containerEl.clientWidth) breakpoint = point;
		}
		return breakpoint || "max";
	}
	var breakpoints = {
		setBreakpoint,
		getBreakpoint
	};
	function prepareClasses(entries, prefix) {
		const resultClasses = [];
		entries.forEach((item => {
			if (typeof item === "object") Object.keys(item).forEach((classNames => {
				if (item[classNames]) resultClasses.push(prefix + classNames);
			})); else if (typeof item === "string") resultClasses.push(prefix + item);
		}));
		return resultClasses;
	}
	function addClasses() {
		const swiper = this;
		const { classNames, params, rtl, el, device } = swiper;
		const suffixes = prepareClasses(["initialized", params.direction, {
			"free-mode": swiper.params.freeMode && params.freeMode.enabled
		}, {
				autoheight: params.autoHeight
			}, {
				rtl
			}, {
				grid: params.grid && params.grid.rows > 1
			}, {
				"grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
			}, {
				android: device.android
			}, {
				ios: device.ios
			}, {
				"css-mode": params.cssMode
			}, {
				centered: params.cssMode && params.centeredSlides
			}, {
				"watch-progress": params.watchSlidesProgress
			}], params.containerModifierClass);
		classNames.push(...suffixes);
		el.classList.add(...classNames);
		swiper.emitContainerClasses();
	}
	function removeClasses() {
		const swiper = this;
		const { el, classNames } = swiper;
		el.classList.remove(...classNames);
		swiper.emitContainerClasses();
	}
	var classes = {
		addClasses,
		removeClasses
	};
	function checkOverflow() {
		const swiper = this;
		const { isLocked: wasLocked, params } = swiper;
		const { slidesOffsetBefore } = params;
		if (slidesOffsetBefore) {
			const lastSlideIndex = swiper.slides.length - 1;
			const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
			swiper.isLocked = swiper.size > lastSlideRightEdge;
		} else swiper.isLocked = swiper.snapGrid.length === 1;
		if (params.allowSlideNext === true) swiper.allowSlideNext = !swiper.isLocked;
		if (params.allowSlidePrev === true) swiper.allowSlidePrev = !swiper.isLocked;
		if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
		if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
	}
	var checkOverflow$1 = {
		checkOverflow
	};
	var defaults = {
		init: true,
		direction: "horizontal",
		oneWayMovement: false,
		swiperElementNodeName: "SWIPER-CONTAINER",
		touchEventsTarget: "wrapper",
		initialSlide: 0,
		speed: 300,
		cssMode: false,
		updateOnWindowResize: true,
		resizeObserver: true,
		nested: false,
		createElements: false,
		eventsPrefix: "swiper",
		enabled: true,
		focusableElements: "input, select, option, textarea, button, video, label",
		width: null,
		height: null,
		preventInteractionOnTransition: false,
		userAgent: null,
		url: null,
		edgeSwipeDetection: false,
		edgeSwipeThreshold: 20,
		autoHeight: false,
		setWrapperSize: false,
		virtualTranslate: false,
		effect: "slide",
		breakpoints: void 0,
		breakpointsBase: "window",
		spaceBetween: 0,
		slidesPerView: 1,
		slidesPerGroup: 1,
		slidesPerGroupSkip: 0,
		slidesPerGroupAuto: false,
		centeredSlides: false,
		centeredSlidesBounds: false,
		slidesOffsetBefore: 0,
		slidesOffsetAfter: 0,
		normalizeSlideIndex: true,
		centerInsufficientSlides: false,
		watchOverflow: true,
		roundLengths: false,
		touchRatio: 1,
		touchAngle: 45,
		simulateTouch: true,
		shortSwipes: true,
		longSwipes: true,
		longSwipesRatio: .5,
		longSwipesMs: 300,
		followFinger: true,
		allowTouchMove: true,
		threshold: 5,
		touchMoveStopPropagation: false,
		touchStartPreventDefault: true,
		touchStartForcePreventDefault: false,
		touchReleaseOnEdges: false,
		uniqueNavElements: true,
		resistance: true,
		resistanceRatio: .85,
		watchSlidesProgress: false,
		grabCursor: false,
		preventClicks: true,
		preventClicksPropagation: true,
		slideToClickedSlide: false,
		loop: false,
		loopAddBlankSlides: true,
		loopAdditionalSlides: 0,
		loopPreventsSliding: true,
		rewind: false,
		allowSlidePrev: true,
		allowSlideNext: true,
		swipeHandler: null,
		noSwiping: true,
		noSwipingClass: "swiper-no-swiping",
		noSwipingSelector: null,
		passiveListeners: true,
		maxBackfaceHiddenSlides: 10,
		containerModifierClass: "swiper-",
		slideClass: "swiper-slide",
		slideBlankClass: "swiper-slide-blank",
		slideActiveClass: "swiper-slide-active",
		slideVisibleClass: "swiper-slide-visible",
		slideFullyVisibleClass: "swiper-slide-fully-visible",
		slideNextClass: "swiper-slide-next",
		slidePrevClass: "swiper-slide-prev",
		wrapperClass: "swiper-wrapper",
		lazyPreloaderClass: "swiper-lazy-preloader",
		lazyPreloadPrevNext: 0,
		runCallbacksOnInit: true,
		_emitClasses: false
	};
	function moduleExtendParams(params, allModulesParams) {
		return function extendParams(obj) {
			if (obj === void 0) obj = {};
			const moduleParamName = Object.keys(obj)[0];
			const moduleParams = obj[moduleParamName];
			if (typeof moduleParams !== "object" || moduleParams === null) {
				utils_extend(allModulesParams, obj);
				return;
			}
			if (params[moduleParamName] === true) params[moduleParamName] = {
				enabled: true
			};
			if (moduleParamName === "navigation" && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) params[moduleParamName].auto = true;
			if (["pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) params[moduleParamName].auto = true;
			if (!(moduleParamName in params && "enabled" in moduleParams)) {
				utils_extend(allModulesParams, obj);
				return;
			}
			if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
			if (!params[moduleParamName]) params[moduleParamName] = {
				enabled: false
			};
			utils_extend(allModulesParams, obj);
		};
	}
	const prototypes = {
		eventsEmitter,
		update,
		translate,
		transition,
		slide,
		loop,
		grabCursor,
		events: events$1,
		breakpoints,
		checkOverflow: checkOverflow$1,
		classes
	};
	const extendedDefaults = {};
	class swiper_core_Swiper {
		constructor() {
			let el;
			let params;
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
			if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") params = args[0]; else[el, params] = args;
			if (!params) params = {};
			params = utils_extend({}, params);
			if (el && !params.el) params.el = el;
			const document = ssr_window_esm_getDocument();
			if (params.el && typeof params.el === "string" && document.querySelectorAll(params.el).length > 1) {
				const swipers = [];
				document.querySelectorAll(params.el).forEach((containerEl => {
					const newParams = utils_extend({}, params, {
						el: containerEl
					});
					swipers.push(new swiper_core_Swiper(newParams));
				}));
				return swipers;
			}
			const swiper = this;
			swiper.__swiper__ = true;
			swiper.support = getSupport();
			swiper.device = getDevice({
				userAgent: params.userAgent
			});
			swiper.browser = getBrowser();
			swiper.eventsListeners = {};
			swiper.eventsAnyListeners = [];
			swiper.modules = [...swiper.__modules__];
			if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
			const allModulesParams = {};
			swiper.modules.forEach((mod => {
				mod({
					params,
					swiper,
					extendParams: moduleExtendParams(params, allModulesParams),
					on: swiper.on.bind(swiper),
					once: swiper.once.bind(swiper),
					off: swiper.off.bind(swiper),
					emit: swiper.emit.bind(swiper)
				});
			}));
			const swiperParams = utils_extend({}, defaults, allModulesParams);
			swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
			swiper.originalParams = utils_extend({}, swiper.params);
			swiper.passedParams = utils_extend({}, params);
			if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
				swiper.on(eventName, swiper.params.on[eventName]);
			}));
			if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
			Object.assign(swiper, {
				enabled: swiper.params.enabled,
				el,
				classNames: [],
				slides: [],
				slidesGrid: [],
				snapGrid: [],
				slidesSizesGrid: [],
				isHorizontal() {
					return swiper.params.direction === "horizontal";
				},
				isVertical() {
					return swiper.params.direction === "vertical";
				},
				activeIndex: 0,
				realIndex: 0,
				isBeginning: true,
				isEnd: false,
				translate: 0,
				previousTranslate: 0,
				progress: 0,
				velocity: 0,
				animating: false,
				cssOverflowAdjustment() {
					return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
				},
				allowSlideNext: swiper.params.allowSlideNext,
				allowSlidePrev: swiper.params.allowSlidePrev,
				touchEventsData: {
					isTouched: void 0,
					isMoved: void 0,
					allowTouchCallbacks: void 0,
					touchStartTime: void 0,
					isScrolling: void 0,
					currentTranslate: void 0,
					startTranslate: void 0,
					allowThresholdMove: void 0,
					focusableElements: swiper.params.focusableElements,
					lastClickTime: 0,
					clickTimeout: void 0,
					velocities: [],
					allowMomentumBounce: void 0,
					startMoving: void 0,
					pointerId: null,
					touchId: null
				},
				allowClick: true,
				allowTouchMove: swiper.params.allowTouchMove,
				touches: {
					startX: 0,
					startY: 0,
					currentX: 0,
					currentY: 0,
					diff: 0
				},
				imagesToLoad: [],
				imagesLoaded: 0
			});
			swiper.emit("_swiper");
			if (swiper.params.init) swiper.init();
			return swiper;
		}
		getDirectionLabel(property) {
			if (this.isHorizontal()) return property;
			return {
				width: "height",
				"margin-top": "margin-left",
				"margin-bottom ": "margin-right",
				"margin-left": "margin-top",
				"margin-right": "margin-bottom",
				"padding-left": "padding-top",
				"padding-right": "padding-bottom",
				marginRight: "marginBottom"
			}[property];
		}
		getSlideIndex(slideEl) {
			const { slidesEl, params } = this;
			const slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
			const firstSlideIndex = utils_elementIndex(slides[0]);
			return utils_elementIndex(slideEl) - firstSlideIndex;
		}
		getSlideIndexByData(index) {
			return this.getSlideIndex(this.slides.filter((slideEl => slideEl.getAttribute("data-swiper-slide-index") * 1 === index))[0]);
		}
		recalcSlides() {
			const swiper = this;
			const { slidesEl, params } = swiper;
			swiper.slides = utils_elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
		}
		enable() {
			const swiper = this;
			if (swiper.enabled) return;
			swiper.enabled = true;
			if (swiper.params.grabCursor) swiper.setGrabCursor();
			swiper.emit("enable");
		}
		disable() {
			const swiper = this;
			if (!swiper.enabled) return;
			swiper.enabled = false;
			if (swiper.params.grabCursor) swiper.unsetGrabCursor();
			swiper.emit("disable");
		}
		setProgress(progress, speed) {
			const swiper = this;
			progress = Math.min(Math.max(progress, 0), 1);
			const min = swiper.minTranslate();
			const max = swiper.maxTranslate();
			const current = (max - min) * progress + min;
			swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
			swiper.updateActiveIndex();
			swiper.updateSlidesClasses();
		}
		emitContainerClasses() {
			const swiper = this;
			if (!swiper.params._emitClasses || !swiper.el) return;
			const cls = swiper.el.className.split(" ").filter((className => className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0));
			swiper.emit("_containerClasses", cls.join(" "));
		}
		getSlideClasses(slideEl) {
			const swiper = this;
			if (swiper.destroyed) return "";
			return slideEl.className.split(" ").filter((className => className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0)).join(" ");
		}
		emitSlidesClasses() {
			const swiper = this;
			if (!swiper.params._emitClasses || !swiper.el) return;
			const updates = [];
			swiper.slides.forEach((slideEl => {
				const classNames = swiper.getSlideClasses(slideEl);
				updates.push({
					slideEl,
					classNames
				});
				swiper.emit("_slideClass", slideEl, classNames);
			}));
			swiper.emit("_slideClasses", updates);
		}
		slidesPerViewDynamic(view, exact) {
			if (view === void 0) view = "current";
			if (exact === void 0) exact = false;
			const swiper = this;
			const { params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex } = swiper;
			let spv = 1;
			if (typeof params.slidesPerView === "number") return params.slidesPerView;
			if (params.centeredSlides) {
				let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize) : 0;
				let breakLoop;
				for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
					slideSize += Math.ceil(slides[i].swiperSlideSize);
					spv += 1;
					if (slideSize > swiperSize) breakLoop = true;
				}
				for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
					slideSize += slides[i].swiperSlideSize;
					spv += 1;
					if (slideSize > swiperSize) breakLoop = true;
				}
			} else if (view === "current") for (let i = activeIndex + 1; i < slides.length; i += 1) {
				const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
				if (slideInView) spv += 1;
			} else for (let i = activeIndex - 1; i >= 0; i -= 1) {
				const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
				if (slideInView) spv += 1;
			}
			return spv;
		}
		update() {
			const swiper = this;
			if (!swiper || swiper.destroyed) return;
			const { snapGrid, params } = swiper;
			if (params.breakpoints) swiper.setBreakpoint();
			[...swiper.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl => {
				if (imageEl.complete) processLazyPreloader(swiper, imageEl);
			}));
			swiper.updateSize();
			swiper.updateSlides();
			swiper.updateProgress();
			swiper.updateSlidesClasses();
			function setTranslate() {
				const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
				const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
				swiper.setTranslate(newTranslate);
				swiper.updateActiveIndex();
				swiper.updateSlidesClasses();
			}
			let translated;
			if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
				setTranslate();
				if (params.autoHeight) swiper.updateAutoHeight();
			} else {
				if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
					const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
					translated = swiper.slideTo(slides.length - 1, 0, false, true);
				} else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
				if (!translated) setTranslate();
			}
			if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
			swiper.emit("update");
		}
		changeDirection(newDirection, needUpdate) {
			if (needUpdate === void 0) needUpdate = true;
			const swiper = this;
			const currentDirection = swiper.params.direction;
			if (!newDirection) newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
			if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") return swiper;
			swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
			swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
			swiper.emitContainerClasses();
			swiper.params.direction = newDirection;
			swiper.slides.forEach((slideEl => {
				if (newDirection === "vertical") slideEl.style.width = ""; else slideEl.style.height = "";
			}));
			swiper.emit("changeDirection");
			if (needUpdate) swiper.update();
			return swiper;
		}
		changeLanguageDirection(direction) {
			const swiper = this;
			if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr") return;
			swiper.rtl = direction === "rtl";
			swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
			if (swiper.rtl) {
				swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
				swiper.el.dir = "rtl";
			} else {
				swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
				swiper.el.dir = "ltr";
			}
			swiper.update();
		}
		mount(element) {
			const swiper = this;
			if (swiper.mounted) return true;
			let el = element || swiper.params.el;
			if (typeof el === "string") el = document.querySelector(el);
			if (!el) return false;
			el.swiper = swiper;
			if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) swiper.isElement = true;
			const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
			const getWrapper = () => {
				if (el && el.shadowRoot && el.shadowRoot.querySelector) {
					const res = el.shadowRoot.querySelector(getWrapperSelector());
					return res;
				}
				return utils_elementChildren(el, getWrapperSelector())[0];
			};
			let wrapperEl = getWrapper();
			if (!wrapperEl && swiper.params.createElements) {
				wrapperEl = utils_createElement("div", swiper.params.wrapperClass);
				el.append(wrapperEl);
				utils_elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl => {
					wrapperEl.append(slideEl);
				}));
			}
			Object.assign(swiper, {
				el,
				wrapperEl,
				slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
				hostEl: swiper.isElement ? el.parentNode.host : el,
				mounted: true,
				rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
				rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
				wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
			});
			return true;
		}
		init(el) {
			const swiper = this;
			if (swiper.initialized) return swiper;
			const mounted = swiper.mount(el);
			if (mounted === false) return swiper;
			swiper.emit("beforeInit");
			if (swiper.params.breakpoints) swiper.setBreakpoint();
			swiper.addClasses();
			swiper.updateSize();
			swiper.updateSlides();
			if (swiper.params.watchOverflow) swiper.checkOverflow();
			if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
			if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
			if (swiper.params.loop) swiper.loopCreate();
			swiper.attachEvents();
			const lazyElements = [...swiper.el.querySelectorAll('[loading="lazy"]')];
			if (swiper.isElement) lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
			lazyElements.forEach((imageEl => {
				if (imageEl.complete) processLazyPreloader(swiper, imageEl); else imageEl.addEventListener("load", (e => {
					processLazyPreloader(swiper, e.target);
				}));
			}));
			preload(swiper);
			swiper.initialized = true;
			preload(swiper);
			swiper.emit("init");
			swiper.emit("afterInit");
			return swiper;
		}
		destroy(deleteInstance, cleanStyles) {
			if (deleteInstance === void 0) deleteInstance = true;
			if (cleanStyles === void 0) cleanStyles = true;
			const swiper = this;
			const { params, el, wrapperEl, slides } = swiper;
			if (typeof swiper.params === "undefined" || swiper.destroyed) return null;
			swiper.emit("beforeDestroy");
			swiper.initialized = false;
			swiper.detachEvents();
			if (params.loop) swiper.loopDestroy();
			if (cleanStyles) {
				swiper.removeClasses();
				el.removeAttribute("style");
				wrapperEl.removeAttribute("style");
				if (slides && slides.length) slides.forEach((slideEl => {
					slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
					slideEl.removeAttribute("style");
					slideEl.removeAttribute("data-swiper-slide-index");
				}));
			}
			swiper.emit("destroy");
			Object.keys(swiper.eventsListeners).forEach((eventName => {
				swiper.off(eventName);
			}));
			if (deleteInstance !== false) {
				swiper.el.swiper = null;
				deleteProps(swiper);
			}
			swiper.destroyed = true;
			return null;
		}
		static extendDefaults(newDefaults) {
			utils_extend(extendedDefaults, newDefaults);
		}
		static get extendedDefaults() {
			return extendedDefaults;
		}
		static get defaults() {
			return defaults;
		}
		static installModule(mod) {
			if (!swiper_core_Swiper.prototype.__modules__) swiper_core_Swiper.prototype.__modules__ = [];
			const modules = swiper_core_Swiper.prototype.__modules__;
			if (typeof mod === "function" && modules.indexOf(mod) < 0) modules.push(mod);
		}
		static use(module) {
			if (Array.isArray(module)) {
				module.forEach((m => swiper_core_Swiper.installModule(m)));
				return swiper_core_Swiper;
			}
			swiper_core_Swiper.installModule(module);
			return swiper_core_Swiper;
		}
	}
	Object.keys(prototypes).forEach((prototypeGroup => {
		Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
			swiper_core_Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
		}));
	}));
	swiper_core_Swiper.use([Resize, Observer]);
	function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
		if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
			if (!params[key] && params.auto === true) {
				let element = utils_elementChildren(swiper.el, `.${checkProps[key]}`)[0];
				if (!element) {
					element = utils_createElement("div", checkProps[key]);
					element.className = checkProps[key];
					swiper.el.append(element);
				}
				params[key] = element;
				originalParams[key] = element;
			}
		}));
		return params;
	}
	function Navigation(_ref) {
		let { swiper, extendParams, on, emit } = _ref;
		extendParams({
			navigation: {
				nextEl: null,
				prevEl: null,
				hideOnClick: false,
				disabledClass: "swiper-button-disabled",
				hiddenClass: "swiper-button-hidden",
				lockClass: "swiper-button-lock",
				navigationDisabledClass: "swiper-navigation-disabled"
			}
		});
		swiper.navigation = {
			nextEl: null,
			prevEl: null
		};
		function getEl(el) {
			let res;
			if (el && typeof el === "string" && swiper.isElement) {
				res = swiper.el.querySelector(el);
				if (res) return res;
			}
			if (el) {
				if (typeof el === "string") res = [...document.querySelectorAll(el)];
				if (swiper.params.uniqueNavElements && typeof el === "string" && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) res = swiper.el.querySelector(el);
			}
			if (el && !res) return el;
			return res;
		}
		function toggleEl(el, disabled) {
			const params = swiper.params.navigation;
			el = utils_makeElementsArray(el);
			el.forEach((subEl => {
				if (subEl) {
					subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
					if (subEl.tagName === "BUTTON") subEl.disabled = disabled;
					if (swiper.params.watchOverflow && swiper.enabled) subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
				}
			}));
		}
		function update() {
			const { nextEl, prevEl } = swiper.navigation;
			if (swiper.params.loop) {
				toggleEl(prevEl, false);
				toggleEl(nextEl, false);
				return;
			}
			toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
			toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
		}
		function onPrevClick(e) {
			e.preventDefault();
			if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
			swiper.slidePrev();
			emit("navigationPrev");
		}
		function onNextClick(e) {
			e.preventDefault();
			if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
			swiper.slideNext();
			emit("navigationNext");
		}
		function init() {
			const params = swiper.params.navigation;
			swiper.params.navigation = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
				nextEl: "swiper-button-next",
				prevEl: "swiper-button-prev"
			});
			if (!(params.nextEl || params.prevEl)) return;
			let nextEl = getEl(params.nextEl);
			let prevEl = getEl(params.prevEl);
			Object.assign(swiper.navigation, {
				nextEl,
				prevEl
			});
			nextEl = utils_makeElementsArray(nextEl);
			prevEl = utils_makeElementsArray(prevEl);
			const initButton = (el, dir) => {
				if (el) el.addEventListener("click", dir === "next" ? onNextClick : onPrevClick);
				if (!swiper.enabled && el) el.classList.add(...params.lockClass.split(" "));
			};
			nextEl.forEach((el => initButton(el, "next")));
			prevEl.forEach((el => initButton(el, "prev")));
		}
		function destroy() {
			let { nextEl, prevEl } = swiper.navigation;
			nextEl = utils_makeElementsArray(nextEl);
			prevEl = utils_makeElementsArray(prevEl);
			const destroyButton = (el, dir) => {
				el.removeEventListener("click", dir === "next" ? onNextClick : onPrevClick);
				el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
			};
			nextEl.forEach((el => destroyButton(el, "next")));
			prevEl.forEach((el => destroyButton(el, "prev")));
		}
		on("init", (() => {
			if (swiper.params.navigation.enabled === false) disable(); else {
				init();
				update();
			}
		}));
		on("toEdge fromEdge lock unlock", (() => {
			update();
		}));
		on("destroy", (() => {
			destroy();
		}));
		on("enable disable", (() => {
			let { nextEl, prevEl } = swiper.navigation;
			nextEl = utils_makeElementsArray(nextEl);
			prevEl = utils_makeElementsArray(prevEl);
			if (swiper.enabled) {
				update();
				return;
			}
			[...nextEl, ...prevEl].filter((el => !!el)).forEach((el => el.classList.add(swiper.params.navigation.lockClass)));
		}));
		on("click", ((_s, e) => {
			let { nextEl, prevEl } = swiper.navigation;
			nextEl = utils_makeElementsArray(nextEl);
			prevEl = utils_makeElementsArray(prevEl);
			const targetEl = e.target;
			if (swiper.params.navigation.hideOnClick && !prevEl.includes(targetEl) && !nextEl.includes(targetEl)) {
				if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
				let isHidden;
				if (nextEl.length) isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass); else if (prevEl.length) isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
				if (isHidden === true) emit("navigationShow"); else emit("navigationHide");
				[...nextEl, ...prevEl].filter((el => !!el)).forEach((el => el.classList.toggle(swiper.params.navigation.hiddenClass)));
			}
		}));
		const enable = () => {
			swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(" "));
			init();
			update();
		};
		const disable = () => {
			swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(" "));
			destroy();
		};
		Object.assign(swiper.navigation, {
			enable,
			disable,
			update,
			init,
			destroy
		});
	}
	function classes_to_selector_classesToSelector(classes) {
		if (classes === void 0) classes = "";
		return `.${classes.trim().replace(/([\.:!+\/])/g, "\\$1").replace(/ /g, ".")}`;
	}
	function Pagination(_ref) {
		let { swiper, extendParams, on, emit } = _ref;
		const pfx = "swiper-pagination";
		extendParams({
			pagination: {
				el: null,
				bulletElement: "span",
				clickable: false,
				hideOnClick: false,
				renderBullet: null,
				renderProgressbar: null,
				renderFraction: null,
				renderCustom: null,
				progressbarOpposite: false,
				type: "bullets",
				dynamicBullets: false,
				dynamicMainBullets: 1,
				formatFractionCurrent: number => number,
				formatFractionTotal: number => number,
				bulletClass: `${pfx}-bullet`,
				bulletActiveClass: `${pfx}-bullet-active`,
				modifierClass: `${pfx}-`,
				currentClass: `${pfx}-current`,
				totalClass: `${pfx}-total`,
				hiddenClass: `${pfx}-hidden`,
				progressbarFillClass: `${pfx}-progressbar-fill`,
				progressbarOppositeClass: `${pfx}-progressbar-opposite`,
				clickableClass: `${pfx}-clickable`,
				lockClass: `${pfx}-lock`,
				horizontalClass: `${pfx}-horizontal`,
				verticalClass: `${pfx}-vertical`,
				paginationDisabledClass: `${pfx}-disabled`
			}
		});
		swiper.pagination = {
			el: null,
			bullets: []
		};
		let bulletSize;
		let dynamicBulletIndex = 0;
		function isPaginationDisabled() {
			return !swiper.params.pagination.el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0;
		}
		function setSideBullets(bulletEl, position) {
			const { bulletActiveClass } = swiper.params.pagination;
			if (!bulletEl) return;
			bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
			if (bulletEl) {
				bulletEl.classList.add(`${bulletActiveClass}-${position}`);
				bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
				if (bulletEl) bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`);
			}
		}
		function onBulletClick(e) {
			const bulletEl = e.target.closest(classes_to_selector_classesToSelector(swiper.params.pagination.bulletClass));
			if (!bulletEl) return;
			e.preventDefault();
			const index = utils_elementIndex(bulletEl) * swiper.params.slidesPerGroup;
			if (swiper.params.loop) {
				if (swiper.realIndex === index) return;
				swiper.slideToLoop(index);
			} else swiper.slideTo(index);
		}
		function update() {
			const rtl = swiper.rtl;
			const params = swiper.params.pagination;
			if (isPaginationDisabled()) return;
			let el = swiper.pagination.el;
			el = utils_makeElementsArray(el);
			let current;
			let previousIndex;
			const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
			const total = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
			if (swiper.params.loop) {
				previousIndex = swiper.previousRealIndex || 0;
				current = swiper.params.slidesPerGroup > 1 ? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup) : swiper.realIndex;
			} else if (typeof swiper.snapIndex !== "undefined") {
				current = swiper.snapIndex;
				previousIndex = swiper.previousSnapIndex;
			} else {
				previousIndex = swiper.previousIndex || 0;
				current = swiper.activeIndex || 0;
			}
			if (params.type === "bullets" && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
				const bullets = swiper.pagination.bullets;
				let firstIndex;
				let lastIndex;
				let midIndex;
				if (params.dynamicBullets) {
					bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? "width" : "height", true);
					el.forEach((subEl => {
						subEl.style[swiper.isHorizontal() ? "width" : "height"] = `${bulletSize * (params.dynamicMainBullets + 4)}px`;
					}));
					if (params.dynamicMainBullets > 1 && previousIndex !== void 0) {
						dynamicBulletIndex += current - (previousIndex || 0);
						if (dynamicBulletIndex > params.dynamicMainBullets - 1) dynamicBulletIndex = params.dynamicMainBullets - 1; else if (dynamicBulletIndex < 0) dynamicBulletIndex = 0;
					}
					firstIndex = Math.max(current - dynamicBulletIndex, 0);
					lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
					midIndex = (lastIndex + firstIndex) / 2;
				}
				bullets.forEach((bulletEl => {
					const classesToRemove = [...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((suffix => `${params.bulletActiveClass}${suffix}`))].map((s => typeof s === "string" && s.includes(" ") ? s.split(" ") : s)).flat();
					bulletEl.classList.remove(...classesToRemove);
				}));
				if (el.length > 1) bullets.forEach((bullet => {
					const bulletIndex = utils_elementIndex(bullet);
					if (bulletIndex === current) bullet.classList.add(...params.bulletActiveClass.split(" ")); else if (swiper.isElement) bullet.setAttribute("part", "bullet");
					if (params.dynamicBullets) {
						if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) bullet.classList.add(...`${params.bulletActiveClass}-main`.split(" "));
						if (bulletIndex === firstIndex) setSideBullets(bullet, "prev");
						if (bulletIndex === lastIndex) setSideBullets(bullet, "next");
					}
				})); else {
					const bullet = bullets[current];
					if (bullet) bullet.classList.add(...params.bulletActiveClass.split(" "));
					if (swiper.isElement) bullets.forEach(((bulletEl, bulletIndex) => {
						bulletEl.setAttribute("part", bulletIndex === current ? "bullet-active" : "bullet");
					}));
					if (params.dynamicBullets) {
						const firstDisplayedBullet = bullets[firstIndex];
						const lastDisplayedBullet = bullets[lastIndex];
						for (let i = firstIndex; i <= lastIndex; i += 1) if (bullets[i]) bullets[i].classList.add(...`${params.bulletActiveClass}-main`.split(" "));
						setSideBullets(firstDisplayedBullet, "prev");
						setSideBullets(lastDisplayedBullet, "next");
					}
				}
				if (params.dynamicBullets) {
					const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
					const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
					const offsetProp = rtl ? "right" : "left";
					bullets.forEach((bullet => {
						bullet.style[swiper.isHorizontal() ? offsetProp : "top"] = `${bulletsOffset}px`;
					}));
				}
			}
			el.forEach(((subEl, subElIndex) => {
				if (params.type === "fraction") {
					subEl.querySelectorAll(classes_to_selector_classesToSelector(params.currentClass)).forEach((fractionEl => {
						fractionEl.textContent = params.formatFractionCurrent(current + 1);
					}));
					subEl.querySelectorAll(classes_to_selector_classesToSelector(params.totalClass)).forEach((totalEl => {
						totalEl.textContent = params.formatFractionTotal(total);
					}));
				}
				if (params.type === "progressbar") {
					let progressbarDirection;
					if (params.progressbarOpposite) progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal"; else progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
					const scale = (current + 1) / total;
					let scaleX = 1;
					let scaleY = 1;
					if (progressbarDirection === "horizontal") scaleX = scale; else scaleY = scale;
					subEl.querySelectorAll(classes_to_selector_classesToSelector(params.progressbarFillClass)).forEach((progressEl => {
						progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
						progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
					}));
				}
				if (params.type === "custom" && params.renderCustom) {
					subEl.innerHTML = params.renderCustom(swiper, current + 1, total);
					if (subElIndex === 0) emit("paginationRender", subEl);
				} else {
					if (subElIndex === 0) emit("paginationRender", subEl);
					emit("paginationUpdate", subEl);
				}
				if (swiper.params.watchOverflow && swiper.enabled) subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
			}));
		}
		function render() {
			const params = swiper.params.pagination;
			if (isPaginationDisabled()) return;
			const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.grid && swiper.params.grid.rows > 1 ? swiper.slides.length / Math.ceil(swiper.params.grid.rows) : swiper.slides.length;
			let el = swiper.pagination.el;
			el = utils_makeElementsArray(el);
			let paginationHTML = "";
			if (params.type === "bullets") {
				let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
				if (swiper.params.freeMode && swiper.params.freeMode.enabled && numberOfBullets > slidesLength) numberOfBullets = slidesLength;
				for (let i = 0; i < numberOfBullets; i += 1) if (params.renderBullet) paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass); else paginationHTML += `<${params.bulletElement} ${swiper.isElement ? 'part="bullet"' : ""} class="${params.bulletClass}"></${params.bulletElement}>`;
			}
			if (params.type === "fraction") if (params.renderFraction) paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass); else paginationHTML = `<span class="${params.currentClass}"></span>` + " / " + `<span class="${params.totalClass}"></span>`;
			if (params.type === "progressbar") if (params.renderProgressbar) paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass); else paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
			swiper.pagination.bullets = [];
			el.forEach((subEl => {
				if (params.type !== "custom") subEl.innerHTML = paginationHTML || "";
				if (params.type === "bullets") swiper.pagination.bullets.push(...subEl.querySelectorAll(classes_to_selector_classesToSelector(params.bulletClass)));
			}));
			if (params.type !== "custom") emit("paginationRender", el[0]);
		}
		function init() {
			swiper.params.pagination = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
				el: "swiper-pagination"
			});
			const params = swiper.params.pagination;
			if (!params.el) return;
			let el;
			if (typeof params.el === "string" && swiper.isElement) el = swiper.el.querySelector(params.el);
			if (!el && typeof params.el === "string") el = [...document.querySelectorAll(params.el)];
			if (!el) el = params.el;
			if (!el || el.length === 0) return;
			if (swiper.params.uniqueNavElements && typeof params.el === "string" && Array.isArray(el) && el.length > 1) {
				el = [...swiper.el.querySelectorAll(params.el)];
				if (el.length > 1) el = el.filter((subEl => {
					if (utils_elementParents(subEl, ".swiper")[0] !== swiper.el) return false;
					return true;
				}))[0];
			}
			if (Array.isArray(el) && el.length === 1) el = el[0];
			Object.assign(swiper.pagination, {
				el
			});
			el = utils_makeElementsArray(el);
			el.forEach((subEl => {
				if (params.type === "bullets" && params.clickable) subEl.classList.add(...(params.clickableClass || "").split(" "));
				subEl.classList.add(params.modifierClass + params.type);
				subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
				if (params.type === "bullets" && params.dynamicBullets) {
					subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
					dynamicBulletIndex = 0;
					if (params.dynamicMainBullets < 1) params.dynamicMainBullets = 1;
				}
				if (params.type === "progressbar" && params.progressbarOpposite) subEl.classList.add(params.progressbarOppositeClass);
				if (params.clickable) subEl.addEventListener("click", onBulletClick);
				if (!swiper.enabled) subEl.classList.add(params.lockClass);
			}));
		}
		function destroy() {
			const params = swiper.params.pagination;
			if (isPaginationDisabled()) return;
			let el = swiper.pagination.el;
			if (el) {
				el = utils_makeElementsArray(el);
				el.forEach((subEl => {
					subEl.classList.remove(params.hiddenClass);
					subEl.classList.remove(params.modifierClass + params.type);
					subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
					if (params.clickable) {
						subEl.classList.remove(...(params.clickableClass || "").split(" "));
						subEl.removeEventListener("click", onBulletClick);
					}
				}));
			}
			if (swiper.pagination.bullets) swiper.pagination.bullets.forEach((subEl => subEl.classList.remove(...params.bulletActiveClass.split(" "))));
		}
		on("changeDirection", (() => {
			if (!swiper.pagination || !swiper.pagination.el) return;
			const params = swiper.params.pagination;
			let { el } = swiper.pagination;
			el = utils_makeElementsArray(el);
			el.forEach((subEl => {
				subEl.classList.remove(params.horizontalClass, params.verticalClass);
				subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
			}));
		}));
		on("init", (() => {
			if (swiper.params.pagination.enabled === false) disable(); else {
				init();
				render();
				update();
			}
		}));
		on("activeIndexChange", (() => {
			if (typeof swiper.snapIndex === "undefined") update();
		}));
		on("snapIndexChange", (() => {
			update();
		}));
		on("snapGridLengthChange", (() => {
			render();
			update();
		}));
		on("destroy", (() => {
			destroy();
		}));
		on("enable disable", (() => {
			let { el } = swiper.pagination;
			if (el) {
				el = utils_makeElementsArray(el);
				el.forEach((subEl => subEl.classList[swiper.enabled ? "remove" : "add"](swiper.params.pagination.lockClass)));
			}
		}));
		on("lock unlock", (() => {
			update();
		}));
		on("click", ((_s, e) => {
			const targetEl = e.target;
			const el = utils_makeElementsArray(swiper.pagination.el);
			if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && el && el.length > 0 && !targetEl.classList.contains(swiper.params.pagination.bulletClass)) {
				if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
				const isHidden = el[0].classList.contains(swiper.params.pagination.hiddenClass);
				if (isHidden === true) emit("paginationShow"); else emit("paginationHide");
				el.forEach((subEl => subEl.classList.toggle(swiper.params.pagination.hiddenClass)));
			}
		}));
		const enable = () => {
			swiper.el.classList.remove(swiper.params.pagination.paginationDisabledClass);
			let { el } = swiper.pagination;
			if (el) {
				el = utils_makeElementsArray(el);
				el.forEach((subEl => subEl.classList.remove(swiper.params.pagination.paginationDisabledClass)));
			}
			init();
			render();
			update();
		};
		const disable = () => {
			swiper.el.classList.add(swiper.params.pagination.paginationDisabledClass);
			let { el } = swiper.pagination;
			if (el) {
				el = utils_makeElementsArray(el);
				el.forEach((subEl => subEl.classList.add(swiper.params.pagination.paginationDisabledClass)));
			}
			destroy();
		};
		Object.assign(swiper.pagination, {
			enable,
			disable,
			render,
			update,
			init,
			destroy
		});
	}
	function Autoplay(_ref) {
		let { swiper, extendParams, on, emit, params } = _ref;
		swiper.autoplay = {
			running: false,
			paused: false,
			timeLeft: 0
		};
		extendParams({
			autoplay: {
				enabled: false,
				delay: 3e3,
				waitForTransition: true,
				disableOnInteraction: false,
				stopOnLastSlide: false,
				reverseDirection: false,
				pauseOnMouseEnter: false
			}
		});
		let timeout;
		let raf;
		let autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3e3;
		let autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3e3;
		let autoplayTimeLeft;
		let autoplayStartTime = (new Date).getTime();
		let wasPaused;
		let isTouched;
		let pausedByTouch;
		let touchStartTimeout;
		let slideChanged;
		let pausedByInteraction;
		let pausedByPointerEnter;
		function onTransitionEnd(e) {
			if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
			if (e.target !== swiper.wrapperEl) return;
			swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
			if (pausedByPointerEnter) return;
			resume();
		}
		const calcTimeLeft = () => {
			if (swiper.destroyed || !swiper.autoplay.running) return;
			if (swiper.autoplay.paused) wasPaused = true; else if (wasPaused) {
				autoplayDelayCurrent = autoplayTimeLeft;
				wasPaused = false;
			}
			const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - (new Date).getTime();
			swiper.autoplay.timeLeft = timeLeft;
			emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal);
			raf = requestAnimationFrame((() => {
				calcTimeLeft();
			}));
		};
		const getSlideDelay = () => {
			let activeSlideEl;
			if (swiper.virtual && swiper.params.virtual.enabled) activeSlideEl = swiper.slides.filter((slideEl => slideEl.classList.contains("swiper-slide-active")))[0]; else activeSlideEl = swiper.slides[swiper.activeIndex];
			if (!activeSlideEl) return;
			const currentSlideDelay = parseInt(activeSlideEl.getAttribute("data-swiper-autoplay"), 10);
			return currentSlideDelay;
		};
		const run = delayForce => {
			if (swiper.destroyed || !swiper.autoplay.running) return;
			cancelAnimationFrame(raf);
			calcTimeLeft();
			let delay = typeof delayForce === "undefined" ? swiper.params.autoplay.delay : delayForce;
			autoplayDelayTotal = swiper.params.autoplay.delay;
			autoplayDelayCurrent = swiper.params.autoplay.delay;
			const currentSlideDelay = getSlideDelay();
			if (!Number.isNaN(currentSlideDelay) && currentSlideDelay > 0 && typeof delayForce === "undefined") {
				delay = currentSlideDelay;
				autoplayDelayTotal = currentSlideDelay;
				autoplayDelayCurrent = currentSlideDelay;
			}
			autoplayTimeLeft = delay;
			const speed = swiper.params.speed;
			const proceed = () => {
				if (!swiper || swiper.destroyed) return;
				if (swiper.params.autoplay.reverseDirection) {
					if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
						swiper.slidePrev(speed, true, true);
						emit("autoplay");
					} else if (!swiper.params.autoplay.stopOnLastSlide) {
						swiper.slideTo(swiper.slides.length - 1, speed, true, true);
						emit("autoplay");
					}
				} else if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
					swiper.slideNext(speed, true, true);
					emit("autoplay");
				} else if (!swiper.params.autoplay.stopOnLastSlide) {
					swiper.slideTo(0, speed, true, true);
					emit("autoplay");
				}
				if (swiper.params.cssMode) {
					autoplayStartTime = (new Date).getTime();
					requestAnimationFrame((() => {
						run();
					}));
				}
			};
			if (delay > 0) {
				clearTimeout(timeout);
				timeout = setTimeout((() => {
					proceed();
				}), delay);
			} else requestAnimationFrame((() => {
				proceed();
			}));
			return delay;
		};
		const start = () => {
			autoplayStartTime = (new Date).getTime();
			swiper.autoplay.running = true;
			run();
			emit("autoplayStart");
		};
		const stop = () => {
			swiper.autoplay.running = false;
			clearTimeout(timeout);
			cancelAnimationFrame(raf);
			emit("autoplayStop");
		};
		const pause = (internal, reset) => {
			if (swiper.destroyed || !swiper.autoplay.running) return;
			clearTimeout(timeout);
			if (!internal) pausedByInteraction = true;
			const proceed = () => {
				emit("autoplayPause");
				if (swiper.params.autoplay.waitForTransition) swiper.wrapperEl.addEventListener("transitionend", onTransitionEnd); else resume();
			};
			swiper.autoplay.paused = true;
			if (reset) {
				if (slideChanged) autoplayTimeLeft = swiper.params.autoplay.delay;
				slideChanged = false;
				proceed();
				return;
			}
			const delay = autoplayTimeLeft || swiper.params.autoplay.delay;
			autoplayTimeLeft = delay - ((new Date).getTime() - autoplayStartTime);
			if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
			if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
			proceed();
		};
		const resume = () => {
			if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running) return;
			autoplayStartTime = (new Date).getTime();
			if (pausedByInteraction) {
				pausedByInteraction = false;
				run(autoplayTimeLeft);
			} else run();
			swiper.autoplay.paused = false;
			emit("autoplayResume");
		};
		const onVisibilityChange = () => {
			if (swiper.destroyed || !swiper.autoplay.running) return;
			const document = ssr_window_esm_getDocument();
			if (document.visibilityState === "hidden") {
				pausedByInteraction = true;
				pause(true);
			}
			if (document.visibilityState === "visible") resume();
		};
		const onPointerEnter = e => {
			if (e.pointerType !== "mouse") return;
			pausedByInteraction = true;
			pausedByPointerEnter = true;
			if (swiper.animating || swiper.autoplay.paused) return;
			pause(true);
		};
		const onPointerLeave = e => {
			if (e.pointerType !== "mouse") return;
			pausedByPointerEnter = false;
			if (swiper.autoplay.paused) resume();
		};
		const attachMouseEvents = () => {
			if (swiper.params.autoplay.pauseOnMouseEnter) {
				swiper.el.addEventListener("pointerenter", onPointerEnter);
				swiper.el.addEventListener("pointerleave", onPointerLeave);
			}
		};
		const detachMouseEvents = () => {
			swiper.el.removeEventListener("pointerenter", onPointerEnter);
			swiper.el.removeEventListener("pointerleave", onPointerLeave);
		};
		const attachDocumentEvents = () => {
			const document = ssr_window_esm_getDocument();
			document.addEventListener("visibilitychange", onVisibilityChange);
		};
		const detachDocumentEvents = () => {
			const document = ssr_window_esm_getDocument();
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
		on("init", (() => {
			if (swiper.params.autoplay.enabled) {
				attachMouseEvents();
				attachDocumentEvents();
				start();
			}
		}));
		on("destroy", (() => {
			detachMouseEvents();
			detachDocumentEvents();
			if (swiper.autoplay.running) stop();
		}));
		on("_freeModeStaticRelease", (() => {
			if (pausedByTouch || pausedByInteraction) resume();
		}));
		on("_freeModeNoMomentumRelease", (() => {
			if (!swiper.params.autoplay.disableOnInteraction) pause(true, true); else stop();
		}));
		on("beforeTransitionStart", ((_s, speed, internal) => {
			if (swiper.destroyed || !swiper.autoplay.running) return;
			if (internal || !swiper.params.autoplay.disableOnInteraction) pause(true, true); else stop();
		}));
		on("sliderFirstMove", (() => {
			if (swiper.destroyed || !swiper.autoplay.running) return;
			if (swiper.params.autoplay.disableOnInteraction) {
				stop();
				return;
			}
			isTouched = true;
			pausedByTouch = false;
			pausedByInteraction = false;
			touchStartTimeout = setTimeout((() => {
				pausedByInteraction = true;
				pausedByTouch = true;
				pause(true);
			}), 200);
		}));
		on("touchEnd", (() => {
			if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
			clearTimeout(touchStartTimeout);
			clearTimeout(timeout);
			if (swiper.params.autoplay.disableOnInteraction) {
				pausedByTouch = false;
				isTouched = false;
				return;
			}
			if (pausedByTouch && swiper.params.cssMode) resume();
			pausedByTouch = false;
			isTouched = false;
		}));
		on("slideChange", (() => {
			if (swiper.destroyed || !swiper.autoplay.running) return;
			slideChanged = true;
		}));
		Object.assign(swiper.autoplay, {
			start,
			stop,
			pause,
			resume
		});
	}
	function initSliders() {
		if (document.querySelector(".rs-slider-block")) {
			const sliderBlocks = document.querySelectorAll(".rs-slider-block");
			sliderBlocks.forEach((sliderBlock => {
				if (!sliderBlock.classList.contains("rs-slider-block-pins")) sliderBlockSwiperSettings(sliderBlock);
				if (window.innerWidth <= 991.98 && sliderBlock.classList.contains("rs-slider-block-pins")) {
					sliderBlock.classList.remove("rs-slider-block-pins");
					sliderBlockSwiperSettings(sliderBlock);
				}
			}));
			function sliderBlockSwiperSettings(sliderBlock) {
				const slider = sliderBlock.querySelector(".rs-slider-block__slider");
				const pagination = sliderBlock.querySelector(".rs-slider-block__pagination");
				const arrowNext = sliderBlock.querySelector(".rs-slider-block__button-next");
				const arrowPrev = sliderBlock.querySelector(".rs-slider-block__button-prev");
				new swiper_core_Swiper(slider, {
					modules: [Navigation, Pagination, Autoplay],
					autoplay: {
						delay: 1e4,
						stopOnLastSlide: false,
						disableOnInteraction: false
					},
					observer: true,
					observeParents: true,
					observeSlideChildren: true,
					speed: 500,
					simulateTouch: true,
					touchRadio: 1,
					touchAngle: 45,
					grabCursor: true,
					pagination: {
						el: pagination,
						type: "progressbar"
					},
					navigation: {
						nextEl: arrowNext,
						prevEl: arrowPrev
					},
					breakpoints: {
						320: {
							slidesPerView: 1,
							spaceBetween: 20
						},
						540: {
							slidesPerView: 2,
							spaceBetween: 20
						},
						768: {
							slidesPerView: 2,
							spaceBetween: 24
						},
						992: {
							slidesPerView: 2,
							spaceBetween: 30
						},
						1170: {
							slidesPerView: 3,
							spaceBetween: 30
						},
						1440: {
							slidesPerView: 3.34,
							spaceBetween: 30
						}
					}
				});
			}
		}
		if (document.querySelector(".rs-services")) {
			const sliderBlocks = document.querySelectorAll(".rs-services");
			sliderBlocks.forEach((sliderBlock => {
				const slider = sliderBlock.querySelector(".rs-services__slider");
				const pagination = sliderBlock.querySelector(".rs-services__pagination");
				const arrowNext = sliderBlock.querySelector(".rs-services__button-next");
				const arrowPrev = sliderBlock.querySelector(".rs-services__button-prev");
				new swiper_core_Swiper(slider, {
					modules: [Navigation, Pagination, Autoplay],
					autoplay: {
						delay: 1e4,
						stopOnLastSlide: false,
						disableOnInteraction: false
					},
					observer: true,
					observeParents: true,
					observeSlideChildren: true,
					speed: 500,
					simulateTouch: true,
					touchRadio: 1,
					touchAngle: 45,
					grabCursor: true,
					pagination: {
						el: pagination,
						type: "progressbar"
					},
					navigation: {
						nextEl: arrowNext,
						prevEl: arrowPrev
					},
					breakpoints: {
						320: {
							slidesPerView: 1.22,
							spaceBetween: 20
						},
						540: {
							slidesPerView: 2,
							spaceBetween: 20
						},
						768: {
							slidesPerView: 2.39,
							spaceBetween: 20
						},
						992: {
							slidesPerView: 2,
							spaceBetween: 30
						},
						1170: {
							slidesPerView: 3,
							spaceBetween: 30
						}
					}
				});
			}));
		}
		if (document.querySelector(".rs-services-about")) {
			const sliderBlocks = document.querySelectorAll(".rs-services-about");
			sliderBlocks.forEach((sliderBlock => {
				const slider = sliderBlock.querySelector(".rs-services-about__slider");
				new swiper_core_Swiper(slider, {
					modules: [Navigation, Pagination, Autoplay],
					autoplay: {
						delay: 1e4,
						stopOnLastSlide: false,
						disableOnInteraction: false
					},
					observer: true,
					observeParents: true,
					observeSlideChildren: true,
					speed: 500,
					simulateTouch: true,
					touchRadio: 1,
					touchAngle: 45,
					grabCursor: true,
					breakpoints: {
						320: {
							slidesPerView: 1.22,
							spaceBetween: 20
						},
						768: {
							slidesPerView: 2.4,
							spaceBetween: 20
						},
						992: {
							slidesPerView: 3,
							spaceBetween: 40
						}
					}
				});
			}));
		}
		if (document.querySelector(".rs-reviews")) {
			const sliderBlocks = document.querySelectorAll(".rs-reviews");
			sliderBlocks.forEach((sliderBlock => {
				const slider = sliderBlock.querySelector(".rs-reviews__slider");
				const slides = sliderBlock.querySelectorAll(".rs-reviews__slide");
				const arrowNext = sliderBlock.querySelector(".rs-reviews__button-next");
				const arrowPrev = sliderBlock.querySelector(".rs-reviews__button-prev");
				new swiper_core_Swiper(slider, {
					modules: [Navigation, Pagination, Autoplay],
					autoplay: {
						delay: 1e4,
						stopOnLastSlide: false,
						disableOnInteraction: false
					},
					observer: true,
					observeParents: true,
					observeSlideChildren: true,
					speed: 500,
					simulateTouch: true,
					touchRadio: 1,
					touchAngle: 45,
					grabCursor: true,
					navigation: {
						nextEl: arrowNext,
						prevEl: arrowPrev
					},
					breakpoints: {
						320: {
							slidesPerView: 1.22,
							spaceBetween: 20
						},
						768: {
							slidesPerView: 2.4,
							spaceBetween: 20
						},
						992: {
							slidesPerView: 1,
							spaceBetween: 30
						}
					}
				});
				slides.forEach((slide => {
					const reviewsDesc = slide.querySelector(".rs-reviews .rs-reviews__description p");
					if (reviewsDesc.clientHeight > 175) reviewsDesc.closest(".rs-reviews__description").classList.add("_large-reviews");
				}));
			}));
		}
		if (document.querySelector(".rs-project__slider")) {
			"use strict";
			const breakpoint = window.matchMedia("(min-width: 991.98px)");
			let projectSlider;
			const breakpointChecker = function () {
				if (breakpoint.matches === true) {
					if (projectSlider !== void 0) projectSlider.destroy(true, true);
					return;
				} else if (breakpoint.matches === false) return enableSwiper();
			};
			const enableSwiper = function () {
				projectSlider = new swiper_core_Swiper(".rs-project__slider", {
					modules: [Navigation, Pagination, Autoplay],
					autoplay: {
						delay: 5e3,
						stopOnLastSlide: false,
						disableOnInteraction: true
					},
					observer: true,
					observeParents: true,
					observeSlideChildren: true,
					speed: 500,
					simulateTouch: true,
					touchRadio: 1,
					touchAngle: 45,
					touchStartPreventDefault: true,
					grabCursor: true,
					loop: true,
					breakpoints: {
						320: {
							slidesPerView: 1.6,
							spaceBetween: 20,
							centeredSlides: true
						},
						540: {
							slidesPerView: 3,
							spaceBetween: 20,
							centeredSlides: false
						},
						768: {
							slidesPerView: 2.39,
							spaceBetween: 20,
							centeredSlides: false
						}
					}
				});
			};
			breakpoint.addListener(breakpointChecker);
			breakpointChecker();
		}
		if (document.querySelector(".rs-partners__slider")) {
			"use strict";
			const breakpoint = window.matchMedia("(min-width: 767.98px)");
			let partners;
			const breakpointChecker = function () {
				if (breakpoint.matches === true) {
					if (partners !== void 0) partners.destroy(true, true);
					return;
				} else if (breakpoint.matches === false) return enableSwiper();
			};
			const enableSwiper = function () {
				partners = new swiper_core_Swiper(".rs-partners__slider", {
					modules: [Navigation, Pagination, Autoplay],
					autoplay: {
						delay: 5e3,
						stopOnLastSlide: false,
						disableOnInteraction: true
					},
					observer: true,
					observeParents: true,
					observeSlideChildren: true,
					speed: 500,
					simulateTouch: true,
					touchRadio: 1,
					touchAngle: 45,
					touchStartPreventDefault: true,
					grabCursor: true,
					breakpoints: {
						320: {
							slidesPerView: 2.45,
							spaceBetween: 14,
							grid: {
								fill: "row",
								rows: 2
							}
						},
						540: {
							slidesPerView: 4,
							spaceBetween: 14,
							grid: {
								fill: "row",
								rows: 2
							}
						}
					}
				});
			};
			breakpoint.addListener(breakpointChecker);
			breakpointChecker();
		}
		if (document.querySelector(".rs-main__logo_slider")) new swiper_core_Swiper(".rs-main__logo_slider", {
			modules: [Navigation, Pagination, Autoplay],
			autoplay: {
				delay: 1,
				disableOnInteraction: false
			},
			speed: 3e3,
			loop: true,
			loopAdditionalSlides: 100,
			slidesPerView: "auto",
			spaceBetween: 24,
			allowTouchMove: false,
			observer: true,
			observeParents: true,
			observeSlideChildren: true
		});
		if (document.querySelector(".rs-logo")) {
			const sliderBlocks = document.querySelectorAll(".rs-logo");
			sliderBlocks.forEach((sliderBlock => {
				const sliders = sliderBlock.querySelectorAll(".rs-logo__slider");
				sliders.forEach((slider => {
					const pagination = slider.querySelector(".rs-logo__pagination");
					const arrowNext = slider.querySelector(".rs-logo__button-next");
					const arrowPrev = slider.querySelector(".rs-logo__button-prev");
					const slides = slider.querySelectorAll(".rs-logo__slide");
					const filters = sliderBlock.querySelectorAll(".rs-logo__filter");
					const sliderSwiper = new swiper_core_Swiper(slider, {
						modules: [Navigation, Pagination, Autoplay],
						observer: true,
						observeParents: true,
						observeSlideChildren: true,
						speed: 500,
						simulateTouch: true,
						touchRadio: 1,
						touchAngle: 45,
						grabCursor: true,
						pagination: {
							el: pagination,
							type: "progressbar"
						},
						navigation: {
							nextEl: arrowNext,
							prevEl: arrowPrev
						},
						breakpoints: {
							320: {
								slidesPerView: 2,
								spaceBetween: 20
							},
							768: {
								slidesPerView: 2.4,
								spaceBetween: 24
							},
							1170: {
								slidesPerView: 3,
								spaceBetween: 30
							}
						}
					});
					function updateFilter(activeFilter) {
						if (!activeFilter) {
							filters[0].classList.add("_filter-active");
							activeFilter = filters[0];
						}
						filters.forEach((filter => {
							if (filter === activeFilter) filter.classList.add("_filter-active"); else filter.classList.remove("_filter-active");
						}));
					}
					function updateSlider(slider) {
						slider.updateProgress();
						slider.updateSize();
						slider.updateSlides();
						slider.update();
					}
					filters.forEach((filter => {
						filter.addEventListener("click", (function (e) {
							slides.forEach((slide => {
								if (!filter.classList.contains("_filter-active")) if (filter.dataset.filter === slide.dataset.filter) {
									slide.classList.remove("hidden");
									slide.classList.add("swiper-slide");
									updateSlider(sliderSwiper);
								} else if (filter.dataset.filter === "All" || filter.dataset.filter === "all" || filter.textContent === "Все") {
									slide.classList.remove("hidden");
									slide.classList.add("swiper-slide");
									updateSlider(sliderSwiper);
								} else {
									slide.classList.add("hidden");
									slide.classList.remove("swiper-slide");
									slide.removeAttribute("style");
									updateSlider(sliderSwiper);
								}
							}));
							updateFilter(filter);
						}));
					}));
				}));
			}));
		}
	}
	function destroySliders() {
		const sliderContainers = document.querySelectorAll(".swiper-container-initialized");
		sliderContainers.forEach((sliderContainer => {
			const swiperInstance = sliderContainer.swiper;
			if (swiperInstance) swiperInstance.destroy(true, true);
		}));
	}
	if (document.querySelector(".swiper")) initSliders();
	function _toConsumableArray(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
			return arr2;
		} else return Array.from(arr);
	}
	var hasPassiveEvents = false;
	if (typeof window !== "undefined") {
		var passiveTestOptions = {
			get passive() {
				hasPassiveEvents = true;
				return;
			}
		};
		window.addEventListener("testPassive", null, passiveTestOptions);
		window.removeEventListener("testPassive", null, passiveTestOptions);
	}
	var isIosDevice = typeof window !== "undefined" && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
	var locks = [];
	var documentListenerAdded = false;
	var initialClientY = -1;
	var previousBodyOverflowSetting = void 0;
	var previousBodyPosition = void 0;
	var previousBodyPaddingRight = void 0;
	var allowTouchMove = function allowTouchMove(el) {
		return locks.some((function (lock) {
			if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) return true;
			return false;
		}));
	};
	var preventDefault = function preventDefault(rawEvent) {
		var e = rawEvent || window.event;
		if (allowTouchMove(e.target)) return true;
		if (e.touches.length > 1) return true;
		if (e.preventDefault) e.preventDefault();
		return false;
	};
	var setOverflowHidden = function setOverflowHidden(options) {
		if (previousBodyPaddingRight === void 0) {
			var _reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
			var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;
			if (_reserveScrollBarGap && scrollBarGap > 0) {
				var computedBodyPaddingRight = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right"), 10);
				previousBodyPaddingRight = document.body.style.paddingRight;
				document.body.style.paddingRight = computedBodyPaddingRight + scrollBarGap + "px";
			}
		}
		if (previousBodyOverflowSetting === void 0) {
			previousBodyOverflowSetting = document.body.style.overflow;
			document.body.style.overflow = "hidden";
		}
	};
	var restoreOverflowSetting = function restoreOverflowSetting() {
		if (previousBodyPaddingRight !== void 0) {
			document.body.style.paddingRight = previousBodyPaddingRight;
			previousBodyPaddingRight = void 0;
		}
		if (previousBodyOverflowSetting !== void 0) {
			document.body.style.overflow = previousBodyOverflowSetting;
			previousBodyOverflowSetting = void 0;
		}
	};
	var setPositionFixed = function setPositionFixed() {
		return window.requestAnimationFrame((function () {
			if (previousBodyPosition === void 0) {
				previousBodyPosition = {
					position: document.body.style.position,
					top: document.body.style.top,
					left: document.body.style.left
				};
				var _window = window, scrollY = _window.scrollY, scrollX = _window.scrollX, innerHeight = _window.innerHeight;
				document.body.style.position = "fixed";
				document.body.style.top = -scrollY;
				document.body.style.left = -scrollX;
				setTimeout((function () {
					return window.requestAnimationFrame((function () {
						var bottomBarHeight = innerHeight - window.innerHeight;
						if (bottomBarHeight && scrollY >= innerHeight) document.body.style.top = -(scrollY + bottomBarHeight);
					}));
				}), 300);
			}
		}));
	};
	var restorePositionSetting = function restorePositionSetting() {
		if (previousBodyPosition !== void 0) {
			var y = -parseInt(document.body.style.top, 10);
			var x = -parseInt(document.body.style.left, 10);
			document.body.style.position = previousBodyPosition.position;
			document.body.style.top = previousBodyPosition.top;
			document.body.style.left = previousBodyPosition.left;
			window.scrollTo(x, y);
			previousBodyPosition = void 0;
		}
	};
	var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled(targetElement) {
		return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
	};
	var handleScroll = function handleScroll(event, targetElement) {
		var clientY = event.targetTouches[0].clientY - initialClientY;
		if (allowTouchMove(event.target)) return false;
		if (targetElement && targetElement.scrollTop === 0 && clientY > 0) return preventDefault(event);
		if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) return preventDefault(event);
		event.stopPropagation();
		return true;
	};
	var disableBodyScroll = function disableBodyScroll(targetElement, options) {
		if (!targetElement) {
			console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.");
			return;
		}
		if (locks.some((function (lock) {
			return lock.targetElement === targetElement;
		}))) return;
		var lock = {
			targetElement,
			options: options || {}
		};
		locks = [].concat(_toConsumableArray(locks), [lock]);
		if (isIosDevice) setPositionFixed(); else setOverflowHidden(options);
		if (isIosDevice) {
			targetElement.ontouchstart = function (event) {
				if (event.targetTouches.length === 1) initialClientY = event.targetTouches[0].clientY;
			};
			targetElement.ontouchmove = function (event) {
				if (event.targetTouches.length === 1) handleScroll(event, targetElement);
			};
			if (!documentListenerAdded) {
				document.addEventListener("touchmove", preventDefault, hasPassiveEvents ? {
					passive: false
				} : void 0);
				documentListenerAdded = true;
			}
		}
	};
	var enableBodyScroll = function enableBodyScroll(targetElement) {
		if (!targetElement) {
			console.error("enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.");
			return;
		}
		locks = locks.filter((function (lock) {
			return lock.targetElement !== targetElement;
		}));
		if (isIosDevice) {
			targetElement.ontouchstart = null;
			targetElement.ontouchmove = null;
			if (documentListenerAdded && locks.length === 0) {
				document.removeEventListener("touchmove", preventDefault, hasPassiveEvents ? {
					passive: false
				} : void 0);
				documentListenerAdded = false;
			}
		}
		if (isIosDevice) restorePositionSetting(); else restoreOverflowSetting();
	};
	class ImageCompare {
		constructor(el, settings = {}) {
			const defaults = {
				controlColor: "#FFFFFF",
				controlShadow: true,
				addCircle: false,
				addCircleBlur: true,
				showLabels: false,
				labelOptions: {
					before: "Before",
					after: "After",
					onHover: false
				},
				smoothing: true,
				smoothingAmount: 100,
				hoverStart: false,
				verticalMode: false,
				startingPoint: 50,
				fluidMode: false
			};
			this.settings = Object.assign(defaults, settings);
			this.animationFrameId = null;
			this.safariAgent = navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1;
			this.el = el;
			this.images = {};
			this.wrapper = null;
			this.control = null;
			this.arrowContainer = null;
			this.arrowAnimator = [];
			this.active = false;
			this.slideWidth = 50;
			this.lineWidth = 2;
			this.arrowCoordinates = {
				circle: [5, 3],
				standard: [8, 0]
			};
		}
		mount() {
			if (this.safariAgent) this.settings.smoothing = false;
			this._shapeContainer();
			this._getImages();
			this._buildControl();
			this._events();
		}
		_events() {
			this.el.addEventListener("mousedown", (ev => {
				this._activate(true);
				document.body.classList.add("icv__body");
				disableBodyScroll(this.el, {
					reserveScrollBarGap: true
				});
				this._slideCompare(ev);
			}));
			this.el.addEventListener("mousemove", (ev => this.active && this._slideCompare(ev)));
			this.el.addEventListener("mouseup", (() => this._activate(false)));
			document.body.addEventListener("mouseup", (() => {
				document.body.classList.remove("icv__body");
				enableBodyScroll(this.el);
				this._activate(false);
			}));
			this.control.addEventListener("touchstart", (e => {
				this._activate(true);
				document.body.classList.add("icv__body");
				disableBodyScroll(this.el, {
					reserveScrollBarGap: true
				});
			}));
			this.el.addEventListener("touchmove", (ev => {
				this.active && this._slideCompare(ev);
			}));
			this.el.addEventListener("touchend", (() => {
				this._activate(false);
				document.body.classList.remove("icv__body");
				enableBodyScroll(this.el);
			}));
			this.el.addEventListener("mouseenter", (() => {
				this.settings.hoverStart && this._activate(true);
				let coord = this.settings.addCircle ? this.arrowCoordinates.circle : this.arrowCoordinates.standard;
				this.arrowAnimator.forEach(((anim, i) => {
					anim.style.cssText = `\n        ${this.settings.verticalMode ? `transform: translateY(${coord[1] * (i === 0 ? 1 : -1)}px);` : `transform: translateX(${coord[1] * (i === 0 ? 1 : -1)}px);`}\n        `;
				}));
			}));
			this.el.addEventListener("mouseleave", (() => {
				let coord = this.settings.addCircle ? this.arrowCoordinates.circle : this.arrowCoordinates.standard;
				this.arrowAnimator.forEach(((anim, i) => {
					anim.style.cssText = `\n        ${this.settings.verticalMode ? `transform: translateY(${i === 0 ? `${coord[0]}px` : `-${coord[0]}px`});` : `transform: translateX(${i === 0 ? `${coord[0]}px` : `-${coord[0]}px`});`}\n        `;
				}));
			}));
		}
		_slideCompare(ev) {
			if (this.animationFrameId === null) this.animationFrameId = requestAnimationFrame((() => {
				const bounds = this.el.getBoundingClientRect();
				const x = ev.touches !== void 0 ? ev.touches[0].clientX - bounds.left : ev.clientX - bounds.left;
				const y = ev.touches !== void 0 ? ev.touches[0].clientY - bounds.top : ev.clientY - bounds.top;
				const position = this.settings.verticalMode ? y / bounds.height * 100 : x / bounds.width * 100;
				if (position >= 0 && position <= 100) {
					this.settings.verticalMode ? this.control.style.top = `calc(${position}% - ${this.slideWidth / 2}px)` : this.control.style.left = `calc(${position}% - ${this.slideWidth / 2}px)`;
					if (this.settings.fluidMode) this.settings.verticalMode ? this.wrapper.style.clipPath = `inset(0 0 ${100 - position}% 0)` : this.wrapper.style.clipPath = `inset(0 0 0 ${position}%)`; else this.settings.verticalMode ? this.wrapper.style.height = `calc(${position}%)` : this.wrapper.style.width = `calc(${100 - position}%)`;
				}
				this.animationFrameId = null;
			}));
		}
		_activate(state) {
			this.active = state;
		}
		_shapeContainer() {
			let imposter = document.createElement("div");
			let label_l = document.createElement("span");
			let label_r = document.createElement("span");
			label_l.classList.add("icv__label", "icv__label-before", "keep");
			label_r.classList.add("icv__label", "icv__label-after", "keep");
			if (this.settings.labelOptions.onHover) {
				label_l.classList.add("on-hover");
				label_r.classList.add("on-hover");
			}
			if (this.settings.verticalMode) {
				label_l.classList.add("vertical");
				label_r.classList.add("vertical");
			}
			label_l.innerHTML = this.settings.labelOptions.before || "Before";
			label_r.innerHTML = this.settings.labelOptions.after || "After";
			if (this.settings.showLabels) {
				this.el.appendChild(label_l);
				this.el.appendChild(label_r);
			}
			this.el.classList.add(`icv`, this.settings.verticalMode ? `icv__icv--vertical` : `icv__icv--horizontal`, this.settings.fluidMode ? `icv__is--fluid` : `standard`);
			imposter.classList.add("icv__imposter");
			this.el.appendChild(imposter);
		}
		_buildControl() {
			let control = document.createElement("div");
			let uiLine = document.createElement("div");
			let arrows = document.createElement("div");
			let circle = document.createElement("div");
			const arrowSize = "20";
			arrows.classList.add("icv__theme-wrapper");
			for (var idx = 0; idx <= 1; idx++) {
				let animator = document.createElement(`div`);
				let arrow = `<svg\n      height="15"\n      width="15"\n       style="\n       transform: \n       scale(${this.settings.addCircle ? .7 : 1.5})  \n       rotateZ(${idx === 0 ? this.settings.verticalMode ? `-90deg` : `180deg` : this.settings.verticalMode ? `90deg` : `0deg`}); height: ${arrowSize}px; width: ${arrowSize}px;\n       \n       ${this.settings.controlShadow ? `\n       -webkit-filter: drop-shadow( 0px 3px 5px rgba(0, 0, 0, .33));\n       filter: drop-shadow( 0px ${idx === 0 ? "-3px" : "3px"} 5px rgba(0, 0, 0, .33));\n       ` : ``}\n       "\n       xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 15 15">\n       <path ${this.settings.addCircle ? `fill="transparent"` : `fill="${this.settings.controlColor}"`}\n       stroke="${this.settings.controlColor}"\n       stroke-linecap="round"\n       stroke-width="${this.settings.addCircle ? 3 : 0}"\n       d="M4.5 1.9L10 7.65l-5.5 5.4"\n       />\n     </svg>`;
				animator.innerHTML += arrow;
				this.arrowAnimator.push(animator);
				arrows.appendChild(animator);
			}
			let coord = this.settings.addCircle ? this.arrowCoordinates.circle : this.arrowCoordinates.standard;
			this.arrowAnimator.forEach(((anim, i) => {
				anim.classList.add("icv__arrow-wrapper");
				anim.style.cssText = `\n      ${this.settings.verticalMode ? `transform: translateY(${i === 0 ? `${coord[0]}px` : `-${coord[0]}px`});` : `transform: translateX(${i === 0 ? `${coord[0]}px` : `-${coord[0]}px`});`}\n      `;
			}));
			control.classList.add("icv__control");
			control.style.cssText = `\n    ${this.settings.verticalMode ? `height` : `width `}: ${this.slideWidth}px;\n    ${this.settings.verticalMode ? `top` : `left `}: calc(${this.settings.startingPoint}% - ${this.slideWidth / 2}px);\n    ${"ontouchstart" in document.documentElement ? `` : this.settings.smoothing ? `transition: ${this.settings.smoothingAmount}ms ease-out;` : ``}\n    `;
			uiLine.classList.add("icv__control-line");
			uiLine.style.cssText = `\n      ${this.settings.verticalMode ? `height` : `width `}: ${this.lineWidth}px;\n      background: ${this.settings.controlColor};\n        ${this.settings.controlShadow ? `box-shadow: 0px 0px 15px rgba(0,0,0,0.33);` : ``}\n    `;
			let uiLine2 = uiLine.cloneNode(true);
			circle.classList.add("icv__circle");
			circle.style.cssText = `\n\n      ${this.settings.addCircleBlur && `-webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px)`};\n      \n      border: ${this.lineWidth}px solid ${this.settings.controlColor};\n      ${this.settings.controlShadow && `box-shadow: 0px 0px 15px rgba(0,0,0,0.33)`};\n    `;
			control.appendChild(uiLine);
			this.settings.addCircle && control.appendChild(circle);
			control.appendChild(arrows);
			control.appendChild(uiLine2);
			this.arrowContainer = arrows;
			this.control = control;
			this.el.appendChild(control);
		}
		_getImages() {
			let children = this.el.querySelectorAll("img, video, .keep");
			this.el.innerHTML = "";
			children.forEach((img => {
				this.el.appendChild(img);
			}));
			let childrenImages = [...children].filter((element => ["img", "video"].includes(element.nodeName.toLowerCase())));
			this.settings.verticalMode && childrenImages.reverse();
			for (let idx = 0; idx <= 1; idx++) {
				let child = childrenImages[idx];
				child.classList.add("icv__img");
				child.classList.add(idx === 0 ? `icv__img-a` : `icv__img-b`);
				if (idx === 1) {
					let wrapper = document.createElement("div");
					let afterUrl = childrenImages[1].src;
					wrapper.classList.add("icv__wrapper");
					wrapper.style.cssText = `\n            width: ${100 - this.settings.startingPoint}%; \n            height: ${this.settings.startingPoint}%;\n\n            ${"ontouchstart" in document.documentElement ? `` : this.settings.smoothing ? `transition: ${this.settings.smoothingAmount}ms ease-out;` : ``}\n            ${this.settings.fluidMode && `background-image: url(${afterUrl}); clip-path: inset(${this.settings.verticalMode ? ` 0 0 ${100 - this.settings.startingPoint}% 0` : `0 0 0 ${this.settings.startingPoint}%`})`}\n        `;
					wrapper.appendChild(child);
					this.wrapper = wrapper;
					this.el.appendChild(this.wrapper);
				}
			}
			if (this.settings.fluidMode) {
				let url = childrenImages[0].src;
				let fluidWrapper = document.createElement("div");
				fluidWrapper.classList.add("icv__fluidwrapper");
				fluidWrapper.style.cssText = `\n \n        background-image: url(${url});\n        \n      `;
				this.el.appendChild(fluidWrapper);
			}
		}
	}
	const scripts = ImageCompare;
	const addCursorHover = (hoveredElement, selectedElement, newClass) => {
		if (document.querySelector(hoveredElement) && document.querySelector(selectedElement)) document.querySelectorAll(hoveredElement).forEach((hover => {
			hover.addEventListener("mouseenter", (function () {
				document.querySelector(selectedElement).classList.add(newClass);
				hover.classList.add("_mouse-event");
			}));
			hover.addEventListener("mouseleave", (function () {
				document.querySelector(selectedElement).classList.remove(newClass);
				hover.classList.remove("_mouse-event");
			}));
			hover.addEventListener("mousemove", (function () {
				document.querySelector(selectedElement).classList.add(newClass);
			}));
		}));
	};
	const addCursorMove = (hoveredElement, selectedElement) => {
		if (document.querySelector(hoveredElement) && document.querySelector(selectedElement)) document.body.addEventListener("mousemove", (function (e) {
			if (document.querySelector(hoveredElement) && document.querySelector(selectedElement)) document.querySelector(selectedElement).style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
		}));
	};
	function initComparison(id) {
		const comparison = document.getElementById(id);
		if (comparison) {
			new scripts(comparison, {
				controlColor: "#FFFFFF",
				controlShadow: false,
				addCircle: true,
				addCircleBlur: false,
				showLabels: false,
				labelOptions: {
					before: "Before",
					after: "After",
					onHover: false
				},
				smoothing: true,
				smoothingAmount: 300,
				hoverStart: true,
				verticalMode: false,
				startingPoint: 46.2,
				fluidMode: true
			}).mount();
		}
	}
	function destroyComparison(id) {
		const comparison = document.getElementById(id);
		if (comparison && comparison.__imageCompare) comparison.__imageCompare.destroy();
	}
	initComparison("image-compare");
	addCursorHover(".rs-comparison__compare", ".rs-comparison .icv__circle", "cursor__active");
	addCursorMove(".rs-comparison__compare", ".icv__circle");
	var PipsMode;
	(function (PipsMode) {
		PipsMode["Range"] = "range";
		PipsMode["Steps"] = "steps";
		PipsMode["Positions"] = "positions";
		PipsMode["Count"] = "count";
		PipsMode["Values"] = "values";
	})(PipsMode || (PipsMode = {}));
	var PipsType;
	(function (PipsType) {
		PipsType[PipsType["None"] = -1] = "None";
		PipsType[PipsType["NoValue"] = 0] = "NoValue";
		PipsType[PipsType["LargeValue"] = 1] = "LargeValue";
		PipsType[PipsType["SmallValue"] = 2] = "SmallValue";
	})(PipsType || (PipsType = {}));
	function isValidFormatter(entry) {
		return isValidPartialFormatter(entry) && typeof entry.from === "function";
	}
	function isValidPartialFormatter(entry) {
		return typeof entry === "object" && typeof entry.to === "function";
	}
	function removeElement(el) {
		el.parentElement.removeChild(el);
	}
	function isSet(value) {
		return value !== null && value !== void 0;
	}
	function nouislider_preventDefault(e) {
		e.preventDefault();
	}
	function unique(array) {
		return array.filter((function (a) {
			return !this[a] ? this[a] = true : false;
		}), {});
	}
	function closest(value, to) {
		return Math.round(value / to) * to;
	}
	function offset(elem, orientation) {
		var rect = elem.getBoundingClientRect();
		var doc = elem.ownerDocument;
		var docElem = doc.documentElement;
		var pageOffset = getPageOffset(doc);
		if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) pageOffset.x = 0;
		return orientation ? rect.top + pageOffset.y - docElem.clientTop : rect.left + pageOffset.x - docElem.clientLeft;
	}
	function isNumeric(a) {
		return typeof a === "number" && !isNaN(a) && isFinite(a);
	}
	function addClassFor(element, className, duration) {
		if (duration > 0) {
			addClass(element, className);
			setTimeout((function () {
				removeClass(element, className);
			}), duration);
		}
	}
	function limit(a) {
		return Math.max(Math.min(a, 100), 0);
	}
	function asArray(a) {
		return Array.isArray(a) ? a : [a];
	}
	function countDecimals(numStr) {
		numStr = String(numStr);
		var pieces = numStr.split(".");
		return pieces.length > 1 ? pieces[1].length : 0;
	}
	function addClass(el, className) {
		if (el.classList && !/\s/.test(className)) el.classList.add(className); else el.className += " " + className;
	}
	function removeClass(el, className) {
		if (el.classList && !/\s/.test(className)) el.classList.remove(className); else el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
	}
	function hasClass(el, className) {
		return el.classList ? el.classList.contains(className) : new RegExp("\\b" + className + "\\b").test(el.className);
	}
	function getPageOffset(doc) {
		var supportPageOffset = window.pageXOffset !== void 0;
		var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
		var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? doc.documentElement.scrollLeft : doc.body.scrollLeft;
		var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? doc.documentElement.scrollTop : doc.body.scrollTop;
		return {
			x,
			y
		};
	}
	function getActions() {
		return window.navigator.pointerEnabled ? {
			start: "pointerdown",
			move: "pointermove",
			end: "pointerup"
		} : window.navigator.msPointerEnabled ? {
			start: "MSPointerDown",
			move: "MSPointerMove",
			end: "MSPointerUp"
		} : {
			start: "mousedown touchstart",
			move: "mousemove touchmove",
			end: "mouseup touchend"
		};
	}
	function getSupportsPassive() {
		var supportsPassive = false;
		try {
			var opts = Object.defineProperty({}, "passive", {
				get: function () {
					supportsPassive = true;
				}
			});
			window.addEventListener("test", null, opts);
		} catch (e) { }
		return supportsPassive;
	}
	function getSupportsTouchActionNone() {
		return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
	}
	function subRangeRatio(pa, pb) {
		return 100 / (pb - pa);
	}
	function fromPercentage(range, value, startRange) {
		return value * 100 / (range[startRange + 1] - range[startRange]);
	}
	function toPercentage(range, value) {
		return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0], 0);
	}
	function isPercentage(range, value) {
		return value * (range[1] - range[0]) / 100 + range[0];
	}
	function getJ(value, arr) {
		var j = 1;
		while (value >= arr[j]) j += 1;
		return j;
	}
	function toStepping(xVal, xPct, value) {
		if (value >= xVal.slice(-1)[0]) return 100;
		var j = getJ(value, xVal);
		var va = xVal[j - 1];
		var vb = xVal[j];
		var pa = xPct[j - 1];
		var pb = xPct[j];
		return pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb);
	}
	function fromStepping(xVal, xPct, value) {
		if (value >= 100) return xVal.slice(-1)[0];
		var j = getJ(value, xPct);
		var va = xVal[j - 1];
		var vb = xVal[j];
		var pa = xPct[j - 1];
		var pb = xPct[j];
		return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
	}
	function getStep(xPct, xSteps, snap, value) {
		if (value === 100) return value;
		var j = getJ(value, xPct);
		var a = xPct[j - 1];
		var b = xPct[j];
		if (snap) {
			if (value - a > (b - a) / 2) return b;
			return a;
		}
		if (!xSteps[j - 1]) return value;
		return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
	}
	var Spectrum = function () {
		function Spectrum(entry, snap, singleStep) {
			this.xPct = [];
			this.xVal = [];
			this.xSteps = [];
			this.xNumSteps = [];
			this.xHighestCompleteStep = [];
			this.xSteps = [singleStep || false];
			this.xNumSteps = [false];
			this.snap = snap;
			var index;
			var ordered = [];
			Object.keys(entry).forEach((function (index) {
				ordered.push([asArray(entry[index]), index]);
			}));
			ordered.sort((function (a, b) {
				return a[0][0] - b[0][0];
			}));
			for (index = 0; index < ordered.length; index++) this.handleEntryPoint(ordered[index][1], ordered[index][0]);
			this.xNumSteps = this.xSteps.slice(0);
			for (index = 0; index < this.xNumSteps.length; index++) this.handleStepPoint(index, this.xNumSteps[index]);
		}
		Spectrum.prototype.getDistance = function (value) {
			var distances = [];
			for (var index = 0; index < this.xNumSteps.length - 1; index++) distances[index] = fromPercentage(this.xVal, value, index);
			return distances;
		};
		Spectrum.prototype.getAbsoluteDistance = function (value, distances, direction) {
			var xPct_index = 0;
			if (value < this.xPct[this.xPct.length - 1]) while (value > this.xPct[xPct_index + 1]) xPct_index++; else if (value === this.xPct[this.xPct.length - 1]) xPct_index = this.xPct.length - 2;
			if (!direction && value === this.xPct[xPct_index + 1]) xPct_index++;
			if (distances === null) distances = [];
			var start_factor;
			var rest_factor = 1;
			var rest_rel_distance = distances[xPct_index];
			var range_pct = 0;
			var rel_range_distance = 0;
			var abs_distance_counter = 0;
			var range_counter = 0;
			if (direction) start_factor = (value - this.xPct[xPct_index]) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]); else start_factor = (this.xPct[xPct_index + 1] - value) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
			while (rest_rel_distance > 0) {
				range_pct = this.xPct[xPct_index + 1 + range_counter] - this.xPct[xPct_index + range_counter];
				if (distances[xPct_index + range_counter] * rest_factor + 100 - start_factor * 100 > 100) {
					rel_range_distance = range_pct * start_factor;
					rest_factor = (rest_rel_distance - 100 * start_factor) / distances[xPct_index + range_counter];
					start_factor = 1;
				} else {
					rel_range_distance = distances[xPct_index + range_counter] * range_pct / 100 * rest_factor;
					rest_factor = 0;
				}
				if (direction) {
					abs_distance_counter -= rel_range_distance;
					if (this.xPct.length + range_counter >= 1) range_counter--;
				} else {
					abs_distance_counter += rel_range_distance;
					if (this.xPct.length - range_counter >= 1) range_counter++;
				}
				rest_rel_distance = distances[xPct_index + range_counter] * rest_factor;
			}
			return value + abs_distance_counter;
		};
		Spectrum.prototype.toStepping = function (value) {
			value = toStepping(this.xVal, this.xPct, value);
			return value;
		};
		Spectrum.prototype.fromStepping = function (value) {
			return fromStepping(this.xVal, this.xPct, value);
		};
		Spectrum.prototype.getStep = function (value) {
			value = getStep(this.xPct, this.xSteps, this.snap, value);
			return value;
		};
		Spectrum.prototype.getDefaultStep = function (value, isDown, size) {
			var j = getJ(value, this.xPct);
			if (value === 100 || isDown && value === this.xPct[j - 1]) j = Math.max(j - 1, 1);
			return (this.xVal[j] - this.xVal[j - 1]) / size;
		};
		Spectrum.prototype.getNearbySteps = function (value) {
			var j = getJ(value, this.xPct);
			return {
				stepBefore: {
					startValue: this.xVal[j - 2],
					step: this.xNumSteps[j - 2],
					highestStep: this.xHighestCompleteStep[j - 2]
				},
				thisStep: {
					startValue: this.xVal[j - 1],
					step: this.xNumSteps[j - 1],
					highestStep: this.xHighestCompleteStep[j - 1]
				},
				stepAfter: {
					startValue: this.xVal[j],
					step: this.xNumSteps[j],
					highestStep: this.xHighestCompleteStep[j]
				}
			};
		};
		Spectrum.prototype.countStepDecimals = function () {
			var stepDecimals = this.xNumSteps.map(countDecimals);
			return Math.max.apply(null, stepDecimals);
		};
		Spectrum.prototype.hasNoSize = function () {
			return this.xVal[0] === this.xVal[this.xVal.length - 1];
		};
		Spectrum.prototype.convert = function (value) {
			return this.getStep(this.toStepping(value));
		};
		Spectrum.prototype.handleEntryPoint = function (index, value) {
			var percentage;
			if (index === "min") percentage = 0; else if (index === "max") percentage = 100; else percentage = parseFloat(index);
			if (!isNumeric(percentage) || !isNumeric(value[0])) throw new Error("noUiSlider: 'range' value isn't numeric.");
			this.xPct.push(percentage);
			this.xVal.push(value[0]);
			var value1 = Number(value[1]);
			if (!percentage) {
				if (!isNaN(value1)) this.xSteps[0] = value1;
			} else this.xSteps.push(isNaN(value1) ? false : value1);
			this.xHighestCompleteStep.push(0);
		};
		Spectrum.prototype.handleStepPoint = function (i, n) {
			if (!n) return;
			if (this.xVal[i] === this.xVal[i + 1]) {
				this.xSteps[i] = this.xHighestCompleteStep[i] = this.xVal[i];
				return;
			}
			this.xSteps[i] = fromPercentage([this.xVal[i], this.xVal[i + 1]], n, 0) / subRangeRatio(this.xPct[i], this.xPct[i + 1]);
			var totalSteps = (this.xVal[i + 1] - this.xVal[i]) / this.xNumSteps[i];
			var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
			var step = this.xVal[i] + this.xNumSteps[i] * highestStep;
			this.xHighestCompleteStep[i] = step;
		};
		return Spectrum;
	}();
	var defaultFormatter = {
		to: function (value) {
			return value === void 0 ? "" : value.toFixed(2);
		},
		from: Number
	};
	var cssClasses = {
		target: "target",
		base: "base",
		origin: "origin",
		handle: "handle",
		handleLower: "handle-lower",
		handleUpper: "handle-upper",
		touchArea: "touch-area",
		horizontal: "horizontal",
		vertical: "vertical",
		background: "background",
		connect: "connect",
		connects: "connects",
		ltr: "ltr",
		rtl: "rtl",
		textDirectionLtr: "txt-dir-ltr",
		textDirectionRtl: "txt-dir-rtl",
		draggable: "draggable",
		drag: "state-drag",
		tap: "state-tap",
		active: "active",
		tooltip: "tooltip",
		pips: "pips",
		pipsHorizontal: "pips-horizontal",
		pipsVertical: "pips-vertical",
		marker: "marker",
		markerHorizontal: "marker-horizontal",
		markerVertical: "marker-vertical",
		markerNormal: "marker-normal",
		markerLarge: "marker-large",
		markerSub: "marker-sub",
		value: "value",
		valueHorizontal: "value-horizontal",
		valueVertical: "value-vertical",
		valueNormal: "value-normal",
		valueLarge: "value-large",
		valueSub: "value-sub"
	};
	var INTERNAL_EVENT_NS = {
		tooltips: ".__tooltips",
		aria: ".__aria"
	};
	function testStep(parsed, entry) {
		if (!isNumeric(entry)) throw new Error("noUiSlider: 'step' is not numeric.");
		parsed.singleStep = entry;
	}
	function testKeyboardPageMultiplier(parsed, entry) {
		if (!isNumeric(entry)) throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
		parsed.keyboardPageMultiplier = entry;
	}
	function testKeyboardMultiplier(parsed, entry) {
		if (!isNumeric(entry)) throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
		parsed.keyboardMultiplier = entry;
	}
	function testKeyboardDefaultStep(parsed, entry) {
		if (!isNumeric(entry)) throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
		parsed.keyboardDefaultStep = entry;
	}
	function testRange(parsed, entry) {
		if (typeof entry !== "object" || Array.isArray(entry)) throw new Error("noUiSlider: 'range' is not an object.");
		if (entry.min === void 0 || entry.max === void 0) throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
		parsed.spectrum = new Spectrum(entry, parsed.snap || false, parsed.singleStep);
	}
	function testStart(parsed, entry) {
		entry = asArray(entry);
		if (!Array.isArray(entry) || !entry.length) throw new Error("noUiSlider: 'start' option is incorrect.");
		parsed.handles = entry.length;
		parsed.start = entry;
	}
	function testSnap(parsed, entry) {
		if (typeof entry !== "boolean") throw new Error("noUiSlider: 'snap' option must be a boolean.");
		parsed.snap = entry;
	}
	function testAnimate(parsed, entry) {
		if (typeof entry !== "boolean") throw new Error("noUiSlider: 'animate' option must be a boolean.");
		parsed.animate = entry;
	}
	function testAnimationDuration(parsed, entry) {
		if (typeof entry !== "number") throw new Error("noUiSlider: 'animationDuration' option must be a number.");
		parsed.animationDuration = entry;
	}
	function testConnect(parsed, entry) {
		var connect = [false];
		var i;
		if (entry === "lower") entry = [true, false]; else if (entry === "upper") entry = [false, true];
		if (entry === true || entry === false) {
			for (i = 1; i < parsed.handles; i++) connect.push(entry);
			connect.push(false);
		} else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) throw new Error("noUiSlider: 'connect' option doesn't match handle count."); else connect = entry;
		parsed.connect = connect;
	}
	function testOrientation(parsed, entry) {
		switch (entry) {
			case "horizontal":
				parsed.ort = 0;
				break;

			case "vertical":
				parsed.ort = 1;
				break;

			default:
				throw new Error("noUiSlider: 'orientation' option is invalid.");
		}
	}
	function testMargin(parsed, entry) {
		if (!isNumeric(entry)) throw new Error("noUiSlider: 'margin' option must be numeric.");
		if (entry === 0) return;
		parsed.margin = parsed.spectrum.getDistance(entry);
	}
	function testLimit(parsed, entry) {
		if (!isNumeric(entry)) throw new Error("noUiSlider: 'limit' option must be numeric.");
		parsed.limit = parsed.spectrum.getDistance(entry);
		if (!parsed.limit || parsed.handles < 2) throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.");
	}
	function testPadding(parsed, entry) {
		var index;
		if (!isNumeric(entry) && !Array.isArray(entry)) throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
		if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
		if (entry === 0) return;
		if (!Array.isArray(entry)) entry = [entry, entry];
		parsed.padding = [parsed.spectrum.getDistance(entry[0]), parsed.spectrum.getDistance(entry[1])];
		for (index = 0; index < parsed.spectrum.xNumSteps.length - 1; index++) if (parsed.padding[0][index] < 0 || parsed.padding[1][index] < 0) throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
		var totalPadding = entry[0] + entry[1];
		var firstValue = parsed.spectrum.xVal[0];
		var lastValue = parsed.spectrum.xVal[parsed.spectrum.xVal.length - 1];
		if (totalPadding / (lastValue - firstValue) > 1) throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.");
	}
	function testDirection(parsed, entry) {
		switch (entry) {
			case "ltr":
				parsed.dir = 0;
				break;

			case "rtl":
				parsed.dir = 1;
				break;

			default:
				throw new Error("noUiSlider: 'direction' option was not recognized.");
		}
	}
	function testBehaviour(parsed, entry) {
		if (typeof entry !== "string") throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
		var tap = entry.indexOf("tap") >= 0;
		var drag = entry.indexOf("drag") >= 0;
		var fixed = entry.indexOf("fixed") >= 0;
		var snap = entry.indexOf("snap") >= 0;
		var hover = entry.indexOf("hover") >= 0;
		var unconstrained = entry.indexOf("unconstrained") >= 0;
		var dragAll = entry.indexOf("drag-all") >= 0;
		var smoothSteps = entry.indexOf("smooth-steps") >= 0;
		if (fixed) {
			if (parsed.handles !== 2) throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
			testMargin(parsed, parsed.start[1] - parsed.start[0]);
		}
		if (unconstrained && (parsed.margin || parsed.limit)) throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
		parsed.events = {
			tap: tap || snap,
			drag,
			dragAll,
			smoothSteps,
			fixed,
			snap,
			hover,
			unconstrained
		};
	}
	function testTooltips(parsed, entry) {
		if (entry === false) return;
		if (entry === true || isValidPartialFormatter(entry)) {
			parsed.tooltips = [];
			for (var i = 0; i < parsed.handles; i++) parsed.tooltips.push(entry);
		} else {
			entry = asArray(entry);
			if (entry.length !== parsed.handles) throw new Error("noUiSlider: must pass a formatter for all handles.");
			entry.forEach((function (formatter) {
				if (typeof formatter !== "boolean" && !isValidPartialFormatter(formatter)) throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
			}));
			parsed.tooltips = entry;
		}
	}
	function testHandleAttributes(parsed, entry) {
		if (entry.length !== parsed.handles) throw new Error("noUiSlider: must pass a attributes for all handles.");
		parsed.handleAttributes = entry;
	}
	function testAriaFormat(parsed, entry) {
		if (!isValidPartialFormatter(entry)) throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
		parsed.ariaFormat = entry;
	}
	function testFormat(parsed, entry) {
		if (!isValidFormatter(entry)) throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
		parsed.format = entry;
	}
	function testKeyboardSupport(parsed, entry) {
		if (typeof entry !== "boolean") throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
		parsed.keyboardSupport = entry;
	}
	function testDocumentElement(parsed, entry) {
		parsed.documentElement = entry;
	}
	function testCssPrefix(parsed, entry) {
		if (typeof entry !== "string" && entry !== false) throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
		parsed.cssPrefix = entry;
	}
	function testCssClasses(parsed, entry) {
		if (typeof entry !== "object") throw new Error("noUiSlider: 'cssClasses' must be an object.");
		if (typeof parsed.cssPrefix === "string") {
			parsed.cssClasses = {};
			Object.keys(entry).forEach((function (key) {
				parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
			}));
		} else parsed.cssClasses = entry;
	}
	function testOptions(options) {
		var parsed = {
			margin: null,
			limit: null,
			padding: null,
			animate: true,
			animationDuration: 300,
			ariaFormat: defaultFormatter,
			format: defaultFormatter
		};
		var tests = {
			step: {
				r: false,
				t: testStep
			},
			keyboardPageMultiplier: {
				r: false,
				t: testKeyboardPageMultiplier
			},
			keyboardMultiplier: {
				r: false,
				t: testKeyboardMultiplier
			},
			keyboardDefaultStep: {
				r: false,
				t: testKeyboardDefaultStep
			},
			start: {
				r: true,
				t: testStart
			},
			connect: {
				r: true,
				t: testConnect
			},
			direction: {
				r: true,
				t: testDirection
			},
			snap: {
				r: false,
				t: testSnap
			},
			animate: {
				r: false,
				t: testAnimate
			},
			animationDuration: {
				r: false,
				t: testAnimationDuration
			},
			range: {
				r: true,
				t: testRange
			},
			orientation: {
				r: false,
				t: testOrientation
			},
			margin: {
				r: false,
				t: testMargin
			},
			limit: {
				r: false,
				t: testLimit
			},
			padding: {
				r: false,
				t: testPadding
			},
			behaviour: {
				r: true,
				t: testBehaviour
			},
			ariaFormat: {
				r: false,
				t: testAriaFormat
			},
			format: {
				r: false,
				t: testFormat
			},
			tooltips: {
				r: false,
				t: testTooltips
			},
			keyboardSupport: {
				r: true,
				t: testKeyboardSupport
			},
			documentElement: {
				r: false,
				t: testDocumentElement
			},
			cssPrefix: {
				r: true,
				t: testCssPrefix
			},
			cssClasses: {
				r: true,
				t: testCssClasses
			},
			handleAttributes: {
				r: false,
				t: testHandleAttributes
			}
		};
		var defaults = {
			connect: false,
			direction: "ltr",
			behaviour: "tap",
			orientation: "horizontal",
			keyboardSupport: true,
			cssPrefix: "noUi-",
			cssClasses,
			keyboardPageMultiplier: 5,
			keyboardMultiplier: 1,
			keyboardDefaultStep: 10
		};
		if (options.format && !options.ariaFormat) options.ariaFormat = options.format;
		Object.keys(tests).forEach((function (name) {
			if (!isSet(options[name]) && defaults[name] === void 0) {
				if (tests[name].r) throw new Error("noUiSlider: '" + name + "' is required.");
				return;
			}
			tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
		}));
		parsed.pips = options.pips;
		var d = document.createElement("div");
		var msPrefix = d.style.msTransform !== void 0;
		var noPrefix = d.style.transform !== void 0;
		parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";
		var styles = [["left", "top"], ["right", "bottom"]];
		parsed.style = styles[parsed.dir][parsed.ort];
		return parsed;
	}
	function scope(target, options, originalOptions) {
		var actions = getActions();
		var supportsTouchActionNone = getSupportsTouchActionNone();
		var supportsPassive = supportsTouchActionNone && getSupportsPassive();
		var scope_Target = target;
		var scope_Base;
		var scope_Handles;
		var scope_Connects;
		var scope_Pips;
		var scope_Tooltips;
		var scope_Spectrum = options.spectrum;
		var scope_Values = [];
		var scope_Locations = [];
		var scope_HandleNumbers = [];
		var scope_ActiveHandlesCount = 0;
		var scope_Events = {};
		var scope_Document = target.ownerDocument;
		var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
		var scope_Body = scope_Document.body;
		var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;
		function addNodeTo(addTarget, className) {
			var div = scope_Document.createElement("div");
			if (className) addClass(div, className);
			addTarget.appendChild(div);
			return div;
		}
		function addOrigin(base, handleNumber) {
			var origin = addNodeTo(base, options.cssClasses.origin);
			var handle = addNodeTo(origin, options.cssClasses.handle);
			addNodeTo(handle, options.cssClasses.touchArea);
			handle.setAttribute("data-handle", String(handleNumber));
			if (options.keyboardSupport) {
				handle.setAttribute("tabindex", "0");
				handle.addEventListener("keydown", (function (event) {
					return eventKeydown(event, handleNumber);
				}));
			}
			if (options.handleAttributes !== void 0) {
				var attributes_1 = options.handleAttributes[handleNumber];
				Object.keys(attributes_1).forEach((function (attribute) {
					handle.setAttribute(attribute, attributes_1[attribute]);
				}));
			}
			handle.setAttribute("role", "slider");
			handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");
			if (handleNumber === 0) addClass(handle, options.cssClasses.handleLower); else if (handleNumber === options.handles - 1) addClass(handle, options.cssClasses.handleUpper);
			origin.handle = handle;
			return origin;
		}
		function addConnect(base, add) {
			if (!add) return false;
			return addNodeTo(base, options.cssClasses.connect);
		}
		function addElements(connectOptions, base) {
			var connectBase = addNodeTo(base, options.cssClasses.connects);
			scope_Handles = [];
			scope_Connects = [];
			scope_Connects.push(addConnect(connectBase, connectOptions[0]));
			for (var i = 0; i < options.handles; i++) {
				scope_Handles.push(addOrigin(base, i));
				scope_HandleNumbers[i] = i;
				scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
			}
		}
		function addSlider(addTarget) {
			addClass(addTarget, options.cssClasses.target);
			if (options.dir === 0) addClass(addTarget, options.cssClasses.ltr); else addClass(addTarget, options.cssClasses.rtl);
			if (options.ort === 0) addClass(addTarget, options.cssClasses.horizontal); else addClass(addTarget, options.cssClasses.vertical);
			var textDirection = getComputedStyle(addTarget).direction;
			if (textDirection === "rtl") addClass(addTarget, options.cssClasses.textDirectionRtl); else addClass(addTarget, options.cssClasses.textDirectionLtr);
			return addNodeTo(addTarget, options.cssClasses.base);
		}
		function addTooltip(handle, handleNumber) {
			if (!options.tooltips || !options.tooltips[handleNumber]) return false;
			return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
		}
		function isSliderDisabled() {
			return scope_Target.hasAttribute("disabled");
		}
		function isHandleDisabled(handleNumber) {
			var handleOrigin = scope_Handles[handleNumber];
			return handleOrigin.hasAttribute("disabled");
		}
		function disable(handleNumber) {
			if (handleNumber !== null && handleNumber !== void 0) {
				scope_Handles[handleNumber].setAttribute("disabled", "");
				scope_Handles[handleNumber].handle.removeAttribute("tabindex");
			} else {
				scope_Target.setAttribute("disabled", "");
				scope_Handles.forEach((function (handle) {
					handle.handle.removeAttribute("tabindex");
				}));
			}
		}
		function enable(handleNumber) {
			if (handleNumber !== null && handleNumber !== void 0) {
				scope_Handles[handleNumber].removeAttribute("disabled");
				scope_Handles[handleNumber].handle.setAttribute("tabindex", "0");
			} else {
				scope_Target.removeAttribute("disabled");
				scope_Handles.forEach((function (handle) {
					handle.removeAttribute("disabled");
					handle.handle.setAttribute("tabindex", "0");
				}));
			}
		}
		function removeTooltips() {
			if (scope_Tooltips) {
				removeEvent("update" + INTERNAL_EVENT_NS.tooltips);
				scope_Tooltips.forEach((function (tooltip) {
					if (tooltip) removeElement(tooltip);
				}));
				scope_Tooltips = null;
			}
		}
		function tooltips() {
			removeTooltips();
			scope_Tooltips = scope_Handles.map(addTooltip);
			bindEvent("update" + INTERNAL_EVENT_NS.tooltips, (function (values, handleNumber, unencoded) {
				if (!scope_Tooltips || !options.tooltips) return;
				if (scope_Tooltips[handleNumber] === false) return;
				var formattedValue = values[handleNumber];
				if (options.tooltips[handleNumber] !== true) formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
				scope_Tooltips[handleNumber].innerHTML = formattedValue;
			}));
		}
		function aria() {
			removeEvent("update" + INTERNAL_EVENT_NS.aria);
			bindEvent("update" + INTERNAL_EVENT_NS.aria, (function (values, handleNumber, unencoded, tap, positions) {
				scope_HandleNumbers.forEach((function (index) {
					var handle = scope_Handles[index];
					var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
					var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);
					var now = positions[index];
					var text = String(options.ariaFormat.to(unencoded[index]));
					min = scope_Spectrum.fromStepping(min).toFixed(1);
					max = scope_Spectrum.fromStepping(max).toFixed(1);
					now = scope_Spectrum.fromStepping(now).toFixed(1);
					handle.children[0].setAttribute("aria-valuemin", min);
					handle.children[0].setAttribute("aria-valuemax", max);
					handle.children[0].setAttribute("aria-valuenow", now);
					handle.children[0].setAttribute("aria-valuetext", text);
				}));
			}));
		}
		function getGroup(pips) {
			if (pips.mode === PipsMode.Range || pips.mode === PipsMode.Steps) return scope_Spectrum.xVal;
			if (pips.mode === PipsMode.Count) {
				if (pips.values < 2) throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
				var interval = pips.values - 1;
				var spread = 100 / interval;
				var values = [];
				while (interval--) values[interval] = interval * spread;
				values.push(100);
				return mapToRange(values, pips.stepped);
			}
			if (pips.mode === PipsMode.Positions) return mapToRange(pips.values, pips.stepped);
			if (pips.mode === PipsMode.Values) {
				if (pips.stepped) return pips.values.map((function (value) {
					return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
				}));
				return pips.values;
			}
			return [];
		}
		function mapToRange(values, stepped) {
			return values.map((function (value) {
				return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
			}));
		}
		function generateSpread(pips) {
			function safeIncrement(value, increment) {
				return Number((value + increment).toFixed(7));
			}
			var group = getGroup(pips);
			var indexes = {};
			var firstInRange = scope_Spectrum.xVal[0];
			var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
			var ignoreFirst = false;
			var ignoreLast = false;
			var prevPct = 0;
			group = unique(group.slice().sort((function (a, b) {
				return a - b;
			})));
			if (group[0] !== firstInRange) {
				group.unshift(firstInRange);
				ignoreFirst = true;
			}
			if (group[group.length - 1] !== lastInRange) {
				group.push(lastInRange);
				ignoreLast = true;
			}
			group.forEach((function (current, index) {
				var step;
				var i;
				var q;
				var low = current;
				var high = group[index + 1];
				var newPct;
				var pctDifference;
				var pctPos;
				var type;
				var steps;
				var realSteps;
				var stepSize;
				var isSteps = pips.mode === PipsMode.Steps;
				if (isSteps) step = scope_Spectrum.xNumSteps[index];
				if (!step) step = high - low;
				if (high === void 0) high = low;
				step = Math.max(step, 1e-7);
				for (i = low; i <= high; i = safeIncrement(i, step)) {
					newPct = scope_Spectrum.toStepping(i);
					pctDifference = newPct - prevPct;
					steps = pctDifference / (pips.density || 1);
					realSteps = Math.round(steps);
					stepSize = pctDifference / realSteps;
					for (q = 1; q <= realSteps; q += 1) {
						pctPos = prevPct + q * stepSize;
						indexes[pctPos.toFixed(5)] = [scope_Spectrum.fromStepping(pctPos), 0];
					}
					type = group.indexOf(i) > -1 ? PipsType.LargeValue : isSteps ? PipsType.SmallValue : PipsType.NoValue;
					if (!index && ignoreFirst && i !== high) type = 0;
					if (!(i === high && ignoreLast)) indexes[newPct.toFixed(5)] = [i, type];
					prevPct = newPct;
				}
			}));
			return indexes;
		}
		function addMarking(spread, filterFunc, formatter) {
			var _a, _b;
			var element = scope_Document.createElement("div");
			var valueSizeClasses = (_a = {}, _a[PipsType.None] = "", _a[PipsType.NoValue] = options.cssClasses.valueNormal,
				_a[PipsType.LargeValue] = options.cssClasses.valueLarge, _a[PipsType.SmallValue] = options.cssClasses.valueSub,
				_a);
			var markerSizeClasses = (_b = {}, _b[PipsType.None] = "", _b[PipsType.NoValue] = options.cssClasses.markerNormal,
				_b[PipsType.LargeValue] = options.cssClasses.markerLarge, _b[PipsType.SmallValue] = options.cssClasses.markerSub,
				_b);
			var valueOrientationClasses = [options.cssClasses.valueHorizontal, options.cssClasses.valueVertical];
			var markerOrientationClasses = [options.cssClasses.markerHorizontal, options.cssClasses.markerVertical];
			addClass(element, options.cssClasses.pips);
			addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);
			function getClasses(type, source) {
				var a = source === options.cssClasses.value;
				var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
				var sizeClasses = a ? valueSizeClasses : markerSizeClasses;
				return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
			}
			function addSpread(offset, value, type) {
				type = filterFunc ? filterFunc(value, type) : type;
				if (type === PipsType.None) return;
				var node = addNodeTo(element, false);
				node.className = getClasses(type, options.cssClasses.marker);
				node.style[options.style] = offset + "%";
				if (type > PipsType.NoValue) {
					node = addNodeTo(element, false);
					node.className = getClasses(type, options.cssClasses.value);
					node.setAttribute("data-value", String(value));
					node.style[options.style] = offset + "%";
					node.innerHTML = String(formatter.to(value));
				}
			}
			Object.keys(spread).forEach((function (offset) {
				addSpread(offset, spread[offset][0], spread[offset][1]);
			}));
			return element;
		}
		function removePips() {
			if (scope_Pips) {
				removeElement(scope_Pips);
				scope_Pips = null;
			}
		}
		function pips(pips) {
			removePips();
			var spread = generateSpread(pips);
			var filter = pips.filter;
			var format = pips.format || {
				to: function (value) {
					return String(Math.round(value));
				}
			};
			scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));
			return scope_Pips;
		}
		function baseSize() {
			var rect = scope_Base.getBoundingClientRect();
			var alt = "offset" + ["Width", "Height"][options.ort];
			return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
		}
		function attachEvent(events, element, callback, data) {
			var method = function (event) {
				var e = fixEvent(event, data.pageOffset, data.target || element);
				if (!e) return false;
				if (isSliderDisabled() && !data.doNotReject) return false;
				if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) return false;
				if (events === actions.start && e.buttons !== void 0 && e.buttons > 1) return false;
				if (data.hover && e.buttons) return false;
				if (!supportsPassive) e.preventDefault();
				e.calcPoint = e.points[options.ort];
				callback(e, data);
				return;
			};
			var methods = [];
			events.split(" ").forEach((function (eventName) {
				element.addEventListener(eventName, method, supportsPassive ? {
					passive: true
				} : false);
				methods.push([eventName, method]);
			}));
			return methods;
		}
		function fixEvent(e, pageOffset, eventTarget) {
			var touch = e.type.indexOf("touch") === 0;
			var mouse = e.type.indexOf("mouse") === 0;
			var pointer = e.type.indexOf("pointer") === 0;
			var x = 0;
			var y = 0;
			if (e.type.indexOf("MSPointer") === 0) pointer = true;
			if (e.type === "mousedown" && !e.buttons && !e.touches) return false;
			if (touch) {
				var isTouchOnTarget = function (checkTouch) {
					var target = checkTouch.target;
					return target === eventTarget || eventTarget.contains(target) || e.composed && e.composedPath().shift() === eventTarget;
				};
				if (e.type === "touchstart") {
					var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);
					if (targetTouches.length > 1) return false;
					x = targetTouches[0].pageX;
					y = targetTouches[0].pageY;
				} else {
					var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);
					if (!targetTouch) return false;
					x = targetTouch.pageX;
					y = targetTouch.pageY;
				}
			}
			pageOffset = pageOffset || getPageOffset(scope_Document);
			if (mouse || pointer) {
				x = e.clientX + pageOffset.x;
				y = e.clientY + pageOffset.y;
			}
			e.pageOffset = pageOffset;
			e.points = [x, y];
			e.cursor = mouse || pointer;
			return e;
		}
		function calcPointToPercentage(calcPoint) {
			var location = calcPoint - offset(scope_Base, options.ort);
			var proposal = location * 100 / baseSize();
			proposal = limit(proposal);
			return options.dir ? 100 - proposal : proposal;
		}
		function getClosestHandle(clickedPosition) {
			var smallestDifference = 100;
			var handleNumber = false;
			scope_Handles.forEach((function (handle, index) {
				if (isHandleDisabled(index)) return;
				var handlePosition = scope_Locations[index];
				var differenceWithThisHandle = Math.abs(handlePosition - clickedPosition);
				var clickAtEdge = differenceWithThisHandle === 100 && smallestDifference === 100;
				var isCloser = differenceWithThisHandle < smallestDifference;
				var isCloserAfter = differenceWithThisHandle <= smallestDifference && clickedPosition > handlePosition;
				if (isCloser || isCloserAfter || clickAtEdge) {
					handleNumber = index;
					smallestDifference = differenceWithThisHandle;
				}
			}));
			return handleNumber;
		}
		function documentLeave(event, data) {
			if (event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null) eventEnd(event, data);
		}
		function eventMove(event, data) {
			if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) return eventEnd(event, data);
			var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);
			var proposal = movement * 100 / data.baseSize;
			moveHandles(movement > 0, proposal, data.locations, data.handleNumbers, data.connect);
		}
		function eventEnd(event, data) {
			if (data.handle) {
				removeClass(data.handle, options.cssClasses.active);
				scope_ActiveHandlesCount -= 1;
			}
			data.listeners.forEach((function (c) {
				scope_DocumentElement.removeEventListener(c[0], c[1]);
			}));
			if (scope_ActiveHandlesCount === 0) {
				removeClass(scope_Target, options.cssClasses.drag);
				setZindex();
				if (event.cursor) {
					scope_Body.style.cursor = "";
					scope_Body.removeEventListener("selectstart", nouislider_preventDefault);
				}
			}
			if (options.events.smoothSteps) {
				data.handleNumbers.forEach((function (handleNumber) {
					setHandle(handleNumber, scope_Locations[handleNumber], true, true, false, false);
				}));
				data.handleNumbers.forEach((function (handleNumber) {
					fireEvent("update", handleNumber);
				}));
			}
			data.handleNumbers.forEach((function (handleNumber) {
				fireEvent("change", handleNumber);
				fireEvent("set", handleNumber);
				fireEvent("end", handleNumber);
			}));
		}
		function eventStart(event, data) {
			if (data.handleNumbers.some(isHandleDisabled)) return;
			var handle;
			if (data.handleNumbers.length === 1) {
				var handleOrigin = scope_Handles[data.handleNumbers[0]];
				handle = handleOrigin.children[0];
				scope_ActiveHandlesCount += 1;
				addClass(handle, options.cssClasses.active);
			}
			event.stopPropagation();
			var listeners = [];
			var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
				target: event.target,
				handle,
				connect: data.connect,
				listeners,
				startCalcPoint: event.calcPoint,
				baseSize: baseSize(),
				pageOffset: event.pageOffset,
				handleNumbers: data.handleNumbers,
				buttonsProperty: event.buttons,
				locations: scope_Locations.slice()
			});
			var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
				target: event.target,
				handle,
				listeners,
				doNotReject: true,
				handleNumbers: data.handleNumbers
			});
			var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
				target: event.target,
				handle,
				listeners,
				doNotReject: true,
				handleNumbers: data.handleNumbers
			});
			listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));
			if (event.cursor) {
				scope_Body.style.cursor = getComputedStyle(event.target).cursor;
				if (scope_Handles.length > 1) addClass(scope_Target, options.cssClasses.drag);
				scope_Body.addEventListener("selectstart", nouislider_preventDefault, false);
			}
			data.handleNumbers.forEach((function (handleNumber) {
				fireEvent("start", handleNumber);
			}));
		}
		function eventTap(event) {
			event.stopPropagation();
			var proposal = calcPointToPercentage(event.calcPoint);
			var handleNumber = getClosestHandle(proposal);
			if (handleNumber === false) return;
			if (!options.events.snap) addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
			setHandle(handleNumber, proposal, true, true);
			setZindex();
			fireEvent("slide", handleNumber, true);
			fireEvent("update", handleNumber, true);
			if (!options.events.snap) {
				fireEvent("change", handleNumber, true);
				fireEvent("set", handleNumber, true);
			} else eventStart(event, {
				handleNumbers: [handleNumber]
			});
		}
		function eventHover(event) {
			var proposal = calcPointToPercentage(event.calcPoint);
			var to = scope_Spectrum.getStep(proposal);
			var value = scope_Spectrum.fromStepping(to);
			Object.keys(scope_Events).forEach((function (targetEvent) {
				if ("hover" === targetEvent.split(".")[0]) scope_Events[targetEvent].forEach((function (callback) {
					callback.call(scope_Self, value);
				}));
			}));
		}
		function eventKeydown(event, handleNumber) {
			if (isSliderDisabled() || isHandleDisabled(handleNumber)) return false;
			var horizontalKeys = ["Left", "Right"];
			var verticalKeys = ["Down", "Up"];
			var largeStepKeys = ["PageDown", "PageUp"];
			var edgeKeys = ["Home", "End"];
			if (options.dir && !options.ort) horizontalKeys.reverse(); else if (options.ort && !options.dir) {
				verticalKeys.reverse();
				largeStepKeys.reverse();
			}
			var key = event.key.replace("Arrow", "");
			var isLargeDown = key === largeStepKeys[0];
			var isLargeUp = key === largeStepKeys[1];
			var isDown = key === verticalKeys[0] || key === horizontalKeys[0] || isLargeDown;
			var isUp = key === verticalKeys[1] || key === horizontalKeys[1] || isLargeUp;
			var isMin = key === edgeKeys[0];
			var isMax = key === edgeKeys[1];
			if (!isDown && !isUp && !isMin && !isMax) return true;
			event.preventDefault();
			var to;
			if (isUp || isDown) {
				var direction = isDown ? 0 : 1;
				var steps = getNextStepsForHandle(handleNumber);
				var step = steps[direction];
				if (step === null) return false;
				if (step === false) step = scope_Spectrum.getDefaultStep(scope_Locations[handleNumber], isDown, options.keyboardDefaultStep);
				if (isLargeUp || isLargeDown) step *= options.keyboardPageMultiplier; else step *= options.keyboardMultiplier;
				step = Math.max(step, 1e-7);
				step *= isDown ? -1 : 1;
				to = scope_Values[handleNumber] + step;
			} else if (isMax) to = options.spectrum.xVal[options.spectrum.xVal.length - 1]; else to = options.spectrum.xVal[0];
			setHandle(handleNumber, scope_Spectrum.toStepping(to), true, true);
			fireEvent("slide", handleNumber);
			fireEvent("update", handleNumber);
			fireEvent("change", handleNumber);
			fireEvent("set", handleNumber);
			return false;
		}
		function bindSliderEvents(behaviour) {
			if (!behaviour.fixed) scope_Handles.forEach((function (handle, index) {
				attachEvent(actions.start, handle.children[0], eventStart, {
					handleNumbers: [index]
				});
			}));
			if (behaviour.tap) attachEvent(actions.start, scope_Base, eventTap, {});
			if (behaviour.hover) attachEvent(actions.move, scope_Base, eventHover, {
				hover: true
			});
			if (behaviour.drag) scope_Connects.forEach((function (connect, index) {
				if (connect === false || index === 0 || index === scope_Connects.length - 1) return;
				var handleBefore = scope_Handles[index - 1];
				var handleAfter = scope_Handles[index];
				var eventHolders = [connect];
				var handlesToDrag = [handleBefore, handleAfter];
				var handleNumbersToDrag = [index - 1, index];
				addClass(connect, options.cssClasses.draggable);
				if (behaviour.fixed) {
					eventHolders.push(handleBefore.children[0]);
					eventHolders.push(handleAfter.children[0]);
				}
				if (behaviour.dragAll) {
					handlesToDrag = scope_Handles;
					handleNumbersToDrag = scope_HandleNumbers;
				}
				eventHolders.forEach((function (eventHolder) {
					attachEvent(actions.start, eventHolder, eventStart, {
						handles: handlesToDrag,
						handleNumbers: handleNumbersToDrag,
						connect
					});
				}));
			}));
		}
		function bindEvent(namespacedEvent, callback) {
			scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
			scope_Events[namespacedEvent].push(callback);
			if (namespacedEvent.split(".")[0] === "update") scope_Handles.forEach((function (a, index) {
				fireEvent("update", index);
			}));
		}
		function isInternalNamespace(namespace) {
			return namespace === INTERNAL_EVENT_NS.aria || namespace === INTERNAL_EVENT_NS.tooltips;
		}
		function removeEvent(namespacedEvent) {
			var event = namespacedEvent && namespacedEvent.split(".")[0];
			var namespace = event ? namespacedEvent.substring(event.length) : namespacedEvent;
			Object.keys(scope_Events).forEach((function (bind) {
				var tEvent = bind.split(".")[0];
				var tNamespace = bind.substring(tEvent.length);
				if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) if (!isInternalNamespace(tNamespace) || namespace === tNamespace) delete scope_Events[bind];
			}));
		}
		function fireEvent(eventName, handleNumber, tap) {
			Object.keys(scope_Events).forEach((function (targetEvent) {
				var eventType = targetEvent.split(".")[0];
				if (eventName === eventType) scope_Events[targetEvent].forEach((function (callback) {
					callback.call(scope_Self, scope_Values.map(options.format.to), handleNumber, scope_Values.slice(), tap || false, scope_Locations.slice(), scope_Self);
				}));
			}));
		}
		function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue, smoothSteps) {
			var distance;
			if (scope_Handles.length > 1 && !options.events.unconstrained) {
				if (lookBackward && handleNumber > 0) {
					distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.margin, false);
					to = Math.max(to, distance);
				}
				if (lookForward && handleNumber < scope_Handles.length - 1) {
					distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.margin, true);
					to = Math.min(to, distance);
				}
			}
			if (scope_Handles.length > 1 && options.limit) {
				if (lookBackward && handleNumber > 0) {
					distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.limit, false);
					to = Math.min(to, distance);
				}
				if (lookForward && handleNumber < scope_Handles.length - 1) {
					distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.limit, true);
					to = Math.max(to, distance);
				}
			}
			if (options.padding) {
				if (handleNumber === 0) {
					distance = scope_Spectrum.getAbsoluteDistance(0, options.padding[0], false);
					to = Math.max(to, distance);
				}
				if (handleNumber === scope_Handles.length - 1) {
					distance = scope_Spectrum.getAbsoluteDistance(100, options.padding[1], true);
					to = Math.min(to, distance);
				}
			}
			if (!smoothSteps) to = scope_Spectrum.getStep(to);
			to = limit(to);
			if (to === reference[handleNumber] && !getValue) return false;
			return to;
		}
		function inRuleOrder(v, a) {
			var o = options.ort;
			return (o ? a : v) + ", " + (o ? v : a);
		}
		function moveHandles(upward, proposal, locations, handleNumbers, connect) {
			var proposals = locations.slice();
			var firstHandle = handleNumbers[0];
			var smoothSteps = options.events.smoothSteps;
			var b = [!upward, upward];
			var f = [upward, !upward];
			handleNumbers = handleNumbers.slice();
			if (upward) handleNumbers.reverse();
			if (handleNumbers.length > 1) handleNumbers.forEach((function (handleNumber, o) {
				var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o], false, smoothSteps);
				if (to === false) proposal = 0; else {
					proposal = to - proposals[handleNumber];
					proposals[handleNumber] = to;
				}
			})); else b = f = [true];
			var state = false;
			handleNumbers.forEach((function (handleNumber, o) {
				state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o], false, smoothSteps) || state;
			}));
			if (state) {
				handleNumbers.forEach((function (handleNumber) {
					fireEvent("update", handleNumber);
					fireEvent("slide", handleNumber);
				}));
				if (connect != void 0) fireEvent("drag", firstHandle);
			}
		}
		function transformDirection(a, b) {
			return options.dir ? 100 - a - b : a;
		}
		function updateHandlePosition(handleNumber, to) {
			scope_Locations[handleNumber] = to;
			scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);
			var translation = transformDirection(to, 0) - scope_DirOffset;
			var translateRule = "translate(" + inRuleOrder(translation + "%", "0") + ")";
			scope_Handles[handleNumber].style[options.transformRule] = translateRule;
			updateConnect(handleNumber);
			updateConnect(handleNumber + 1);
		}
		function setZindex() {
			scope_HandleNumbers.forEach((function (handleNumber) {
				var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
				var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
				scope_Handles[handleNumber].style.zIndex = String(zIndex);
			}));
		}
		function setHandle(handleNumber, to, lookBackward, lookForward, exactInput, smoothSteps) {
			if (!exactInput) to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false, smoothSteps);
			if (to === false) return false;
			updateHandlePosition(handleNumber, to);
			return true;
		}
		function updateConnect(index) {
			if (!scope_Connects[index]) return;
			var l = 0;
			var h = 100;
			if (index !== 0) l = scope_Locations[index - 1];
			if (index !== scope_Connects.length - 1) h = scope_Locations[index];
			var connectWidth = h - l;
			var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
			var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";
			scope_Connects[index].style[options.transformRule] = translateRule + " " + scaleRule;
		}
		function resolveToValue(to, handleNumber) {
			if (to === null || to === false || to === void 0) return scope_Locations[handleNumber];
			if (typeof to === "number") to = String(to);
			to = options.format.from(to);
			if (to !== false) to = scope_Spectrum.toStepping(to);
			if (to === false || isNaN(to)) return scope_Locations[handleNumber];
			return to;
		}
		function valueSet(input, fireSetEvent, exactInput) {
			var values = asArray(input);
			var isInit = scope_Locations[0] === void 0;
			fireSetEvent = fireSetEvent === void 0 ? true : fireSetEvent;
			if (options.animate && !isInit) addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
			scope_HandleNumbers.forEach((function (handleNumber) {
				setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false, exactInput);
			}));
			var i = scope_HandleNumbers.length === 1 ? 0 : 1;
			if (isInit && scope_Spectrum.hasNoSize()) {
				exactInput = true;
				scope_Locations[0] = 0;
				if (scope_HandleNumbers.length > 1) {
					var space_1 = 100 / (scope_HandleNumbers.length - 1);
					scope_HandleNumbers.forEach((function (handleNumber) {
						scope_Locations[handleNumber] = handleNumber * space_1;
					}));
				}
			}
			for (; i < scope_HandleNumbers.length; ++i) scope_HandleNumbers.forEach((function (handleNumber) {
				setHandle(handleNumber, scope_Locations[handleNumber], true, true, exactInput);
			}));
			setZindex();
			scope_HandleNumbers.forEach((function (handleNumber) {
				fireEvent("update", handleNumber);
				if (values[handleNumber] !== null && fireSetEvent) fireEvent("set", handleNumber);
			}));
		}
		function valueReset(fireSetEvent) {
			valueSet(options.start, fireSetEvent);
		}
		function valueSetHandle(handleNumber, value, fireSetEvent, exactInput) {
			handleNumber = Number(handleNumber);
			if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) throw new Error("noUiSlider: invalid handle number, got: " + handleNumber);
			setHandle(handleNumber, resolveToValue(value, handleNumber), true, true, exactInput);
			fireEvent("update", handleNumber);
			if (fireSetEvent) fireEvent("set", handleNumber);
		}
		function valueGet(unencoded) {
			if (unencoded === void 0) unencoded = false;
			if (unencoded) return scope_Values.length === 1 ? scope_Values[0] : scope_Values.slice(0);
			var values = scope_Values.map(options.format.to);
			if (values.length === 1) return values[0];
			return values;
		}
		function destroy() {
			removeEvent(INTERNAL_EVENT_NS.aria);
			removeEvent(INTERNAL_EVENT_NS.tooltips);
			Object.keys(options.cssClasses).forEach((function (key) {
				removeClass(scope_Target, options.cssClasses[key]);
			}));
			while (scope_Target.firstChild) scope_Target.removeChild(scope_Target.firstChild);
			delete scope_Target.noUiSlider;
		}
		function getNextStepsForHandle(handleNumber) {
			var location = scope_Locations[handleNumber];
			var nearbySteps = scope_Spectrum.getNearbySteps(location);
			var value = scope_Values[handleNumber];
			var increment = nearbySteps.thisStep.step;
			var decrement = null;
			if (options.snap) return [value - nearbySteps.stepBefore.startValue || null, nearbySteps.stepAfter.startValue - value || null];
			if (increment !== false) if (value + increment > nearbySteps.stepAfter.startValue) increment = nearbySteps.stepAfter.startValue - value;
			if (value > nearbySteps.thisStep.startValue) decrement = nearbySteps.thisStep.step; else if (nearbySteps.stepBefore.step === false) decrement = false; else decrement = value - nearbySteps.stepBefore.highestStep;
			if (location === 100) increment = null; else if (location === 0) decrement = null;
			var stepDecimals = scope_Spectrum.countStepDecimals();
			if (increment !== null && increment !== false) increment = Number(increment.toFixed(stepDecimals));
			if (decrement !== null && decrement !== false) decrement = Number(decrement.toFixed(stepDecimals));
			return [decrement, increment];
		}
		function getNextSteps() {
			return scope_HandleNumbers.map(getNextStepsForHandle);
		}
		function updateOptions(optionsToUpdate, fireSetEvent) {
			var v = valueGet();
			var updateAble = ["margin", "limit", "padding", "range", "animate", "snap", "step", "format", "pips", "tooltips"];
			updateAble.forEach((function (name) {
				if (optionsToUpdate[name] !== void 0) originalOptions[name] = optionsToUpdate[name];
			}));
			var newOptions = testOptions(originalOptions);
			updateAble.forEach((function (name) {
				if (optionsToUpdate[name] !== void 0) options[name] = newOptions[name];
			}));
			scope_Spectrum = newOptions.spectrum;
			options.margin = newOptions.margin;
			options.limit = newOptions.limit;
			options.padding = newOptions.padding;
			if (options.pips) pips(options.pips); else removePips();
			if (options.tooltips) tooltips(); else removeTooltips();
			scope_Locations = [];
			valueSet(isSet(optionsToUpdate.start) ? optionsToUpdate.start : v, fireSetEvent);
		}
		function setupSlider() {
			scope_Base = addSlider(scope_Target);
			addElements(options.connect, scope_Base);
			bindSliderEvents(options.events);
			valueSet(options.start);
			if (options.pips) pips(options.pips);
			if (options.tooltips) tooltips();
			aria();
		}
		setupSlider();
		var scope_Self = {
			destroy,
			steps: getNextSteps,
			on: bindEvent,
			off: removeEvent,
			get: valueGet,
			set: valueSet,
			setHandle: valueSetHandle,
			reset: valueReset,
			disable,
			enable,
			__moveHandles: function (upward, proposal, handleNumbers) {
				moveHandles(upward, proposal, scope_Locations, handleNumbers);
			},
			options: originalOptions,
			updateOptions,
			target: scope_Target,
			removePips,
			removeTooltips,
			getPositions: function () {
				return scope_Locations.slice();
			},
			getTooltips: function () {
				return scope_Tooltips;
			},
			getOrigins: function () {
				return scope_Handles;
			},
			pips
		};
		return scope_Self;
	}
	function initialize(target, originalOptions) {
		if (!target || !target.nodeName) throw new Error("noUiSlider: create requires a single element, got: " + target);
		if (target.noUiSlider) throw new Error("noUiSlider: Slider was already initialized.");
		var options = testOptions(originalOptions);
		var api = scope(target, options, originalOptions);
		target.noUiSlider = api;
		return api;
	}
	function initNoUiField(page, page_count) {
		const pageItem = document.getElementById(page);
		const pageCount = document.getElementById(page_count);
		if (pageItem && pageCount) {
			const pageNumber = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
			const pageformat = {
				to: function (value) {
					return pageNumber[Math.round(value)];
				},
				from: function (value) {
					return pageNumber.indexOf(value);
				}
			};
			initialize(pageItem, {
				start: 3,
				connect: "lower",
				range: {
					min: 0,
					max: pageNumber.length - 1
				},
				step: 1,
				format: pageformat,
				pips: {
					mode: "steps",
					format: pageformat,
					density: 100
				}
			});
			pageItem.noUiSlider.on("update", (function (values, handle) {
				pageNumber.forEach((number => {
					pageItem.classList.remove(`active-pip-${number}`);
				}));
				pageItem.classList.add(`active-pip-${values}`);
				pageCount.textContent = values;
			}));
		}
	}
	function destroyNoUiField(page) {
		const pageItem = document.getElementById(page);
		if (pageItem && pageItem.noUiSlider) pageItem.noUiSlider.destroy();
	}
	initNoUiField("styles-page", "styles-page-count");
	initNoUiField("fill-page", "fill-page-count");
	addCursorHover(".rs-project__slide", ".cursor", "cursor__active");
	addCursorMove(".rs-project__slide", ".cursor__circle");
	function filterClear() {
		const filterItem = document.querySelectorAll(".rs-case .filter__item");
		const filterBtn = document.querySelector(".rs-case .filter__btn");
		function outputCountActiveFilter(where_find, where_output) {
			if (where_output) {
				let filterCount = document.createElement("span");
				filterCount.classList.add("filter__count");
				where_output.prepend(filterCount);
				const checkboxs = where_find.querySelectorAll('input[type="checkbox"]');
				checkboxs.forEach((checkbox => {
					checkbox.addEventListener("input", (function () {
						countChecked();
					}));
				}));
				function countChecked() {
					const activeCheckbox = where_find.querySelectorAll('input[type="checkbox"]:checked');
					let numCheckedFilter = activeCheckbox.length;
					if (numCheckedFilter > 0) {
						where_output.classList.add("_output-count");
						filterCount.style.display = "flex";
						filterCount.innerHTML = numCheckedFilter;
					} else {
						where_output.classList.remove("_output-count");
						filterCount.style.display = "none";
						filterCount.innerHTML = "0";
					}
				}
			}
		}
		outputCountActiveFilter(document, filterBtn);
		filterItem.forEach((filter => {
			const filterTitle = filter.querySelector(".filter__title");
			outputCountActiveFilter(filter, filterTitle);
		}));
	}
	if (document.querySelector(".rs-case .filter")) filterClear();
	function filterProject() {
		const filters = document.querySelectorAll(".filter");
		filters.forEach((filter => {
			const filterItems = filter.querySelectorAll(".filter__item");
			const filterBlock = filter.querySelector(".filter__block");
			const filterBtn = filter.querySelector(".filter__btn");
			if (filterBtn) filterBtn.addEventListener("click", (function () {
				filterBlock.classList.toggle("_open-filter");
				document.documentElement.classList.toggle("_open-filter");
			}));
			filterItems.forEach((item => {
				const filterShow = item.querySelector(".filter__title");
				const filterClose = item.querySelector(".filter__close");
				filterShow.addEventListener("click", (function () {
					if (!this.closest(".filter__item").classList.contains("_open-filter")) {
						filterItems.forEach((item => {
							if (item.classList.contains("_open-filter")) item.classList.remove("_open-filter");
						}));
						this.closest(".filter__item").classList.add("_open-filter");
					} else this.closest(".filter__item").classList.remove("_open-filter");
				}));
				filter.addEventListener("click", (function (e) {
					e.stopPropagation();
				}));
				document.addEventListener("click", (function (e) {
					item.classList.remove("_open-filter");
				}));
				if (filterClose) filterClose.addEventListener("click", (function () {
					item.classList.remove("_open-filter");
				}));
			}));
		}));
	}
	if (document.querySelector(".filter")) filterProject();
	function imitationProductLoad() {
		const projects = document.querySelectorAll(".rs-project");
		projects.forEach((project => {
			const showData = project.querySelector("[data-project-show]");
			const loadData = project.querySelector("[data-project-load]");
			const projectSlide = project.querySelectorAll(".rs-project__slide");
			const projectAdd = project.querySelector(".rs-project__add");
			let showCount = Number(showData.getAttribute("data-project-show"));
			let loadCount = Number(loadData.getAttribute("data-project-load"));
			function checkCurrentItems() {
				if (showCount >= projectSlide.length) projectAdd.classList.add("_close-btn");
			}
			checkCurrentItems();
			for (let i = 0; i < showCount; i++) if (projectSlide[i]) projectSlide[i].classList.add("_open-project");
			projectAdd.addEventListener("click", (function () {
				for (let i = showCount; i < showCount + loadCount; i++) if (projectSlide[i]) projectSlide[i].classList.add("_open-project");
				showCount += loadCount;
				checkCurrentItems();
				handleReveal();
			}));
		}));
	}
	if (document.querySelector(".rs-project")) imitationProductLoad();
	function sidebarNavigation() {
		const indicators = document.querySelectorAll(".rs-steps__navigation_list a");
		const sections = document.querySelectorAll(".rs-steps__spollers_item");
		if (indicators && sections) {
			const resetCurrentActiveIndicator = () => {
				const activeIndicator = document.querySelector("._active-step");
				if (activeIndicator) activeIndicator.classList.remove("_active-step");
			};
			indicators.forEach((indicator => {
				indicator.addEventListener("click", (function () {
					resetCurrentActiveIndicator();
					this.classList.add("_active-step");
				}));
			}));
			const onSectionLeavesViewport = section => {
				const observer = new IntersectionObserver((entries => {
					entries.forEach((entry => {
						if (entry.isIntersecting) {
							resetCurrentActiveIndicator();
							const element = entry.target;
							const indicator = document.querySelector(`.rs-steps__navigation_list a[href='#${element.id}']`);
							if (indicator) indicator.classList.add("_active-step");
							return;
						}
					}));
				}), {
					threshold: .75
				});
				observer.observe(section);
			};
			sections.forEach(onSectionLeavesViewport);
			indicators.forEach((indicator => {
				indicator.addEventListener("click", (function () {
					document.querySelector(this.getAttribute("href")).scrollIntoView({
						behavior: "smooth"
					});
				}));
			}));
		}
	}
	if (document.querySelector(".rs-steps__spollers_item") && document.querySelector(".rs-steps__navigation_list a")) sidebarNavigation();
	function openFullList() {
		const tariffs = document.querySelectorAll(".rs-tariff");
		tariffs.forEach((tariff => {
			const tariffAbout = tariff.querySelector(".rs-tariff__block");
			const tariffAdd = tariff.querySelector(".rs-tariff__add");
			if (tariffAdd && tariffAbout) tariffAdd.addEventListener("click", (function () {
				tariffAbout.classList.add("_full");
				tariffAdd.classList.add("_hide");
				handleReveal();
			}));
		}));
	}
	if (document.querySelector(".rs-tariff__block") && document.querySelector(".rs-tariff__add")) openFullList();
	let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
		const targetBlockElement = document.querySelector(targetBlock);
		if (targetBlockElement) {
			let headerItem = "";
			let headerItemHeight = 0;
			if (noHeader) {
				headerItem = ".rs-header";
				const headerElement = document.querySelector(headerItem);
				if (!headerElement.classList.contains("_header-scroll")) {
					headerElement.style.cssText = `transition-duration: 0s;`;
					headerElement.classList.add("_header-scroll");
					headerItemHeight = headerElement.offsetHeight;
					headerElement.classList.remove("_header-scroll");
					setTimeout((() => {
						headerElement.style.cssText = ``;
					}), 0);
				} else headerItemHeight = headerElement.offsetHeight;
			}
			let options = {
				speedAsDuration: true,
				speed,
				header: headerItem,
				offset: offsetTop,
				easing: "easeOutQuad"
			};
			document.documentElement.classList.contains("menu-open") ? menuClose() : null;
			if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
				let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
				targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
				targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
				window.scrollTo({
					top: targetBlockElementPosition,
					behavior: "smooth"
				});
			}
			functions_vnv(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
		} else functions_vnv(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
	};
	document.addEventListener("DOMContentLoaded", (function () {
		const formsBlock = document.querySelectorAll(".form");
		formsBlock.forEach((formBlock => {
			const form = formBlock.querySelector("form");
			const formLines = document.querySelectorAll(".form__line");
			const inputs = formBlock.querySelectorAll(".rs-input");
			inputs.forEach((input => {
				input.addEventListener("focus", (function () {
					this.classList.add("wpcf7-focus");
					this.closest(".form__line").classList.add("wpcf7-focus");
				}));
				input.addEventListener("blur", (function () {
					this.classList.remove("wpcf7-focus");
					this.closest(".form__line").classList.remove("wpcf7-focus");
					if (this.value.trim() !== "") {
						this.classList.add("wpcf7-content");
						this.closest(".form__line").classList.add("wpcf7-content");
					} else {
						this.classList.remove("wpcf7-content");
						this.closest(".form__line").classList.remove("wpcf7-content");
					}
					if (this.classList.contains("wpcf7-not-valid")) {
						this.classList.add("wpcf7-not-valid");
						this.closest(".form__line").classList.add("wpcf7-not-valid");
						this.classList.remove("wpcf7-valid");
						this.closest(".form__line").classList.remove("wpcf7-valid");
						const validTip = this.closest(".form__line").querySelector(".wpcf7-valid-tip");
						if (validTip) validTip.remove();
					} else if (this.value.trim() !== "") {
						this.classList.add("wpcf7-valid");
						this.closest(".form__line").classList.add("wpcf7-valid");
						this.classList.remove("wpcf7-not-valid");
						this.closest(".form__line").classList.remove("wpcf7-not-valid");
						if (!this.closest(".form__line").querySelector(".wpcf7-valid-tip")) {
							const validTip = document.createElement("span");
							validTip.classList.add("wpcf7-valid-tip");
							this.closest(".form__line").appendChild(validTip);
						}
					} else {
						this.classList.remove("wpcf7-valid");
						this.closest(".form__line").classList.remove("wpcf7-valid");
						const validTip = this.closest(".form__line").querySelector(".wpcf7-valid-tip");
						if (validTip) validTip.remove();
					}
				}));
			}));
			formLines.forEach((formLine => {
				const formInput = formLine.querySelector(".rs-input");
				const formClear = formLine.querySelector(".rs-input-clear");
				formInput.addEventListener("input", (function () {
					if (formInput.value != "") {
						formClear.style.display = "block";
						formInput.closest(".form__line").classList.add("wpcf7-content");
					} else {
						formClear.style.display = "none";
						formInput.closest(".form__line").classList.remove("wpcf7-content");
					}
				}));
				formClear.addEventListener("click", (function () {
					formInput.value = "";
					formClear.style.display = "none";
					formInput.closest(".form__line").classList.remove("wpcf7-content");
					formInput.focus();
				}));
			}));
			form.addEventListener("submit", (function () {
				setTimeout((() => {
					inputs.forEach((input => {
						input.classList.remove("wpcf7-focus", "wpcf7-content", "wpcf7-not-valid", "wpcf7-valid");
						input.closest(".form__line").classList.remove("wpcf7-focus", "wpcf7-content", "wpcf7-not-valid", "wpcf7-valid");
						const validTip = input.closest(".form__line").querySelector(".wpcf7-valid-tip");
						if (validTip) validTip.remove();
					}));
					formLines.forEach((formLine => {
						const formClear = formLine.querySelector(".rs-input-clear");
						formClear.style.display = "none";
					}));
				}), 300);
			}));
		}));
	}));
	function formQuantity() {
		document.addEventListener("click", (function (e) {
			let targetElement = e.target;
			if (targetElement.closest("[data-quantity-plus]") || targetElement.closest("[data-quantity-minus]")) {
				const valueElement = targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]");
				let value = parseInt(valueElement.value);
				if (targetElement.hasAttribute("data-quantity-plus")) {
					value++;
					if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) value = valueElement.dataset.quantityMax;
				} else {
					--value;
					if (+valueElement.dataset.quantityMin) {
						if (+valueElement.dataset.quantityMin > value) value = valueElement.dataset.quantityMin;
					} else if (value < 1) value = 1;
				}
				targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]").value = value;
			}
		}));
	}
	function formRating() {
		const ratings = document.querySelectorAll(".rating");
		if (ratings.length > 0) initRatings();
		function initRatings() {
			let ratingActive, ratingValue;
			for (let index = 0; index < ratings.length; index++) {
				const rating = ratings[index];
				initRating(rating);
			}
			function initRating(rating) {
				initRatingVars(rating);
				setRatingActiveWidth();
				if (rating.classList.contains("rating_set")) setRating(rating);
			}
			function initRatingVars(rating) {
				ratingActive = rating.querySelector(".rating__active");
				ratingValue = rating.querySelector(".rating__value");
			}
			function setRatingActiveWidth(index = ratingValue.innerHTML) {
				const ratingActiveWidth = index / .05;
				ratingActive.style.width = `${ratingActiveWidth}%`;
			}
			function setRating(rating) {
				const ratingItems = rating.querySelectorAll(".rating__item");
				for (let index = 0; index < ratingItems.length; index++) {
					const ratingItem = ratingItems[index];
					ratingItem.addEventListener("mouseenter", (function (e) {
						initRatingVars(rating);
						setRatingActiveWidth(ratingItem.value);
					}));
					ratingItem.addEventListener("mouseleave", (function (e) {
						setRatingActiveWidth();
					}));
					ratingItem.addEventListener("click", (function (e) {
						initRatingVars(rating);
						if (rating.dataset.ajax) setRatingValue(ratingItem.value, rating); else {
							ratingValue.innerHTML = index + 1;
							setRatingActiveWidth();
						}
					}));
				}
			}
			async function setRatingValue(value, rating) {
				if (!rating.classList.contains("rating_sending")) {
					rating.classList.add("rating_sending");
					let response = await fetch("rating.json", {
						method: "GET"
					});
					if (response.ok) {
						const result = await response.json();
						const newRating = result.newRating;
						ratingValue.innerHTML = newRating;
						setRatingActiveWidth();
						rating.classList.remove("rating_sending");
					} else {
						alert("Ошибка");
						rating.classList.remove("rating_sending");
					}
				}
			}
		}
	}
	class FullPage {
		constructor(element, options) {
			let config = {
				noEventSelector: "[data-no-event]",
				сlassInit: "fp-init",
				wrapperAnimatedClass: "fp-switching",
				selectorSection: "[data-fp-section]",
				activeClass: "active-section",
				previousClass: "previous-section",
				nextClass: "next-section",
				idActiveSection: 0,
				mode: element.dataset.fpEffect ? element.dataset.fpEffect : "slider",
				bullets: element.hasAttribute("data-fp-bullets") ? true : false,
				bulletsClass: "fp-bullets",
				bulletClass: "fp-bullet",
				bulletActiveClass: "fp-bullet-active",
				onInit: function () { },
				onSwitching: function () { },
				onDestroy: function () { }
			};
			this.options = Object.assign(config, options);
			this.wrapper = element;
			this.sections = this.wrapper.querySelectorAll(this.options.selectorSection);
			this.activeSection = false;
			this.activeSectionId = false;
			this.previousSection = false;
			this.previousSectionId = false;
			this.nextSection = false;
			this.nextSectionId = false;
			this.bulletsWrapper = false;
			this.stopEvent = false;
			if (this.sections.length) this.init();
		}
		init() {
			if (this.options.idActiveSection > this.sections.length - 1) return;
			this.setId();
			this.activeSectionId = this.options.idActiveSection;
			this.setEffectsClasses();
			this.setClasses();
			this.setStyle();
			if (this.options.bullets) {
				this.setBullets();
				this.setActiveBullet(this.activeSectionId);
			}
			this.events();
			setTimeout((() => {
				document.documentElement.classList.add(this.options.сlassInit);
				this.options.onInit(this);
				document.dispatchEvent(new CustomEvent("fpinit", {
					detail: {
						fp: this
					}
				}));
			}), 0);
		}
		destroy() {
			this.removeEvents();
			this.removeClasses();
			document.documentElement.classList.remove(this.options.сlassInit);
			this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
			this.removeEffectsClasses();
			this.removeZIndex();
			this.removeStyle();
			this.removeId();
			this.options.onDestroy(this);
			document.dispatchEvent(new CustomEvent("fpdestroy", {
				detail: {
					fp: this
				}
			}));
		}
		setId() {
			for (let index = 0; index < this.sections.length; index++) {
				const section = this.sections[index];
				section.setAttribute("data-fp-id", index);
			}
		}
		removeId() {
			for (let index = 0; index < this.sections.length; index++) {
				const section = this.sections[index];
				section.removeAttribute("data-fp-id");
			}
		}
		setClasses() {
			this.previousSectionId = this.activeSectionId - 1 >= 0 ? this.activeSectionId - 1 : false;
			this.nextSectionId = this.activeSectionId + 1 < this.sections.length ? this.activeSectionId + 1 : false;
			this.activeSection = this.sections[this.activeSectionId];
			this.activeSection.classList.add(this.options.activeClass);
			if (this.previousSectionId !== false) {
				this.previousSection = this.sections[this.previousSectionId];
				this.previousSection.classList.add(this.options.previousClass);
			} else this.previousSection = false;
			if (this.nextSectionId !== false) {
				this.nextSection = this.sections[this.nextSectionId];
				this.nextSection.classList.add(this.options.nextClass);
			} else this.nextSection = false;
		}
		removeEffectsClasses() {
			switch (this.options.mode) {
				case "slider":
					this.wrapper.classList.remove("slider-mode");
					break;

				case "cards":
					this.wrapper.classList.remove("cards-mode");
					this.setZIndex();
					break;

				case "fade":
					this.wrapper.classList.remove("fade-mode");
					this.setZIndex();
					break;

				default:
					break;
			}
		}
		setEffectsClasses() {
			switch (this.options.mode) {
				case "slider":
					this.wrapper.classList.add("slider-mode");
					break;

				case "cards":
					this.wrapper.classList.add("cards-mode");
					this.setZIndex();
					break;

				case "fade":
					this.wrapper.classList.add("fade-mode");
					this.setZIndex();
					break;

				default:
					break;
			}
		}
		setStyle() {
			switch (this.options.mode) {
				case "slider":
					this.styleSlider();
					break;

				case "cards":
					this.styleCards();
					break;

				case "fade":
					this.styleFade();
					break;

				default:
					break;
			}
		}
		styleSlider() {
			for (let index = 0; index < this.sections.length; index++) {
				const section = this.sections[index];
				if (index === this.activeSectionId) section.style.transform = "translate3D(0,0,0)"; else if (index < this.activeSectionId) section.style.transform = "translate3D(0,-100%,0)"; else if (index > this.activeSectionId) section.style.transform = "translate3D(0,100%,0)";
			}
		}
		styleCards() {
			for (let index = 0; index < this.sections.length; index++) {
				const section = this.sections[index];
				if (index >= this.activeSectionId) section.style.transform = "translate3D(0,0,0)"; else if (index < this.activeSectionId) section.style.transform = "translate3D(0,-100%,0)";
			}
		}
		styleFade() {
			for (let index = 0; index < this.sections.length; index++) {
				const section = this.sections[index];
				if (index === this.activeSectionId) {
					section.style.opacity = "1";
					section.style.visibility = "visible";
				} else {
					section.style.opacity = "0";
					section.style.visibility = "hidden";
				}
			}
		}
		removeStyle() {
			for (let index = 0; index < this.sections.length; index++) {
				const section = this.sections[index];
				section.style.opacity = "";
				section.style.visibility = "";
				section.style.transform = "";
			}
		}
		checkScroll(yCoord, element) {
			this.goScroll = false;
			if (!this.stopEvent && element) {
				this.goScroll = true;
				if (this.haveScroll(element)) {
					this.goScroll = false;
					const position = Math.round(element.scrollHeight - element.scrollTop);
					if (Math.abs(position - element.scrollHeight) < 2 && yCoord <= 0 || Math.abs(position - element.clientHeight) < 2 && yCoord >= 0) this.goScroll = true;
				}
			}
		}
		haveScroll(element) {
			return element.scrollHeight !== window.innerHeight;
		}
		removeClasses() {
			for (let index = 0; index < this.sections.length; index++) {
				const section = this.sections[index];
				section.classList.remove(this.options.activeClass);
				section.classList.remove(this.options.previousClass);
				section.classList.remove(this.options.nextClass);
			}
		}
		events() {
			this.events = {
				wheel: this.wheel.bind(this),
				touchdown: this.touchDown.bind(this),
				touchup: this.touchUp.bind(this),
				touchmove: this.touchMove.bind(this),
				touchcancel: this.touchUp.bind(this),
				transitionEnd: this.transitionend.bind(this),
				click: this.clickBullets.bind(this)
			};
			if (isMobile.iOS()) document.addEventListener("touchmove", (e => {
				e.preventDefault();
			}));
			this.setEvents();
		}
		setEvents() {
			this.wrapper.addEventListener("wheel", this.events.wheel);
			this.wrapper.addEventListener("touchstart", this.events.touchdown);
			if (this.options.bullets && this.bulletsWrapper) this.bulletsWrapper.addEventListener("click", this.events.click);
		}
		removeEvents() {
			this.wrapper.removeEventListener("wheel", this.events.wheel);
			this.wrapper.removeEventListener("touchdown", this.events.touchdown);
			this.wrapper.removeEventListener("touchup", this.events.touchup);
			this.wrapper.removeEventListener("touchcancel", this.events.touchup);
			this.wrapper.removeEventListener("touchmove", this.events.touchmove);
			if (this.bulletsWrapper) this.bulletsWrapper.removeEventListener("click", this.events.click);
		}
		clickBullets(e) {
			const bullet = e.target.closest(`.${this.options.bulletClass}`);
			if (bullet) {
				const arrayChildren = Array.from(this.bulletsWrapper.children);
				const idClickBullet = arrayChildren.indexOf(bullet);
				this.switchingSection(idClickBullet);
			}
		}
		setActiveBullet(idButton) {
			if (!this.bulletsWrapper) return;
			const bullets = this.bulletsWrapper.children;
			for (let index = 0; index < bullets.length; index++) {
				const bullet = bullets[index];
				if (idButton === index) bullet.classList.add(this.options.bulletActiveClass); else bullet.classList.remove(this.options.bulletActiveClass);
			}
		}
		touchDown(e) {
			this._yP = e.changedTouches[0].pageY;
			this._eventElement = e.target.closest(`.${this.options.activeClass}`);
			if (this._eventElement) {
				this._eventElement.addEventListener("touchend", this.events.touchup);
				this._eventElement.addEventListener("touchcancel", this.events.touchup);
				this._eventElement.addEventListener("touchmove", this.events.touchmove);
				this.clickOrTouch = true;
				if (isMobile.iOS()) {
					if (this._eventElement.scrollHeight !== this._eventElement.clientHeight) {
						if (this._eventElement.scrollTop === 0) this._eventElement.scrollTop = 1;
						if (this._eventElement.scrollTop === this._eventElement.scrollHeight - this._eventElement.clientHeight) this._eventElement.scrollTop = this._eventElement.scrollHeight - this._eventElement.clientHeight - 1;
					}
					this.allowUp = this._eventElement.scrollTop > 0;
					this.allowDown = this._eventElement.scrollTop < this._eventElement.scrollHeight - this._eventElement.clientHeight;
					this.lastY = e.changedTouches[0].pageY;
				}
			}
		}
		touchMove(e) {
			const targetElement = e.target.closest(`.${this.options.activeClass}`);
			if (isMobile.iOS()) {
				let up = e.changedTouches[0].pageY > this.lastY;
				let down = !up;
				this.lastY = e.changedTouches[0].pageY;
				if (targetElement) if (up && this.allowUp || down && this.allowDown) e.stopPropagation(); else if (e.cancelable) e.preventDefault();
			}
			if (!this.clickOrTouch || e.target.closest(this.options.noEventSelector)) return;
			let yCoord = this._yP - e.changedTouches[0].pageY;
			this.checkScroll(yCoord, targetElement);
			if (this.goScroll && Math.abs(yCoord) > 20) this.choiceOfDirection(yCoord);
		}
		touchUp(e) {
			this._eventElement.removeEventListener("touchend", this.events.touchup);
			this._eventElement.removeEventListener("touchcancel", this.events.touchup);
			this._eventElement.removeEventListener("touchmove", this.events.touchmove);
			return this.clickOrTouch = false;
		}
		transitionend(e) {
			if (e.target.closest(this.options.selectorSection)) {
				this.stopEvent = false;
				this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
			}
		}
		wheel(e) {
			if (e.target.closest(this.options.noEventSelector)) return;
			const yCoord = e.deltaY;
			const targetElement = e.target.closest(`.${this.options.activeClass}`);
			this.checkScroll(yCoord, targetElement);
			if (this.goScroll) this.choiceOfDirection(yCoord);
		}
		choiceOfDirection(direction) {
			this.stopEvent = true;
			if (this.activeSectionId === 0 && direction < 0 || this.activeSectionId === this.sections.length - 1 && direction > 0) this.stopEvent = false;
			if (direction > 0 && this.nextSection !== false) this.activeSectionId = this.activeSectionId + 1 < this.sections.length ? ++this.activeSectionId : this.activeSectionId; else if (direction < 0 && this.previousSection !== false) this.activeSectionId = this.activeSectionId - 1 >= 0 ? --this.activeSectionId : this.activeSectionId;
			if (this.stopEvent) this.switchingSection();
		}
		switchingSection(idSection = this.activeSectionId) {
			this.activeSectionId = idSection;
			this.wrapper.classList.add(this.options.wrapperAnimatedClass);
			this.wrapper.addEventListener("transitionend", this.events.transitionEnd);
			this.removeClasses();
			this.setClasses();
			this.setStyle();
			if (this.options.bullets) this.setActiveBullet(this.activeSectionId);
			this.options.onSwitching(this);
			document.dispatchEvent(new CustomEvent("fpswitching", {
				detail: {
					fp: this
				}
			}));
		}
		setBullets() {
			this.bulletsWrapper = document.querySelector(`.${this.options.bulletsClass}`);
			if (!this.bulletsWrapper) {
				const bullets = document.createElement("div");
				bullets.classList.add(this.options.bulletsClass);
				this.wrapper.append(bullets);
				this.bulletsWrapper = bullets;
			}
			if (this.bulletsWrapper) for (let index = 0; index < this.sections.length; index++) {
				const span = document.createElement("span");
				span.classList.add(this.options.bulletClass);
				this.bulletsWrapper.append(span);
			}
		}
		setZIndex() {
			let zIndex = this.sections.length;
			for (let index = 0; index < this.sections.length; index++) {
				const section = this.sections[index];
				section.style.zIndex = zIndex;
				--zIndex;
			}
		}
		removeZIndex() {
			for (let index = 0; index < this.sections.length; index++) {
				const section = this.sections[index];
				section.style.zIndex = "";
			}
		}
	}
	if (document.querySelector("[data-fp]")) modules_vnvModules.fullpage = new FullPage(document.querySelector("[data-fp]"), "");
	let addWindowScrollEvent = false;
	function pageNavigation() {
		document.addEventListener("click", pageNavigationAction);
		document.addEventListener("watcherCallback", pageNavigationAction);
		function pageNavigationAction(e) {
			if (e.type === "click") {
				const targetElement = e.target;
				if (targetElement.closest("[data-goto]")) {
					const gotoLink = targetElement.closest("[data-goto]");
					const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
					const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
					const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
					const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
					gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
					e.preventDefault();
				}
			} else if (e.type === "watcherCallback" && e.detail) {
				const entry = e.detail.entry;
				const targetElement = entry.target;
				if (targetElement.dataset.watch === "navigator") {
					document.querySelector(`[data-goto]._navigator-active`);
					let navigatorCurrentItem;
					if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
						const element = targetElement.classList[index];
						if (document.querySelector(`[data-goto=".${element}"]`)) {
							navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
							break;
						}
					}
					if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
				}
			}
		}
		if (getHash()) {
			let goToHash;
			if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
			goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
		}
	}
	function headerScroll() {
		addWindowScrollEvent = true;
		const headerAll = document.querySelectorAll(".rs-header");
		headerAll.forEach((header => {
			const headerShow = header.hasAttribute("data-scroll-show");
			header.dataset.scrollShow && header.dataset.scrollShow;
			const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
			let scrollDirection = 0;
			document.addEventListener("windowScroll", (function (e) {
				const scrollTop = window.scrollY;
				if (scrollTop >= startPoint) {
					!header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
					if (headerShow) if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
				} else {
					header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
					if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
				}
				scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
			}));
		}));
	}
	setTimeout((() => {
		if (addWindowScrollEvent) {
			let windowScroll = new Event("windowScroll");
			window.addEventListener("scroll", (function (e) {
				document.dispatchEvent(windowScroll);
			}));
		}
	}), 0);
	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
	const loader = document.querySelector(".mg-loader");
	const loaderFillv1 = loader.querySelector(".mg-loader-fill.-v1");
	const loaderFillv2 = loader.querySelector(".mg-loader-fill.-v2");
	const loaderAnim = (element, yPercent, delay) => {
		gsap.to(element, {
			yPercent,
			delay,
			duration: .6,
			ease: "cubic-bezier(0.9, 0, 0.2, 1)"
		});
	};
	loaderAnim(loaderFillv1, 100, .4);
	loaderAnim(loaderFillv2, 100, .2);
	const handleResize = () => {
		requestAnimationFrame((() => {
			ScrollTrigger.refresh();
		}));
	};
	const handleReveal = () => {
		initAnimationsBasedOnWidth();
		if (typeof refreshScrollTrigger === "function") refreshScrollTrigger();
	};
	let currentWidthAnimation = null;
	const stagger = .5;
	function animateSvgDashedLine({ dashedSelector, maskSelector, topOffset = 50, endOffset = 500, markers = false }) {
		const dasheds = document.querySelectorAll(dashedSelector);
		dasheds.forEach((dashed => {
			const trigger = dashed.closest("section");
			const mask = dashed.closest('section [class*="__line"]').querySelector(".mask-path");
			if (dashed && mask && trigger) {
				gsap.from(mask, {
					scrollTrigger: {
						trigger,
						start: `top-=50% top`,
						end: `bottom+=50% bottom`,
						scrub: 1,
						markers
					}
				});
				gsap.from(dashed, {
					"--dashOffset": 1e3,
					scrollTrigger: {
						trigger,
						start: `top-=${topOffset}% top`,
						end: `bottom+=${endOffset}% bottom`,
						scrub: 1,
						markers
					}
				});
				dashed.setAttribute("stroke-dashoffset", "var(--dashOffset)");
			}
		}));
	}
	function revealOnScroll({ elements, duration = .5, delay = .3, direction = "bottom-up" }) {
		const items = gsap.utils.toArray(elements);
		const getAnimationProps = (direction, index) => {
			const baseProps = {
				autoAlpha: 0,
				duration,
				delay: direction.includes("--every") ? delay * (index + 1) : delay
			};
			switch (direction.replace("--every", "")) {
				case "bottom-up":
					return {
						...baseProps,
						from: {
							autoAlpha: 0,
							y: 50
						},
						to: {
							autoAlpha: 1,
							y: 0
						}
					};

				case "up-bottom":
					return {
						...baseProps,
						from: {
							autoAlpha: 0,
							y: -50
						},
						to: {
							autoAlpha: 1,
							y: 0
						}
					};

				case "left-right":
					return {
						...baseProps,
						from: {
							autoAlpha: 0,
							x: -50
						},
						to: {
							autoAlpha: 1,
							x: 0
						}
					};

				case "right-left":
					return {
						...baseProps,
						from: {
							autoAlpha: 0,
							x: 50
						},
						to: {
							autoAlpha: 1,
							x: 0
						}
					};

				case "fade":
					return {
						...baseProps,
						from: {
							autoAlpha: 0
						},
						to: {
							autoAlpha: 1
						}
					};

				case "scale":
					return {
						...baseProps,
						from: {
							scale: 0,
							autoAlpha: 0
						},
						to: {
							scale: 1,
							autoAlpha: 1
						}
					};

				case "width-100":
					return {
						from: {
							width: "0%"
						},
						to: {
							width: "100%",
							ease: "cubic-bezier(0.4, 0, 0.2, 1)"
						}
					};

				default:
					return {};
			}
		};
		items.forEach(((item, index) => {
			if (!item.classList.contains("animated")) {
				const { from, to, duration, delay } = getAnimationProps(direction, index);
				const anim = gsap.fromTo(item, from, {
					...to,
					duration,
					delay
				});
				ScrollTrigger.create({
					trigger: item,
					animation: anim,
					once: true,
					onEnter: () => item.classList.add("animated")
				});
			}
		}));
	}
	let refreshScrollTrigger = null;
	function horizontalScroll({ blockSelector, triggerSelector, progressSelector }) {
		const block = document.querySelector(blockSelector);
		const trigger = document.querySelector(triggerSelector);
		const progress = document.querySelector(progressSelector);
		let scrollTriggerInstance;
		if (block && trigger && progress) {
			const createScrollTrigger = () => {
				if (scrollTriggerInstance) scrollTriggerInstance.kill();
				scrollTriggerInstance = ScrollTrigger.create({
					trigger,
					start: "top-=10% top",
					end: () => `+=${trigger.clientHeight + window.innerHeight}`,
					scrub: true,
					pin: true,
					invalidateOnRefresh: true,
					anticipatePin: 1,
					onUpdate: self => {
						gsap.to(block, {
							x: () => -self.progress * (block.scrollWidth - block.clientWidth) + "px",
							duration: .1,
							ease: "power1.inOut"
						});
						const progressValue = (self.progress * 100).toFixed(2) + "%";
						gsap.to(progress, {
							width: progressValue,
							duration: .1,
							ease: "power1.inOut"
						});
					}
				});
			};
			createScrollTrigger();
			refreshScrollTrigger = () => {
				createScrollTrigger();
				ScrollTrigger.refresh();
			};
			const nextButton = trigger.querySelector(".swiper-button-next");
			const prevButton = trigger.querySelector(".swiper-button-prev");
			let nextButtonClickHandler = null;
			let prevButtonClickHandler = null;
			if (nextButton) {
				nextButton.removeEventListener("click", nextButtonClickHandler);
				nextButtonClickHandler = () => {
					let scrollAmount = 300 / document.documentElement.clientHeight;
					let newScrollPosition = scrollTrigger.progress + scrollAmount;
					scrollTrigger.scroll(scrollTrigger.start + newScrollPosition * (scrollTrigger.end - scrollTrigger.start));
				};
				nextButton.addEventListener("click", nextButtonClickHandler);
			}
			if (prevButton) {
				prevButton.removeEventListener("click", prevButtonClickHandler);
				prevButtonClickHandler = () => {
					let scrollAmount = 300 / document.documentElement.clientHeight;
					let newScrollPosition = scrollTrigger.progress - scrollAmount;
					scrollTrigger.scroll(scrollTrigger.start + newScrollPosition * (scrollTrigger.end - scrollTrigger.start));
				};
				prevButton.addEventListener("click", prevButtonClickHandler);
			}
		}
	}
	function updatePrimaryColor() {
		const wrapperStyles = window.getComputedStyle(document.querySelector(".wrapper"));
		const primaryColor = wrapperStyles.getPropertyValue("--primary-color");
		document.body.style.setProperty("--primary-color", primaryColor);
	}
	function debounce(func, wait) {
		let timeout;
		return function () {
			const context = this, args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout((() => func.apply(context, args)), wait);
		};
	}
	function clearAnimations() {
		ScrollTrigger.getAll().forEach((trigger => {
			trigger.kill();
		}));
		document.querySelectorAll(".pin-spacer, .gsap-pin-spacer").forEach((spacer => {
			spacer.replaceWith(...spacer.childNodes);
		}));
		console.log("Все анимации и pin-spacer удалены");
	}
	function initAnimationsBasedOnWidth() {
		const width = window.innerWidth;
		const scrollPos = window.scrollY || window.pageYOffse;
		clearAnimations();
		window.scrollTo(0, scrollPos);
		if (width >= 991.98) {
			if (currentWidthAnimation === "mobile") clearAnimations();
			initializeDesktopAnimations();
			currentWidthAnimation = "desktop";
		} else {
			if (currentWidthAnimation === "desktop") clearAnimations();
			initializeMobileAnimations();
			currentWidthAnimation = "mobile";
		}
		initializeCommonAnimations();
		ScrollTrigger.refresh();
	}
	function videoPlay() {
		console.log("func load");
		const videoElements = document.querySelectorAll("video");
		if (videoElements.length > 0) videoElements.forEach((videoElement => {
			console.log(videoElement);
			videoElement.play().catch((function (error) {
				console.error("Автоматическое воспроизведение видео не удалось: ", error);
			}));
		}));
	}
	const debouncedInitAnimations = debounce(initAnimationsBasedOnWidth, 100);
	window.addEventListener("resize", debouncedInitAnimations);
	window.addEventListener("orientationchange", (() => {
		setTimeout((() => {
			initAnimationsBasedOnWidth();
		}), 500);
	}));
	window.addEventListener("load", (() => {
		updatePrimaryColor();
		initAnimationsBasedOnWidth();
		handleResize();
		videoPlay();
		console.log("Load page");
		setTimeout((() => {
			window.scrollTo(0, 0);
		}), 300);
	}));
	function initializeCommonAnimations() {
		console.log("Инициализация общих анимаций");
		if (document.querySelector(".rs-features__slide")) setTimeout((() => {
			const stackItems = gsap.utils.toArray(".rs-features__slide");
			gsap.set(stackItems, {
				yPercent: index => 0,
				scale: index => 1
			});
			const stackTimeline = gsap.timeline({
				scrollTrigger: {
					trigger: ".rs-features__wrapper",
					start: "top top",
					end: "bottom+=50% top",
					pin: true,
					pinSpacing: true,
					scrub: true,
					invalidateOnRefresh: true
				}
			});
			stackTimeline.to(stackItems, {
				yPercent: index => -100 * index,
				duration: 1,
				ease: "power2.inOut",
				stagger
			}).to(stackItems, {
				scale: index => 1 - (stackItems.length - index) * .025,
				duration: 1,
				ease: "power2.inOut",
				stagger
			}, stagger);
			handleResize();
		}), 1e3);
		if (document.querySelector(".rs-main__title h1")) setTimeout((() => {
			gsap.to(".rs-main__title h1", {
				scrollTrigger: {
					trigger: ".rs-main__title",
					start: `top top`,
					end: `bottom bottom`,
					endTrigger: ".rs-main__pins",
					pin: true,
					pinSpacing: false,
					scrub: true,
					invalidateOnRefresh: true
				}
			});
			gsap.set(".rs-main__title h1", {
				scale: 0,
				opacity: 0
			});
			gsap.to(".rs-main__title h1", {
				scale: 1,
				opacity: 1,
				scrollTrigger: {
					start: `top+=50% top`,
					end: `bottom=+50% bottom`,
					endTrigger: ".rs-main__title",
					scrub: true
				}
			});
		}), 100);
		animateSvgDashedLine({
			dashedSelector: "section [class*='__line'] .dashed-path"
		});
		revealOnScroll({
			elements: ".mrp-med-65"
		});
		revealOnScroll({
			elements: ".mrp-med-50"
		});
		revealOnScroll({
			elements: ".mrp-med-45"
		});
		revealOnScroll({
			elements: ".mrp-med-40"
		});
		revealOnScroll({
			elements: ".mrp-med-25"
		});
		revealOnScroll({
			elements: ".mrp-med-21"
		});
		revealOnScroll({
			elements: ".mrp-med-18"
		});
		revealOnScroll({
			elements: ".mrp-reg-25"
		});
		revealOnScroll({
			elements: ".mrp-reg-21"
		});
		revealOnScroll({
			elements: ".mrp-reg-18"
		});
		revealOnScroll({
			elements: "blockquote"
		});
		revealOnScroll({
			elements: ".rs-header__menu",
			direction: "fade"
		});
		revealOnScroll({
			elements: ".rs-header__logo",
			delay: .3,
			direction: "fade"
		});
		revealOnScroll({
			elements: ".rs-header__actions",
			delay: .45,
			direction: "fade"
		});
		revealOnScroll({
			elements: ".rs-banner__buttons",
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-banner__body ul",
			delay: .3
		});
		revealOnScroll({
			elements: ".rs-banner__bg",
			delay: .15,
			direction: "width-100"
		});
		revealOnScroll({
			elements: ".rs-slider-block__slide",
			direction: "right-left--every"
		});
		revealOnScroll({
			elements: ".rs-slider-block__slider",
			direction: "right-left"
		});
		revealOnScroll({
			elements: ".rs-slider-block__icon",
			delay: .15,
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-project__item",
			duration: .3,
			delay: .15,
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-project__filter",
			delay: 1,
			direction: "fade"
		});
		revealOnScroll({
			elements: ".rs-project__add",
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-steps__navigation_list li a",
			delay: .15,
			direction: "left-right--every"
		});
		revealOnScroll({
			elements: ".rs-steps__item",
			delay: .3,
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-steps__footer ul li"
		});
		revealOnScroll({
			elements: ".rs-calc__bg",
			delay: .2
		});
		revealOnScroll({
			elements: ".rs-calc__settings_wrapper",
			delay: .3
		});
		revealOnScroll({
			elements: ".rs-calc__cost_img",
			delay: .2,
			direction: "right-left"
		});
		revealOnScroll({
			elements: ".rs-calc__cost_list ul li",
			delay: .15,
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-calc__cost_footer",
			delay: .3,
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-reviews__bg",
			delay: .2
		});
		revealOnScroll({
			elements: ".rs-reviews__slide",
			delay: .2,
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-reviews__sticker",
			delay: .2,
			direction: "right-left"
		});
		revealOnScroll({
			elements: ".rs-services__slide",
			delay: .2,
			direction: "right-left--every"
		});
		revealOnScroll({
			elements: ".rs-services__icon",
			delay: .15,
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-footer .rs-breadcrumbs",
			delay: .2
		});
		revealOnScroll({
			elements: ".rs-footer__phone",
			delay: .2
		});
		revealOnScroll({
			elements: ".rs-footer__links ul li",
			delay: .15,
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-footer__social"
		});
		revealOnScroll({
			elements: ".rs-footer__spollers_item",
			delay: .15,
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-footer__city",
			delay: .3
		});
		revealOnScroll({
			elements: ".rs-footer__copyright",
			delay: .4,
			direction: "left-right"
		});
		revealOnScroll({
			elements: ".rs-text-block .rs-text-block__picture .rs-text-block__img-0 img",
			delay: .3,
			direction: "scale"
		});
		revealOnScroll({
			elements: ".rs-text-block .rs-text-block__picture .rs-text-block__img-1 img",
			delay: .6,
			direction: "scale"
		});
		revealOnScroll({
			elements: ".rs-text-block .rs-text-block__picture .rs-text-block__img-2 img",
			delay: .9,
			direction: "scale"
		});
		revealOnScroll({
			elements: ".rs-text-block .rs-text-block__picture .rs-text-block__img-3 img",
			delay: 1.2,
			direction: "scale"
		});
		revealOnScroll({
			elements: ".rs-text-block .rs-text-block__picture .rs-text-block__icons img",
			delay: .3,
			direction: "scale--every"
		});
		revealOnScroll({
			elements: ".rs-text-block__description ol li",
			duration: .15,
			delay: .3,
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-text-block__description ul li",
			duration: .15,
			delay: .3,
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-workflow .rs-workflow__img img",
			delay: .3,
			direction: "scale--every"
		});
		revealOnScroll({
			elements: ".rs-workflow .rs-workflow__icon",
			delay: .3,
			direction: "scale--every"
		});
		revealOnScroll({
			elements: ".rs-tariff__desktop",
			duration: 1,
			delay: 1,
			direction: "fade"
		});
		revealOnScroll({
			elements: ".rs-tariff__mobile .rs-tariff__spollers",
			duration: 1,
			delay: 1,
			direction: "fade"
		});
		revealOnScroll({
			elements: ".rs-features-list__icon",
			delay: .3,
			direction: "scale--every"
		});
		revealOnScroll({
			elements: ".rs-features-list__img",
			delay: .3,
			direction: "left-right"
		});
		revealOnScroll({
			elements: ".section-bg .section__bg",
			duration: 1,
			delay: .3,
			direction: "width-100"
		});
		revealOnScroll({
			elements: ".section-bg .section__container",
			duration: 1,
			delay: 1,
			direction: "fade"
		});
		revealOnScroll({
			elements: ".rs-about-block__img"
		});
		revealOnScroll({
			elements: ".rs-about-block__desc",
			delay: .3
		});
		revealOnScroll({
			elements: ".rs-services-price__item",
			delay: .3
		});
		revealOnScroll({
			elements: ".rs-feedback",
			delay: .3
		});
		revealOnScroll({
			elements: ".rs-document__spollers_item",
			delay: .2,
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-contact__info_list li",
			delay: .2,
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-contact__map",
			direction: "fade"
		});
		revealOnScroll({
			elements: ".rs-services-about__text",
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-services-about__table"
		});
		revealOnScroll({
			elements: ".rs-services-about__hint",
			delay: 1
		});
		revealOnScroll({
			elements: ".rs-services-about__item",
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-task__item",
			direction: "bottom-up--every"
		});
		revealOnScroll({
			elements: ".rs-why-block__bg",
			duration: 1,
			delay: .3,
			direction: "width-100"
		});
		revealOnScroll({
			elements: ".rs-main__title_video",
			duration: 1,
			delay: .3,
			direction: "width-100"
		});
		revealOnScroll({
			elements: ".rs-main__title h1",
			delay: 1,
			direction: "scale"
		});
		revealOnScroll({
			elements: ".rs-logo__slide",
			delay: .2,
			direction: "right-left--every"
		});
		revealOnScroll({
			elements: ".rs-error-block",
			duration: .8
		});
	}
	function initializeDesktopAnimations() {
		console.log("Инициализация десктопных анимаций");
		horizontalScroll({
			blockSelector: ".rs-slider-block-pins .rs-slider-block__swiper",
			triggerSelector: ".rs-slider-block-pins",
			progressSelector: ".rs-slider-block-pins .rs-slider-block__pagination .swiper-pagination-progressbar-fill"
		});
		if (document.querySelector(".rs-steps .rs-steps__spollers_item")) {
			const sections = document.querySelectorAll(".rs-steps .rs-steps__spollers_item");
			sections.forEach(((section, i) => {
				function setActive(section) {
					if (!section) return;
					sections.forEach((el => el.classList.remove("_active-step")));
					section.classList.add("_active-step");
					console.log(`Активен раздел: ${section.classList}`);
				}
				function removeActive() {
					sections.forEach((el => el.classList.remove("_active-step")));
					console.log("Активный раздел удален");
				}
				ScrollTrigger.create({
					trigger: section,
					start: "top center",
					end: "bottom center",
					invalidateOnRefresh: true,
					onEnter: () => setActive(section),
					onEnterBack: () => setActive(section),
					onLeave: () => removeActive(),
					onLeaveBack: () => removeActive()
				});
			}));
		}
		const parallaxItems = [{
			selector: ".rs-steps__column-top",
			animation: {
				from: {
					y: "200px"
				},
				to: {
					y: "-200px"
				}
			}
		}, {
			selector: ".rs-steps__column-middle",
			animation: {
				from: {
					x: "300px",
					y: "-100px"
				},
				to: {
					x: "-100px",
					y: "100px"
				}
			}
		}, {
			selector: ".rs-steps__column-bottom",
			animation: {
				from: {
					y: "-200px"
				},
				to: {
					y: "200px"
				}
			}
		}];
		parallaxItems.forEach((item => {
			if (document.querySelector(item.selector)) {
				const parallaxTimeline = gsap.timeline({
					scrollTrigger: {
						trigger: ".rs-steps",
						scrub: 1,
						start: "top-=30% top",
						end: "bottom+=30% bottom",
						invalidateOnRefresh: true
					}
				});
				if (item.animation.from && item.animation.to) parallaxTimeline.fromTo(item.selector, item.animation.from, item.animation.to); else parallaxTimeline.from(item.selector, item.animation);
			}
		}));
		if (document.querySelector(".rs-steps-algorithm .rs-steps__text")) {
			gsap.to(".rs-steps-algorithm .rs-steps__text", {
				scrollTrigger: {
					trigger: ".rs-steps-algorithm .rs-steps__text",
					start: "top top+=100px",
					end: "bottom bottom",
					endTrigger: ".rs-steps-algorithm",
					pin: true,
					pinSpacing: false,
					scrub: true,
					invalidateOnRefresh: true
				}
			});
			const cardsSteps = gsap.utils.toArray(".rs-steps-algorithm .rs-steps__spollers_item");
			cardsSteps.forEach(((card, index) => {
				gsap.to(card, {
					scrollTrigger: {
						trigger: card,
						start: `top-=${index * 20} top+=100px`,
						end: "bottom+=50px bottom-=50%",
						endTrigger: ".rs-steps-algorithm",
						pin: true,
						pinSpacing: false,
						scrub: true,
						invalidateOnRefresh: true
					},
					ease: "none"
				});
			}));
		}
		if (document.querySelector(".rs-tariff__top")) setTimeout((() => {
			gsap.to(".rs-tariff__top", {
				scrollTrigger: {
					trigger: ".rs-tariff__top",
					start: "top top",
					end: "bottom bottom",
					endTrigger: ".rs-tariff",
					pin: true,
					pinSpacing: false,
					scrub: true,
					invalidateOnRefresh: true
				}
			});
			handleResize();
		}), 1e3);
		if (document.querySelector(".rs-main__project_item")) setTimeout((() => {
			gsap.set(".rs-main__project_item", {
				y: index => 0 * index,
				zIndex: (index, target, targets) => targets.length - index,
				scale: index => 1 - index * .05
			});
			const pinBlock = gsap.timeline({
				defaults: {
					ease: "none"
				},
				scrollTrigger: {
					trigger: ".rs-main__project",
					start: "top top",
					end: "bottom+=300% top",
					scrub: true,
					pin: true,
					id: "pin-block",
					invalidateOnRefresh: true
				}
			});
			pinBlock.to(".rs-main__project_item", {
				scale: 1,
				y: 0,
				webkitFilter: "blur(" + 0 + "px)",
				stagger
			});
			pinBlock.to(".rs-main__project_item:not(:last-child)", {
				yPercent: -125,
				stagger
			}, stagger);
			ScrollTrigger.refresh();
			const start = pinBlock.scrollTrigger.start;
			const end = pinBlock.scrollTrigger.end;
			const totalScroll = end - start;
			let links = gsap.utils.toArray(".rs-main__project_nav ul li a");
			const scrollSteps = totalScroll / links.length;
			links.forEach(((a, index) => {
				let element = document.querySelector(a.getAttribute("href"));
				ScrollTrigger.create({
					trigger: element,
					start: `${scrollSteps * (index + 1)} center`,
					end: `${scrollSteps * (index + 1) + element.clientHeight} center`,
					onEnter: () => setActive(a),
					onEnterBack: () => setActive(a),
					onLeave: () => setActive(a),
					onLeaveBack: () => setActive(a)
				});
				a.addEventListener("click", (e => {
					e.preventDefault();
					gsap.to(window, {
						duration: .1,
						scrollTo: () => scrollSteps * (index + 1) + start,
						overwrite: "auto"
					});
				}));
			}));
			function setActive(link) {
				links.forEach((el => el.classList.remove("_active")));
				link.classList.add("_active");
			}
		}), 200);
	}
	function initializeMobileAnimations() {
		console.log("Инициализация мобильных анимаций");
	}
	function initBarba() {
		const initializePage = () => {
			videoPlay();
			initSliders();
			initComparison("image-compare");
			initNoUiField("styles-page", "styles-page-count");
			initNoUiField("fill-page", "fill-page-count");
			spollers();
			tabs();
			menuInit();
			menu();
			regionMenu();
			showMore();
			formQuantity();
			formRating();
			pageNavigation();
			headerScroll();
			filterClear();
			filterProject();
			imitationProductLoad();
			sidebarNavigation();
			openFullList();
			addCursorHover(".rs-project__slide", ".rs-project .cursor", "cursor__active");
			addCursorMove(".rs-project__slide", ".cursor__circle");
			addCursorHover(".rs-comparison__compare", ".rs-comparison .icv__circle", "cursor__active");
			addCursorMove(".rs-comparison__compare", ".icv__circle");
			ScrollTrigger.refresh(true);
		};
		const destroyPage = () => {
			destroySliders();
			destroyComparison();
			destroyNoUiField();
		};
		barba.init({
			transitions: [{
				leave({ current }) {
					loaderAnim(loaderFillv1, 0, .2);
					loaderAnim(loaderFillv2, 0, .4);
					destroyPage();
					setTimeout((() => {
						window.scrollTo(0, 0);
					}), 400);
					return gsap.to(current.container, {
						delay: .5
					});
				},
				enter({ current, next, trigger }) {
					return gsap.from(next.container, {
						onComplete: () => {
							updatePrimaryColor();
							initAnimationsBasedOnWidth();
							handleResize();
						}
					});
				},
				after({ next }) {
					loaderAnim(loaderFillv1, 100, .4);
					loaderAnim(loaderFillv2, 100, .2);
					setTimeout((() => {
						window.scrollTo(0, 0);
					}), 100);
					return gsap.from(next.container, {
						delay: .5,
						onComplete: function () {
							updatePrimaryColor();
							initAnimationsBasedOnWidth();
							handleResize();
							initializePage();
						}
					});
				}
			}]
		});
		barba.hooks.afterLeave((() => {
			ScrollTrigger.getAll().forEach((trigger => trigger.kill()));
		}));
		barba.hooks.enter((() => {
			window.scrollTo(0, 0);
			ScrollTrigger.refresh(true);
		}));
		barba.hooks.afterEnter((() => { }));
	}
	initBarba();
	function isWebp() {
		function testWebP(callback) {
			let webP = new Image;
			webP.onload = webP.onerror = function () {
				callback(webP.height == 2);
			};
			webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
		}
		testWebP((function (support) {
			let className = support === true ? "webp" : "no-webp";
			document.documentElement.classList.add(className);
		}));
	}
	let isMobile = {
		Android: function () {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function () {
			return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
		}
	};
	function addTouchClass() {
		if (isMobile.any()) document.documentElement.classList.add("touch");
	}
	function addLoadedClass() {
		setTimeout((function () {
			document.documentElement.classList.add("loaded");
		}), 0);
	}
	function getHash() {
		if (location.hash) return location.hash.replace("#", "");
	}
	function setHash(hash) {
		hash = hash ? `#${hash}` : window.location.href.split("#")[0];
		history.pushState("", "", hash);
	}
	let _slideUp = (target, duration = 500, showmore = 0) => {
		if (!target.classList.contains("_slide")) {
			target.classList.add("_slide");
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + "ms";
			target.style.height = `${target.offsetHeight}px`;
			target.offsetHeight;
			target.style.overflow = "hidden";
			target.style.height = showmore ? `${showmore}px` : `0px`;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout((() => {
				target.hidden = !showmore ? true : false;
				!showmore ? target.style.removeProperty("height") : null;
				target.style.removeProperty("padding-top");
				target.style.removeProperty("padding-bottom");
				target.style.removeProperty("margin-top");
				target.style.removeProperty("margin-bottom");
				!showmore ? target.style.removeProperty("overflow") : null;
				target.style.removeProperty("transition-duration");
				target.style.removeProperty("transition-property");
				target.classList.remove("_slide");
				document.dispatchEvent(new CustomEvent("slideUpDone", {
					detail: {
						target
					}
				}));
			}), duration);
		}
	};
	let _slideDown = (target, duration = 500, showmore = 0) => {
		if (!target.classList.contains("_slide")) {
			target.classList.add("_slide");
			target.hidden = target.hidden ? false : null;
			showmore ? target.style.removeProperty("height") : null;
			let height = target.offsetHeight;
			target.style.overflow = "hidden";
			target.style.height = showmore ? `${showmore}px` : `0px`;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + "ms";
			target.style.height = height + "px";
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			window.setTimeout((() => {
				target.style.removeProperty("height");
				target.style.removeProperty("overflow");
				target.style.removeProperty("transition-duration");
				target.style.removeProperty("transition-property");
				target.classList.remove("_slide");
				document.dispatchEvent(new CustomEvent("slideDownDone", {
					detail: {
						target
					}
				}));
			}), duration);
		}
	};
	let _slideToggle = (target, duration = 500) => {
		if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
	};
	let bodyLockStatus = true;
	let bodyLockToggle = (delay = 500) => {
		if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
	};
	let bodyUnlock = (delay = 500) => {
		let body = document.querySelector("body");
		if (bodyLockStatus) {
			let lock_padding = document.querySelectorAll("[data-lp]");
			setTimeout((() => {
				for (let index = 0; index < lock_padding.length; index++) {
					const el = lock_padding[index];
					el.style.paddingRight = "0px";
				}
				body.style.paddingRight = "0px";
				document.documentElement.classList.remove("lock");
			}), delay);
			bodyLockStatus = false;
			setTimeout((function () {
				bodyLockStatus = true;
			}), delay);
		}
	};
	let bodyLock = (delay = 500) => {
		let body = document.querySelector("body");
		if (bodyLockStatus) {
			let lock_padding = document.querySelectorAll("[data-lp]");
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
			}
			body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
			document.documentElement.classList.add("lock");
			bodyLockStatus = false;
			setTimeout((function () {
				bodyLockStatus = true;
			}), delay);
		}
	};
	function spollers() {
		const spollersArray = document.querySelectorAll("[data-spollers]");
		function spollerClassInit() {
			spollersArray.forEach((spoller => {
				if (spoller) {
					const spollersItem = spoller.querySelectorAll('[class*="_item"]');
					spoller.classList.add("spollers");
					spollersItem.forEach((item => {
						if (item) {
							const spollerTitle = item.querySelector('[class*="_title"]');
							const spollerBody = item.querySelector('[class*="_body"]');
							item.classList.add("spollers__item");
							if (spollerTitle) spollerTitle.classList.add("spollers__title");
							if (spollerBody) spollerBody.classList.add("spollers__body");
						}
					}));
				}
			}));
		}
		spollerClassInit();
		if (spollersArray.length > 0) {
			const spollersRegular = Array.from(spollersArray).filter((function (item, index, self) {
				return !item.dataset.spollers.split(",")[0];
			}));
			if (spollersRegular.length) initSpollers(spollersRegular);
			let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
			if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
				mdQueriesItem.matchMedia.addEventListener("change", (function () {
					initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				}));
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			}));
			function initSpollers(spollersArray, matchMedia = false) {
				spollersArray.forEach((spollersBlock => {
					spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
					if (matchMedia.matches || !matchMedia) {
						spollersBlock.classList.add("_spoller-init");
						initSpollerBody(spollersBlock);
						spollersBlock.addEventListener("click", setSpollerAction);
					} else {
						spollersBlock.classList.remove("_spoller-init");
						initSpollerBody(spollersBlock, false);
						spollersBlock.removeEventListener("click", setSpollerAction);
					}
				}));
			}
			function initSpollerBody(spollersBlock, hideSpollerBody = true) {
				let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
				if (spollerTitles.length) {
					spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
					spollerTitles.forEach((spollerTitle => {
						if (hideSpollerBody) {
							spollerTitle.removeAttribute("tabindex");
							if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.closest(".spollers__item").querySelector(".spollers__body").hidden = true;
						} else {
							spollerTitle.setAttribute("tabindex", "-1");
							spollerTitle.closest(".spollers__item").querySelector(".spollers__body").hidden = false;
						}
					}));
				}
			}
			function setSpollerAction(e) {
				const el = e.target;
				if (el.closest("[data-spoller]")) {
					const spollerTitle = el.closest("[data-spoller]");
					const spollersBlock = spollerTitle.closest("[data-spollers]");
					const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
					const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
					if (!spollersBlock.querySelectorAll("._slide").length) {
						if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
						spollerTitle.classList.toggle("_spoller-active");
						_slideToggle(spollerTitle.closest(".spollers__item").querySelector(".spollers__body"), spollerSpeed);
					}
					e.preventDefault();
				}
			}
			function hideSpollersBody(spollersBlock) {
				const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
				const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
				if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
					spollerActiveTitle.classList.remove("_spoller-active");
					_slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
				}
			}
			const spollersClose = document.querySelectorAll("[data-spoller-close]");
			if (spollersClose.length) document.addEventListener("click", (function (e) {
				const el = e.target;
				if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
					const spollersBlock = spollerClose.closest("[data-spollers]");
					if (spollersBlock.classList.contains("_spoller-init")) {
						const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
						spollerClose.classList.remove("_spoller-active");
						_slideUp(spollerClose.nextElementSibling, spollerSpeed);
					}
				}));
			}));
		}
	}
	function tabs() {
		const tabs = document.querySelectorAll("[data-tabs]");
		let tabsActiveHash = [];
		if (tabs.length > 0) {
			const hash = getHash();
			if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
			tabs.forEach(((tabsBlock, index) => {
				tabsBlock.classList.add("_tab-init");
				tabsBlock.setAttribute("data-tabs-index", index);
				tabsBlock.addEventListener("click", setTabsAction);
				initTabs(tabsBlock);
			}));
			let mdQueriesArray = dataMediaQueries(tabs, "tabs");
			if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
				mdQueriesItem.matchMedia.addEventListener("change", (function () {
					setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				}));
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			}));
		}
		function setTitlePosition(tabsMediaArray, matchMedia) {
			tabsMediaArray.forEach((tabsMediaItem => {
				tabsMediaItem = tabsMediaItem.item;
				let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
				let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
				let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
				let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
				tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
				tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
				tabsContentItems.forEach(((tabsContentItem, index) => {
					if (matchMedia.matches) {
						tabsContent.append(tabsTitleItems[index]);
						tabsContent.append(tabsContentItem);
						tabsMediaItem.classList.add("_tab-spoller");
					} else {
						tabsTitles.append(tabsTitleItems[index]);
						tabsMediaItem.classList.remove("_tab-spoller");
					}
				}));
			}));
		}
		function initTabs(tabsBlock) {
			let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
			let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
			const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
			const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
			if (tabsActiveHashBlock) {
				const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
				tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
			}
			if (tabsContent.length) {
				tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
				tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
				tabsContent.forEach(((tabsContentItem, index) => {
					tabsTitles[index].setAttribute("data-tabs-title", "");
					tabsContentItem.setAttribute("data-tabs-item", "");
					if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
					tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
				}));
			}
		}
		function setTabsStatus(tabsBlock) {
			let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
			let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
			const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
			function isTabsAnamate(tabsBlock) {
				if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
			}
			const tabsBlockAnimate = isTabsAnamate(tabsBlock);
			if (tabsContent.length > 0) {
				const isHash = tabsBlock.hasAttribute("data-tabs-hash");
				tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
				tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
				tabsContent.forEach(((tabsContentItem, index) => {
					if (tabsTitles[index].classList.contains("_tab-active")) {
						if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
						if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
					} else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
				}));
			}
		}
		function setTabsAction(e) {
			const el = e.target;
			if (el.closest("[data-tabs-title]")) {
				const tabTitle = el.closest("[data-tabs-title]");
				const tabsBlock = tabTitle.closest("[data-tabs]");
				if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
					let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
					tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
					tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
					tabTitle.classList.add("_tab-active");
					setTabsStatus(tabsBlock);
				}
				e.preventDefault();
			}
		}
	}
	function menuInit() {
		if (document.querySelector(".icon-menu")) document.addEventListener("click", (function (e) {
			if (bodyLockStatus && e.target.closest(".icon-menu")) menuToggle();
		}));
	}
	function menuClose() {
		bodyUnlock();
		document.documentElement.classList.remove("menu-open");
	}
	function menuToggle() {
		bodyLockToggle();
		document.documentElement.classList.toggle("menu-open");
	}
	function regionMenuOpen() {
		bodyLock();
		document.documentElement.classList.add("region-menu-open");
	}
	function regionMenuClose() {
		bodyUnlock();
		document.documentElement.classList.remove("region-menu-open");
	}
	function menu() {
		const menus = document.querySelectorAll(".rs-header .menu");
		menus.forEach((menu => {
			menu.querySelectorAll(".menu__list li.menu-item");
			const menuItemDropdowns = menu.querySelectorAll(".menu__list .menu__dropdown");
			const menuItemDropdownsMenu = menu.querySelectorAll(".menu__list .menu__dropdown_block");
			const menuItemDropdownsNull = menu.querySelectorAll(".menu__list > .menu__dropdown");
			const menuItemDropdownsMenuNull = menu.querySelectorAll(".menu__list > .menu__dropdown > .menu__dropdown_block");
			const menuItemDropdownsFirst = menu.querySelectorAll(".menu__list > .menu__dropdown > .menu__dropdown_block > .dropdown__container > .dropdown__columns > .menu__dropdown");
			const menuItemDropdownsMenuFirst = menu.querySelectorAll(".menu__list > .menu__dropdown > .menu__dropdown_block > .dropdown__container > .dropdown__columns > .menu__dropdown > .menu__dropdown_block");
			const menuItemDropdownsTwo = menu.querySelectorAll(".menu__list > .menu__dropdown > .menu__dropdown_block > .dropdown__container > .dropdown__columns > .menu__dropdown > .menu__dropdown_block > .menu__dropdown");
			const menuItemDropdownsMenuTwo = menu.querySelectorAll(".menu__list > .menu__dropdown > .menu__dropdown_block > .dropdown__container > .dropdown__columns > .menu__dropdown > .menu__dropdown_block > .menu__dropdown > .menu__dropdown_block");
			menuItemDropdowns.forEach((item => {
				const menuLinkDropdowns = item.querySelector("a");
				let iconDropdown = document.createElement("i");
				iconDropdown.classList.add("menu__dropdown-arrow");
				menuLinkDropdowns.append(iconDropdown);
			}));
			menuItemDropdowns.forEach((item => {
				item.addEventListener("mouseenter", (function () {
					item.closest(".rs-header").classList.add("_header-hover");
				}));
				item.addEventListener("mouseleave", (function () {
					if (!document.documentElement.classList.contains("region-menu-open") || !document.documentElement.classList.contains("region-menu-open")) item.closest(".rs-header").classList.remove("_header-hover");
				}));
			}));
			function openLvlMenu(li, ul) {
				li.forEach((item => {
					const menuItemIcons = item.querySelector("a > .menu__dropdown-arrow");
					const menuItemBack = item.querySelector(".menu__dropdown_back");
					if (menuItemBack) menuItemBack.addEventListener("click", (e => {
						e.preventDefault();
						e.stopPropagation();
						if (menuItemIcons.closest(".menu__dropdown").classList.contains("_open-menu")) menuItemIcons.closest(".menu__dropdown").classList.remove("_open-menu");
					}));
					if (window.innerWidth <= 991.98) {
						const menuItemLink = item.querySelector("a");
						menuItemLink.addEventListener("click", (function (e) {
							e.preventDefault();
							e.stopPropagation();
						}));
					}
					menuItemIcons.addEventListener("click", (e => {
						e.preventDefault();
						e.stopPropagation();
						if (!menuItemIcons.closest(".menu__dropdown").classList.contains("_open-menu")) {
							li.forEach((itemDrop => {
								if (itemDrop.classList.contains("_open-menu")) itemDrop.classList.remove("_open-menu");
							}));
							menuItemIcons.closest(".menu__dropdown").classList.add("_open-menu");
						} else if (menuItemIcons.closest(".menu__dropdown").classList.contains("_open-menu")) menuItemIcons.closest(".menu__dropdown").classList.remove("_open-menu");
					}));
				}));
			}
			openLvlMenu(menuItemDropdownsNull, menuItemDropdownsMenuNull);
			openLvlMenu(menuItemDropdownsFirst, menuItemDropdownsMenuFirst);
			openLvlMenu(menuItemDropdownsTwo, menuItemDropdownsMenuTwo);
			document.addEventListener("click", (function (e) {
				if (e.target.closest(".menu__icon")) {
					menuItemDropdownsMenu.forEach((menu => {
						_slideUp(menu, 500);
					}));
					menuItemDropdowns.forEach((item => {
						item.classList.remove("_open-menu");
					}));
					regionMenuClose();
				}
			}));
		}));
	}
	function regionMenu() {
		const regionBtns = document.querySelectorAll(".rs-header__actions .rs-header__location_show-search");
		const regionInnerBtns = document.querySelectorAll(".rs-header .menu__block .rs-header__location\t.rs-header__location_show-search");
		const regionVerf = document.querySelectorAll(".rs-header__location_verification");
		document.querySelectorAll(".rs-header__location_modal");
		const regionBlockClose = document.querySelectorAll(".rs-header__region .rs-header__region_head .rs-header__region_close");
		const regionBlockInnerClose = document.querySelectorAll(".rs-header__region .rs-header__region_field .rs-header__region_close");
		const regionModalInnerMenuBtn = document.querySelector(".rs-header__container > .rs-header__location_modal .rs-header__location_show-search");
		window.addEventListener("load", (function () {
			setTimeout((() => {
				document.documentElement.classList.toggle("location-modal-open");
			}), 3e3);
		}));
		if (regionBtns.length > 0) regionBtns.forEach((regionBtn => {
			regionBtn.addEventListener("click", (function (e) {
				e.preventDefault();
				if (document.documentElement.classList.contains("location-modal-open")) document.documentElement.classList.remove("location-modal-open");
				if (!document.documentElement.classList.contains("region-menu-open")) {
					regionMenuOpen();
					menuClose();
					regionBtn.closest(".rs-header").classList.add("_header-hover");
				}
			}));
		}));
		if (regionInnerBtns.length > 0) regionInnerBtns.forEach((regionBtn => {
			regionBtn.addEventListener("click", (function (e) {
				e.preventDefault();
				if (document.documentElement.classList.contains("location-modal-open")) document.documentElement.classList.remove("location-modal-open");
				if (!document.documentElement.classList.contains("region-menu-open")) {
					document.documentElement.classList.add("region-menu-open");
					regionBtn.closest(".rs-header").classList.add("_header-hover");
				}
			}));
		}));
		if (regionBlockClose.length > 0) regionBlockClose.forEach((close => {
			close.addEventListener("click", (function (e) {
				e.preventDefault();
				if (document.documentElement.classList.contains("region-menu-open")) {
					regionMenuClose();
					close.closest(".rs-header").classList.remove("_header-hover");
				}
			}));
		}));
		if (regionBlockInnerClose.length > 0) regionBlockInnerClose.forEach((close => {
			close.addEventListener("click", (function (e) {
				e.preventDefault();
				if (document.documentElement.classList.contains("region-menu-open")) document.documentElement.classList.remove("region-menu-open");
			}));
		}));
		if (regionVerf.length > 0) regionVerf.forEach((verf => {
			verf.addEventListener("click", (function (e) {
				e.preventDefault();
				if (document.documentElement.classList.contains("location-modal-open")) document.documentElement.classList.remove("location-modal-open");
			}));
		}));
		if (regionModalInnerMenuBtn) regionModalInnerMenuBtn.addEventListener("click", (function (e) {
			e.preventDefault();
			document.querySelector(".rs-header").classList.add("_header-show");
			menuClose();
			regionMenuOpen();
		}));
		function searchRegion() {
			const regionBlock = document.querySelectorAll(".rs-header__region");
			regionBlock.forEach((region => {
				const listRegion = region.querySelectorAll(".rs-header__region_select .rs-header__region_list li");
				const inputRegion = region.querySelector(".rs-header__region_field input");
				inputRegion.addEventListener("input", (function () {
					const filterRegion = inputRegion.value.toUpperCase();
					listRegion.forEach((item => {
						const textValue = item.textContent;
						if (textValue.toUpperCase().indexOf(filterRegion) === 0) {
							console.log(textValue.toUpperCase().indexOf(filterRegion) === 0);
							item.classList.remove("hidden");
							item.parentElement.parentElement.classList.remove("hidden");
						} else {
							item.classList.add("hidden");
							item.parentElement.parentElement.classList.add("hidden");
						}
						const listRegionShow = region.querySelectorAll(".rs-header__region_select .rs-header__region_list li:not(.hidden)");
						listRegionShow.forEach((itemShow => {
							itemShow.parentElement.parentElement.classList.remove("hidden");
						}));
					}));
				}));
				listRegion.forEach((item => {
					const link = item.querySelector("a");
					if (link) link.addEventListener("click", (function () {
						if (document.documentElement.classList.contains("region-menu-open")) {
							regionMenuClose();
							link.closest(".rs-header").classList.remove("_header-hover");
						}
					}));
				}));
			}));
		}
		searchRegion();
	}
	function showMore() {
		const showMoreBlocks = document.querySelectorAll("[data-showmore]");
		let showMoreBlocksRegular;
		let mdQueriesArray;
		if (showMoreBlocks.length) {
			showMoreBlocksRegular = Array.from(showMoreBlocks).filter((function (item, index, self) {
				return !item.dataset.showmoreMedia;
			}));
			showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
			document.addEventListener("click", showMoreActions);
			window.addEventListener("resize", showMoreActions);
			mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
			if (mdQueriesArray && mdQueriesArray.length) {
				mdQueriesArray.forEach((mdQueriesItem => {
					mdQueriesItem.matchMedia.addEventListener("change", (function () {
						initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
					}));
				}));
				initItemsMedia(mdQueriesArray);
			}
		}
		function initItemsMedia(mdQueriesArray) {
			mdQueriesArray.forEach((mdQueriesItem => {
				initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			}));
		}
		function initItems(showMoreBlocks, matchMedia) {
			showMoreBlocks.forEach((showMoreBlock => {
				initItem(showMoreBlock, matchMedia);
			}));
		}
		function initItem(showMoreBlock, matchMedia = false) {
			showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
			let showMoreContent = showMoreBlock.querySelectorAll("[data-showmore-content]");
			let showMoreButton = showMoreBlock.querySelectorAll("[data-showmore-button]");
			showMoreContent = Array.from(showMoreContent).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
			showMoreButton = Array.from(showMoreButton).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
			const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
			if (matchMedia.matches || !matchMedia) if (hiddenHeight < getOriginalHeight(showMoreContent)) {
				_slideUp(showMoreContent, 0, hiddenHeight);
				showMoreBlock.classList.add("_showmore-hide");
				showMoreButton.hidden = false;
			} else {
				_slideDown(showMoreContent, 0, hiddenHeight);
				showMoreBlock.classList.add("_showmore-nohide");
				showMoreButton.hidden = true;
			} else {
				_slideDown(showMoreContent, 0, hiddenHeight);
				showMoreBlock.classList.add("_showmore-nohide");
				showMoreButton.hidden = true;
			}
		}
		function getHeight(showMoreBlock, showMoreContent) {
			let hiddenHeight = 0;
			const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : "size";
			if (showMoreType === "items") {
				const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
				const showMoreItems = showMoreContent.children;
				for (let index = 1; index < showMoreItems.length; index++) {
					const showMoreItem = showMoreItems[index - 1];
					hiddenHeight += showMoreItem.offsetHeight;
					if (index == showMoreTypeValue) break;
				}
			} else {
				const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
				hiddenHeight = showMoreTypeValue;
			}
			return hiddenHeight;
		}
		function getOriginalHeight(showMoreContent) {
			let parentHidden;
			let hiddenHeight = showMoreContent.offsetHeight;
			showMoreContent.style.removeProperty("height");
			if (showMoreContent.closest(`[hidden]`)) {
				parentHidden = showMoreContent.closest(`[hidden]`);
				parentHidden.hidden = false;
			}
			let originalHeight = showMoreContent.offsetHeight;
			parentHidden ? parentHidden.hidden = true : null;
			showMoreContent.style.height = `${hiddenHeight}px`;
			return originalHeight;
		}
		function showMoreActions(e) {
			const targetEvent = e.target;
			const targetType = e.type;
			if (targetType === "click") {
				if (targetEvent.closest("[data-showmore-button]")) {
					const showMoreButton = targetEvent.closest("[data-showmore-button]");
					const showMoreBlock = showMoreButton.closest("[data-showmore]");
					const showMoreContent = showMoreBlock.querySelector("[data-showmore-content]");
					const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : "500";
					const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
					if (!showMoreContent.classList.contains("_slide")) {
						showMoreBlock.classList.contains("_showmore-active") ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
						showMoreBlock.classList.toggle("_showmore-active");
						handleReveal();
					}
				}
			} else if (targetType === "resize") {
				showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
				mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
			}
		}
	}
	function functions_vnv(message) {
		setTimeout((() => {
			if (window.vnv) console.log(message);
		}), 0);
	}
	function uniqArray(array) {
		return array.filter((function (item, index, self) {
			return self.indexOf(item) === index;
		}));
	}
	function dataMediaQueries(array, dataSetValue) {
		const media = Array.from(array).filter((function (item, index, self) {
			if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
		}));
		if (media.length) {
			const breakpointsArray = [];
			media.forEach((item => {
				const params = item.dataset[dataSetValue];
				const breakpoint = {};
				const paramsArray = params.split(",");
				breakpoint.value = paramsArray[0];
				breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
				breakpoint.item = item;
				breakpointsArray.push(breakpoint);
			}));
			let mdQueries = breakpointsArray.map((function (item) {
				return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
			}));
			mdQueries = uniqArray(mdQueries);
			const mdQueriesArray = [];
			if (mdQueries.length) {
				mdQueries.forEach((breakpoint => {
					const paramsArray = breakpoint.split(",");
					const mediaBreakpoint = paramsArray[1];
					const mediaType = paramsArray[2];
					const matchMedia = window.matchMedia(paramsArray[0]);
					const itemsArray = breakpointsArray.filter((function (item) {
						if (item.value === mediaBreakpoint && item.type === mediaType) return true;
					}));
					mdQueriesArray.push({
						itemsArray,
						matchMedia
					});
				}));
				return mdQueriesArray;
			}
		}
	}
	class Popup {
		constructor(options) {
			let config = {
				logging: true,
				init: true,
				attributeOpenButton: "data-popup",
				attributeCloseButton: "data-close",
				fixElementSelector: "[data-lp]",
				youtubeAttribute: "data-popup-youtube",
				youtubePlaceAttribute: "data-popup-youtube-place",
				setAutoplayYoutube: true,
				classes: {
					popup: "popup",
					popupContent: "popup__content",
					popupActive: "popup_show",
					bodyActive: "popup-show"
				},
				focusCatch: true,
				closeEsc: true,
				bodyLock: true,
				hashSettings: {
					location: true,
					goHash: true
				},
				on: {
					beforeOpen: function () { },
					afterOpen: function () { },
					beforeClose: function () { },
					afterClose: function () { }
				}
			};
			this.youTubeCode;
			this.isOpen = false;
			this.targetOpen = {
				selector: false,
				element: false
			};
			this.previousOpen = {
				selector: false,
				element: false
			};
			this.lastClosed = {
				selector: false,
				element: false
			};
			this._dataValue = false;
			this.hash = false;
			this._reopen = false;
			this._selectorOpen = false;
			this.lastFocusEl = false;
			this._focusEl = ["a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'];
			this.options = {
				...config,
				...options,
				classes: {
					...config.classes,
					...options?.classes
				},
				hashSettings: {
					...config.hashSettings,
					...options?.hashSettings
				},
				on: {
					...config.on,
					...options?.on
				}
			};
			this.bodyLock = false;
			this.options.init ? this.initPopups() : null;
		}
		initPopups() {
			this.popupLogging(`Проснулся`);
			this.eventsPopup();
		}
		eventsPopup() {
			document.addEventListener("click", function (e) {
				const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
				if (buttonOpen) {
					e.preventDefault();
					this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
					this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
					if (this._dataValue !== "error") {
						if (!this.isOpen) this.lastFocusEl = buttonOpen;
						this.targetOpen.selector = `${this._dataValue}`;
						this._selectorOpen = true;
						this.open();
						return;
					} else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
					return;
				}
				const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
				if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
					e.preventDefault();
					this.close();
					return;
				}
			}.bind(this));
			document.addEventListener("keydown", function (e) {
				if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
					e.preventDefault();
					this.close();
					return;
				}
				if (this.options.focusCatch && e.which == 9 && this.isOpen) {
					this._focusCatch(e);
					return;
				}
			}.bind(this));
			if (this.options.hashSettings.goHash) {
				window.addEventListener("hashchange", function () {
					if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
				}.bind(this));
				window.addEventListener("load", function () {
					if (window.location.hash) this._openToHash();
				}.bind(this));
			}
		}
		open(selectorValue) {
			if (bodyLockStatus) {
				this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
				if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
					this.targetOpen.selector = selectorValue;
					this._selectorOpen = true;
				}
				if (this.isOpen) {
					this._reopen = true;
					this.close();
				}
				if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
				if (!this._reopen) this.previousActiveElement = document.activeElement;
				this.targetOpen.element = document.querySelector(this.targetOpen.selector);
				if (this.targetOpen.element) {
					if (this.youTubeCode) {
						const codeVideo = this.youTubeCode;
						const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
						const iframe = document.createElement("iframe");
						iframe.setAttribute("allowfullscreen", "");
						const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
						iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
						iframe.setAttribute("src", urlVideo);
						if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
							this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
						}
						this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
					}
					if (this.options.hashSettings.location) {
						this._getHash();
						this._setHash();
					}
					this.options.on.beforeOpen(this);
					document.dispatchEvent(new CustomEvent("beforePopupOpen", {
						detail: {
							popup: this
						}
					}));
					this.targetOpen.element.classList.add(this.options.classes.popupActive);
					document.documentElement.classList.add(this.options.classes.bodyActive);
					if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
					this.targetOpen.element.setAttribute("aria-hidden", "false");
					this.previousOpen.selector = this.targetOpen.selector;
					this.previousOpen.element = this.targetOpen.element;
					this._selectorOpen = false;
					this.isOpen = true;
					setTimeout((() => {
						this._focusTrap();
					}), 50);
					this.options.on.afterOpen(this);
					document.dispatchEvent(new CustomEvent("afterPopupOpen", {
						detail: {
							popup: this
						}
					}));
					this.popupLogging(`Открыл попап`);
				} else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
			}
		}
		close(selectorValue) {
			if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
			if (!this.isOpen || !bodyLockStatus) return;
			this.options.on.beforeClose(this);
			document.dispatchEvent(new CustomEvent("beforePopupClose", {
				detail: {
					popup: this
				}
			}));
			if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
			this.previousOpen.element.classList.remove(this.options.classes.popupActive);
			this.previousOpen.element.setAttribute("aria-hidden", "true");
			if (!this._reopen) {
				document.documentElement.classList.remove(this.options.classes.bodyActive);
				!this.bodyLock ? bodyUnlock() : null;
				this.isOpen = false;
			}
			this._removeHash();
			if (this._selectorOpen) {
				this.lastClosed.selector = this.previousOpen.selector;
				this.lastClosed.element = this.previousOpen.element;
			}
			this.options.on.afterClose(this);
			document.dispatchEvent(new CustomEvent("afterPopupClose", {
				detail: {
					popup: this
				}
			}));
			setTimeout((() => {
				this._focusTrap();
			}), 50);
			this.popupLogging(`Закрыл попап`);
		}
		_getHash() {
			if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
		}
		_openToHash() {
			let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
			const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
			if (buttons && classInHash) this.open(classInHash);
		}
		_setHash() {
			history.pushState("", "", this.hash);
		}
		_removeHash() {
			history.pushState("", "", window.location.href.split("#")[0]);
		}
		_focusCatch(e) {
			const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
			const focusArray = Array.prototype.slice.call(focusable);
			const focusedIndex = focusArray.indexOf(document.activeElement);
			if (e.shiftKey && focusedIndex === 0) {
				focusArray[focusArray.length - 1].focus();
				e.preventDefault();
			}
			if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
				focusArray[0].focus();
				e.preventDefault();
			}
		}
		_focusTrap() {
			const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
			if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
		}
		popupLogging(message) {
			this.options.logging ? functions_vnv(`[Попапос]: ${message}`) : null;
		}
	}
	modules_vnvModules.popup = new Popup({});
	class MousePRLX {
		constructor(props, data = null) {
			let defaultConfig = {
				init: true,
				logging: true
			};
			this.config = Object.assign(defaultConfig, props);
			if (this.config.init) {
				const paralaxMouse = document.querySelectorAll("[data-prlx-mouse]");
				if (paralaxMouse.length) {
					this.paralaxMouseInit(paralaxMouse);
					this.setLogging(`Проснулся, слежу за объектами: (${paralaxMouse.length})`);
				} else this.setLogging("Нет ни одного объекта. Сплю...zzZZZzZZz...");
			}
		}
		paralaxMouseInit(paralaxMouse) {
			paralaxMouse.forEach((el => {
				const paralaxMouseWrapper = el.closest("[data-prlx-mouse-wrapper]");
				const paramСoefficientX = el.dataset.prlxCx ? +el.dataset.prlxCx : 100;
				const paramСoefficientY = el.dataset.prlxCy ? +el.dataset.prlxCy : 100;
				const directionX = el.hasAttribute("data-prlx-dxr") ? -1 : 1;
				const directionY = el.hasAttribute("data-prlx-dyr") ? -1 : 1;
				const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 50;
				let positionX = 0, positionY = 0;
				let coordXprocent = 0, coordYprocent = 0;
				setMouseParallaxStyle();
				if (paralaxMouseWrapper) mouseMoveParalax(paralaxMouseWrapper); else mouseMoveParalax();
				function setMouseParallaxStyle() {
					const distX = coordXprocent - positionX;
					const distY = coordYprocent - positionY;
					positionX += distX * paramAnimation / 1e3;
					positionY += distY * paramAnimation / 1e3;
					el.style.cssText = `transform: translate3D(${directionX * positionX / (paramСoefficientX / 10)}%,${directionY * positionY / (paramСoefficientY / 10)}%,0);`;
					requestAnimationFrame(setMouseParallaxStyle);
				}
				function mouseMoveParalax(wrapper = window) {
					wrapper.addEventListener("mousemove", (function (e) {
						const offsetTop = el.getBoundingClientRect().top + window.scrollY;
						if (offsetTop >= window.scrollY || offsetTop + el.offsetHeight >= window.scrollY) {
							const parallaxWidth = window.innerWidth;
							const parallaxHeight = window.innerHeight;
							const coordX = e.clientX - parallaxWidth / 2;
							const coordY = e.clientY - parallaxHeight / 2;
							coordXprocent = coordX / parallaxWidth * 100;
							coordYprocent = coordY / parallaxHeight * 100;
						}
					}));
				}
			}));
		}
		setLogging(message) {
			this.config.logging ? functions_vnv(`[PRLX Mouse]: ${message}`) : null;
		}
	}
	modules_vnvModules.mousePrlx = new MousePRLX({});
	const imgs = document.getElementsByTagName("img");
	for (let i = 0; i < imgs.length; i++) imgs[i].setAttribute("draggable", false);
	function progressBar() {
		let scroll = document.body.scrollTop || document.documentElement.scrollTop;
		let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		let scrolled = scroll / height * 100;
		document.getElementById("progressBar").style.width = scrolled + "%";
	}
	window.addEventListener("scroll", progressBar);
	function showBtnCases() {
		const btnProjectAll = document.querySelector(".rs-main__project-all");
		if (btnProjectAll) if (window.scrollY > 500 && window.scrollY < 2500) btnProjectAll.classList.add("_show"); else btnProjectAll.classList.remove("_show");
	}
	window.addEventListener("scroll", showBtnCases);
	window["vnv"] = false;
	isWebp();
	addTouchClass();
	addLoadedClass();
	menuInit();
	menu();
	regionMenu();
	spollers();
	tabs();
	showMore();
	formRating();
	pageNavigation();
	headerScroll();
})();