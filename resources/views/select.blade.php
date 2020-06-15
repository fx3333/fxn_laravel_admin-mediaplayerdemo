<div class="{{$viewClass['form-group']}} {!! !$errors->hasAny($errorKey) ? '' : 'has-error' !!}">

    <label for="{{$id}}" class="{{$viewClass['label']}} control-label">{{$label}}</label>

    <div class="{{$viewClass['field']}} form-inline">

        @foreach($errorKey as $key => $col)
            @if($errors->has($col))
                @foreach($errors->get($col) as $message)
                    <label class="control-label" for="inputError"><i class="fa fa-times-circle-o"></i> {{$message}}</label><br/>
                @endforeach
            @endif
        @endforeach

        <div id="{{ $id }}" {!! $attributes !!}>&nbsp;
            <div id="picker" type="file">选择文件</div>
            {{--<div ><label class="click_image" image_val="1" title="视频">视频</label><lable class="exten">&nbsp;&nbsp;格式:{{ $img_ext }}</lable></div>
            <div  ><label class="click_image" image_val="0" title="图片">图片</label><lable class="exten">&nbsp;&nbsp;格式:{{ $video_ext }}</lable></div>
--}}

            <div class="box">
                <ul>
                    <li>
                        <input type="radio" name="check" id="active1" class="click_image" image_val="0" title="图片" checked><label for="active1">图片</label>
                        <div >格式:{{ $img_ext }}</div>
                    </li>
                    <li>
                        <input type="radio" name="check" id="active2" class="click_image" image_val="1" title="视频"><label for="active2">视频</label>
                        <div >格式:{{ $video_ext }}</div>
                    </li>

                </ul>
            </div>
            <!--用来存放文件信息-->
            <div id="thelist" class="uploader-list">
                <table class="table" border="1" cellpadding="0" cellspacing="0" width="100%">
                    <tr class="filelist-head">
                        <th width="5%" class="file-num">序号</th>
                        <th class="file-name">视频/图片名称</th>
                        <th class="file-size">大小</th>
                        <th width="20%" class="file-pro">进度</th>
                        <th class="file-status">状态</th>
                        <th class="file-url">展示</th>
                        <th width="20%" class="file-manage">操作</th>
                    </tr>
                </table>
                <input type="hidden" name="image_type" value="0"/>
                <input type="hidden" name="{{$name['images']}}" value=""/>
                <!--<button type="submit" name="" value="提交"/>-->
            </div>
            <!--</form>-->
            <!--div id="ctlBtn" class="btn btn-default">开始上传</div-->
            <div id="outerdiv" style="position:fixed;top:0;left:0;background:rgba(0,0,0,0.7);z-index:2;width:100%;height:100%;display:none;">
                <div id="innerdiv" style="position:absolute;">
                    <img id="max_img" style="border:5px solid #fff;" src="" />
                </div>
            </div>

        </div>
        @include('admin::form.help-block')

    </div>
</div>