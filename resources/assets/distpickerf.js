//step01 定义JQuery的作用域
(function ($) {

    //step03-a 插件的默认值属性
    var defaults = {
        // images:'',
        // image_type:0,
        product_id:0,
        url:'',
        imgurl:'',
        release_type:'moment',
        user_id:'0',
        extensions:{
            img:'jpg',
            video:'mp3',
        },

        //……
    };
    var iNum1=-2;
    var iNum2=-2;
    var NUM_LIMIT=3;
    var IMG_NUM_LIMIT=3;
    var VIDEO_NUM_LIMIT=1;

    var acceptImage=[
        //图片
        {
            title: 'Images',
            extensions: 'jpg,png',
            mimeTypes: 'image/*'
        },
        //视频
        {
            title: 'Images',
            extensions: 'mp4',
            mimeTypes: 'video/*'
        }
    ];

    var img_data=[];
    var img_rel_data=[];
    var uploader=null;
    var init_img_type;
    var init_img_data={};

    //视频上传 start
    var $list = $('#thelist .table'),
        $btn = $('#ctlBtn');
    $click_image=$(".click_image");
    /**
     * 空值判断
     * 1.字符串类型判断非空且不为空串
     * 2.对象或者undefined类型判断是否为null
     * 3.数值类型判断是否为NaN
     * 4.boolean类型直接返回false
     * 5.未知类型返回true
     */
    var isEmpty =function (param){
        if(typeof param == 'string'){
            //字符串类型判断非空且不为空串
            return param==null
                ||param.trim().length==0
                ||param=='null'
                ;
        }else if(typeof param == 'object'
            || typeof param == undefined){
            //对象或者undefined类型判断是否为null
            return param==null;
        }else if(typeof param == 'number'){
            //数值类型判断是否为NaN
            return isNaN(param);
        }else if(typeof param == 'boolean'){
            //boolean类型直接返回false
            return false ;
        }else{
            //未知类型返回true
            return true;
        }
    }

    //图片或者视频大小格式化输出
    var bytesToSize=function (bytes){
        if (bytes === 0) return '0 B';
        let k = 1000, // or 1024
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }

    //图片点击放大效果
    var imgShow=function (outerdiv, innerdiv, max_img, _this){
        //console.log("bsdf");
        var src = _this.attr("src");//获取当前点击的min_img元素中的src属性
        $(max_img).attr("src", src);//设置#max_img元素的src属性

        /*获取当前点击图片的真实大小，并显示弹出层及大图*/
        $("<img/>").attr("src", src).load(function(){
            var windowW = $(window).width();//获取当前窗口宽度
            var windowH = $(window).height();//获取当前窗口高度
            var realWidth = this.width;//获取图片真实宽度
            var realHeight = this.height;//获取图片真实高度
            var imgWidth, imgHeight;
            var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放

            if(realHeight>windowH*scale) {//判断图片高度
                imgHeight = windowH*scale;//如大于窗口高度，图片高度进行缩放
                imgWidth = imgHeight/realHeight*realWidth;//等比例缩放宽度
                if(imgWidth>windowW*scale) {//如宽度扔大于窗口宽度
                    imgWidth = windowW*scale;//再对宽度进行缩放
                }
            } else if(realWidth>windowW*scale) {//如图片高度合适，判断图片宽度
                imgWidth = windowW*scale;//如大于窗口宽度，图片宽度进行缩放
                imgHeight = imgWidth/realWidth*realHeight;//等比例缩放高度
            } else {//如果图片真实高度和宽度都符合要求，高宽不变
                imgWidth = realWidth;
                imgHeight = realHeight;
            }
            $(max_img).css("width",imgWidth);//以最终的宽度对图片缩放

            var w = (windowW-imgWidth)/2;//计算图片与窗口左边距
            var h = (windowH-imgHeight)/2;//计算图片与窗口上边距
            $(innerdiv).css({"top":h, "left":w});//设置#innerdiv的top和left属性
            $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg
        });

        $(outerdiv).click(function(){//再次点击淡出消失弹出层
            $(this).fadeOut("fast");
        });
    }

    //页面加载初始已经存储的图片或者视频列表加载
    var list_append =function (image_data,image_type){

        // console.log(image_data);return false;
        // image_data=JSON.parse(image_data);
        $.each(image_data,function(index,value){
            // alert(index+"..."+value);
            //console.log(index+"..."+value);

            var html='<tr  class="file-item" img_id="'+value+'">';
            html+='<td width="5%" class="file-num">--</td>';
            html+='<td class="file-name">--</td>';
            html+='<td width="20%" class="file-size">--</td>';
            html+='<td width="20%" class="file-pro">100.00%</td><td class="file-status">已上传</td>';
            html+='<td class="file-url" style="width: 100px;height: 100px;">';
            if(image_type==0){
                html+='<img src="'+value+'" class="file_url_img" style="width: 100px;height: 100px;"/>';
            }else if(image_type==1){
                html+='<video width="320" height="240" id="min_video" controls="" autoplay="autoplay" style="width:260px;height:260px;">';
                html+='<source class="video_1" src="'+value+'" type="video/mp4">';
                html+='</video>';
            }

            html+='</td>';
            html+='<td width="20%" class="file-manage">';
            html+='<a class="remove-that" href="javascript:;" load_type="1">取消</a>';
            html+='</td>';
            html+='</tr>';
            //console.log(html);

            //init_img_html+=html;
            img_data.push(value);
            $(".images_field").val(img_data);
            $("#thelist .table").append(html);
        });

    }

    //上传组件动态创建，同时添加监听事件
    var uploader_demo1 =function (image_type,release_type,user_id,num_limit,url,extensions){

        // console.log(extensions);
        var extension_data='';
        if(image_type==0){
            NUM_LIMIT=IMG_NUM_LIMIT;
            extension_data=extensions.img;
        }else if(image_type==1){
            NUM_LIMIT=VIDEO_NUM_LIMIT;
            extension_data=extensions.video;
        }else{
            NUM_LIMIT=IMG_NUM_LIMIT;
            extension_data=extensions.img;
        }
        // console.log(extension_data);

        uploader= WebUploader.create({
            resize: false, // 不压缩image
            swf: 'uploader.swf', // swf文件路径
            //server: 'http://www.enterpriselegend.com/api/v1/ms/ms', // 文件接收服务端。。
            server: url, // 文件接收服务端。
            pick: '#picker', // 选择文件的按钮。可选
            chunked: true, //是否要分片处理大文件上传
            chunkSize:5*1024*1024, //分片上传，每片2M，默认是5M
            auto: true, //选择文件后是否自动上传
            // chunkRetry : 2, //如果某个分片由于网络问题出错，允许自动重传次数
            //runtimeOrder: 'html5,flash',
            // accept: {
            //   title: 'Images',
            //   extensions: 'gif,jpg,jpeg,bmp,png',
            //   mimeTypes: 'image/*'
            // }
            accept: {
                title: acceptImage[image_type]['title'],
                extensions: extension_data,
                mimeTypes:acceptImage[image_type]['mimeTypes'],
            },
            // accept:acceptImage[image_type],
            duplicate: false, //是否支持重复上传
            // fileSizeLimit:"5mb",//文件总大小限制
            fileSingleSizeLimit:"5mb",//单个文件大小限制
            multiple: true, // 选择多个
            // fileVal:'file', // [默认值：'file'] 设置文件上传域的name。
            method: 'POST', // 文件上传方式，POST或者GET。
            formData:{
                "image_type":image_type,
                "release_type":release_type,
                "user_id":user_id,
            },
            fileNumLimit:NUM_LIMIT,
        });

        // 当有文件被添加进队列的时候
        uploader.on( 'fileQueued', function( file ) {
            var html="";
            html+='<tr id="'+ file.id +'" class="file-item" img_id="0">';
            html+='<td width="5%" class="file-num">111</td>';
            html+='<td class="file-name">'+ file.name +'</td>';
            html+='<td width="20%" class="file-size">'+bytesToSize (file.size) +'</td>';
            html+='<td width="20%" class="file-pro">0%</td>';
            html+='<td class="file-status">等待上传</td>';
            html+='<td class="file-url" style="width: 100px;height: 100px;"></td>';
            html+='<td width="20%" class="file-manage">';
            // html+='<a class="stop-btn" href="javascript:;">暂停</a>';
            html+='<a class="remove-this" href="javascript:;" load_type="0">取消</a></td>';
            html+='</tr>';
            // console.log(html);
            //$list.append(html);
            $("#thelist .table").append(html);

            // $list.append('<tr id="'+ file.id +'" class="file-item">'+'<td width="5%" class="file-num">111</td>'+'<td class="file-name">'+ file.name +'</td>'+ '<td width="20%" class="file-size">'+ (file.size/1024/1024).toFixed(1)+'M' +'</td>' +'<td width="20%" class="file-pro">0%</td>'+'<td class="file-status">等待上传</td>'+'<td width="20%" class="file-manage"><a class="stop-btn" href="javascript:;">暂停</a><a class="remove-this" href="javascript:;">取消</a></td>'+'</tr>');

            //暂停上传的文件
            $("#thelist .table").on('click','.stop-btn',function(){
                uploader.stop(true);
            })
            //删除上传的文件
            $("#thelist .table").on('click','.remove-this',function(){
                //console.log(99);
                if ($(this).parents(".file-item").attr('id') == file.id) {
                    uploader.removeFile(file);
                    $(this).parents(".file-item").remove();
                    var img_id=$(this).parents(".file-item").attr("img_id");
                    // console.log("img_id"+img_id);
                    img_data.splice($.inArray(img_id,img_data),1);

                    //console.log("img_data:remove");
                    // console.log(img_data);
                    $(".images_field").val(img_data);
                }

            });
        });
        //重复添加文件
        var timer1;
        uploader.onError = function(code){
            // console.log(code);
            clearTimeout(timer1);
            if(code=="Q_EXCEED_NUM_LIMIT"){
                layer.msg('文件数量总数超额');
            }else if(code=="Q_TYPE_DENIED"){
                layer.msg('文件格式不符合条件');
            }else if(code=="Q_EXCEED_SIZE_LIMIT "){
                layer.msg('添加的文件总大小超额');
            }
            else{
                layer.msg('该文件已存在');
            }
            timer1 = setTimeout(function(code) {
                //console.log(code);
            },250);
        }

        // 文件上传过程中创建进度条实时显示
        uploader.on( 'uploadProgress', function( file, percentage ) {
            $("td.file-pro").text("");
            var $li = $( '#'+file.id ).find('.file-pro'),
                $percent = $li.find('.file-progress .progress-bar');

            // 避免重复创建
            // if ( !$percent.length ) {
            //     $percent = $('<div class="file-progress progress-striped active">' +
            //         '<div class="progress-bar" role="progressbar" style="width: 0%">' +
            //         '</div>' +
            //         '</div>' + '<br/><div class="per">0%</div>').appendTo( $li ).find('.progress-bar');
            // }

            $li.siblings('.file-status').text('上传中');
            $li.text((percentage * 100).toFixed(2) + '%');
            //console.log(percentage);
            // $li.find('.per').text((percentage * 100).toFixed(2) + '%');
            // $percent.css( 'width', percentage * 100 + '%' );
        });
        // 文件上传成功
        uploader.on( 'uploadSuccess', function( file ,response) {
            //console.log(file,response);
            if(response.error=="0"){
                $( '#'+file.id ).find('.file-status').text('已上传');

                if(response.image_type=="0"){
                    $( '#'+file.id ).find('.file-url').html( '<img src="'+response.pic+'" class="file_url_img" style="width: 100px;height: 100px;"/>');
                }else{
                    var html='<video width="320" height="240" id="min_video" controls="" autoplay="autoplay" style="width:260px;height:260px;" >\n' +
                        '            <source class="video_1" src="'+response.pic+'" type="video/mp4">\n' +
                        '        </video>';
                    $( '#'+file.id ).find('.file-url').html( html);
                }
                $( '#'+file.id ).attr("img_id",response.path);

                img_data.push(response.pic);
                //console.log("img_data:insert");
                //console.log(img_data);
                $(".images_field").val(img_data);
            }else{
                layer.msg(''+response.error);
            }


        });

        // 文件上传失败，显示上传出错
        uploader.on( 'uploadError', function( file ) {
            $( '#'+file.id ).find('.file-status').text('上传出错');
        });
        // 完成上传完后将视频添加到视频列表，显示状态为：转码中
        uploader.on( 'uploadComplete', function( file ) {
            // $( '#'+file.id ).find('.file-progress').fadeOut();
        });

        $btn.on('click', function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            uploader.upload();
        });

        // alert(1)
        $("#thelist .table").find('.file-manage').on('click','.remove-that',function () {
            // alert(111);
            // uploader.removeFile(file);
            $(this).parents(".file-item").remove();
            var img_id=$(this).parents(".file-item").attr("img_id");
            // console.log("img_id"+img_id);
            img_data.splice($.inArray(img_id,img_data),1);

            //console.log("img_data:remove");
            //console.log(img_data);
            $(".images_field").val(img_data);
        });
    }



    //获取初始化图片/视频数据
    var getPcdData = function (url,get_data) {
        var result;
        //console.log(id);
        $.ajax({
            type: 'get',
            //url: ''+url+'/?release_type='+release_type+'&id='+id,
            url: ''+url,
            dataType: 'json',
            async:false,
            data:get_data,
            success: (response) => {
                //if(Array.isArray(response)){
                // console.log("asdf");
                //}
                // console.log(response);
                // var jsonarray = eval('('+response+')');
                result = response;
            }
        });
        return result;


    };

    //显示图片还是视频标签选中
    var showImgOrVideo=function(image_type){
        $(".box_fxn_img").find(".click_image").each(function () {
            // console.log(1);
            var id = $(this).attr("image_val");
            // console.log(id);
            if(id==image_type){
                $(this).attr("checked","checked");
            }else{
                $(this).attr("removeAttr");
            }
        });
    };

    //step06-a 在插件里定义方法
    var showLink = function (obj,options) {
        // console.log("obj_fff");
        img_data=[];
        var url=options.url;
        var imgurl=options.imgurl;
        var product_id=options.product_id;
        var release_type=options.release_type;
        var user_id=options.user_id;
        var extensions=options.extensions;
        // var image_type=options.image_type;
        // var images=options.images;


        if(product_id>0){
            //var remote_img_data=getPcdData("/api/v1/ms/getProImgsByID",product_id);
            //var remote_img_data=getPcdData(imgurl,product_id,release_type);
            var remote_img_data=getPcdData(imgurl,{id:product_id,release_type:release_type});
            // console.log(remote_img_data);return false;
            var image_type=remote_img_data.image_type;
            var images=remote_img_data.images;
            init_img_data=images;
            init_img_type=image_type;
            //console.log(jQuery.isEmptyObject(images));
            //console.log(images=='null');
            if(images!='null' ){
                // alert("asdf");
                //console.log(images,image_type);
                list_append(images,image_type);
            }
        }else{

            // console.log(remote_img_data);return false;
            var image_type=0;
            var images='null';
            init_img_type=image_type;
            //console.log(jQuery.isEmptyObject(images));
            // console.log(images=='null');
            if(images!='null' ){
                // alert("asdf");
                //console.log(images,image_type);
                list_append(images,image_type);
            }
        }

        if(image_type==1){
            // alert(image_type);
            showImgOrVideo(image_type);
        }

        uploader_demo1(image_type,release_type,user_id,1,url,extensions);
        $(".click_image").on('click', function () {
            uploader.destroy();//容器对象销毁
            $('#thelist .table').find(".file-item").remove();//容易dom清空
            img_data=[];//js数组置空
            $(".images_field").val(img_data);//name数据为空
            image_type=$(this).attr("image_val");
            //console.log($(this).attr("image_val"));
            uploader_demo1(image_type,release_type,user_id,1,url,extensions);
            showImgOrVideo(image_type);
            if(image_type==init_img_type){
                // alert("回来");
                if(!isEmpty(init_img_data) ){
                    // alert("asdf");
                    //console.log(images,image_type);
                    list_append(init_img_data,image_type);
                }
            }

        });

        //图片放大展示
        $(document).on('click','.file-url .file_url_img',function () {
            // debugger
            //console.log("asdf");
            var _this = $(this);//将当前的min_img元素作为_this传入函数
            imgShow("#outerdiv", "#innerdiv", "#max_img", _this);
        });
    }

    //step02 插件的扩展方法名称
    $.fn.mediaplayerfeng = function (options) {
        // alert(options);
        // console.log("进入插件");

        //step03-b 合并用户自定义属性，默认属性
        var options = $.extend(defaults, options);
        // return showLink(this);
        //step4 支持JQuery选择器
        //step5 支持链式调用
        return this.each(function () {
            //step06-b 在插件里定义方法
            //alert("asdf");
            showLink(this,options);
        });
    };
})(jQuery);