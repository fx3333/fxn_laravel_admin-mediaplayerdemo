<?php

namespace FengLaravelAdmin\MediaPlayerDemo;

use App\Models\Product;
use App\Models\Release;
use Encore\Admin\Form\Field;
use Illuminate\Support\Arr;

class DemoCheck extends Field
{
    /**
     * @var string
     */
    protected $view = 'fxn_laravel_admin-mediaplayerdemo::select';

    /**
     * @var array
     */
    protected static $js = [
        'vendor/fxn_laravel_admin/mediaplayerdemo/distpickerf.js',
        'vendor/fxn_laravel_admin/mediaplayerdemo/layer.js',
        'vendor/fxn_laravel_admin/mediaplayerdemo/webuploader.min.js',
    ];

    /**
     * @var array
     */
    protected static $css = [
        'vendor/fxn_laravel_admin/mediaplayerdemo/webuploader.css',
        'vendor/fxn_laravel_admin/mediaplayerdemo/tab.css',
    ];

    /**
     * @var array
     */
    protected $columnKeys = ['images','product_id'];

    /**
     * @var array
     */
    protected $placeholder = [];

    /**
     * request url for this resource .
     *
     * @var string
     */
    protected $url;

    /**
     * request imgurl for this resource .
     *
     * @var string
     */
    protected $release_type;

    /**
     * Distpicker constructor.
     *
     * @param array $column
     * @param array $arguments
     */
    public function __construct($column, $arguments)
    {
//        var_dump($column);die;
        if (!Arr::isAssoc($column)) {
            $this->column = array_combine($this->columnKeys, $column);
        } else {
            $this->column      = array_combine($this->columnKeys, array_keys($column));
            $this->placeholder = array_combine($this->columnKeys, $column);
        }
//var_dump($this->column->release);die;
        $this->label = empty($arguments) ? '图片/视频' : current($arguments);
    }

    public function getValidator(array $input)
    {
        if ($this->validator) {
            return $this->validator->call($this, $input);
        }

        $rules = $attributes = [];

        if (!$fieldRules = $this->getRules()) {
            return false;
        }

        foreach ($this->column as $key => $column) {
            if (!Arr::has($input, $column)) {
                continue;
            }
            $input[$column] = Arr::get($input, $column);
            $rules[$column] = $fieldRules;
            $attributes[$column] = $this->label."[$column]";
        }

        return \validator($input, $rules, $this->getValidationMessages(), $attributes);
    }

    /**
     * @param int $count
     * @return $this
     */
    public function autoselect($count = 0)
    {
        return $this->attribute('data-autoselect', $count);
    }

    /**
     * @param int $count
     * @return $this
     */
//    public function setUrl($url="")
//    {
//        $this->url = empty($url) ? '' : trim($url);
//    }
    public function setUrl($url_arrs)
    {
        $url=$url_arrs[0];
        $imgurl=$url_arrs[1];
        $release_type=$url_arrs[2];
        $this->url = empty($url) ? '' : trim($url);
        $this->imgurl = empty($imgurl) ? '' : trim($imgurl);
        $this->release_type = empty($release_type) ? '' : trim($release_type);
    }

    /**
     * @param int $count
     * @return $this
     */
    public function setType($release_type="")
    {
//        var_dump($imgurl);die;
        $this->release_type = empty($release_type) ? '' : trim($release_type);
    }

    /**
     * {@inheritdoc}
     */
    public function render()
    {
//        var_dump("asdf");die;
        $this->attribute('data-value-type', 'code');

        $images = old($this->column['images'], Arr::get($this->value(), 'images')) ?: Arr::get($this->placeholder, 'images');
        $product_id = old($this->column['product_id'], Arr::get($this->value(), 'product_id')) ?: Arr::get($this->placeholder, 'product_id');
        $release_type = $this->release_type;

        $user_id=Release::getReleaseUserID($release_type,$product_id);


//var_dump($release_type,$user_id);die;
        $image_type=0;
        $mediaplayerdemo_config=config("admin.extensions.mediaplayerdemo");
//        var_dump($mediaplayerdemo_config,$images);die;
        $img_ext=implode(",",$mediaplayerdemo_config['img_ext']);
        $video_ext=implode(",",$mediaplayerdemo_config['video_ext']);
        if($images){
            foreach($images as $key=>$value){
//            $value=strrev($value);
                $pos=strrpos($value,".");
                $ext=substr($value,$pos+1,strlen($value)-1);
                if(in_array($ext,$mediaplayerdemo_config['img_ext'])){
                    $image_type=0;
                }else if(in_array($ext,$mediaplayerdemo_config['video_ext'])){
                    $image_type=1;
                }
//                var_dump($image_type);
                break;

            }
        }
//        $size=filesize("D:/phpstudy_pro/WWW/www.enterpriseLegend.com/public/uploads/videos\moments/202006/13/0_1592011742_AkZPUElJQb.mp4");
//var_dump($img_ext,$video_ext);die;
//        die;
//测试12334534520200617

        $images=json_encode($images);
        $id = uniqid('uploadfile-');
//var_dump($images,$image_type);die;
        $this->script = <<<EOT
        
            $("#{$id}").mediaplayerfeng({
              product_id:'$product_id',
              url: '$this->url',
              imgurl: '$this->imgurl',
              release_type: '$release_type',
              user_id: '$user_id',
              extensions:{
                img:'$img_ext',
                video:'$video_ext',
              }
            });
            
EOT;

//        $this->script = <<<EOT
//        (function () {
//            $("#{$id}").mediaplayerfeng({
//              product_id:'$product_id',
//              url: '$this->url',
//            });
//            })();
//EOT;

        return parent::render()->with(compact('id','img_ext','video_ext'));
    }
}