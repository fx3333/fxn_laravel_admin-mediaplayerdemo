<?php

namespace FengLaravelAdmin\MediaPlayerDemo;

use Encore\Admin\Extension;

class MediaPlayerDemo extends Extension
{
    public $name = 'mediaplayerdemo';

    public $views = __DIR__.'/../resources/views';

    public $assets = __DIR__.'/../resources/assets';

    public $menu = [
        'title' => 'Mediaplayerdemo',
        'path'  => 'mediaplayerdemo',
        'icon'  => 'fa-gears',
    ];
}