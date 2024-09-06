<?php
/**
 * The template for displaying the footer.
 *
 */
?>
</main><!-- .page -->
<?php
// Подключение футера дочерней темы
get_template_part('template-parts/rs-footer');
?>
</div><!-- .wrapper -->

<?php
wp_footer();
global $popups;
foreach ($popups as $index => $popup){
    do_action('footer_on_'.$popup['id_formy'], $popup);
}
do_action( 'rs_action_footer' );
?>
</body>
</html>