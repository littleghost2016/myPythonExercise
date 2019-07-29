/**
 * @fileOverview
 * @author  yangye & liuwentao
 * Created: 2016-9-19
 */
LBF.define('qd/js/read.qidian.com/common.0.45.js', function (require, exports, module) {
    var
        Node = require('ui.Nodes.Node'),
        ajaxSetting = require('qd/js/component/ajaxSetting.0.14.js'),
        report = require('qd/js/component/report.0.26.js'),
        Cookie = require('util.Cookie'),
        Login = require('qd/js/component/login.0.12.js'),
        Panel = require('ui.widget.Panel.Panel'),
        Addbook = require('qd/js/free/addBook.0.38.js'),
        LightTip = require('ui.widget.LightTip.LightTip'),
        Url = require('qd/js/component/url.0.9.js'),
        ejsChinese = require('qd/js/read.qidian.com/ejsChinese.0.4.js');

    exports = module.exports = Node.inherit({
        /**
         * Default UI proxy Element
         * @protected
         */
        el: 'body',
        /**
         * Default UI events
         * @property events
         * @type Object
         * @protected
         */
        events: {
            //打开指南
            'click #j_guideBtn': 'openGuide',
            //最近阅读ajax
            'mouseenter #j_nearRead': 'nearReadAjax',
            //加载左侧导航目录弹窗
            'mouseenter #j_navCatalogBtn': 'loadCatalog',
            //加载左侧导航目录弹窗
            'click #j_navCatalogBtn': 'navCatalog',
            //目录、书签tab
            'click #j_catalogTab span': 'catalogSwitchTab',
            //点击加载书签list
            'click #j_markerBtn': 'addMarker',
            //目录卷节显示收起
            'click #j_catalogListWrap h3': 'extendCatalogList',
            //删除书签
            'click #j_bookMarkList .delete': 'removeBookMark',
            //加载左侧导航设置弹窗
            'click #j_navSettingBtn': 'navSetting',
            //阅读主题选择、正文字体切换
            'click #j_themeList span, #j_fontFamily span, #j_readMode span': 'switchStyle',
            //阅读字体设置
            'click #j_fontSize span': 'fontSizeSet',
            //阅读正文宽度设置
            'click #j_pageWidth span': 'widthSet',
            //阅读设置保存
            'click #j_setSave': 'readSetSave',
            //阅读设置取消,不保存
            'click #j_setCancel , .setting-close': 'readSetCancel',
            //加入书架
            'click .add-book': 'addToBookShelf',
            //加载游戏弹窗
            'click #j_navGameBtn': 'navGame',
            //自动订阅开关
            'click #j_autoSwitch': 'subscribeSwitch',
            //关闭左侧面板浮层
            'click #j_leftBarList .close-panel': 'closeLeftPanel',
            //手机阅读
            'click #j_phoneRead': 'mobilePhoneRead',
            //返回顶部
            'click #j_goTop': 'goPageTop'
        },
        /**
         * Nodes default UI element，this.$element
         * @property elements
         * @type Object
         * @protected
         */
        elements: {
            //当前页面的大封面，获取bookId
            bookImg: '#bookImg'
        },

        /**
         * Render node
         * Most node needs overwritten this method for own logic
         * @method render
         * @chainable
         */
        render: function () {

            // 设置UI Node proxy对象，chainable method，勿删
            this.setElement(this.el);

            // 页面逻辑入口
            this.init();

            // 返回组件
            return this;
        },

        /**
         * 页面逻辑入口
         */
        init: function () {

            var that = this;
            //书id
            that.bookId = $(bookImg).data('bid');
            //左侧导航box
            that.leftNav = $('#j_leftBarList');
            //获取内容区域box
            that.readMainWrap = $('#j_readMainWrap');
            //游戏弹窗dom

            that.gameDom = '<div class="panel-wrap game" id="j_game"><a class="iconfont close-panel" href="javascript:">&#xe61f;</a><iframe id="j_qdGame" src="//webgame.qidian.com/Home/Ad/readPageWindow" scrolling="0" frameborder="0"></iframe></div>';
            //获取body
            that.bodyDom = $('body');
            //最近阅读是否存在标识
            that.navNearRead = false;
            //目录是否存在的标识
            that.leftNavCatalog = false;
            //书签是否存在的标识
            that.leftNavmarker = false;
            //是否已经获取订阅状态
            that.subscribeBool = false;
            //用户之前是否有订阅本书vip章节标识
            that.subscribeBookChapter = 0;
            //定义暂时存储setting参数
            that.zanshiSetting = {};
            //获取屏幕的高度
            that.winHeight = $(window).height();

            //检查是否进行过简繁体转换
            that.checkLang();

            //头部
            that.readHeader();

            //阅读设置cookie set
            that.setReadCookie();

            //阅读左右导航虚浮
            that.readNav();

            //窗口resize触发
            that.windowResize();

            //判断用户是否是第一次进入阅读页
            that.firstRead();

            //切换月票、推荐票
            that.switchTicket();

            //登录回调
            Login.setSuccess(that, function () {
                window.location.reload();
            });

            //标识目录是否已经发送ajax , 默认为false , 未发送
            that.catalogAjaxbool = false;

        },
        /**
         * 检查是否进行过简繁体转换
         * @method checkLang
         */
        checkLang: function () {
            //如果页面get不到lang或者lang是zht 繁体的话，异步请求繁体字体和转换js，把html转换成繁体
            if (Cookie.get('lang') == 'zht') {
                require.async('qd/css/tradition_font.0.68.css');
                require.async('qd/js/component/chinese.0.14.js', function (S2TChinese) {
                    $('#switchEl').html('简体版');
                    S2TChinese.trans2Tradition('html');
                    $('.lang').addClass('zht');
                });
            }
        },
        /**
         * 关闭左侧浮层面板
         * @method closeLeftPanel
         * @param e 事件对象
         */
        closeLeftPanel: function (e) {

            var target = $(e.currentTarget);
            //当前面板关闭
            $(target).parents('.panel-wrap').hide();
            //去除左侧点击后的当前样式
            $('#j_leftBarList dd').removeClass('act');

        },
        /*
         * 判断用户是否是第一次进入阅读页
         * @method firstRead
         * */
        firstRead: function () {

            if (!Cookie.get('qdgd')) {
                this.openGuide();
                //qdgd
                Cookie.set('qdgd', '1', 'qidian.com', '/', 86400000 * 365);
            }
        },
        /*
         * 阅读设置cookie set
         * @method setReadCookie
         */
        setReadCookie: function () {

            //判断qdrs是否存在,不存在种植cookie
            if (!Cookie.get('qdrs')) {

                var cookieSetData = g_data.readSetting.t + '|' + g_data.readSetting.fs + '|' + g_data.readSetting.ft + '|' + g_data.readSetting.rt + '|' + g_data.readSetting.w;
                //设置保存cookie,不包括是否订阅配置 ,时长 1年 365天
                Cookie.set('qdrs', cookieSetData, 'qidian.com', '/', 86400000 * 365);
            }


        },
        /**
         * 阅读页头部logo下拉框
         * @method readHeader
         */
        readHeader: function () {
            var readHeader = $('#readHeader');
            var PinSearch = $('#pin-search');
            var PinInput = $('#pin-input');

            readHeader.on('mouseenter', '.left-nav li, .sign-in', function () {
                readHeader.find('li').removeClass('act');
                $(this).addClass('act');
            }).on('mouseleave', 'li', function () {
                $(this).removeClass('act');
            });

            PinSearch.click(function () {
                if (PinInput.val() == '') {
                    PinInput.val(PinInput.attr('placeholder'))
                }
                //kw 埋点
                PinSearch.data('kw', PinInput.val());
                //判断域名是否是搜索页，是的话当前页面搜索，否则跳转带值跳搜索页
                if (g_data.domainSearch == location.hostname) {
                    location.href = '//' + g_data.domainSearch + '?kw=' + encodeURIComponent(PinInput.val());
                }
            });

            // 支持enter键搜索
            PinInput.on('keydown', function (evt) {
                if (evt.keyCode == 13) {
                    //判断值是否是空，是空去取placeholder值后带着值传给搜索页
                    if (PinInput.val() == '') {
                        PinInput.val(PinInput.attr('placeholder'))
                    }
                    //kw 埋点
                    $('#searchSubmit').data('kw', PinInput.val());
                    //判断域名是否是搜索页，是的话当前页面搜索，否则跳转带值跳搜索页
                    if (g_data.domainSearch == location.hostname) {
                        location.href = '//' + g_data.domainSearch + '?kw=' + encodeURIComponent(PinInput.val());
                    }
                }
            });

        },
        /*
         * 最近阅读
         * @method nearReadAjax
         * @param e 事件对象
         * */
        nearReadAjax: function (e) {

            var that = this,
                target = $(e.currentTarget);

            //获取最新阅读
            if (that.navNearRead == false) {
                $.ajax({
                    type: 'GET',
                    url: '/ajax/chapter/getReadRecord',
                    dataType: 'json',
                    success: function (response) {
                        if (response.code === 0) {
                            //异步加载目录弹窗模板
                            var nearReadPopup = ejsChinese('/ejs/qd/js/read.qidian.com/readRecord.0.1.ejs', response.data);
                            //加入弹窗中
                            target.append(nearReadPopup);
                            //改变最近阅读标识
                            that.navNearRead = true;
                        }
                    }
                });
            }
        },
        /* 
         * 阅读左右导航虚浮 
         * @method readNav 
         * */
        readNav: function () {

            var that = this,
                win = $(window),
                doc = $(document);

            // 左侧导航定参
            var leftBar = $('#j_leftBarList'),
                nowLeftTop = leftBarTop = 119;

            //右侧导航定参
            var rightBar = $('#j_rightBarList'),
                nowRightBottom = rightBarBottom = 120,
                pageHeight,
                bottomTo;

            var goTop = $('#j_goTop');

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

                //获取滚动条距底部的距离
                bottomTo = pageHeight - that.winHeight - rightBarBottom;
                //当滚动条位置大于rightBar距底部的位置时,并且 nowRightBottom != 0 
                if (winScrollTop <= bottomTo && nowRightBottom != 0) {
                    nowRightBottom = 0;
                    rightBar.css('bottom', nowRightBottom);
                } else if (winScrollTop > bottomTo) {
                    nowRightBottom = rightBarBottom - pageHeight + that.winHeight + winScrollTop;
                    rightBar.css('bottom', nowRightBottom);
                }

                //回到顶部按钮是否出现
                if (winScrollTop > 0) {
                    goTop.show();
                } else {
                    goTop.hide();
                }

            }).trigger('scroll');
        },
        /**
         * 打开指南
         * @method openGuide
         */
        openGuide: function () {

            var that = this;
            var guideBox = $('.guide-box'),
                body = $('body'),
                panelWrap = $('#j_leftBarList'),
                leftBarList = panelWrap.find('dd');
            //关闭左侧
            leftBarList.removeClass('act');
            panelWrap.find('.panel-wrap').hide();
            guideBox.fadeIn();
            //添加上层和底层遮罩
            body.append('<div class="guide-mask top"></div>');
            body.append('<div class="guide-mask bottom"></div>');

            //异步加载指南弹窗模板
            var guidePopup = new EJS({
                url: '/ejs/qd/js/component/template/guidePopup.0.1.ejs'
            }).render();

            //关闭指南弹窗
            function closeGuide() {
                panel.close();
                guideBox.fadeOut(200);
                //提升章节box的z-index
                $('#j_readMainWrap').css('z-index', '101');
                $('.guide-mask').remove();
            }

            $('.setting-close').trigger('click');

            //显示指南弹窗
            var panel = new Panel({
                drag: false,
                headerVisible: false,
                width: 520,
                footerVisible: false,
                content: guidePopup,
                events: {
                    close: function () {
                        closeGuide();
                    }
                }
            });
            //提升章节box的z-index
            $('#j_readMainWrap').css('z-index', '104');
            panel.confirm();
            that.panel = panel;

            //移除lbf原生遮罩，防止遮挡
            $('.lbf-overlay').remove();

            //关闭指南按钮绑定事件
            $('#j_closeGuide').on('click', function () {
                closeGuide();

            });

        },
        /**
         * 左侧工具栏按钮 各自执行的方法
         * @method leftBtnMethod
         * @param e 事件对象
         */
        leftBtnMethod: function (e) {

            var that = this,
                target = $(e.currentTarget),
                bool = 0;

            // 阅读设置的弹窗单独逻辑
            if($('#j_navSettingBtn').hasClass('act') &&  target.attr('id') != 'j_navSettingBtn'  ) {
                that.readSetCancel(e);
            }

            if (target.hasClass('act')) {
                target.removeClass('act').siblings().removeClass('act');
                bool = 1;
            } else {
                target.addClass('act').siblings().removeClass('act');
            }

            that.leftNav.find('.panel-wrap').hide();

            return bool;

        },
        /*
         * hover上去，提前拉取目录
         * @method   loadCatalog
         */
        loadCatalog: function (e) {

            var that = this,
                target = $(e.currentTarget);

            if (that.leftNavCatalog || target.hasClass('act')) return false;
            //页面js执行完之后拉取目录
            that.catalogAjax();
            //隐藏目录弹窗
            $('#j_catalog').hide();

        },
        /*
         * 左侧获取目录按钮
         * @method navCatalog
         *  @param e 事件对象
         * */
        navCatalog: function (e) {

            var that = this;
            //调用选中func
            if (that.leftBtnMethod(e)) return false;
            //加载目录
            that.catalogAjax();

        },
        /*
         * 发送请求拉取目录
         * @method catalogAjax
         * */
        catalogAjax: function () {

            var that = this,
                catalogPop = $('#j_catalog');
            //如果没有
            if (catalogPop.length == 0) {

                //获取用户是否登陆
                var data = {
                    loginStatus: ( Cookie.get('cmfuToken') ) ? 1 : 0
                }

                //获取目录弹窗
                catalogPop = ejsChinese('/ejs/qd/js/read.qidian.com/navCatalogBox.0.1.ejs', data);
                //把弹窗加入左侧导航中
                that.leftNav.append(catalogPop);

            } else {
                catalogPop.show();
            }

            var catalogBox = $('#j_catalogListWrap');

            //如果是第一次加载目录tab
            if (!that.leftNavCatalog) {

                //判断是否已经发送ajax请求,
                if (!that.catalogAjaxbool) {

                    //标识目录已经发送ajax
                    that.catalogAjaxbool = true;
                    $.ajax({
                        type: 'GET',
                        url: '/ajax/book/category',
                        dataType: 'json',
                        data: {
                            bookId: that.bookId
                        },
                        success: function (response) {
                            if (response.code === 0) {
                                //加入bookid 参数
                                $.extend(response.data, {
                                    bId: that.bookId,
                                    envType: g_data.envType,
                                    authorId: g_data.bookInfo.authorId
                                });
                                //异步加载目录弹窗模板
                                var guidePopup = ejsChinese('/ejs/qd/js/read.qidian.com/navCatalog.0.5.ejs', response.data);
                                //加入弹窗中
                                catalogBox.html(guidePopup);
                                //标识目录已经加载
                                that.leftNavCatalog = true;
                                //设置展开区域的最大高度
                                $('.left-bar-list .panel-list-wrap').css('max-height', (that.winHeight - 250 ) + 'px');
                                //目录定位到章节
                                showChapter();
                            } else {
                                //标识目录未完成加载
                                that.leftNavCatalog = false;
                                that.catalogAjaxbool = false;
                            }
                        }
                    });

                }

            } else {
                //目录定位到章节
                showChapter();
            }

            //目录定位到章节
            function showChapter() {
                if (g_data.lastPage) return false;
                //获取页面当前显示的章节id
                var nowChapterId = ( g_data.readSetting.rt == 0 ) ? g_data.chapter.id : that.scrollChapter(),
                    chapterDom = $('#nav-chapter-' + nowChapterId),
                    volumeList = chapterDom.parents('.volume-list');
                //移除li选中样式
                catalogBox.find('li.on').removeClass('on');
                //给新的目录章节添加选中样式
                chapterDom.addClass('on');
                //给新的选中章节做展开样式
                volumeList.prev('h3').addClass('cur').siblings('h3').removeClass('cur');
                volumeList.show().siblings('.volume-list').hide();
                //滚动到选中章节区域
                catalogBox.scrollTop(0).scrollTop(chapterDom.offset().top - catalogBox.offset().top);
            }

        },
        /**
         * 目录书签切换
         * @method catalogSwitchTab
         */
        catalogSwitchTab: function (e) {

            var catalogTab = $('#j_catalogTab span'),
                target = $(e.currentTarget),
                catalogTabWrap = $('#j_catalogTabWrap');

            target.addClass('act').siblings().removeClass('act');
            catalogTabWrap.find('.panel-list-wrap').eq(catalogTab.index(target)).show().siblings().hide();

        },
        /**
         * 展开收起目录列表
         * @method extendCatalogList
         */
        extendCatalogList: function (e) {

            //获取目标元素
            var target = $(e.currentTarget);

            //给卷标题绑定事件
            if (target.hasClass('cur')) {
                //收起
                target.removeClass('cur').next('.volume-list').hide();
            } else {
                //展开
                target.addClass('cur').next('.volume-list').show();
            }
        },
        /*
         * 左侧导航获取书签按钮
         * @method addMarker
         * */
        addMarker: function () {

            var that = this,
                markerItem = $('#j_bookMarkList');

            if (!that.leftNavmarker) {
                //标示已经发送ajax求情
                that.leftNavmarker = true;
                //获取是否订阅状态
                $.ajax({
                    type: 'GET',
                    url: '/ajax/chapter/getBookMarkList',
                    dataType: 'json',
                    data: {
                        bookId: that.bookId
                    },
                    success: function (response) {
                        if (response.code === 0) {

                            //加入bookid 参数
                            $.extend(response.data, {
                                bId: that.bookId,
                                authorId: g_data.bookInfo.authorId
                            });
                            //异步加载书签模板
                            var guidePopup = ejsChinese('/ejs/qd/js/read.qidian.com/navMarker.0.1.ejs', response.data);
                            //加入弹窗中
                            markerItem.html(guidePopup);
                        } else {
                            //标识目录未加载成功
                            that.leftNavmarker = false;
                        }
                    }
                });
            }
        },
        /**
         * 删除书签
         * @method removeBookMark
         * @param e 事件对象
         */
        removeBookMark: function (e) {
            var target = $(e.currentTarget),
                chapterId = target.data('chapid');

            //删除后下面开始发请求
            $.ajax({
                type: 'GET',
                url: '/ajax/chapter/delBookMark',
                dataType: 'json',
                data: {
                    chapterId: chapterId
                },
                success: function (response) {

                    if (response.code == 0) {
                        $(target).parent('li').remove();
                        //删除章节上书签选中样式，如果dom存在的话
                        var chapterBox = $('#chapter-' + chapterId);
                        if (chapterBox.length != 0) chapterBox.find('.book-mark').removeClass('on');
                        //判断原先书签个数，为0是，显示无书签标识
                        var navMarkList = $('#j_bookMarkList');
                        if (navMarkList.find('li').length == 0) navMarkList.find('.no-data').show();
                        //请求成功后执行提示
                        new LightTip({
                            content: '<div class="simple-tips"><span class="iconfont success">&#xe61d;</span><h3>书签删除成功</h3></div>'
                        }).success();
                        $('.lbf-light-tip-success').prev('.lbf-overlay').remove();
                    } else {
                        //请求失败后执行提示
                        new LightTip({
                            content: '<div class="simple-tips"><span class="iconfont error">&#xe61e;</span><h3>书签删除失败</h3></div>'
                        }).success();
                    }
                }
            });
        },
        /*
         * 加载setiing弹窗
         * @method navSetting
         * @param e 事件对象
         * */
        navSetting: function (e) {

            //获取配置数组
            var that = this,
                settingPop = $('#j_setting');

            //调用选中func
            if (that.leftBtnMethod(e)) {
                that.readSetCancel(e);
                return false;
            }

            //当设置弹窗不存在时,发请求加载,否则显示出来就好
            if (settingPop.length == 0) {

                //异步加载指南弹窗模板
                settingPop = ejsChinese('/ejs/qd/js/read.qidian.com/navSetting.0.1.ejs', g_data.readSetting);
                that.leftNav.append(settingPop);
                that.subscribeBool = true;

                //赋值
                $.extend(that.zanshiSetting, g_data.readSetting);

                // 判断用户是否登录
                if (Cookie.get('cmfuToken')) {
                    //获取是否订阅状态
                    $.ajax({
                        type: 'GET',
                        url: '/ajax/chapter/getSubscribeSet',
                        dataType: 'json',
                        data: {
                            bookId: that.bookId
                        },
                        success: function (response) {
                            if (response.code === 0) {
                                g_data.readSetting.autoBuy = response.data.autoBuy;
                                that.zanshiSetting.autoBuy = response.data.autoBuy;
                                //用户之前是否订阅过本书标识
                                that.subscribeBookChapter = response.data.isSubscriber;
                                if (response.data.autoBuy == 1 && that.subscribeBookChapter == 1) {
                                    $('#j_autoSwitch').trigger('click');
                                }
                            }
                        }
                    });
                }

            } else {
                settingPop.show();
            }

        },
        /**
         *  切换主题、字体、阅读方式时的高亮效果
         *  @method switchStyle
         *  @param e 事件对象
         */
        switchStyle: function (e) {

            var that = this,
                target = $(e.currentTarget),
                targetNum = parseInt(target.data('st')),
                wList = ['640', '800', '900', '1280'],
                parentId = target.parents('li').attr('id');

            target.addClass('act').siblings().removeClass('act');

            //判断父亲节点的id
            switch (parentId) {
                case 'j_themeList':
                    //修改页面整体样式
                    that.bodyDom.attr('class', 'theme-' + targetNum + ' w' + wList[that.zanshiSetting.w]);
                    that.zanshiSetting.t = parseInt(target.data('stc'));
                    break;
                case 'j_fontFamily':
                    //修改正文字体
                    that.readMainWrap.attr('class', 'read-main-wrap font-family0' + ( targetNum + 1 ));
                    that.zanshiSetting.ft = targetNum;
                    break;
                case 'j_readMode':
                    //设置阅读模式
                    that.zanshiSetting.rt = targetNum;
                    break;
            }

        },
        /*
         * 阅读字体设置
         * @method fontSizeSet
         * @param e 事件对象
         * */
        fontSizeSet: function (e) {

            var that = this,
                target = $(e.currentTarget),
                sizeBox = target.parents('#j_fontSize');
            sizeDom = target.parents('#j_fontSize').find('.lang'),
                sizeNum = parseInt(sizeDom.text());

            if (target.hasClass('prev') && sizeNum > 12) {
                sizeNum = sizeNum - 2;
            } else if (target.hasClass('next') && sizeNum < 48) {
                sizeNum = sizeNum + 2;
            } else {
                return false;
            }
            that.readMainWrap.css('font-size', sizeNum + 'px');
            sizeDom.text(sizeNum);
            that.zanshiSetting.fs = (sizeNum - 12 ) / 2;


            //数据绑定
            var fs = that.zanshiSetting.fs;
            report.send(e, {
                eid: (fs == 0 ) ? 'qd_R48' : 'qd_R' + ( 55 + fs )
            }, 'l1');
        },
        /*
         * 阅读正文宽度设置
         * @method WidthSet
         * @param e 事件对象
         * */
        widthSet: function (e) {

            var that = this,
                target = $(e.currentTarget),
                widthDom = target.parents('#j_pageWidth').find('.lang'),
                widthNum = parseInt(widthDom.text()),
                wList = ['640', '800', '900', '1280'],
                screenWidth = $(window).width(),
                numId;

            //获取宽度排序
            switch (widthNum) {
                case 640 :
                    numId = 0;
                    break;
                case 800 :
                    numId = 1;
                    break;
                case 900 :
                    numId = 2;
                    break;
                case 1280 :
                    numId = 3;
                    break;
            }

            //宽度为减小时,且w>640执行
            if (target.hasClass('prev') && numId > 0) {
                that.zanshiSetting.w = numId - 1;
                //宽度为加大,不为最大宽度限时,且判断屏幕宽度+100 大于下次需要增加到的宽度时,
            } else if (target.hasClass('next') && numId < 3 && wList[numId + 1] <= screenWidth - 180) {
                that.zanshiSetting.w = numId + 1;
            } else {
                return false;
            }
            //主题
            var themeTypeList = [0, 2, 0, 3, 5, 5, 4, 6, 1],
                themeType = themeTypeList[that.zanshiSetting.t];
            //设置宽度
            that.bodyDom.attr('class', 'theme-' + themeType + ' w' + wList[that.zanshiSetting.w]);
            widthDom.text(wList[that.zanshiSetting.w]);

            $(window).trigger('resize');

            //数据绑定
            var w = that.zanshiSetting.w;
            report.send(e, {
                eid: 'qd_R' + ( 52 + w )
            }, 'l1');

        },
        /*
         * 阅读设置保存
         * @method readSetSave
         * @param e 事件对象
         * */
        readSetSave: function (e) {
            var that = this;
            //是否自动订阅
            if ($('#j_SubscribeAuto').hasClass('off')) {
                that.zanshiSetting.autoBuy = 0;
            } else {
                that.zanshiSetting.autoBuy = 1;
            }
            //如果设置对比有修改,发送ajax请求,并显示保存设置
            if (g_data.readSetting != that.zanshiSetting) {
                var zsSet = that.zanshiSetting,
                    cookieSetData = zsSet.t + '|' + zsSet.fs + '|' + zsSet.ft + '|' + zsSet.rt + '|' + zsSet.w;
                //判断阅读模式是否变化,是否为阅读页
                var readTypeBool = 0;
                if (g_data.readSetting.rt != zsSet.rt && g_data.chapter != undefined) {
                    readTypeBool = 1;
                }

                //设置保存cookie,不包括是否订阅配置 ,时长 1年 365天
                Cookie.set('qdrs', cookieSetData, 'qidian.com', '/', 86400000 * 365);
                // 判断用户是否登录,登录,发送ajax在服务器保存用户设置,包括是否订阅
                if (Cookie.get('cmfuToken')) {
                    $.ajax({
                        type: 'POST',
                        url: '/ajax/chapter/saveUserSetting',
                        dataType: 'json',
                        data: {
                            setting: cookieSetData,
                            autoBuy: that.zanshiSetting.autoBuy,
                            bookId: that.bookId
                        },
                        success: function (response) {
                            if (response.code === 0) {
                                //服务器端保存成功
                            }
                        }
                    });
                }
                //把暂存配置存入保存设置中
                $.extend(g_data.readSetting, that.zanshiSetting);

                if (readTypeBool) {
                    if (that.readTypeCallBack) that.readTypeCallBack(zsSet.rt);
                }
            }
            that.closeLeftPanel(e);
        },
        /*
         * 阅读设置取消,不保存
         * @method readSetSave
         * */
        readSetCancel: function (e) {
            var that = this,
                setWidth = ['640', '800', '900', '1280'];
            //暂存设置重置回保存设置
            $.extend(that.zanshiSetting, g_data.readSetting);

            //主题
            var themeTypeList = [0, 2, 0, 3, 5, 5, 4, 6, 1],
                themeType = themeTypeList[that.zanshiSetting.t];
            //页面重置
            that.bodyDom.attr('class', 'theme-' + themeType + ' w' + setWidth[that.zanshiSetting.w]);
            that.readMainWrap.attr('class', 'read-main-wrap font-family0' + ( that.zanshiSetting.ft + 1 ));
            that.readMainWrap.css('font-size', ( 12 + that.zanshiSetting.fs * 2 ) + 'px');
            //设置弹窗重置回系统保存的设置配置
            $('#j_themeList span').eq(themeType).addClass('act').siblings().removeClass('act');
            $('#j_fontFamily span').eq(that.zanshiSetting.ft).addClass('act').siblings().removeClass('act');
            $('#j_fontSize .lang').text(12 + that.zanshiSetting.fs * 2);
            $('#j_pageWidth .lang').text(setWidth[that.zanshiSetting.w]);
            $('#j_readMode span').eq(that.zanshiSetting.rt).addClass('act').siblings().removeClass('act');
            //判断是否自动订阅有改变
            var nowAutoBuy = ( $('#j_SubscribeAuto').hasClass('off') ) ? 0 : 1;
            if (nowAutoBuy != that.zanshiSetting.autoBuy) {
                $('#j_autoSwitch').trigger('click');
            }
            that.closeLeftPanel(e);
        },
        /**
         * 开启关闭自动订阅
         * @method subscribeSwitch
         * @param e 事件对象
         */
        subscribeSwitch: function (e) {
            var that = this;
            // 判断用户是否登录
            if (Cookie.get('cmfuToken')) {
                //订阅过本书章节，可以操作
                if (that.subscribeBookChapter == 1) {

                    var target = $(e.currentTarget),
                        targetBox = target.parent(),
                        targetVoice = target.parents('.remind').find('.remind-voice');

                    if (targetBox.hasClass('off')) {
                        targetBox.addClass('on').removeClass('off');
                        target.css({left: "20px"});
                        if (Cookie.get('lang') == 'zht') {
                            target.text('開啟');
                            target.attr('title', '關閉自動訂閱下壹章');
                            targetVoice.text('關閉自動訂閱下壹章');
                        } else {
                            target.text('开启');
                            target.attr('title', '关闭自动订阅下一章');
                            targetVoice.text('关闭自动订阅下一章');
                        }
                        //数据绑定
                        report.send(e, {
                            eid: 'qd_R74'
                        }, 'l1');
                    } else {
                        targetBox.addClass('off').removeClass('on');
                        target.css({left: "0"});
                        if (Cookie.get('lang') == 'zht') {
                            target.text('關閉');
                            target.attr('title', '不再展示訂閱提醒,自動訂閱下壹章');
                            targetVoice.text('不再展示訂閱提醒,自動訂閱下壹章');
                        } else {
                            target.text('关闭');
                            target.attr('title', '不再展示订阅提醒,自动订阅下一章');
                            targetVoice.text('不再展示订阅提醒,自动订阅下一章');
                        }
                        //数据绑定
                        report.send(e, {
                            eid: 'qd_R75'
                        }, 'l1');
                    }
                    //您尚未订阅过本书章节，无法操作！
                } else {
                    new LightTip({
                        content: '<div class="simple-tips"><p>您尚未订阅过本书章节，无法操作</p></div>'
                    }).success();
                }
                //未登录,弹出登录弹窗
            } else {
                Login.showLoginPopup();
            }
        },
        /**
         * 加入书架
         * @method addToBookShelf
         * @param e 事件对象
         */
        addToBookShelf: function (e) {
            //引用Addbook.js中的加入书架方法
            Addbook.addToBookShelf(e, 'blue-btn', 'in-shelf');
        },
        /*
         * 游戏弹窗
         * @method navGame
         * @param e 事件对象
         * */
        navGame: function (e) {

            var that = this,
                gamePop = $('#j_game'),
                navGameBtn = $('#j_navGameBtn'),
                redPoint = navGameBtn.find('.red-point'),
                redEndTime = parseInt(redPoint.attr('data-endtime'));

            //点击后消除红点
            redPoint.remove();

            var env = g_data.envType == 'pro' ? '' : g_data.envType;
            //设置红点cookie
            Cookie.set('redPoint', 1, env + 'read.qidian.com', '', redEndTime);

            //调用选中func
            if (that.leftBtnMethod(e)) return false;

            //如果没有
            if (gamePop.length == 0) {
                //把弹窗加入左侧导航中
                that.leftNav.append(that.gameDom);
            } else {
                gamePop.show();
            }
        },
        /**
         * 返回页面顶部
         * @method goPageTop
         */
        goPageTop: function () {
            $('body,html').animate({scrollTop: 0}, 220);
        },
        /**
         * 切换月票、推荐票
         * @method switchTicket
         */
        switchTicket: function () {
            var ticketTab = $('#ticket-Tab a');
            var ticketWrap = $('#ticket-wrap');
            ticketTab.on('click', function () {
                $(this).addClass('act').siblings().removeClass('act');
                ticketWrap.find('.ticket').eq(ticketTab.index(this)).show().siblings().hide();
            });
        },
        /*
         * 判断滚动条滚到哪一章节
         * @method scrollChapter
         * @return (num) 章节id
         * */
        scrollChapter: function () {

            //获取所有章节list
            var chapterList = $('.text-wrap'),
                win = $(window),
                scHeight = win.height(),
                scrollTop = win.scrollTop() + scHeight / 2;
            //章节遍历
            var chapterIdList = chapterList.map(function () {
                var that = $(this),
                //获取当前章节距离页面顶部的距离
                    chapterItem = that.offset().top;
                //当章节scrollTop 小于 当前屏幕显示距顶部距离时,获取返回改章节id
                if (chapterItem < scrollTop) return that.data('cid');
            });
            //返回当前显示的章节id
            return chapterIdList[chapterIdList.length - 1];

        },
        /*
         * 窗体改变时,改变高度
         * @method windowResize
         * */
        windowResize: function () {

            var that = this;

            $(window).on('resize', function () {

                var screenWidth = parseInt($(this).width()),
                    ChapterWidth = parseInt($('#j_readMainWrap').width());

                if (screenWidth < ChapterWidth + 136) {
                    $('#j_floatWrap').addClass('fix-float-wrap');
                } else {
                    $('#j_floatWrap').removeClass('fix-float-wrap');
                }

                if (screenWidth < ChapterWidth + 42) {
                    $('#j_floatWrap').addClass('left-bar-guide');
                } else {
                    $('#j_floatWrap').removeClass('left-bar-guide');
                }

                //当高度改变,去重置
                if (that.winHeight != $(this).height()) {
                    //重置
                    that.winHeight = $(this).height();
                    //主动触发窗体滚动
                    $(this).trigger('scroll');
                    //设置展开区域的最大高度
                    $('.left-bar-list .panel-list-wrap').css('max-height', (that.winHeight - 250 ) + 'px');
                }

            }).trigger('resize');
        },
        /*
         * 对左侧导航增加书签操作
         * @method navMarkAddReset
         * @param  chapterId  章节id
         * @param  chapterUrl  章节url
         * @param  chapterName  章节名称
         */
        navMarkAddReset: function (chapterId, chapterUrl, chapterName) {

            var that = this;
            //判断用户是否已经拉取,没有拉取不更新数据
            if (that.leftNavmarker) {
                //获取年月日
                var d = new Date(),
                    monthNum = d.getMonth() + 1,
                    monthNum = ( monthNum > 9 ) ? monthNum : ('0' + monthNum ),
                    dayNum = d.getDate(),
                    dayNum = ( dayNum > 9 ) ? dayNum : ('0' + dayNum );
                var dateStr = d.getFullYear() + '-' + monthNum + '-' + dayNum;

                var navMarkBox = $('#j_bookMarkList'),
                    navMarkList = navMarkBox.find('ul');
                //判断原先书签个数，为0是，隐藏无书签标识
                if (navMarkList.find('li').length == 0) navMarkBox.find('.no-data').hide();
                //添加书签
                navMarkList.append('<li id="nav-mark-' + chapterId + '"><a class="iconfont delete" href="javascript:"  data-chapid="' + chapterId + '" data-cid="' + chapterUrl + '" data-bid="' + that.bookId + '" data-auid="' + g_data.bookInfo.authorId + '" data-eid="qd_R44">&#xe659;</a><div class="mark-info"><a href="' + chapterUrl + '" class="bookmark-link">' + chapterName + '<cite>' + dateStr + '</cite></a></div></li>');
            }

        },
        /*
         * 对左侧导航删除书签操作
         * @method navMarkDelReset
         * @param  chapterId  章节id
         */
        navMarkDelReset: function (chapterId) {
            var that = this;
            //判断用户是否已经拉取,没有拉取不更新数据
            if (that.leftNavmarker) {
                //删除书签
                $('#nav-mark-' + chapterId).remove();
                //获取书签列表
                var navMarkBox = $('#j_bookMarkList'),
                    navMarkList = navMarkBox.find('ul');
                //判断原先书签个数，为0是，显示无书签标识
                if (navMarkList.find('li').length == 0) navMarkBox.find('.no-data').show();
            }
        },
        /*
         * 手机阅读
         * @method mobilePhoneRead
         * @param e
         */
        mobilePhoneRead: function (e) {

            var that = this,
                phoneReadPop = $('#j_cellphone'),
                chapterId = ( g_data.lastPage ) ? 0 : ( g_data.readSetting.rt == 0) ? g_data.chapter.id : that.scrollChapter();

            //调用选中func
            if (that.leftBtnMethod(e)) return false;

            //判断弹窗是否存在
            if (phoneReadPop.length != 0) {
                //书末页
                if (g_data.lastPage) {
                    //显示弹窗
                    phoneReadPop.show();
                } else {

                    phoneReadPop.show();

                    if (that.readPhoneChapterId != chapterId) {
                        phoneReadPop.find('.j_codeImg').attr('src', '');
                        //调用2维码接口
                        that.mobilePhoneReadAjax(chapterId);
                    }
                }
                //页面中无该dom时
            } else {
                //ejs模版加载
                phoneReadPop = ejsChinese('/ejs/qd/js/read.qidian.com/navPhoneRead.0.1.ejs', null);
                that.leftNav.append(phoneReadPop);
                //调用2维码接口
                that.mobilePhoneReadAjax(chapterId);
            }

        },
        /*
         * 手机阅读接口
         * @method mobilePhoneReadAjax
         * @param chapterId 章节id
         */
        mobilePhoneReadAjax: function (chapterId) {

            var that = this;
            //获取手机阅读二维码
            $.ajax({
                type: 'GET',
                url: '/ajax/chapter/getChapterQRCode',
                dataType: 'json',
                data: {
                    bookId: that.bookId,
                    chapterId: chapterId
                },
                success: function (response) {
                    if (response.code == 0) {
                        //显示2维码
                        $('#j_cellphone .j_codeImg').attr('src', response.data.qrCode);
                        that.readPhoneChapterId = chapterId;
                    }

                }
            });
        }
    })
});


