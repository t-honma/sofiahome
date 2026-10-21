// header,footer 共通化
function header(){
    $.ajax({
        url: '/header.html',
        cache: false,
        async: false,
        dataType: 'html',
        success: function(html){
            document.write(html);
        }
    });
}
function footer(){
    $.ajax({
        url: '/footer.html',
        cache: false,
        async: false,
        dataType: 'html',
        success: function(html){
            document.write(html);
        }
    });
}
function facilities_share(){
    $.ajax({
        url: '/facilities_share.html',
        cache: false,
        async: false,
        dataType: 'html',
        success: function(html){
            document.write(html);
        }
    });
}

/* SPグローバルメニューの開閉 ---------------------------------*/
// ※ opossumフォーム(call.js)が $.noConflict(true) でグローバルの $ を消すことがあるため、
//    読み込み時点の jQuery を引数で保持して使う
(function($){
    $(function(){
        $(".menu").click(function(){
            $(this).toggleClass("active");
            $(".child").slideToggle(300);
        });
    });
})(window.jQuery);