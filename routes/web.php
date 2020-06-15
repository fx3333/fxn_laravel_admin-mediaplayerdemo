<?php

use FengLaravelAdmin\MediaPlayerDemo\Http\Controllers\MediaPlayerDemoController;

Route::get('mediaplayerdemo', MediaPlayerDemoController::class.'@index');