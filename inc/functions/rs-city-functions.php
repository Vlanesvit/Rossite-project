<?php
add_post_type('city', 'Города', array(
    'supports'   => array( 'title'),
    'taxonomies' => array( 'post_tag', 'page-attributes' ),
    'menu_icon' => 'dashicons-admin-page',
));
add_action( 'init', 'city_unregister_tags', 99 );
function city_unregister_tags(){
    unregister_taxonomy_for_object_type( 'post_tag', 'city' );
}
add_taxonomy('city_category', "Алфавит", 'city', $args=array('hierarchical'  => true,'has_archive'         => true,));
// Menu_order for posts
add_action( 'admin_init', 'posts_order_city' );
function posts_order_city()
{
    add_post_type_support( 'city', 'page-attributes' );
}
add_filter('post_type_labels_city', 'rename_posts_labels_city');
function rename_posts_labels_city ( $labels ){
    $city = array(
        'name'                  => 'Город',
        'singular_name'         => 'Город',
        'add_new'               => 'Добавить город',
        'add_new_item'          => 'Добавить город',
        'edit_item'             => 'Редактировать город',
        'new_item'              => 'Новый город',
        'view_item'             => 'Просмотреть город',
        'search_items'          => 'Поиск города',
        'not_found'             => 'Город не найден.',
        'not_found_in_trash'    => 'Городов в корзине не найдено.',
        'parent_item_colon'     => '',
        'all_items'             => 'Все города',
        'archives'              => 'Архивы',
        'insert_into_item'      => 'Вставить в город',
        'uploaded_to_this_item' => 'Загруженные для этого города ',
        'featured_image'        => 'Изображение (страница Города)',
        'filter_items_list'     => 'Фильтровать список',
        'items_list_navigation' => 'Навигация по списку',
        'items_list'            => 'Список городов',
        'menu_name'             => 'Города',
        'name_admin_bar'        => 'Город', // пункт "добавить"
    );
    return (object) array_merge( (array) $labels, $city );
}

//Город по умолчанию
$default_city = get_field('city',FRONT_PAGE);
define('DEFAULT_CITY',$default_city->post_title);
define('ID_CITY',$default_city->ID);
define('LINK_CITY',$default_city->post_name);

/*unset($_COOKIE['AUTODETECT_CITY']);
setcookie("AUTODETECT_CITY", '',time() - 60*60*24*100,'/');*/

add_action( 'init', 'current_city', 99);
function current_city (){
    global $current_city;

    $is_autodetect_city = !isset($_COOKIE['AUTODETECT_CITY'])?1:0;
    if(!isset($_COOKIE['AUTODETECT_CITY'])){
        setcookie("AUTODETECT_CITY", $is_autodetect_city,time() + 60*60*24*1,'/');
    }
   // var_dump($_COOKIE['AUTODETECT_CITY']);
    //Город по IP
    if (!$_COOKIE['AUTODETECT_CITY']) {
        $ch = curl_init('http://ip-api.com/json/' . $_SERVER['REMOTE_ADDR'] . '?lang=ru');
      //  $ch = curl_init('http://ip-api.com/json/195.70.196.197?lang=ru');
      //  $ch = curl_init('http://ip-api.com/json/91.149.187.207?lang=ru');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HEADER, false);
        $res = curl_exec($ch);
        curl_close($ch);

        $res = json_decode($res, true);
        $city = trim($res['city']) ? trim($res['city']) : DEFAULT_CITY;

        setcookie("CITY", $city,time() + 60*60*24*30,'/');
        $_SESSION['CITY']=$city;
        $current_city=set_city($city);
        $_SESSION['CURRENT_CITY'] = $current_city['city'];
    }
    if(isset($_REQUEST['set_city'])){
        $current_city=request_city($_REQUEST['set_city']);
        $url = $_SERVER['HTTP_REFERER'];
        $dis_url = $_SERVER['REQUEST_URI'];
    } else {
        $current_city=isset($_SESSION['CURRENT_CITY'])?set_city($_SESSION['CURRENT_CITY']):set_city(DEFAULT_CITY);
    }

    $_SESSION['CURRENT_CITY'] = $current_city['city'];
    $_SESSION['CURRENT_LINK_CITY'] = $current_city['link'];
    $_SESSION['CURRENT_ID'] = $current_city['id'];

    if(isset($_REQUEST['set_city'])){
        if ($url == NULL) {
            $current_url = explode("?", $dis_url );
            header("Location: ".$_SERVER['REQUEST_SCHEME']."://".$_SERVER['SERVER_NAME'].$current_url[0]);
        }
        else{
            $new_uri = trim(strtok($dis_url, '?'));
            header("Location: ".$_SERVER['REQUEST_SCHEME']."://".$_SERVER['SERVER_NAME'].$new_uri);
        }
        if(!isset($_COOKIE['AUTODETECT_CITY']) || $_COOKIE['AUTODETECT_CITY']==0){
            setcookie("AUTODETECT_CITY", 1,time() + 60*60*24*1,'/');
        }
    }

}
function set_city($city){
    /*if(!isset($_COOKIE['AUTODETECT_CITY'])){
        setcookie("AUTODETECT_CITY", 0,time() + 60*60*24*30,'/');
    }*/
    $curent_id = ID_CITY;
    $curent_city = DEFAULT_CITY;
    $curent_link_city = LINK_CITY;

    $posts = get_posts(
        array(
            'post_type' => 'city',
            'title' => $city,
            'numberposts' => 1,
            'update_post_term_cache' => false,
            'update_post_meta_cache' => false,
            'orderby' => 'title',
            'order' => 'ASC',
            'meta_query' => array(
                array(
                    'key' => 'link',
                    'value' => true
                )
            )
        )
    );

    if (!empty($posts)) {
        $curent_id = $posts[0]->ID;
        $curent_city = $posts[0]->post_title;
        $curent_link_city = $posts[0]->post_name; }

    return array('city'=>$curent_city,'link'=>$curent_link_city,'id'=>$curent_id);
    wp_reset_postdata();
}
function request_city($city){
    $curent_id = ID_CITY;
    $curent_city = DEFAULT_CITY;
    $curent_link_city = LINK_CITY;

    if(!isset($_COOKIE['AUTODETECT_CITY'])){
        setcookie("AUTODETECT_CITY", 0,time() + 60*60*24*30,'/');
    }

    $posts = get_posts(
        array(
            'post_type' => 'city',
            'name' => $city,
            'numberposts' => 1,
            'update_post_term_cache' => false,
            'update_post_meta_cache' => false,
            'orderby' => 'title',
            'order' => 'ASC',
            'meta_query' => array(
                array(
                    'key' => 'link',
                    'value' => true
                )
            )
        )
    );
   //
    if (!empty($posts)) {
        $curent_id = $posts[0]->ID;
        $curent_city = $posts[0]->post_title;
        $curent_link_city = $city;
    }

    return array('city'=>$curent_city,'link'=>$curent_link_city,'id'=>$curent_id);
    wp_reset_postdata();
}

