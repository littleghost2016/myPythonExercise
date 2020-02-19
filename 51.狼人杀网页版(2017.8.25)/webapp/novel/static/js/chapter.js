/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-07-09 18:47:15
 * @version v0.1
 */

// 禁止系统右键菜单
window.oncontextmenu = function() {
    return false;
}

// 禁止复制
document.oncopy = function() {
    return false;
}

// 返回顶部
$(".return").click(function() {
    $('body,html').animate({
        scrollTop: 0
    }, 400);
});



// 目录 Toggle
$('.title-wrap h2').click(function() {
    $(this).parent(".title-wrap").find(".dir-list").toggle().prev().find("span i").toggleClass(function() {
        if( $(this).is(".icon-icon2") ) {
            $(this).removeClass("icon-icon2");
            return "icon-icon1";
        } else {
            $(this).removeClass("icon-icon1");
            return "icon-icon2";
        }
    });
});


// 关闭目录层
$('.close').click(function() {
    $('.dir-content').toggle();
    $('.dir-wrap').removeClass("on");
}); 

$('.dir-wrap').click(function() {
    $('.dir-wrap').toggleClass(function() {
        if( $(this).is('.on') ) {
            $('.dir-content').toggle();
            return "on";
        } else {
            $('.dir-content').toggle();
            return "on";
        }
    });
    // $('.dir-wrap').removeClass("on");
});


// 目录层自适应
$('.title-list').css( 'max-height', $(window).height()-250);
$(window).resize(function() {
    var $this = $(this);
    $('.title-list').css('max-height', $this.height()-250 );
})


var plugin = { 
    readNav: function () {

        var win = $(window),
            doc = $(document);

        // 左导航定参
        var leftBar = $('#lan-Top'),
            nowLeftTop = leftBarTop = 121;


        var goTop = $('.return');

        win.on('scroll', function () {

            //获取滚动条距顶部的位置 
            winScrollTop = win.scrollTop();
            //获取页面高度、屏幕高度
            pageHeight = doc.height();

            //当滚动条位置大于leftBar距顶部的位置时,并且 nowLeftTop != 0 
            if (winScrollTop >= leftBarTop && nowLeftTop != 0) {
                nowLeftTop = 0;
                leftBar.css('top', nowLeftTop);
            } else if (winScrollTop < leftBarTop) {
                nowLeftTop = leftBarTop - winScrollTop;
                leftBar.css('top', nowLeftTop);
            }


            //回到顶部按钮是否出现
            if (winScrollTop > 0) {
                goTop.show();
            } else {
                goTop.hide();
            }

        }).trigger('scroll');
    }

}

plugin.readNav();