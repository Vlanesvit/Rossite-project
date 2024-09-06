<?php
/**
 * RS hooks
 *
 */

//Количество записей на страницах - переопределение
add_action( 'pre_get_posts', 'get_posts_per_page');
function get_posts_per_page( $query ){
    if ( !is_admin() && $query->is_search ) {
        $query->set( 'posts_per_page', 10 );
    }
    /*if ( ! is_admin() && (is_shop() || is_product_category() || is_product_tag()) ) {
        $query->set( 'posts_per_page', 9 );
    }*/
}

add_filter('navigation_markup_template', 'rs_navigation_template', 100, 2 );
function rs_navigation_template( $template, $class ){
    return '<nav class="pagging %1$s" role="navigation">%3$s</nav>';
}

add_filter('wpcf7_autop_or_not', '__return_false');
add_filter( 'wpcf7_form_elements', 'imp_wpcf7_form_elements' );
function imp_wpcf7_form_elements( $content ) {
    $str_pos = strpos( $content, ' name="user-name"' );
    if($str_pos>0) $content = substr_replace( $content, ' data-required data-validate data-error="Введите ФИО" ', $str_pos, 0 );
    $str_pos = strpos( $content, ' name="user-phone"' );
    if($str_pos>0) $content = substr_replace( $content, ' data-required="tel" data-validate data-error="Введите телефон" ', $str_pos, 0 );
    return $content;
}
add_filter( 'wpcf7_form_autocomplete', function ( $autocomplete ) {
    $autocomplete = 'off';
    return $autocomplete;
}, 10, 1 );

// Подключение обработчика дополнительных типов записей
function add_post_type($name, $label, $args = array()) {
    add_action('init', function() use($name, $label, $args) {
        $upper = ucwords($name);
        $name = strtolower(str_replace(' ', '_', $name));

        $args = array_merge(
            array(
                'public' => true,
                'label' => "$label",
                'publicly_queryable' => true,
                'show_ui' => true,
                'query_var' => true,
                'capability_type' => 'post',
                'has_archive' => true,
                'labels' => array('add_new_item' => 'Add New'),
                'supports' => array('comments', 'title', 'editor', 'excerpt', 'thumbnail' ),
                'taxonomies' => array('post_tag', 'category'),
            ),
            $args
        );
        register_post_type($name, $args);
    });
}
function add_taxonomy($name, $label, $post_type, $args=array()) {
    $name = strtolower($name);
    add_action('init', function() use($name, $label, $post_type, $args) {
        $args = array_merge(
            array (/*'hierarchical' => true,*/
                'label' => __($label),
                'singular_label' => $name,
                'show_ui'       => true,
                'query_var' => $name),
            $args
        );
        register_taxonomy($name, $post_type, $args);
    }, 0);
}

add_filter( 'template_include', 'my_template' );
function my_template( $template ) {
    if( is_page('about') || is_page('contacts')){
        if ( $new_template = locate_template( array( 'page-contact.php' ) ) )
            return $new_template ;
    }
    if( is_page('logo-dev')){
        if ( $new_template = locate_template( array( 'page-logo.php' ) ) )
            return $new_template ;
    }
    return $template;
}

