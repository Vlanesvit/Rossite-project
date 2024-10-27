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

    wp_enqueue_style( 'style', get_stylesheet_directory_uri().'/css/style.min.css',array(), '20240506133819', 'screen');

    wp_enqueue_script('api-maps','https://api-maps.yandex.ru/2.1?apikey=38863ba5-9462-46dc-940c-d9fed985abff&lang=ru_RU',[],'20240506133819');
	
    // Подключаем скрипт app.js с атрибутом defer
    wp_enqueue_script('app', get_stylesheet_directory_uri() . '/js/app.min.js', [], false, ['in_footer' => true, 'strategy' => 'defer']);
    
    // Добавляем фильтр для добавления атрибута defer
    add_filter('script_loader_tag', function($tag, $handle) {
        // Проверяем, что это нужный скрипт
        if ('app' === $handle) {
            // Добавляем атрибут defer
            $tag = str_replace(' src', ' defer src', $tag);
        }
        return $tag;
    }, 10, 2);

	// Добавляем инлайн-скрипт, который будет выполнен после app.js
    wp_add_inline_script('app', "
        // Инициализация при загрузке страницы
        const loader = document.querySelector('.mg-loader');

        const loaderFillv1 = loader.querySelector('.mg-loader-fill.-v1');
        const loaderFillv2 = loader.querySelector('.mg-loader-fill.-v2');

        function showLoader() {
            loaderFillv1.classList.add('active');
            loaderFillv2.classList.add('active');
        }
        function hideLoader() {
            loaderFillv1.classList.remove('active');
            loaderFillv2.classList.remove('active');
        }

        window.addEventListener('DOMContentLoaded', () => {
            // Активируем лоадер при первой загрузке
            showLoader();
            setTimeout(() => {
                hideLoader(); // Скрываем лоадер после завершения CSS-анимации
            }, 1000); // Время скрытия можно изменить
        });
    ");

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