/**
 * @fileOverview
 * @author liuwentao
 * Created: 16/10/11
 */
LBF.define('qd/js/read.qidian.com/ejsChinese.0.4.js', function (require, exports, module) {

    var
        EJS = require('util.EJS');

    return (function (ejsUrl , ejsData ) {

        //异步加载指南弹窗模板
        var ejsDom = new EJS({
            url: ejsUrl
        }).render(ejsData);

        //判断简繁体
        require.async('qd/js/component/chinese.0.14.js', function (S2TChinese) {

            ejsDom = S2TChinese.s2tString(ejsDom);

        });
        
        return ejsDom ;

    });

})
LBF.define("qd/js/component/votePopup.0.35.js",function(require,exports,module){var e=require("ui.widget.Panel.Panel"),a=require("ui.Nodes.Textarea"),t=require("ui.Plugins.TextCounter"),n=require("ui.widget.LightTip.LightTip"),o=require("qd/js/component/login.0.12.js"),r=require("ui.Nodes.Node"),i=require("util.Cookie"),s=require("qd/js/book_details/payment.0.18.js"),d=require("qd/js/read.qidian.com/ejsChinese.0.4.js"),c=require("qd/js/component/loading.0.5.js");module.exports=r.inherit({el:"body",events:{"click #addMonth":"addMonthTicket","click #subMonth":"subMonthTicket","click #addRec":"addRecTicket","click #subRec":"subRecTicket","click #rewardList li":"selectReward","click #popupTab a":"popupTabSwitch","click #voteMonth":"voteMonthPost","click #voteRec":"voteRecPost","click #voteReward":"voteRewardPost","click .goReward":"goRewardTab","click #recTab":"showRecPopup","click #monthTab":"showMonthPopup","click #rewardTab":"showRewardPopup","click .j_bindphone":"showPhoneBindProcess","click .j_month_hasbind":"bindComplete","keyup #recNum":"checkRecNum"},elements:{popupTab:"#popupTab",voteWrap:"#voteWrap",rewardMsgText:"#rewardMsgText"},render:function(){return this.setElement(this.el),this.init(),this},init:function(){var e=this,a=$("#bookImg").data("bid"),t=$("#authorId").data("authorid");e.bookId=a,e.authorId=t;this.rewardPrice=500,this.loading=new c({}),this.payment=new s({})},checkRecNum:function(e){var a=this,t=parseInt($("#recSurplus").html()),n=parseInt($("#recNum").val()),o=$("#recTicket");$(".warning-tip").remove(),$("#addRec, #subRec").removeClass("disabled"),n>t?(a.voteErrorTip($("#voteWrap"),"输入错误！","当前最大只能投"+t+"张"),$("#recNum").val(t),o.find("b").remove(),o.append("<b></b><b></b><b></b><b></b><b></b>"),$("#addRec").addClass("disabled")):1==n?($("#subRec").addClass("disabled"),o.find("b").remove(),o.append("<b></b>")):2==n?(o.find("b").remove(),o.append("<b></b><b></b>")):3==n?(o.find("b").remove(),o.append("<b></b><b></b><b></b>")):4==n?(o.find("b").remove(),o.append("<b></b><b></b><b></b><b></b>")):n>=5?(o.find("b").remove(),o.append("<b></b><b></b><b></b><b></b><b></b>")):$(".warning-tip").remove()},popupTabSwitch:function(e){var a=$(e.currentTarget),t=$("#voteWrap");a.addClass("act").siblings().removeClass("act"),t.find(".popup-content").eq(a.index()).show().siblings(".popup-content").hide(),$(".warning-tip").remove()},getVoteData:function(e,a){var t=this;if(!i.get("cmfuToken"))return void(o&&o.showLoginPopup&&o.showLoginPopup());var t=this,n={},r={monthVisibility:"hidden",recVisibility:"hidden"};1===e?(t.loadVotePanel(t,n,e,r),t.getMonthData(n,e,a,t.showVote,r)):2===e?(t.loadVotePanel(t,n,e,r),t.getRecData(n,e,a,t.showVote,r)):(t.loadVotePanel(t,n,e,r),t.getRewardData(t.showVote))},loadVotePanel:function(a,t,n,o){var r=g_data.pageJson;if(0==$("#votePopup").length){$.extend(r,o);var i=d("/ejs/qd/js/component/template/votePopup.0.1.ejs",r);if($(".lbf-panel").length>0)a.panel.setContent(i),a.panel.setToCenter();else{var s=new e({drag:!1,headerVisible:!1,width:520,footerVisible:!1,content:i});a.panel=s}}1===n?($(popupTab).find("#monthTab").addClass("act"),$(voteWrap).find("#monthPopup").show()):2===n?($(popupTab).find("#recTab").addClass("act"),$(voteWrap).find("#recPopup").show()):($(popupTab).find("#rewardTab").addClass("act"),$(voteWrap).find("#rewardPopup").show()),$(".lbf-icon-close").on("click",function(){a.resetSigns()})},getMonthData:function(e,r,i,s,d){var c=this;c.hasMonthData||$.ajax({type:"GET",url:"/ajax/book/GetUserMonthTicket",data:{bookId:c.bookId,userLevel:i,authorId:c.authorId},success:function(i){0===i.code?(e.monthArr=i.data,d.monthVisibility="",s(c,e,r,d),$("#monthMsgText").length>0&&new a({selector:"#monthMsgText"}).plug(t,{counter:"#mCounter",countDirection:"up",strictMax:!0,maxCount:350}),c.hasMonthData=!0):1e3===i.code?(c.panel.close(),o&&o.showLoginPopup&&o.showLoginPopup()):(new n({content:'<div class="simple-tips"><span class="iconfont error">&#xe61e;</span><h3>网络异常，请稍后再试</h3></div>'}).error(),$(".lbf-overlay:last").hide())}})},getRecData:function(e,a,t,r,i){var s=this;s.hasRecData||$.ajax({type:"GET",url:"/ajax/book/GetUserRecomTicket",data:{bookId:s.bookId,userLevel:t},success:function(t){0===t.code?(s.recNum=t.data.enableCnt,e.recArr=t.data,i.recVisibility="",r(s,e,a,i),s.hasRecData=!0):1e3===t.code?(s.panel.close(),o&&o.showLoginPopup&&o.showLoginPopup()):(new n({content:'<div class="simple-tips"><span class="iconfont error">&#xe61e;</span><h3>网络异常，请稍后再试</h3></div>'}).error(),$(".lbf-overlay:last").hide())}})},getRewardData:function(e){var n=this;if(!n.hasRewardData){var r={};$.ajax({type:"GET",url:"/ajax/book/getDashangBalance",success:function(i){if(1e3===i.code)return n.panel.close(),void(o&&o.showLoginPopup&&o.showLoginPopup());r.balance=i.data&&i.data.balance,n.balance=i.data.balance,void 0==r.balance&&(r.balance="- -"),e(n,r,g_data.pageJson),n.hasRewardData=!0,$("#rewardMsgText").length>0&&new a({selector:"#rewardMsgText"}).plug(t,{counter:"#rCounter",countDirection:"up",strictMax:!0,maxCount:350})}})}},showRecPopup:function(){var e={},a={monthVisibility:"hidden",recVisibility:"hidden"};this.getRecData(e,2,$("#userLevel").text(),this.renderRecPopup,a),setTimeout(function(){$("#recNum").focus()},10)},showMonthPopup:function(){var e={},a={monthVisibility:"hidden",recVisibility:"hidden"};this.getMonthData(e,1,$("#userLevel").text(),this.renderMonthPopup,a)},showRewardPopup:function(){this.getRewardData(this.renderRewardPopup)},renderRecPopup:function(e,a,t){if(!e.hasRecData){var n=$("#recPopup"),o=new EJS({url:"/ejs/qd/js/component/template/recPopup.0.6.ejs"}).render(a,t);n.html(""),n.append(o)}},renderMonthPopup:function(e,a,t){if(!e.hasMonthData){var n=$("#monthPopup"),o=new EJS({url:"/ejs/qd/js/component/template/monthPopup.0.5.ejs"}).render(a,t);n.html(""),n.append(o)}},renderRewardPopup:function(e,a,t){if(!e.hasRewardData){var n=$("#rewardPopup"),o=new EJS({url:"/ejs/qd/js/component/template/rewardPopup.0.4.ejs"}).render({balance:a.balance},t);n.html(""),n.append(o)}},showVote:function(e,a){var t=g_data.pageJson;a.recArr&&e.renderRecPopup(e,a,t),a.monthArr&&e.renderMonthPopup(e,a,t),1==t.isSign&&e.renderRewardPopup(e,a,t)},resetSigns:function(){this.hasRecData=!1,this.hasMonthData=!1,this.hasRewardData=!1},addMonthTicket:function(){var e=$("#monthSurplus").html(),a=parseInt($(monthNum).html());if($("#subMonth").removeClass("disabled"),a<=e&&(a+=1,$(monthNum).text(a),$(mTicket).find("b").length<e&&$(mTicket).append("<b></b>")),a>e)return $(monthNum).text(a-1),$("#addMonth").addClass("disabled"),!1;$(mTicket).find("b").fadeIn(200),$("#calcMonthExp").html(a)},subMonthTicket:function(){var e=parseInt($(monthNum).html());if($("#addMonth").removeClass("disabled"),e>=1&&(e-=1,$(monthNum).text(e),e<5&&$(mTicket).find("b:last").prev("b").remove()),e<1)return $(monthNum).text(e+1),$("#subMonth").addClass("disabled"),!1;$("#calcMonthExp").html(e)},addRecTicket:function(){$(".warning-tip").remove(),$(recNum).focus();var e=parseInt($("#recSurplus").html()),a=parseInt($(recNum).val());if($("#subRec").removeClass("disabled"),a<=e){a+=1,$(recNum).val(a);var t=e>5?5:e;$(recTicket).find("b").length<t&&$(recTicket).append("<b></b>")}if(a>e)return $(recNum).val(a-1),$("#addRec").addClass("disabled"),!1;$(recTicket).find("b").fadeIn(200),$("#calcRecExp").html(a)},subRecTicket:function(){$(".warning-tip").remove(),$(recNum).focus();var e=parseInt($(recNum).val());if($("#addRec").removeClass("disabled"),e>=1&&(e-=1,$(recNum).val(e),e<5&&$(recTicket).find("b:last").prev("b").remove()),e<1)return $(recNum).val(e+1),$("#subRec").addClass("disabled"),!1;$("#calcRecExp").html(e)},selectReward:function(e){var a=$(e.currentTarget);switch(a.addClass("act").siblings().removeClass("act"),this.rewardPrice=a.data("reward"),this.rewardPrice){case 100:$(".calcReward").text(100),$(rewardMsgText).val("这本书太棒了，犒劳一下，希望后续更加精彩！");break;case 500:$(".calcReward").text(500),$(rewardMsgText).val("这本书太棒了，犒劳一下，希望后续更加精彩！");break;case 1e3:$(".calcReward").text(1e3),$(rewardMsgText).val("这本书太棒了，犒劳一下，希望后续更加精彩！");break;case 2e3:$(".calcReward").text(2e3),$(rewardMsgText).val("这本书太棒了，犒劳一下，希望后续更加精彩！");break;case 1e4:$(".calcReward").text(1e4),$(rewardMsgText).val("这本书太棒了，犒劳一下，希望后续更加精彩！");break;case 5e4:$(".calcReward").text(5e4),$(rewardMsgText).val("击节赞叹，拍案而起，非此犒赏不足以表吾之意!");break;case 1e5:$(".calcReward").text(1e5),$(rewardMsgText).val("天花乱坠，感动涕零，先生之才当受此赏！");break;case 1e6:$(".calcReward").text(1e6),$(rewardMsgText).val("心潮澎湃，相见恨晚，百万虽巨，亦难表吾之喜爱！");break;case 1e7:$(".calcReward").text(1e7),$(rewardMsgText).val("荡气回肠，百感交集，千金妙笔相赠，助先生纸墨风流！");break;default:$(rewardMsgText).val("这本书太棒了，犒劳一下，希望后续更加精彩！")}},addNumAnimate:function(e,a,t){var n=e,o=parseInt($("#Lnterval").text()),r=parseInt($("#userLevel").text());if(n.hasClass("rewardNum")){var i=parseInt($(".rewardNum").text()),s=parseInt($("#todayNum").text());setTimeout(function(){$("#rewardNum").after("<span>+1</span>"),$("#rewardNum").text(i+1),$("#todayNum").text(s+1),o-a<0||t>0?$("#noLv").hasClass("hidden")?$("#Lnterval").parent().html("恭喜您已成功升级:Lv"+(r+t)):$("#levelUp").html("恭喜您已成功升级:Lv"+(r+t)):$("#Lnterval").text(o-a)},1e3)}else{var d=parseInt(n.text());setTimeout(function(){n.text(d+a),n.after("<span>+"+a+"</span>"),o-a<0||t>0?$("#noLv").hasClass("hidden")?$("#Lnterval").parent().html("恭喜您已成功升级:Lv"+(r+t)):$("#levelUp").html("恭喜您已成功升级:Lv"+(r+t)):$("#Lnterval").text(o-100*a)},1e3)}setTimeout(function(){n.next("span").fadeOut()},2e3)},voteErrorTip:function(e,a,t){$(".warning-tip").remove(),e.append('<div class="warning-tip">'+a+t+"</div>"),$(".warning-tip").animate({top:0},300)},voteMonthPost:function(e){var a,t=this,n=$(e.currentTarget),r={},i=parseInt($("#monthNum").html());t.hasMonthData=!1,n.hasClass("btn-loading")||(t.loading.startLoading(n,function(){return a},200),$(".warning-tip").length>0&&$(".warning-tip").remove(),$.ajax({type:"POST",url:"/ajax/book/VoteMonthTicket",data:{bookId:t.bookId,cnt:i,desc:$("#monthMsgText").val(),authorId:t.authorId},dataType:"json",success:function(e){if(0===e.code){a=!0,r.monthArr=e.data,t.renderMonthPopup(t,r,g_data.pageJson),t.loading.clearLoading(n);var s=e.data.status,d=$("#monthPopup .no-limit-wrap");if(d.hide(),0===s){var c={};c=e.data;var l=c.info,p=c.updLevel,u=d.siblings(".vote-complete");u.show(),u.find(".post-num").text(i),u.find(".fans-value").text(l),u.on("click",".closeBtn",function(){t.addNumAnimate($("#monthCount"),i,p)}),$("#scrollDiv ul").append('<li><em class="month"></em><a href="//me.qidian.com/Index.aspx" target="_blank" title='+userName+">"+userName+"</a><span>投了</span>"+i+"张月票</li>"),t.voteMonthCallBack&&t.voteMonthCallBack(userName,i)}}else 1e3===e.code?(t.closePanel(),o&&o.showLoginPopup&&o.showLoginPopup()):t.voteErrorTip($("#voteWrap"),"投月票失败！",e.msg)}}))},voteRecPost:function(e){var a,t=this,n=$(e.currentTarget),r={},i=parseInt($("#recSurplus").html()),s=$("#recNum").val(),d=/^[1-9]+[0-9]*]*$/;if(!n.hasClass("btn-loading"))if(""!=s&&s<=i&&1==d.test(s)){t.loading.startLoading(n,function(){return a},200);var c=parseInt($("#recNum").val());$(".warning-tip").remove(),$.ajax({type:"POST",url:"/ajax/book/VoteRecomTicket",data:{bookId:t.bookId,cnt:c,enableCnt:t.recNum},dataType:"json",success:function(e){if(0===e.code){a=!0,t.hasRecData=!1,r.recArr=e.data,t.renderRecPopup(t,r,g_data.pageJson),t.loading.clearLoading(n);var i=$("#recPopup .no-limit-wrap");i.hide();if(0===e.data.status){var s={};s=e.data;var d=s.info;i.hide();var l=i.siblings(".vote-complete");l.show(),l.find(".post-num").text(c),l.find(".fans-value").text(d),l.on("click",".closeBtn",function(){var e=$("#recCount"),a=parseInt(e.text());e.after("<span>+"+c+"</span>"),setTimeout(function(){e.text(a+c)},1e3),setTimeout(function(){e.next("span").fadeOut()},2e3)}),$("#scrollDiv ul").append('<li><em class="month"></em><a href="//me.qidian.com/Index.aspx" target="_blank" title='+userName+">"+userName+"</a><span>投了</span>"+c+"张推荐票</li>"),t.voteRecCallBack&&t.voteRecCallBack(userName,c)}}else 1e3===e.code?(t.closePanel(),o&&o.showLoginPopup&&o.showLoginPopup()):t.voteErrorTip($("#voteWrap"),"投推荐票失败！",e.msg)}})}else t.voteErrorTip($("#voteWrap"),"投推荐票失败！","请输入正确的推荐票数量"),$("#recNum").focus()},voteRewardPost:function(e){var a,t=this,n=$(e.currentTarget);n.hasClass("btn-loading")||(amount=parseInt($("#rewardList li.act").data("reward")),t.amount=amount,this.requiredData={bookId:t.bookId,amount:amount,desc:$("#rewardMsgText").val()},t.voteChapterId&&(this.requiredData.chapterId=t.voteChapterId),t.loading.startLoading(n,function(){return a},0),$(".warning-tip").length>0&&$(".warning-tip").remove(),$.ajax({type:"POST",url:"/ajax/book/RewardBook",data:this.requiredData,dataType:"json",success:function(e){if(a=!0,t.loading.clearLoading(n),0===e.code){var r={};r=e.data;var i=r.info,s=r.updLevel,d=r.monthTicketCnt;window.balance=r.balance;var c=r.status;if(1==c){var l=parseInt(t.rewardPrice)-balance;return $("#rewardPopup").find("#noMoney").show().end().find(".no-limit-wrap").hide(),$("#balance").html(balance),$("#differ").html(Math.abs(l)),!1}if(2===c)$("#rewardPopup").find("#rewardBan").show().end().find(".no-limit-wrap").hide();else{var p=$("#rewardPopup").find(".no-limit-wrap");p.hide();var u=p.siblings(".vote-complete");u.show(),u.find(".post-num").text(amount),u.find(".fans-value").text(i),d>0&&u.find(".gift").html("赠投出 "+d+" 张月票，"),u.on("click",".closeBtn",function(){t.addNumAnimate($(".rewardNum"),amount,s)});var h="";amount>=1e4&&(h="high-light"),$("#scrollDiv ul").append("<li class="+h+'><em class="money"></em><a href="//me.qidian.com/Index.aspx" target="_blank" title='+userName+">"+userName+"</a><span>打赏了</span>"+amount+"起点币</li>"),t.voteRewardCallBack&&t.voteRewardCallBack(userName,amount)}}else 1e3===e.code?(t.closePanel(),o&&o.showLoginPopup&&o.showLoginPopup()):(t.payment.getPanel(t.panel),t.payment.checkBadPaymentNoCode(e,t.requiredData,4,"打赏",function(){t.voteErrorTip($("#voteWrap"),"打赏失败！",e.msg)}))}}))},checkCode:function(e){this.payment.goCheckCode(e,this.goCheckCodeOk)},goRewardTab:function(){var e=$("#voteWrap"),a=$(".popup-tab a");this.hasRewardData?(a.eq(2).addClass("act").siblings().removeClass("act"),e.find(".popup-content").eq(2).show().siblings(".popup-content").hide()):this.getRewardData(function(t,n,o){t.renderRewardPopup(t,n,o),a.eq(2).addClass("act").siblings().removeClass("act"),e.find(".popup-content").eq(2).show().siblings(".popup-content").hide()})},showPhoneBindProcess:function(){$("#monthPopup .limit-wrap").length>0&&($("#monthPopup .limit-wrap").hide(),$("#monthPopup #bindPhoneProcess").show())},bindComplete:function(){this.hasMonthData=!1,this.showMonthPopup()},closeCurrentPanel:function(){this.panel.close(),this.hasRecData&&(this.hasRecData=!1),this.hasMonthData&&(this.hasMonthData=!1),this.hasRewardData&&(this.hasRewardData=!1)},closePanel:function(){this.panel.close(),this.resetSigns()},continueProcess:function(){var e={},a={monthVisibility:"hidden",recVisibility:"hidden"};this.loadVotePanel(this,e,3,a),this.resetSigns(),this.getRewardData(this.showVote)},retryReward:function(){this.payment.checkBeforeQuick(amount,this.balance,"打赏",4)}})});/**
 * @fileOverview
 * @author  yangye & liuwentao
 * Created: 2016-9-19
 */