function true_breadcrumbs(){
    global $post;

    //if( is_front_page() ) return;
    // получаем номер текущей страницы
    $page_num = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;

    $separator = ''; //  разделяем обычным слэшем, но можете чем угодно другим

    echo '<div class="rs-breadcrumbs">
                <nav class="rs-breadcrumbs__navigation">
                    <ul itemscope itemtype="http://schema.org/BreadcrumbList" class="rs-breadcrumbs__list">';

    // если главная страница сайта
    if( is_front_page() ){
        if( $page_num > 1 ) {
            echo '<li class="rs-breadcrumbs__item" itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem"><a class="rs-breadcrumbs__link" href="' . site_url() . '" itemprop="item" typeof="WebPage"><span itemprop="name">Главная</span></a><meta itemprop="position" content="1"></li>' . $separator .'<li class="rs-breadcrumbs__item" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem"><span itemprop="name">'. $page_num . '-я страница'.'</span><meta itemprop="position" content="2">';
        } else {
            echo '<li class="rs-breadcrumbs__item" itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem"><span itemprop="name">Главная</span></a><meta itemprop="position" content="1"></li>';
        }

    }
    else { // не главная

        echo '<li class="rs-breadcrumbs__item" itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem"><a class="rs-breadcrumbs__link" href="' . site_url() . '" itemprop="item" typeof="WebPage"><span itemprop="name">Главная</span></a><meta itemprop="position" content="1"></li>' . $separator;


        if( is_single() ){ // записи

          //  the_category( ', ' ); echo $separator; the_title();

        } elseif ( is_page() ){ // страницы WordPress
            $k=1;
            // если у текущей страницы существует родительская
            if ( $post->post_parent ) {
                $parent_id  = $post->post_parent; // присвоим в переменную
                $breadcrumbs[] = array();
                $breadcrumbs_link = array();
                while ( $parent_id ) {
                    $page = get_page( $parent_id );
                    $breadcrumbs_link[] = '<a class="rs-breadcrumbs__link" href="' . get_permalink( $page->ID ) . '" itemprop="item" typeof="WebPage"><span itemprop="name">' . get_the_title( $page->ID ) . '</span></a>';
                    $parent_id = $page->post_parent;
                }
                //$breadcrumbs_link = array_reverse( $breadcrumbs_link );
               foreach (array_reverse( $breadcrumbs_link )  as $key=> $link){
                   $k=$key+2;
                   echo '<li class="rs-breadcrumbs__item" itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">'.$link.'<meta itemprop="position" content="'.$k.'"></li>'. $separator;
               }
               // echo join( $separator,  $breadcrumbs  ) . $separator;
            }
            echo '<li class="rs-breadcrumbs__item" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem"><span itemprop="name">'.get_the_title().'</span><meta itemprop="position" content="'.($k+1).'"></li>';
        } elseif ( is_category() ) {

          //  single_cat_title();

        } elseif( is_tag() ) {

          //  single_tag_title();

        } elseif ( is_day() ) { // архивы (по дням)

            echo '<li class="rs-breadcrumbs__item" itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem"><a class="rs-breadcrumbs__link" href="' . get_year_link( get_the_time( 'Y' ) ) . '" itemprop="item" typeof="WebPage"><span itemprop="name">' . get_the_time( 'Y' ) . '</span></a><meta itemprop="position" content="2">' . $separator;
            echo '<li class="rs-breadcrumbs__item" itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem"><a class="rs-breadcrumbs__link" href="' . get_month_link( get_the_time( 'Y' ), get_the_time( 'm' ) )  . '" itemprop="item" typeof="WebPage"><span itemprop="name">' . get_the_time( 'F' ). '</span></a><meta itemprop="position" content="3">' . $separator;
            echo '<li class="rs-breadcrumbs__item" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem"><span itemprop="name">'.get_the_time('d').'</span><meta itemprop="position" content="4"></li>';

        } elseif ( is_month() ) { // архивы (по месяцам)

            echo '<li class="rs-breadcrumbs__item" itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem"><a class="rs-breadcrumbs__link" href="' . get_year_link( get_the_time( 'Y' ) ) . '" itemprop="item" typeof="WebPage"><span itemprop="name">' . get_the_time( 'Y' ) . '</span></a><meta itemprop="position" content="2">' . $separator;;
            echo '<li class="rs-breadcrumbs__item" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem"><span itemprop="name">'.get_the_time('F').'</span><meta itemprop="position" content="3"></li>';

        } elseif ( is_year() ) { // архивы (по годам)

            echo '<li class="rs-breadcrumbs__item" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem"><span itemprop="name">'.get_the_time( 'Y' ).'</span><meta itemprop="position" content="2"></li>';

        } elseif ( is_author() ) { // архивы по авторам

            global $author;
            $userdata = get_userdata( $author );
            echo '<li class="rs-breadcrumbs__item" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem"><span itemprop="name">Опубликовал(а) ' . $userdata->display_name.'</span><meta itemprop="position" content="2"></li>';

        } elseif ( is_404() ) { // если страницы не существует

            echo '<li class="rs-breadcrumbs__item" ><span>Ошибка 404</span></li>';

        }

        /*if ( $page_num > 1 ) { // номер текущей страницы
            echo ' (' . $page_num . '-я страница)';
        }*/

    }

    echo '</ul></nav> </div>';
}

function FileSizeConvert($bytes,$unit=2)
{
    $bytes = floatval($bytes);
    $arBytes = array(
        0 => array(
            "UNIT" => "tb",
            "VALUE" => pow(1024, 4)
        ),
        1 => array(
            "UNIT" => "gb",
            "VALUE" => pow(1024, 3)
        ),
        2 => array(
            "UNIT" => "mb",
            "VALUE" => pow(1024, 2)
        ),
        3 => array(
            "UNIT" => "kb",
            "VALUE" => 1024
        ),
        4 => array(
            "UNIT" => "b",
            "VALUE" => 1
        ),
    );

        $result = $bytes / $arBytes[$unit]["VALUE"];
        $result = number_format($result, 1,'.', ' ').$arBytes[$unit]["UNIT"];

    return $result;
}

//Вывод вспомогательной информации в администраторе
//add_action('wp_dashboard_setup', 'blogood_ru_help_widgets');
function blogood_ru_help_widgets() {
    global $wp_meta_boxes;

    wp_add_dashboard_widget(
        'help_widget', //Слаг виджета
        'Добро пожаловать в РСУ', //Заголовок виджета
        'help' //Функция вывода
    );
}
function help() {
    echo '<p><a href="https://rosait.ru/wordpress-instruktsiya/" target="_blank">Руководство по работе</a> с системой управления WordPress</p>';
    echo '<p>Техническая поддержка: support@rosait.ru<p>';
    echo '<p>Отдел продаж: +7 (800) 222-90-72 по всей России (бесплатно)<p>';
    echo '<hr/><p>РСУ - Россайт Система управления для Wordpress</p>';
}