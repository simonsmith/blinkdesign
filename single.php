<?
    $tpl_name = 'single.mustache';
    $single_tpl = load_mustache_template($tpl_name);

    while (have_posts()) {
        the_post();
        $tpl_data = [
            'template' => $tpl_name,
            'title' => get_the_title(),
            'content' => get_the_content(),
            'w3c_date' => get_the_time('c'),
            'date' => get_the_time('F jS Y')
        ];
    }

    page_output($single_tpl, $tpl_data);