//Документы - шаблон контакты
function rs_documents_contact($content,$key=0){
    $title = $content["title"];
    $subtitle = $content["subtitle"];
    $bg = get_field("bg_image",$_SESSION['CURRENT_ID'])?:get_field("bg_image",ID_CITY);
    $documents = get_field("documents",$_SESSION['CURRENT_ID'])?:get_field("documents",ID_CITY);
    ?>
    <section class="rs-document">
        <div class="rs-document__bg">
            <img src="<?=$bg?>" alt="">
        </div>
        <div class="rs-document__container">
            <h1 class="mrp-med-65"><?=$title?></h1>
            <h5 class="mrp-reg-21"><?=$subtitle?></h5>
    <?if(is_array($documents)):?>
            <div class="rs-document__wrapper">
                <div data-spollers="991.98,max" data-one-spoller class="rs-document__spollers">
                    <?php foreach ($documents as $key => $document):?>
                    <div class="rs-document__spollers_block">
                        <div class="rs-document__spollers_item">
                            <button type="button" data-spoller class="rs-document__spollers_title<?php if($key==0): ?> _spoller-active<?php endif;?>">
                                <span class="rs-document__format"><?=$document['format']?></span>
                                <?=$document['title']?> <i></i>
                            </button>
                            <div class="rs-document__spollers_body">
                                <?php foreach ($document['column'] as $key => $column): ?>
                                    <?php foreach ($column as $item):?>
                                    <div class="rs-document__list">
                                        <ul>
                                            <?php foreach ($item as $doc):
                                            if( $doc["on_download"]):
                                                $file =$doc["link"];
                                                ?>
                                                <li><a href="<?=$file['url']?>" target="_blank"><?=$file['title']?> </a></li>
                                            <?php else :
                                                $file = $doc["file"];
                                            $size =  FileSizeConvert($file["filesize"]);
                                                ?>
                                                <li><a href="<?=$file['url']?>" target="_blank" download=""><?=$file['title']?> (<?= $file["subtype"]?>, <?=$size?>)</a></li>
                                            <?php endif;?>
                                            <?php endforeach;?>
                                        </ul>

                                    </div>
                                    <?php endforeach;?>
                                <?php endforeach;?>
                            </div>
                        </div>
                    </div>
                    <?php endforeach;?>
                </div>
            </div>
    <?php endif;?>
        </div>
    </section>
<?php }
//Контакты - шаблон контакты
function rs_contacts($content,$key=0){
    $citys=array();
    if(is_array($content["city"])){
        $citys = $content["city"];
    } else {
        $citys[] = $content["city"]?$content["city"]:$_SESSION['CURRENT_ID'];
    }

    if($_SESSION['CURRENT_ID'] == 1840){
        $city_ids=array_merge($citys,[ 1840, ID_CITY]);
    } else if($_SESSION['CURRENT_ID'] == ID_CITY){
        $city_ids=array_merge([ID_CITY,1840],$citys);
    } else {
        $city_ids=array_merge([ID_CITY,1840],$citys);
        if(!(get_field("on_office",$_SESSION['CURRENT_ID']) && get_field("on_sales",$_SESSION['CURRENT_ID']))){
            foreach($city_ids as $key => $item){
                if ($item == $_SESSION['CURRENT_ID']){
                    unset($city_ids[$key]);
                }
            }
        }

    }
    $city_ids=array_unique($city_ids);

    /*foreach ($city_ids as $key => $city){
        if(!in_array($city,$citys )){
            unset($city_ids[$key]);
        }
    }*/

    if(!$content["city"] && is_array($city_ids)){
        $key = array_key_first($city_ids);
        $city_ids = [$city_ids[$key]];
    }

	foreach ($city_ids as $index => $city) {
		$map = get_field("map", $city);
		$sales = get_field("sales_department", $city);
		$tech = get_field("tech_department", $city);
	
		?>
        <section class="rs-contact">
            <div class="rs-contact__container">
                <div class="rs-contact__wrapper">
                    <div class="rs-contact__info">
                        <div class="rs-contact__info_body">
                            <?php if($sales):?>
                                <h2 class="mrp-med-40"><?= $sales['title']; ?></h2>

                                <ul class="rs-contact__info_list">
                                    <?php if(!empty($sales['phone'])):?>
                                        <li>
                                            <div class="rs-contact__info_left">
                                                <h6>Телефон</h6>
                                            </div>
                                            <div class="rs-contact__info_right">
                                                <a href="tel:<?= preg_replace('/[^0-9\+]+/', '', $sales['phone']) ?>"><?=$sales['phone']?></a>
                                            </div>
                                        </li>
                                    <?php endif;?>
                                    <?php if(!empty($sales['works'])):?>
                                        <li>
                                            <div class="rs-contact__info_left">
                                                <h6>Время работы</h6>
                                            </div>
                                            <div class="rs-contact__info_right">
                                                <h4><?=$sales['works']?></h4>
                                            </div>
                                        </li>
                                    <?php endif;?>
                                    <?php if(!empty($sales['email'])):?>
                                        <li>
                                            <div class="rs-contact__info_left">
                                                <h6>Email</h6>
                                            </div>
                                            <div class="rs-contact__info_right">
                                                <a href="mailto:<?=$sales['email']?>"><?=$sales['email']?></a>
                                            </div>
                                        </li>
                                    <?php endif;?>
                                    <?php if(!empty($sales['address'])):?>
                                        <li>
                                            <div class="rs-contact__info_left">
                                                <h5>Адрес:</h5>
                                                <p><?=$sales['address']?></p>
                                            </div>
                                            <?php if(!empty($sales['img'])):?>
                                                <div class="rs-contact__info_right">
                                                    <img src="<?=$sales['img']?>" alt="">
                                                </div>
                                            <?php endif;?>
                                        </li>
                                    <?php endif;?>
                                    <?php if(!empty($sales['kak_proehat'])):?>
                                        <li>
                                            <div class="rs-contact__info_left">
                                                <?=$sales['kak_proehat']?>
                                            </div>
                                        </li>
                                    <?php endif;?>
                                    <?php if(!empty($sales['tochki_prodazh'])):?>
                                        <li>
                                            <div class="rs-contact__info_left">
                                                <?=$sales['tochki_prodazh']?>
                                            </div>
                                        </li>
                                    <?php endif;?>
                                </ul>
                            <?php endif;?>

                            <blockquote>
                                <div class="rs-blockquote__text">
                                    <h5><?= $tech['title']; ?></h5>
                                    <p>Время работы: <?= $tech['works']; ?></p>
                                    <p>Электронная почта: <a href="mailto:<?= $tech['email']; ?>"><?= $tech['email']; ?></a>
                                    </p>
                                </div>

                                <a href="#" class="rs-btn _btn-white" data-popup="#letter-manager">
                                    <span class="btn-text">написать в техподдержку</span>
                                    <span class="btn-hover"></span>
                                </a>
                            </blockquote>
                        </div>
                    </div>

                    <div class="rs-contact__map">
                        <div class="map"><?php  echo $map; ?></div>
                    </div>
                </div>
            </div>
        </section>
    <?php }
}
if (!function_exists('array_key_first')) {
    function array_key_first(array $arr)
    {
        foreach ($arr as $key => $unused) {
            return $key;
        }
        return NULL;
    }
}
