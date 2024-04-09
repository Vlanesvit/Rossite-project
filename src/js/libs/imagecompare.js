
/*
Документация: https://image-compare-viewer.netlify.app/
*/
// Подключаем из node_modules
import ImageCompare from "image-compare-viewer";
import 'image-compare-viewer/dist/image-compare-viewer.min.css';

// Инициализация сравнения картинок
export function initComparison(id) {
	const comparison = document.getElementById(id)
	if (comparison) {
		const comparisonViewer = new ImageCompare(comparison, {
			// UI Theme Defaults
			controlColor: "#FFFFFF",
			controlShadow: false,
			addCircle: true,
			addCircleBlur: false,

			// Label Defaults
			showLabels: false,
			labelOptions: {
				before: 'Before',
				after: 'After',
				onHover: false
			},

			// Smoothing
			smoothing: true,
			smoothingAmount: 0,

			// Other options
			hoverStart: true,
			verticalMode: false,
			startingPoint: 46.2,
			fluidMode: true,
		}).mount();
	}
}
initComparison('image-compare')

// Инициализация курсора
import { addCursorHover, addCursorMove, addCursorDrag } from "../libs/cursor.js";
addCursorHover(".rs-comparison__compare", ".rs-comparison .icv__circle", "cursor__active");
addCursorMove(".rs-comparison__compare", ".icv__circle")