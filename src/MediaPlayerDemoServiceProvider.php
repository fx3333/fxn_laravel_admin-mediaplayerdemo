<?php

namespace FengLaravelAdmin\MediaPlayerDemo;

use Illuminate\Support\ServiceProvider;
use Encore\Admin\Admin;
use Encore\Admin\Form;
use Encore\Admin\Grid\Filter;

class MediaPlayerDemoServiceProvider extends ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function boot(MediaPlayerDemo $extension)
    {
        if (! MediaPlayerDemo::boot()) {
            return ;
        }

        if ($views = $extension->views()) {
            $this->loadViewsFrom($views, 'fxn_laravel_admin-mediaplayerdemo');
        }

        if ($this->app->runningInConsole() && $assets = $extension->assets()) {
            $this->publishes(
                [$assets => public_path('vendor/fxn_laravel_admin/mediaplayerdemo')],
                'fxn_laravel_admin-mediaplayerdemo'
            );
        }

        Admin::booting(function () {
            Form::extend('mediaplayerfeng', DemoCheck::class);
//            Filter::extend('distpickerfeng', DemoFilter::class);
        });

//        $this->app->booted(function () {
//            MediaPlayerDemo::routes(__DIR__.'/../routes/web.php');
//        });
    }
}