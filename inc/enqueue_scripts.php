<?php
/**
 * Enqueue functions.
 *
 * @see https://rosait.ru/wiki/
 *
 * @package wp35-shop-v1
 *
 * @version 1.0
 */

//Подключеие стилей и скриптов
add_action( 'wp_enqueue_scripts', 'rs_style_theme');

function rs_style_theme() {

    if(is_page_template('page_instruction.php') && !is_page('agreement')){
        wp_enqueue_style( 'bootstrap', 'https://rosait.ru/lib/bootstrap/bootstrap.min.css', array(), null, 'screen' );
        wp_enqueue_style( 'manual', 'https://rosait.ru/css/manual.css', array(), null, 'screen' );
        wp_enqueue_script('bootstrap','https://rosait.ru/lib/bootstrap/bootstrap.min.js',['jquery'],'20240506133819',['in_footer' => true,'strategy'  => 'async',]);
    }

    wp_enqueue_script( 'jquery' );

    wp_enqueue_style( 'style', get_stylesheet_directory_uri().'/css/style.min.css',array(), '20240506133819', 'screen');

    wp_enqueue_script('api-maps','https://api-maps.yandex.ru/2.1?apikey=38863ba5-9462-46dc-940c-d9fed985abff&lang=ru_RU',[],'20240506133819');
	
	wp_enqueue_script('barba','https://unpkg.com/@barba/core',[], false,['in_footer' => true,'strategy'  => 'async',]);
    // Подключаем скрипт app.js с атрибутом defer
	wp_enqueue_script('app', get_stylesheet_directory_uri().'/js/app.min.js',['barba'],false,['in_footer' => true,'strategy'  => 'defer',]);

	 // Передача URL темы в JavaScript через wp_localize_script
	 wp_localize_script('app', 'themeData', array(
        'themeUri' => get_stylesheet_directory_uri(),
    ));

	wp_add_inline_script("app", '
function initHeaderHeight() {
    const header = document.querySelector(".rs-header");
    const menuItemDropdowns = header.querySelectorAll(".menu__list .menu__dropdown");

    // Функция для обновления CSS переменной
    function updateHeaderHeight(includeDropdown = false) {
        // Если активен hover, не изменять высоту при скролле
        if (header.classList.contains("_header-hover") && !includeDropdown) {
            return;
        }

        let totalHeight = header.clientHeight;
        if (includeDropdown) {
            // Найти максимальную высоту .menu__dropdown_block
            const maxDropdownHeight = Math.max(
                ...Array.from(document.querySelectorAll(".menu__dropdown_block")).map(block => block.clientHeight)
            );
            totalHeight += maxDropdownHeight;
        }
        header.style.setProperty("--header-height", `${totalHeight}px`);
    }

    menuItemDropdowns.forEach(item => {
        item.addEventListener("mouseenter", function () {
            header.classList.add("_header-hover");
            updateHeaderHeight(true);
        });
        item.addEventListener("mouseleave", function () {
            if (!document.documentElement.classList.contains("region-menu-open")) {
                header.classList.remove("_header-hover");
            }
            updateHeaderHeight();
        });
    });

    // Вызов функции один раз для установки начальной высоты
    updateHeaderHeight();

    // Обновление высоты при изменении размера и прокрутке страницы, только если hover не активен
    function handleResizeAndScroll() {
        updateHeaderHeight();
    }

    window.addEventListener("resize", handleResizeAndScroll);
    window.addEventListener("scroll", handleResizeAndScroll);
}

// Вызов функции при загрузке страницы
window.addEventListener("DOMContentLoaded", initHeaderHeight);
');

	wp_add_inline_script('app', '
    const loader = document.querySelector(".mg-loader");
    const percentageDisplay = document.getElementById("mg-percentage");

    let resourcesToLoad = 0;
    let resourcesLoaded = 0;
    let targetPercentage = 0;

    function showLoader() {
        loader.classList.add("show");
        loader.classList.remove("hide");
    }

    function hideLoader() {
        loader.classList.add("hide");
        loader.classList.remove("show");
    }

    function updatePercentage() {
        targetPercentage = resourcesToLoad > 0 
            ? Math.min(Math.floor((resourcesLoaded / resourcesToLoad) * 100), 100)
            : 100;

        let currentPercentage = parseInt(percentageDisplay.textContent) || 0;

        const animate = () => {
            if (currentPercentage < targetPercentage) {
                currentPercentage++;
                percentageDisplay.textContent = currentPercentage + "%";
                requestAnimationFrame(animate);
            } else if (currentPercentage > targetPercentage) {
                currentPercentage--;
                percentageDisplay.textContent = currentPercentage + "%";
                requestAnimationFrame(animate);
            } else if (currentPercentage === 100 && document.readyState === "complete") {
                hideLoader();
            }
        };
        animate();
    }

    function trackResourceLoad() {
        resourcesLoaded++;
        updatePercentage();

        if (resourcesLoaded >= resourcesToLoad) {
            if (document.readyState === "complete") {
                if (parseInt(percentageDisplay.textContent) === 100) {
                    hideLoader();
                }
            } else {
                window.addEventListener("load", () => {
                    if (parseInt(percentageDisplay.textContent) === 100) {
                        hideLoader();
                    }
                });
            }
        }
    }

    function loadResources() {
        resourcesToLoad = 0;
        resourcesLoaded = 0;
        percentageDisplay.textContent = "0%";

        // Отслеживание изображений
        const images = document.querySelectorAll("img");
        resourcesToLoad += images.length;

        images.forEach(img => {
            if (img.complete) {
                trackResourceLoad();
            } else {
                img.addEventListener("load", trackResourceLoad);
                img.addEventListener("error", trackResourceLoad);
            }
        });

        // Отслеживание видео
        const videos = document.querySelectorAll("video");
        resourcesToLoad += videos.length;

        videos.forEach(video => {
            if (video.readyState >= 3) {
                trackResourceLoad();
            } else {
                video.addEventListener("loadeddata", trackResourceLoad);
                video.addEventListener("error", trackResourceLoad);
            }
        });

        // Отслеживание скриптов
        const scriptToLoad = document.querySelector("script[src*=\'app.min.js\'], script[src*=\'app.js\']");
        if (scriptToLoad) {
            scriptToLoad.addEventListener("load", trackResourceLoad);
            scriptToLoad.addEventListener("error", trackResourceLoad);
        }

        // Если ресурсов нет, скрываем загрузчик
        if (resourcesToLoad === 0) {
            hideLoader();
        }
    }

    window.addEventListener("DOMContentLoaded", () => {
        showLoader();
        loadResources();
    });
');

    wp_localize_script( 'app', 'rs_ajax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ),'page_title'=>get_the_title(),'city'=>$_SESSION['CURRENT_CITY'] ) );

    wp_add_inline_script( 'app',"
        let popunBTN = document.querySelectorAll('[data-popup=\"#letter-manager\"]');        
        popunBTN.forEach((btn=>{
            btn.addEventListener('click',function(){
                let formCF7 = document.querySelectorAll('.wpcf7-form');
                formCF7.forEach((item=>{
                    
                    if(item.querySelector('[name=\"city\"]')){
                        item.querySelector('[name=\"city\"]').value = rs_ajax['city'];
                    }
                    if(item.querySelector('[name=\"product-page\"]')){
                        if(!btn.closest('section')){
                            item.querySelector('[name=\"product-page\"]').value = rs_ajax['page_title'];
                        } else {
                            if(btn.closest('section.rs-tariff')){
                                let title =btn.closest('section').querySelector('.rs-tariff__text h4')?btn.closest('section').querySelector('.rs-tariff__text h4').textContent:'',
                                tariff = btn.closest('.rs-tariff__head').querySelector('h5')?btn.closest('.rs-tariff__head').querySelector('h5').textContent:'';
                                item.querySelector('[name=\"product-page\"]').value = title + ' ' + tariff;  
                            } else {                            
                            let title = btn.closest('section').querySelector('h1')? btn.closest('section').querySelector('h1').textContent:btn.closest('section').querySelector('h2').textContent;
                                item.querySelector('[name=\"product-page\"]').value = title;
                            }
                           
                        }
                    }
                } )) ;
                
            });
        }));
    ");
    wp_add_inline_script( 'app', "document.addEventListener( 'wpcf7submit', function( event ) {
        setTimeout(() => { let output = document.querySelectorAll('.wpcf7-response-output'),
        formCF7 = document.querySelectorAll('.wpcf7-form');
        formCF7.forEach((item=>{item.classList.remove('sent','failed','invalid'); item.setAttribute('data-status','init');} )) 
        output.forEach((item=>{item.innerHTML=''} )) 
        }, 5000)
    }, true ); ");
    wp_add_inline_script( 'app', "(function(w,d,u){
                var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/60000|0);
                var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
        })(window,document,'https://cdn-ru.bitrix24.ru/b2808447/crm/site_button/loader_2_2rcncv.js');");
}