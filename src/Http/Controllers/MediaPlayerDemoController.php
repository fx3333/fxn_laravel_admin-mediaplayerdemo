<?php

namespace FengLaravelAdmin\MediaPlayerDemo\Http\Controllers;

use Encore\Admin\Layout\Content;
use Illuminate\Routing\Controller;

class MediaPlayerDemoController extends Controller
{
    public function index(Content $content)
    {
        return $content
            ->title('Title')
            ->description('Description')
            ->body(view('mediaplayerdemo::index'));
    }
}