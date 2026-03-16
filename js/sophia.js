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
$(function(){
    $(".menu").click(function(){
    	$(this).toggleClass("active");
        $(".child").slideToggle(300);
    });
});