LBF.define('qd/js/read.qidian.com/discussTalk.0.10.js', function (require, exports, module) {

    var
        Node = require('ui.Nodes.Node'),
        ajaxSetting = require('qd/js/component/ajaxSetting.0.14.js'),
        Cookie = require('util.Cookie'),
        Loading = require('qd/js/component/loading.0.5.js'),
        LightTip = require('ui.widget.LightTip.LightTip'),
        ejsChinese = require('qd/js/read.qidian.com/ejsChinese.0.4.js');

    exports = module.exports = Node.inherit({
        /**
         * Default UI proxy Element
         * @protected
         */
        el: 'body',
        /**
         * Default UI events
         * @property events
         * @type Object
         * @protected
         */
        events: {
            //打开即时讨论
            'click #j_hongbao': 'openDiscussWrap',
            //关闭即时讨论
            'click #j_discussWrap .close-panel': 'closeDiscussWrap',
            //选择红包
            'click #j_chooseRedPacketBtn' : 'chooseRedPacketPop',
            //点击去编辑发红包按钮
            'click .j_toEditredPacket':'isGetRedPacketSetting',
            //查看讨论list历史记录
            'click #j_discussHistory' : 'historyDiscuss',
            //刷新讨论list
            'click #j_discussReload' : 'reloadDiscuss',
            //关闭选择红包按钮pop
            'click .j_closeRedPop' : 'closeRedPop',
            //移除选择红包按钮pop
            'click .j_removeRedPop' : 'removeRedPop',
            //限制只能输入数字
            'keyup .j_RpNum , .j_RpPrice' : 'rpNumKeyUp',
            //红包数量判断
            'blur .j_RpNum' : 'rpNumJudge',
            //红包金额判断
            'blur .j_RpPrice' : 'rpPriceJudge',
            //红包文字
            'blur .j_RpDesc' : 'rpDescJudge',
            //发红包校验(先获取uuid , then 再提交发红包 )
            'click .j_sendRedPacketBtn' : 'getRedPacketUuid',
            //点击红包状态
            'click .j_redPacketShow' : 'redPacketStatusPop',
            //点击拆红包
            'click .j_grabRedPacket' : 'openRedPacket',
            //获取红包详情
            'click .j_rpInfoBtn' : 'getRedPacketInfo',
            //加载更多红包详情
            'click #j_rpInfoload' : 'reloadRedPacketInfo'
        },
        /**
         * Nodes default UI element，this.$element
         * @property elements
         * @type Object
         * @protected
         */
        elements: {
            //当前页面的大封面，获取bookId
            bookImg: '#bookImg'
        },

        /**
         * Render node
         * Most node needs overwritten this method for own logic
         * @method render
         * @chainable
         */
        render: function () {

            // 设置UI Node proxy对象，chainable method，勿删
            this.setElement(this.el);

            // 页面逻辑入口
            this.init();

            // 返回组件
            return this;
        },

        /**
         * 页面逻辑入口
         */
        init: function () {

            var that = this;

            //书id
            that.bookId = $(bookImg).data('bid');

            //分类id
            that.chanId = $('#j_chanId').data('chanid'); 

            //红包相关信息  红包种类 type  红包数量 num  红包总额 price 红包文案desc
            that.redPacket = {};

            that.redPageIndex = 1 ;

            //实例化loading.js
            this.loading = new Loading({});

            //判断是否已经拉取了红包配置参数
            that.redSettingBool = false ;

            //初始化红包配置
            that.redPacketSet = {
                "cntMin": {
                    com: 5,
                    monthTicket: 5,
                    recTicket : 5
                },
                cntMax: {
                    com : 300,
                    monthTicket : 100,
                    recTicket : 300
                },
                priceSingleMin : {
                    com : 10,
                    monthTicket : 500,
                    recTicket : 20
                },
                priceSingleMax : {
                    com : 20000,
                    monthTicket : 20000,
                    recTicket : 20000
                },
                poundage : {
                    com: 0 ,
                    comDesc : "活动期间免手续费",
                    monthTicket : 0,
                    monthTicketDesc : "活动期间免手续费",
                    recTicket : 0,
                    recTicketDesc : "活动期间免手续费"
                },
                desc : "有钱就是任性|请和我土豪做朋友|大小红包都是爱|子曰：有红包的书不断更|红包发的好，章节更新早|红包发的勤，追更不会停|楼下继续发红包"
            }

        },
        /**
         * 打开讨论浮层
         * @method openDiscussWrap
         */
        openDiscussWrap: function (e) {

            var that = this,
                target = $(e.currentTarget);
            //判断用户是否登录
            if ( Cookie.get('cmfuToken') ) {
                if( target.hasClass('discussShow') ){
                    that.closeDiscussWrap(e);
                    target.removeClass('discussShow');
                }else{
                    target.addClass('discussShow');
                    var discussPop = $('#j_discussWrap');
                    //如果没有加载讨论浮层,拉去ejs模版加载
                    if( discussPop.length == 0 ){
                        //异步加载书签模板
                        var discussPop = ejsChinese('/ejs/qd/js/read.qidian.com/redPacket/discussTalk.0.1.ejs' , null);
                        //加入页面中
                        $('body').append(discussPop);
                        //首次拉取数据
                        that.loadRedPacket( 0 , 0 );
                        //拉取红包配置
                        that.redpacketSet();
                    } else {
                        discussPop.fadeIn(200);
                        //更新最新数据
                        that.reloadDiscuss();
                    }
                }
            }else{
                Login.showLoginPopup() ;
            }

        },
        /**
        * 拉取红包配置
        * @method redpacketSet
        * @param callBack 回调函数
        */
        redpacketSet : function( callBack ){

            var that = this;
            
            if( that.redSettingBool ) return false;
            //拉取红包配置
            $.ajax({
                method: 'GET',
                url: '/ajax/luckyMoney/getConf',
                dataType: 'json',
                success: function (response) {
                    if( response.code == 0 ){
                        //获取系统配置，覆盖默认值
                        $.extend( that.redPacketSet , response.data );
                        that.redSettingBool = true ;
                    }
                    if( callBack ) callBack( response );
                }

            })
        },
        /**
         * 关闭讨论浮层
         * @method closeDiscussWrap
         */
        closeDiscussWrap: function () {
            $('#j_discussWrap').hide();
            $('#j_hongbao').removeClass('discussShow');
        },
        /**
        * 加载讨论红包列表信息
        * @method loadRedPacket
        * @param  redPacketTime   上次拉去数据的时间戳  第一次拉取为0
        * @param  type   第一次调用 :0  , 刷新: 1  ,  历史记录: 2
        * @param  pageIndex    当前书页index
        * @param  callBack
        * */
        loadRedPacket : function ( redPacketTime , type , pageIndex ,  callBack) {

            var that = this ;

            $.ajax({
                method: 'GET',
                url: '/ajax/luckyMoney/getLuckyMoneyList',
                dataType: 'json',
                data: {
                    bookId : that.bookId ,
                    pageSize : 50 ,
                    pageIndex : pageIndex ,
                    timeSpan : redPacketTime
                },
                success: function (response) {
                    if( response.code == 0 ){
                        var data = response.data;
                        //当首次加载 或者 获取有新的信息,渲染ejs
                        var chartLen = data.chartList.length ;
                        var discussTalkList = '';
                        if( type == 0 || type == 1 || chartLen != 0 ){
                            //获取ejs所需要的参数
                            data.mePreFix = g_data.pageJson.mePreFix;
                            //异步加载讨论区list模板
                            discussTalkList = ejsChinese('/ejs/qd/js/read.qidian.com/redPacket/discussTalkList.0.3.ejs' , data );
                        }

                        switch(type){
                            //第一次拉取数据
                            case 0 :
                                $('#j_discussMesBox').show();
                                $('#j_discussWrap').find('.loading').hide();
                            //刷新
                            case 1:
                                //加入讨论列表中
                                $('#j_discussMesList').html(discussTalkList);
                                $('.j_discussReloading').hide();
                                if( chartLen < 50 ) $('#j_discussHistory').hide();
                                that.redPageIndex = 1;
                                $('.discuss-list-wrap').scrollTop($('#j_discussMesBox').outerHeight(true) );
                                break;
                            //查看历史调用
                            case 2:
                                var oldHeight = $('#j_discussMesBox').outerHeight(true) ;
                                //加入讨论列表中
                                $('#j_discussMesList').prepend(discussTalkList);
                                //加载load隐藏
                                $('.j_discussHistoryLoad').hide();
                                //拉去数据时,判断拉去数据是否大于需要拉取的数据条数,小于查看历史不显示
                                if( chartLen < 50 ) $('#j_discussHistory').hide();
                                setTimeout(function () {
                                    $('.discuss-list-wrap').scrollTop($('#j_discussMesBox').outerHeight(true) - oldHeight );
                                }, 20);
                                break;
                        }

                    }
                    //回调函数
                    if( callBack ) callBack(response);
                }

            })
        },
        /**
        * 刷新讨论list
        * @method reloadDiscuss
        */
        reloadDiscuss : function (){
            //获取当前第一条信息的时间戳
            var that= this;
            //显示loading
            $('.j_discussReloading').show();
            //拉去讨论区数据
            that.loadRedPacket( 0 , 1 , 1 );

        },
        /**
        * 查看讨论list历史记录
        * @method historyDiscuss
        */
        historyDiscuss : function (e){
            //获取当前最后一条信息的时间戳
            var that= this,
                target = $(e.currentTarget);

            if( !target.hasClass('disabled') ){

                target.addClass('disabled');
                //加载load显示
                $('.j_discussHistoryLoad').show();
                //拉去讨论区数据
                ++that.redPageIndex ;
                that.loadRedPacket( 0 , 2 , that.redPageIndex ,function(response){
                    target.removeClass('disabled');
                });
            }   

        },
        /**
        * 选择红包
        * @method chooseRedPacketPop
        * */
        chooseRedPacketPop : function () {
            //判断用户是否登录
            if (Cookie.get('cmfuToken')) {

                //如果没有加载讨论浮层,拉去ejs模版加载
                if ($('#selectRedPacket').length == 0) {
                    //判断书籍是否为 签约 && vip书籍 ,是否可以投月票
                    var data = {
                        signAndVip :  g_data.pageJson.isVip && g_data.pageJson.isSign
                    };
                    //异步加载选择红包模板
                    var selectRedPacketPop = ejsChinese('/ejs/qd/js/read.qidian.com/redPacket/selectRedPacket.0.1.ejs', data );
                    //加入页面中
                    $('body').append(selectRedPacketPop);
                }
                //显示弹窗
                $('.red-overlay').fadeIn(200);
                $('#selectRedPacket').fadeIn(200);

            //未登录显示登录框
            } else {
                Login.showLoginPopup();
            }
        },
        /**
        * 判断是否获取了系统配置
        * @method isGetRedPacketSetting
        */
        isGetRedPacketSetting : function (e){
            
            var that = this;

            if( that.redSettingBool ){
                //执行显示就弹窗
                that.editRedPacketPop(e);
            }else{
                that.redpacketSet(function(response){
                    if(response.code == 0 ){
                        //执行显示就弹窗
                        that.editRedPacketPop(e);
                    }
                });
            }
        
        },
        /**
        * 点击去编辑发红包按钮
        * @method  editRedPacketPop
        */
        editRedPacketPop :function(e) {
            var that = this,
                target = $(e.currentTarget);
                redPacketTalkList = that.redPacketSet.desc.split('|');

            //红包种类
            that.redPacket.type = target.data('redtype');
            //随机生成红包寄语
            var num = Math.round(Math.random()*6);

            //红包数量编辑框正确与否判断
            that.rpNumBool = false ;
            //红包金额编辑框正确与否判断
            that.rpPriceBool = false ;
            //判断金额是否已经输入
            that.firstInput = false;
            //红包文案编辑框正确与否判断
            that.rpDescBool = true ;

            //传入ejs的数据
            //红包手续费提示文案
            var poundageTxt = ( that.redPacket.type == 0 ) ? that.redPacketSet.poundage.comDesc :  ( that.redPacket.type == 1 ) ? that.redPacketSet.poundage.monthTicketDesc : that.redPacketSet.poundage.recTicketDesc ;
            var data = $.extend( {} , that.redPacketSet, {
                //红包类型
                redType : that.redPacket.type ,
                desc : redPacketTalkList[num] ,
                poundageTxt : poundageTxt,
                envType: g_data.envType == 'pro' ? '': g_data.envType
            });
            //默认初始化desc
            that.redPacket.desc = redPacketTalkList[num];
            //初始化红包限制
            that.redPacketMinNum = ( that.redPacket.type == 0 ) ? that.redPacketSet.cntMin.com  : ( that.redPacket.type == 1 ) ? that.redPacketSet.cntMin.monthTicket : that.redPacketSet.cntMin.recTicket ;
            that.redPacketMaxNum = ( that.redPacket.type == 0 ) ? that.redPacketSet.cntMax.com  : ( that.redPacket.type == 1 ) ? that.redPacketSet.cntMax.monthTicket : that.redPacketSet.cntMax.recTicket ;
            that.redPacketMinPrice = ( that.redPacket.type == 0 ) ? that.redPacketSet.priceSingleMin.com :  ( that.redPacket.type == 1 ) ? that.redPacketSet.priceSingleMin.monthTicket : that.redPacketSet.priceSingleMin.recTicket ;
            that.redPacketMaxPrice = ( that.redPacket.type == 0 ) ? that.redPacketSet.priceSingleMax.com :  ( that.redPacket.type == 1 ) ? that.redPacketSet.priceSingleMax.monthTicket : that.redPacketSet.priceSingleMax.recTicket ;
            that.poundage = ( that.redPacket.type == 0 ) ? that.redPacketSet.poundage.com :  ( that.redPacket.type == 1 ) ? that.redPacketSet.poundage.monthTicket : that.redPacketSet.poundage.recTicket ;

            //渲染弹窗
            $('#j_editRedPacket').remove();
            var editRedPacketPop = ejsChinese('/ejs/qd/js/read.qidian.com/redPacket/editRedPacket.0.2.ejs' , data );
            //加入页面中
            $('body').append(editRedPacketPop);
            $('#selectRedPacket').hide();
            $('#j_editRedPacket').fadeIn(200);

            // 判断浏览器是否支持 placeholder
            if (!('placeholder' in document.createElement('input'))) {
                $('[placeholder]').focus(function () {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                        input.removeClass('placeholder');
                    }
                }).blur(function () {
                    var input = $(this);
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                        input.addClass('placeholder');
                        input.val(input.attr('placeholder'));
                    }
                }).blur();
            }

            //获取uuid,渲染弹窗
            /*that.getRedPacketUuid( function( response ){

                $('#j_editRedPacket').remove();
                var editRedPacketPop = ejsChinese('/ejs/qd/js/read.qidian.com/redPacket/editRedPacket.0.2.ejs' , data );
                //加入页面中
                $('body').append(editRedPacketPop);
                $('#selectRedPacket').hide();
                $('#j_editRedPacket').fadeIn(200);

                // 判断浏览器是否支持 placeholder
                if (!('placeholder' in document.createElement('input'))) {
                    $('[placeholder]').focus(function () {
                        var input = $(this);
                        if (input.val() == input.attr('placeholder')) {
                            input.val('');
                            input.removeClass('placeholder');
                        }
                    }).blur(function () {
                        var input = $(this);
                        if (input.val() == '' || input.val() == input.attr('placeholder')) {
                            input.addClass('placeholder');
                            input.val(input.attr('placeholder'));
                        }
                    }).blur();
                }
            
            });*/

        },
        /**
        * 获取红包uuid
        * @method getRedPacketUuid
        * @param callBack 回调函数
        */
        getRedPacketUuid : function( e ){

            var that = this;

            //初始化uuid
            that.redPacketUuid = '';

            //获取uuid
            $.ajax({
                method: 'GET',
                url: '/ajax/luckyMoney/getUUID',
                dataType: 'json',
                data: {
                    bookId : that.bookId
                },
                success: function (response) {
                    if( response.code == 0 ){
                        that.redPacketUuid = response.data.uuid ;
                        //校验完成，发红包
                        that.sendRedPacket(e);
                    }else{
                        new LightTip({
                            content: '<div class="simple-tips"><span class="iconfont error">&#xe61e;</span><h3>' + response.msg + '</h3></div>'
                        }).success();
                    }
                }

            });

        },
        /**
        * 通用关闭红包弹窗
        * @method closeRedPop
        * */
        closeRedPop:function (e) {
            var target = $(e.currentTarget);
            $('.red-overlay').fadeOut(200);
            target.parents('.red-packet-pop').fadeOut(200);
        },
        /**
        * 移除红包弹窗
        * @method j_removeRedPop
        */
        removeRedPop : function(e){
            var target = $(e.currentTarget);
            $('.red-overlay').fadeOut(200);
            target.parents('.red-packet-pop').fadeOut(200,function(){
                $(this).remove();
            });
        },
        /**
        * 红包数量判断
        * @method RpNumJudge
        *
        */
        rpNumJudge : function(e){

            var that = this,
                target = $(e.currentTarget);

            //红包数量
            that.redPacket.num = target.val();
            //当输入为空时,为0
            that.redPacket.num = ( that.redPacket.num == '' ) ? 0 : parseInt(that.redPacket.num) ;

            //设置红包最大最小值
            var minNum = that.redPacketMinNum,
                maxNum = that.redPacketMaxNum;
            //如果输入为空时,或红包数量不符合要求
            if( that.redPacket.num < minNum || that.redPacket.num > maxNum ){
                target.parents('.input-box').addClass('error').next('p').addClass('tip');
                that.rpNumBool = false ;
            }else{
                target.parents('.input-box').removeClass('error').next('p').removeClass('tip');
                that.rpNumBool = true ;
            }

            //红包金额判断
            if( that.firstInput ) $('.j_RpPrice').trigger('blur');
            //判断是否可以发红包按钮
            that.isSendRedPacket();


        },
        /**
        * 红包金额判断
        * @method rpPriceJudge
        */
        rpPriceJudge : function(e){

            var that = this,
                target = $(e.currentTarget);

            that.firstInput = true;    

            that.redPacket.price = target.val();
            //当输入为空时,为0
            that.redPacket.price = ( that.redPacket.price == '' ) ? 0 : parseInt(that.redPacket.price) ;
            //设置红包最大最小值
            var averageMinPrice = that.redPacketMinPrice;
            var averageMaxPrice = that.redPacketMaxPrice;
            //获取红包个数
            var redMinNum =  that.redPacketMinNum ;
            var redPacketNum = ( that.redPacket.num == '' || that.redPacket.num < redMinNum ) ? redMinNum : parseInt(that.redPacket.num) ;

            //如果输入为空时,或红包数量不符合要求
            if( that.redPacket.price < averageMinPrice * redPacketNum || that.redPacket.price > averageMaxPrice * redPacketNum ){
                target.parents('.input-box').addClass('error').next('p').addClass('tip');
                 that.rpPriceBool = false ;
            }else{
                target.parents('.input-box').removeClass('error').next('p').removeClass('tip');
                 that.rpPriceBool = true ;
            }

            //判断是否可以发红包按钮
            that.isSendRedPacket();

        },
        /**
        * 红包文案验证
        * @method rpDescJudge
        */
        rpDescJudge : function(e){

            var that = this,
                target = $(e.currentTarget);

            that.redPacket.desc = $.trim(target.val());

            //当文案为空或者大于25个字时，提示error
            if( that.redPacket.desc == '' || that.redPacket.desc.length > 25 ){
                target.parents('.input-box').addClass('error').next('p').show();
                that.rpDescBool = false ;
            }else{
                target.parents('.input-box').removeClass('error').next('p').hide();
                that.rpDescBool = true ;
            }
            //判断是否可以发红包按钮
            that.isSendRedPacket();
        },
        /**
        * 限制只能输入数字
        * @method rpNumKeyUp
        */
        rpNumKeyUp : function(e){

            var that = this ,
                target = $(e.currentTarget),
                targetVal = target.val();
            //判断发现输入的不为数字,立马删除
            targetVal = targetVal.replace(/\D/g, "");
            target.val(targetVal);

            if(target.hasClass('j_RpPrice')){
                var redPacketBox = target.parents('.red-packet-pop'),
                    priceTotal = (targetVal == '') ? 0 : parseInt(targetVal),
                    poundPrice = 0 ;

                if( that.poundage != 0 ){
                    poundPrice = Math.ceil( priceTotal *  that.poundage ) ;
                    priceTotal = priceTotal + poundPrice ;
                    //显示
                    var poundPriceTxt = ( poundPrice == 0 ) ? '': '(含手续费' + poundPrice + ')';
                    redPacketBox.find('.j_totalPoundage').text( poundPriceTxt );
                }
                //重置总金额
                redPacketBox.find('.j_totalCion').text( priceTotal );
            }

        },
        /**
        ＊ 触发是否可以发红包按钮
        ＊ @method isSendRedPacket
        */
        isSendRedPacket:function(){

            $('.j_goRecharge').hide().prev('p').show();
            //当输入信息全部满足要求时，发红包按钮可以触发
            if(this.rpNumBool && this.rpPriceBool && this.rpDescBool ){
                $('.j_sendRedPacketBtn').removeClass('disabled');
            }else{
                $('.j_sendRedPacketBtn').addClass('disabled');
            }
        },

        /**
        * 校验完成，发红包
        * @method  sendRedPacket
        * 
        */
        sendRedPacket : function(e){

            //当前为发红包的表示
            g_data.isScribe = 2;

            var that = this ,
                target = $(e.currentTarget);

            if(!target.hasClass('disabled')){
                var getOrderSucceed;
                //在按钮loading的时候再次点击则不执行逻辑
                if(target.hasClass('btn-loading')){
                    return;
                }
                //显示按钮loading样式
                that.loading.startLoading( target , function(){
                    return getOrderSucceed;
                },200);

                //获取当前阅读章节id
                var nowChapterId = 0 ;
                if( typeof g_data.lastPage == 'undefined' || !g_data.lastPage ){
                    nowChapterId = that.scrollChapter();
                }

                var requiredData =  {
                    //bookId
                    bookId : that.bookId ,
                    // chapterId 阅读页当前视窗内显示的章节id 书末页为 0
                    chapterId : nowChapterId ,
                    //金额类型
                    type : 1,
                    ////红包领取条件类型（0见者有份、1月票专享、2推荐票）
                    ruleType : that.redPacket.type ,
                    //红包金额
                    amount: that.redPacket.price ,
                    //红包数量个数
                    cnt: that.redPacket.num ,
                    //红包文案
                    desc: that.redPacket.desc,
                    //书名
                    bookName : g_data.bookInfo.bookName,
                    //chanId
                    chanId : that.chanId,
                    //红包规则
                    rules : that.redPacket.type ,
                    //???
                    uuid : that.redPacketUuid  ,
                    //作者id
                    authorId : g_data.bookInfo.authorId
                };

                //判断用户是否可以发红包
                $.ajax({
                    method: 'POST',
                    url: '/ajax/luckyMoney/addLuckyMoney',
                    dataType: 'json',
                    data: requiredData ,
                    success: function (response) {

                        switch(response.code){
                            //可以发红包
                            case 0:
                                //获取红包id
                                var data = {
                                        chartList : [],
                                        mePreFix : g_data.pageJson.mePreFix
                                    },
                                    chartItem = response.data;

                                chartItem.isMine = 1;
                                chartItem.isSelf = 1;
                                chartItem.type = 1;
                                chartItem.hongbaoType = that.redPacket.type ;
                                chartItem.hongbaoTitle = that.redPacket.desc;
                                //array add 
                                data.chartList.push(chartItem);
                                //异步加载讨论区list模板
                                var discussTalkList = ejsChinese('/ejs/qd/js/read.qidian.com/redPacket/discussTalkList.0.3.ejs' , data );
                                $('#j_discussMesList').append(discussTalkList);
                                $('.discuss-list-wrap').scrollTop($('#j_discussMesBox').outerHeight(true) );
                                //移除弹窗
                                that.removeRedPop(e);
                                break;
                            //余额不足
                            case 2006 :
                                $('.j_goRecharge').show().prev('p').hide();
                                break;
                            case 1070:
                            case 1074:
                            case 1076:
                                $('#j_editRedPacket').hide();
                                $('.red-overlay').hide();
                                //参数1：panel【将当前页面的全局弹窗传递到payment.js中，当前弹窗在VotePopup.js中】
                                that.payment.getPanel(that.panel);
                                //风控
                                that.payment.checkBadPayment( response , {} , 6 ,undefined ,undefined ,function(){});
                                break;
                            default:
                                //请求成功后执行提示
                                new LightTip({
                                    content: '<div class="simple-tips"><span class="iconfont error">&#xe61e;</span><h3>' + response.msg + '</h3></div>'
                                }).success();
                                break;
                        }
                        //设置loading结束标识
                        getOrderSucceed = true;
                        that.loading.clearLoading(target);

                    }

                });
            }

        },
        /**
        * 查看红包状态
        * @method  redPacketStatusPop
        *  
        */
        redPacketStatusPop : function(e){

            var that = this ,
                target = $(e.currentTarget),

                redPacketId = target.data('hbid'),
                redPacketType = target.data('hbtype');
            //获取红包文案
            var redPacketDescBox = target.find('.j_redPacketTitle'),
                redPacketDesc = (redPacketDescBox.length == 0) ? target.data('hbt') : redPacketDescBox.text() ;

            var ticketsNum = 0;
            
            $.ajax({
                method: 'GET',
                url: '/ajax/luckyMoney/lookLuckyMoney',
                dataType: 'json',
                data: {
                    hongbaoId : redPacketId ,
                    bookId : that.bookId 
                },
                success: function (response) {

                    if( response.code == 0 ){

                        // 拼接ejs所需要的数据
                        var data = response.data;
                        //只有当红包还可以抢的时候才去判断推荐票，月票可用张数
                        if(data.hongbaoStatus == 2 ){
                            //判断红包类型
                            if( redPacketType == 1 ){
                               that.getMonthTicketNum(function(ticketNum){
                                    ticketsNum = ticketNum;
                                    showGetRedPacket(data);
                               });
                            //为推荐票红包
                            } else if( redPacketType == 2 ){
                                that.getRecomTicketNum(function(ticketNum){
                                    ticketsNum = ticketNum;
                                    showGetRedPacket(data);
                                });
                            //普通红包
                            }else{
                                showGetRedPacket(data);
                            }
                            
                        }else{
                            showGetRedPacket(data);
                        }
                    }else{
                        new LightTip({
                            content: '<div class="simple-tips"><span class="iconfont error">&#xe61e;</span><h3>' + response.msg + '</h3></div>'
                        }).success();
                    }
                }

            });
            //显示红包状态
            function showGetRedPacket(data){
                
                data.redPacketId = redPacketId ;
                data.redPacketDesc = redPacketDesc ;
                data.redPacketType = redPacketType ;
                data.ticketsNum = ticketsNum ;
                data.bookName = g_data.bookInfo.bookName;
                data.showTxt = ( data.hongbaoStatus == 2 ) ? redPacketDesc : ( data.hongbaoStatus == 3 ) ? '手慢了，红包抢完了' : '红包已过期';

                //ejs
                var lookRedPacketPop = ejsChinese('/ejs/qd/js/read.qidian.com/redPacket/getRedPacket.0.1.ejs' , data );
                $('body').append(lookRedPacketPop); 
                $('.red-overlay').fadeIn(200); 
                $('#j_openRedPacket').fadeIn(200);
            }

        },

        /**
        * 获取可用月票张数
        * @method getMonthTicketNum
        * @param callBack 回调方法
        */
        getMonthTicketNum : function( callBack ){

            var that = this ;
            //拉取月票张数信息
             $.ajax({
                method: 'GET',
                url: '/ajax/book/GetUserMonthTicket',
                dataType: 'json',
                data: {
                    //bookId
                    bookId : that.bookId ,
                    //用户等级
                    userLevel : $('#userLevel').text(),
                    //作者id
                    authorId : g_data.bookInfo.authorId
                },
                success: function (response) {

                    if( response.code == 0 ){
                        //处理是否目前还有可用的月票
                        var monthNum = 0 ;
                        if( response.data.status == 0 && response.data.enableCnt > 0){
                            monthNum = response.data.enableCnt ; 
                        }
                        if( callBack ) callBack(monthNum);
                    //获取失败
                    }else{
                        if( callBack ) callBack(0);
                    }
                   
                }
            });
        },
        /**
        * 获取可用推荐票张数
        * @method getRecomTicketNum
        * @param callBack 回调方法
        */
        getRecomTicketNum : function(callBack){

            var that = this ;
            //拉取推荐票张数信息
            $.ajax({
                method: 'GET',
                url: '/ajax/book/GetUserRecomTicket',
                dataType: 'json',
                data: {
                    //bookId
                    bookId : that.bookId ,
                    //用户等级
                    userLevel : $('#userLevel').text()
                },
                success: function (response) {
                    if( response.code == 0 ){
                        //处理是否目前还有可用的推荐票
                        var recomNum = 0 ;
                        if( response.data.status == 0 && response.data.enableCnt > 0){
                            recomNum = response.data.enableCnt ; 
                        }
                          if( callBack ) callBack(recomNum);
                    //获取失败
                    }else{
                        if( callBack ) callBack(0);
                    }
                }

            });
        },
        /**
        * 获取红包详情
        * @method getRedPacketInfo
        * @param e
        */
        getRedPacketInfo : function(e){

            //红包翻转效果
            var that = this ;
            var target = $(e.currentTarget);

            //红包翻转效果
            $('.j_redPacketSatus, .bg-wrap').hide();
            $('.j_redPacketInfo').show();
            //target.parents('.bg-wrap').addClass('filpY');
            
            if( $('.j_redPacketInfo ul li').length == 0 ){
                that.loadRedPacketAjaxInfo(0);
            }
            
        },
        /**
        * 加载红包详情
        * @method loadRedPacketInfoAjax 
        * @param  pageIndex  加载第几页
        * @param callBack  回调函数
        */
        loadRedPacketAjaxInfo : function( pageIndex , callBack ){

            var that = this,
                redPacketBox = $('#j_openRedPacket'),
                redPacketId = redPacketBox.data('hbid');

            $.ajax({
                method: 'GET',
                url: '/ajax/luckyMoney/getLuckyMoneyInfo',
                dataType: 'json',
                data: {
                    hongbaoId : redPacketId ,
                    bookId : that.bookId,
                    pageIndex : pageIndex ,
                    pageNum : 10,
                    authorId : g_data.bookInfo.authorId
                },
                success: function (response) {
                    if( response.code == 0 ){
                        //如果没有红包领取信息
                        if( response.data.hongbaoList.length == 0 ){
                            $('.j_redPacketInfo ul').append('<li class="no-data">无人领取该红包</li>');
                            //loading hide
                            $('.j_redPacketInfo .loading').hide();
                            $('.j_redPacketInfo .j_rpListLoading').hide();
                            $('#j_rpInfoload').addClass('hidden');
                            return false;
                        }
                        //加载ejs模版
                        response.data.mePreFix = g_data.pageJson.mePreFix;
                        var redPacketDetailList = ejsChinese('/ejs/qd/js/read.qidian.com/redPacket/redPacketList.0.2.ejs' , response.data );
                        $('.j_redPacketInfo ul').append(redPacketDetailList);
                        //loading hide
                        $('.j_redPacketInfo .loading').hide();
                        $('.j_redPacketInfo .j_rpListLoading').hide();
                        //加载按钮是否显示
                        if( response.data.total > 10 *( pageIndex + 1 )  ){
                            $('#j_rpInfoload').removeClass('hidden');
                        }else{
                            $('#j_rpInfoload').addClass('hidden');
                        }
                        if( callBack ) callBack();

                    }
                }
            });
        } ,
        /**
        * 加载更多红包详情
        * @method reloadRedPacketInfo    
        */
        reloadRedPacketInfo :function(e){

            var that = this,
                target = $(e.currentTarget),
                pageIndex = target.data('pi') + 1 ;

            if(!target.hasClass('disabled')) {

                target.addClass('disabled');

                $('.j_rpListLoading').show();

                that.loadRedPacketAjaxInfo( pageIndex , function(){

                    $('#j_rpInfoload').data('pi',pageIndex);

                    target.removeClass('disabled');  
                
                });
            
            }

        },
        /**
        * 返回抢红包状态
        * @method returnRedPacketStatusPop
        * */
        returnRedPacketStatusPop : function(){
            //红包翻转效果
            $('.j_redPacketSatus').show();
            $('.j_redPacketInfo').hide();
        },
        /**
        * 点击拆红包
        * @method openRedPacket 
        * @param e
        */
        openRedPacket : function(e){

            var that = this ,
                target = $(e.currentTarget),
                sign = target.data('sign'),
                btnBox = target.parents('.btn'),
                redPacketBox = $('.j_redPacketSatus'),
                redPacketId = $('#j_openRedPacket').data('hbid'),
                redPacketDesc = redPacketBox.find('h3').text();

            //当按钮无不可点击标示时，进行请求开红包
            if( !btnBox.hasClass('disabled') ){

                var getOrderSucceed;
                //在按钮loading的时候再次点击则不执行逻辑
                if(target.hasClass('btn-loading')){
                    return;
                }
                //显示按钮loading样式
                that.loading.startLoading( target , function(){
                    return getOrderSucceed;
                },200);
            
                $.ajax({
                    method: 'POST',
                    url: '/ajax/luckyMoney/openLuckyMoneyInfo',
                    dataType: 'json',
                    data: {
                        hongbaoId : redPacketId ,
                        bookId : that.bookId ,
                        chanId : that.chanId , 
                        bookName : g_data.bookInfo.bookName,
                        sign : sign ,
                        authorId : g_data.bookInfo.authorId
                    },
                    success: function (response) {

                        //设置loading结束标识
                        getOrderSucceed = true;
                        that.loading.clearLoading(target);
                        //移除当前弹窗    
                        $('#j_openRedPacket').remove();

                        //处理数据
                        var data = {
                            redPacketId : redPacketId ,
                            redPacketDesc : redPacketDesc ,
                            bookName : g_data.bookInfo.bookName,
                            avatar : redPacketBox.find('.avatar img').attr('src'),
                            userName : redPacketBox.find('.avatar h6').text(),
                            //红包已经抢完
                            hongbaoStatus : 1
                        };

                        switch(response.code){
                            case 0 : 
                                data.isGet = 1 ;
                                data.priceNum = response.data.pieceMoney ; 
                                break;
                            case 1074 :
                                //未绑定手机号,
                                data.isGet = 0 ;
                                data.showTxt = '您未绑定手机号<br><a href="//anquan.qidian.com/AccountSet/UpdateMoblie.php" target="_blank" class="mobile-bind">去安全中心绑定手机号</a>';
                                break;
                            default:
                                data.isGet = 0 ;
                                data.showTxt = response.msg;
                                break;
                        }
                        //显示用户是否抢到了红包，金额多少
                        var getRedPacketPop = ejsChinese('/ejs/qd/js/read.qidian.com/redPacket/getRedPacket.0.1.ejs' , data );
                        $('body').append(getRedPacketPop);  
                        $('#j_openRedPacket').show();

                    }

                });
            }

        }
    })
});
