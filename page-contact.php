<?php
get_header();
if(get_field("on_banner")) {
    //Баннер
    $banner = get_field('banner');
    do_action( 'template_on_main_banner', $banner);
}

$rows = get_field('bloki' );
if( is_array($rows) ) {
    foreach($rows as $index => $row){
        $tip_bloka = $row["tip_bloka"];
        do_action( 'template_on_'.$tip_bloka.'_contact', $row, $index);
    }
}

?>
<?php get_footer(); ?>