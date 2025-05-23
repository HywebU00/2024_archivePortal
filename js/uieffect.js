$(function(){

  const _html = $('html');
  const _body = $('body');
  const _window = $(window);

  var ww = _window.width();
  var wwNew = ww;

  const wwSlim= 400; //更窄螢幕
  const wwMedium = 700; //此值以下是手機
  const wwNormal = 1000; //此值以上是電腦
  const wwMaximum = 1280; // 最大寬度

  const _webHeader = $('.webHeader');
  const _menu = _webHeader.find('.menu'); // 寬版主選單
  const _goTop = $('.goTop');

  // _html.removeClass('no-js');


  // 製作側欄選單遮罩
  // --------------------------------------------------------------- //
  _body.append('<div class="sidebarMask"></div>');
  const _sidebarMask = $('.sidebarMask');
  // --------------------------------------------------------------- //



  // 行動版側欄
  // --------------------------------------------------------------- //
  const _sidebar = $('.sidebar');
  const _sidebarCtrl = $('.sidebarCtrl');

  // 找出_menu中有次選單的li 
  _menu.find('li').has('ul').addClass('hasChild');
  var _hasChildA = _menu.find('.hasChild').children('a');
  _hasChildA.attr('role', 'button').attr('aria-expanded', false);
  
  // 行動版「主選單」 
  // --------------------------------------------------------------- //
  _menu.clone().prependTo(_sidebar);  // 複製「主選單」到側欄給行動版用
  $('.headNav').clone().appendTo(_sidebar);  // 複製「topLinks」到側欄給行動版用

  const _sidebarMenu = _sidebar.find('.menu');
  var _hasChildMobile = _sidebarMenu.find('.hasChild>a');

  // 行動版側欄，顯示／隱藏
  // --------------------------------------------------------------- //
  var _sidebarA = _sidebar.find('a, button');
  const _sidebarA_first = _sidebarA.eq(0);
  const _sidebarA_last = _sidebarA.eq(_sidebarA.length - 1);

  // 點擊漢堡圖示
  _sidebarCtrl.on('click' ,function(){
    if (_sidebar.is(':visible')) {
      _sidebar.removeClass('reveal');
      _sidebarCtrl.removeClass('closeIt');
      _sidebarMask.fadeOut(500, function(){
        _sidebar.removeAttr('style');
        _body.removeClass('noScroll');
      });
    } else {
      _sidebar.css('top', _webHeader.innerHeight()).show(10, 
        function(){ 
          _sidebar.addClass('reveal');
        } 
      );
      _sidebarCtrl.addClass('closeIt');
      _sidebarMask.fadeIn(500);
      _body.addClass('noScroll');
    }
  })

  // 點擊遮罩，隱藏側欄
  _sidebarMask.on( 'click', function(){
    _sidebar.removeClass('reveal');
    _sidebarCtrl.removeClass('closeIt');
    $(this).fadeOut(500, function(){
      _sidebar.hide();
      _body.removeClass('noScroll');
    });
  })

  // 鍵盤 Tab
  _sidebarCtrl.on('keydown', function(e){
    if ( e.code == 'Tab' && _sidebar.is(':visible') ) {      
      if(!e.shiftKey) {
        e.preventDefault();
        _sidebarA_first.trigger('focus');
      } else {
        e.preventDefault();
      }
    }
  })

  _sidebarA_last.on('keydown', function(e){
    if ( e.code == 'Tab' && !e.shiftKey ) {
      e.preventDefault();
      _sidebarCtrl.trigger('focus');
    }
  })

  _sidebarA_first.on('keydown', function(e){
    if ( e.code == 'Tab' && e.shiftKey ) {
      e.preventDefault();
      _sidebarCtrl.trigger('focus');
    }
  })
  // --------------------------------------------------------------- //



  // 行動版側欄「主選單」開合
  // --------------------------------------------------------------- //
  _hasChildMobile.on( 'click', function(e){
    e.preventDefault();
    
    let _this = $(this);
    let _subMenu = _this.next('ul');

    if (_subMenu.is(':hidden')) {
      _subMenu.stop(true, false).slideDown();
      _this.attr('aria-expanded', true).parent().addClass('closeIt').siblings().removeClass('closeIt').find('ul:visible').slideUp().parent().removeClass('closeIt').children('a').attr('aria-expanded', false);
    } else {
      _subMenu.stop(true, false).slideUp().find('ul:visible').slideUp();
      _subMenu.find('.closeIt').removeClass('closeIt').children('a').attr('aria-expanded', false);
      _this.attr('aria-expanded', false).parent().removeClass('closeIt');
    }
  })
  // --------------------------------------------------------------- //




  // 寬版「主選單」
  // --------------------------------------------------------------- //
  var _topItem = _menu.children('ul').children('li'); // 第一層選單項
  var _hasChild = _menu.find('.hasChild');
  var _hasChildA = _hasChild.children('a');
  var liA = _menu.find('li>a');

  _hasChildA.each( function(){
    let _this = $(this);
    let _thisParentLi = _this.parent('li');
    let _thisSubMenu = _this.next('ul');
    let _xButtonDown;
    let _xButtonUp;
    const speed = 200;

    _this.on('mouseenter focus', function(){
      let y1 = _window.height() + _window.scrollTop(); //視窗高度＋已捲動到視窗之上的文件高度
      let y2; // 將存放次選單高度 ＋ 次選單距離文件最上方的垂直距離
      let translate = ''; // 次選單需移動的垂直距離
      let dd = 0;
      let dy = 0; // 次選單超出視窗的高度
  
      _this.attr('aria-expanded', true);
      _thisParentLi.addClass('here'); // 為已展開的次選單上層li加樣式

      _thisSubMenu.stop(true, false).slideDown(speed, function(){
        y2 = _thisSubMenu.outerHeight() + _thisSubMenu.offset().top;
        const itemHeight = parseInt(_thisSubMenu.find('li:first-child').outerHeight());

        // 判斷「次選單底部」是否超過「視窗底部」
        if ( y2 > y1) {
          // 判斷「次選單高度」是否超過「視窗高度」
          if (_thisSubMenu.outerHeight() <= _window.height()){
            // 次選單高度沒有超過視窗高度，移動次選單使「次選單底部」對齊「視窗底部」
            translate = 'translateY(' + String( y1 - y2 ) + 'px)';
          } else {
            // 「次選單高度」超過「視窗高度」，移動次選單使其頂部對齊「視窗頂部」
            translate = 'translateY(' + String( _window.scrollTop() - _thisSubMenu.offset().top) + 'px)';

            // dy = 選單高度 - 視窗高度
            dy =  parseInt(_thisSubMenu.outerHeight() - _window.height());

            // 加入控制 button
            _this.append('<button class="upward" disabled type="button"></button><button class="downward" type="button"></button>');
            _xButtonDown = _this.find('button.downward');
            _xButtonUp = _this.find('button.upward');
            _xButtonDown.add(_xButtonUp).css('left', _thisSubMenu.offset().left + _thisSubMenu.outerWidth());
          }
        }
        _thisSubMenu.css('transform', translate );

        if ( typeof _xButtonDown !== 'undefined') {
          _xButtonDown.on( 'click',  function(){
            if ( dd + dy > 0) {
              dd = dd - itemHeight;
              if (dd + dy < itemHeight) {
                dd = -1*dy ;
                _xButtonDown.attr('disabled', 'disabled');
              }
              _thisSubMenu.stop(true, false).animate({'margin-top': dd}, 200);
              _xButtonUp.removeAttr('disabled');
            }
          })
        }
        if ( typeof _xButtonUp !== 'undefined') {
          _xButtonUp.on( 'click',  function(){
            if ( dd < 0 ) {
              dd = dd + itemHeight;
              if ( -1*dd < itemHeight) {
                dd = 0;
                _xButtonUp.attr('disabled', 'disabled');
              }
              _thisSubMenu.stop(true, false).animate({'margin-top': dd}, 200);
              _xButtonDown.removeAttr('disabled');
            }
          })
        }

      });
      // ----------------------------------------


      

      // 判斷展開的次選單是否超過視窗右邊界
      if ( _thisSubMenu.offset().left + _thisSubMenu.outerWidth() > _window.width()) {
        if ( _thisParentLi.is(_topItem) ) {
          _thisSubMenu.css({ right:0, left: 'auto'});
        } else {
          _thisSubMenu.css({ right: _this.outerWidth(), left: 'auto'});
          _thisParentLi.addClass('turn'); // 讓箭頭轉向
        }
      }
      // ----------------------------------------
        
    })

    _thisParentLi.on('mouseleave' , function(){
      _this.attr('aria-expanded', false).blur();
      _thisParentLi.removeClass('turn here').find('button').remove();
      _thisSubMenu.stop(true, false).slideUp(speed, function(){
        _thisSubMenu.removeAttr('style');
      })
    })

  });

  liA.on( 'focus', function(){
    $(this).parent('li').siblings().removeClass('here turn').find('ul').hide().end().filter('.hasChild').children('a').attr('aria-expanded', false);
  })



  // 離開 _menu 隱藏所有次選單
  $('*').on( 'focus', function(){
    if( $(this).parents('.menu').length == 0 ){
      _menu.find('.hasChild').removeClass('here').find('ul').removeAttr('style');
      _menu.find('.hasChild').children('a').attr('aria-expanded', false);
    }
  })




  // 固定版頭 
  // --------------------------------------------------------------- //
  var fixHeadThreshold;
  var hh = _webHeader.innerHeight();

  if ( ww >= wwNormal) {
    fixHeadThreshold = hh;
  } else {
    fixHeadThreshold = 0;
  }

  _window.scroll(function(){
    if (_window.scrollTop() > fixHeadThreshold ) {
      _webHeader.addClass('fixed');
      _body.offset({top: hh});
      $('.goCenter').trigger('blur');
    } else {
      _webHeader.removeClass('fixed');
      _body.removeAttr('style');
    }

    // goTop button 顯示、隱藏
    // ----------------------------------------------- //
    _window.scrollTop() > 200 ? _goTop.addClass('show') :  _goTop.removeClass('show');
  })
  _window.trigger('scroll');
  // --------------------------------------------------------------- //


  // 版頭查詢區開合
  // --------------------------------------------------------------- //
  const _searchCtrl = $('.searchCtrl');
  const _search = $('.search');
  const _searchLastA = _search.find('a, input, button').last();
  const srSpeed = 250;

  _searchCtrl.on( 'click', function(){
    _search.is(':hidden') ? openSearch() : closeSearch();    
  })

  _body.on('keydown', function(e){
    // 按 alt+S 鍵要開啟 search
    if( e.code == 'KeyS' && e.altKey && _search.is(':hidden') ) {
      openSearch();
    }
    // 按 esc 鍵要關閉 search
    if( e.code == 'Escape' && _search.is(':visible') ) {
      closeSearch();
    }
  })

  // 離開最後一個可聚焦元件要回到控制元件
  _searchLastA.on('keydown', function(e){
    if( e.code == 'Tab' && !e.shiftKey) {
      e.preventDefault();
      closeSearch();
    }
  })

  // 開啟 search
  function openSearch(){
    _search.slideDown(srSpeed, function(){
      _searchCtrl.addClass('closeIt').attr('aria-expanded', true);
      _search.addClass('reveal').find('input[type="text"]').trigger('focus');
    });
  }

  // 關閉 search
  function closeSearch(){
    _searchCtrl.removeClass('closeIt').attr('aria-expanded', false).trigger('focus');
    _search.slideUp(srSpeed);
  }

  // --------------------------------------------------------------- //


  // 點擊展開的功能圖示
  // --------------------------------------------------------------- //
  // 文字大小
  var _compIcon = $('.compound'); //li
  _compIcon.each(function(){
    let _this = $(this);
    let _controler = _this.children('button');
    let _optList = _this.children('ul');
    let _optItem = _optList.children('li');
    let _optButton = _optItem.children('button');
    let _optLink = _optItem.children('a');
    let count = _optItem.length;

    const speed = 300;

    // 改變 li 的 z-index 值，第一個 li 要在最上面
    for (let i = 0; i < count; i++) {
      _optItem.eq(i).css('z-index', count - i)
    }

    // 收合
    function glideUp() {
      for (let i = 0; i < count; i++) {
        _optList.stop(true, false).animate({ 'top': 0 }, speed);
        _optItem.eq(i).delay( speed * i * .4).stop(true, false).animate({ 'top': 0 }, speed, function(){
          if ( i == count-1) {_optList.height(0).hide()}
        });
      }
    }

    _controler.on( 'click', function(){
      if (_optList.is(':hidden')) {
        _optList.show();
        let height = _optItem.outerHeight(true);
        _optList.stop(true, false).animate({ 'top': height }, speed);
        for (let i = 0; i < count; i++) {
          _optItem.eq(i).delay( speed*i*.3 ).stop(true, false).animate({ 'top': height * i }, speed, function(){
            _optList.height( height * count);
          })
        }
      } else {
        glideUp();
      }
    })

    _optButton.add(_optLink).on( 'click', glideUp);
    _this.siblings().on( 'click', glideUp);
    _this.siblings().children('a, button').focus(glideUp);
    _optItem.last().children('button').on('keydown', function(e){
      if( e.which === 9 && !e.shiftKey ) {
        glideUp();
      }
    });
  })
  // 複合功能圖示 end ---------------------------------------------- //




  // font size 和 cookie 
  // --------------------------------------------------------------- //
  // font size：顯示所選項目
  var _fontSize = $('.fontSize');
  var _fontSizeBtn = _fontSize.children('button');
  var _fsOption = _fontSize.find('ul>li>button');

  _fsOption.on( 'click', function(){
    let fontClass = $(this).attr('class');
    _fontSizeBtn.removeClass().addClass(fontClass);
    _body.removeClass('largeFont mediumFont smallFont').addClass(fontClass);
    createCookie('FontSize', fontClass , 365);
  })

  function createCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      var expires = '; expires=' + date.toGMTString();
    } else {
      expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  function readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  window.onload = function () {
    var cookie = readCookie('FontSize');

    _body.removeClass('largeFont mediumFont smallFont').addClass(cookie);
    _fontSizeBtn.removeClass().addClass(cookie);
  }
  // font size 和 cookie end -------------------------------------- //



  // fatfooter 開合
  // --------------------------------------------------------------- //
  var _fatFootCtrl = $('.fatFootCtrl');
  var _footSiteTree = $('.fatFooter').find('.siteTree>ul>li>ul');
  // const text1 = _fatFootCtrl.text(); // 收合
  // const text2 = _fatFootCtrl.attr('data-altText'); // 開啟

  _fatFootCtrl.attr('aria-label', '導覽選單').removeAttr('data-alttext');

  _footSiteTree.is(':hidden') ? _fatFootCtrl.addClass('closed').attr('aria-expanded', false) :  _fatFootCtrl.removeClass('closed').attr('aria-expanded', true);

  // if ( _footSiteTree.is(':hidden') ) {
  //   _fatFootCtrl.addClass('closed').attr('aria-expanded', false);
  // } else {
  //   _fatFootCtrl.removeClass('closed').attr('aria-expanded', true);
  // }
  
  _fatFootCtrl.on( 'click', function(){
    if ( _footSiteTree.is(':visible') ) {
      _footSiteTree.slideUp(400, function(){
        _fatFootCtrl.addClass('closed').attr('aria-expanded', false);
      });
    } else {
      _footSiteTree.slideDown();
      _fatFootCtrl.removeClass('closed').attr('aria-expanded', true);
    }
  })
  // --------------------------------------------------------------- //


  // 回到頁面頂端 Go Top
  // --------------------------------------------------------------- //
  _goTop.on( 'click', function(){
    // const hrefText = window.location.href.split('#')[0];
    _html.stop(true,false).animate({scrollTop: 0}, 800, function(){
      $('.goCenter').trigger('focus');
      // history.replaceState(null, null, hrefText);
    });
  });



	// 頁籤功能 
  // --------------------------------------------------------------- //
	function tabFun() {
		var activeClass = 'active'; // 啟動的 class
		var tabSet = $('.tabSet');
    
		tabSet.each(function () {
      let _this = $(this);
			// var _tabBtnBlock = _this.find('.tabItems');
			let _tabBtn = _this.find('.tabItems').children('button');
			let _tabBtnLength = _tabBtn.length;
			let _tabContent =  _this.find('.tabContent');
      
			_tabBtn.removeClass(activeClass).eq(0).addClass(activeClass);
			_tabContent.eq(0).show();

			for (let i = 0; i < _tabBtnLength; i++) {
				(
					function (i) {
						let _this = _tabBtn.eq(i);
						let _thisContent = _tabContent.eq(i);
						let _thisPrevItem = _tabContent.eq(i - 1);
						let _itemAllA = _thisContent.find('[href], input'); //這一個頁籤內容所有a和input項目
						let _prevItemAllA = _thisPrevItem.find('[href], input'); //前一個頁籤內容所有a和input項目
						let _isFirstTab = i === 0; //如果是第一個頁籤
						let _isLastTab = i === _tabBtnLength - 1; //如果是最後一個頁籤
						let _itemFirstA = _itemAllA.eq(0); //頁籤內容第一個a或是input
						let _itemLastA = _itemAllA.eq(-1); //頁籤內容最後一個a或是input
						let _prevItemLastA = _prevItemAllA.eq(-1); //前一個頁籤的最後一個a或是input

						// _this頁籤觸發focus內容裡的第一個a
						_this.on('keydown', function (e) {
							//頁籤第幾個按鈕觸發時無
							if (e.which === 9 && !e.shiftKey) { // 按下 tab 時沒有按著 shift
								e.preventDefault();
								startTab(i); //啟動頁籤切換功能
								if (_itemAllA.length) { // 如果 _itemAllA.length 不是 0（內容有至少一個 a 或 input）
									_itemFirstA.focus(); // 內容的第一個 a 或是 input focus
								} else {
									_tabBtn.eq(i + 1).focus(); // 當內容沒有 a 或是 input 跳下一個頁籤
								}
							} else if (e.which === 9 && e.shiftKey && !_isFirstTab) { // 按下 tab 時同時按著 shift，且不是第一個頁籤
								e.preventDefault();
								startTab(i - 1); //啟動頁籤切換功能，切換到上一個頁籤

								if (_prevItemAllA.length) { // 如果前ㄧ個頁籤的內容有至少一個 a 或 input
									_prevItemLastA.focus(); // 前一個頁籤內容的最後一個a或是input focus
								} else { // 當內容沒有a或是input
									_tabBtn.eq(i - 1).focus(); // focus 上一個頁籤
								}
							}
						});

						// 當按下shift+tab且為該內容的第一個a或是input
						// 將focus目標轉回tab頁籤上，呼叫上方功能startTab(i - 1);往前一個頁籤
						_itemFirstA.on('keydown', function (e) {
							if (e.which === 9 && e.shiftKey) {
								e.preventDefault();
								_tabBtn.eq(i).focus();
							}
						});

						//當按下shift+tab且為該內容的最後一個a或是input，focus到下一個頁籤
						_itemLastA.on('keydown', function (e) {
							if (e.which === 9 && !e.shiftKey && !_isLastTab) {
								e.preventDefault();
								_tabBtn.eq(i + 1).focus();
							}
						});
					})(i);

				//滑鼠點擊事件
				_tabBtn.on('click', function (e) {
					e.preventDefault();
					startTab( $(this).index() );
				});

				//切換tab
				function startTab(_now) {
					_tabBtn.eq(_now).addClass(activeClass).siblings().removeClass(activeClass);
					_tabContent.hide().eq(_now).show();
				}
			}
		});
	}
	tabFun();
  // --------------------------------------------------------------- //



  // lp 頁上方可收合查詢區 
  // --------------------------------------------------------------- //
  var _showHideSearch = $('.searchOnLp');
  var _drawer = $('.drawer');
  _drawer.each(function () {
    let _this = $(this);
    let _handle = _this.find('button.handle');
    let _tray = _this.find('.tray');
    const speed = 500;
    const text1 = "顯示查詢條件";
    const text2 = "隱藏查詢條件";

    _handle.attr('aria-label', "查詢開關");

    if ( _tray.is(':hidden')) {
      _handle.addClass('openIt').attr('aria-expanded', false);
      if (_this.is(_showHideSearch) ) {_handle.text(text1)}
    } else {
      _handle.removeClass('openIt').attr('aria-expanded', true);
      if (_this.is(_showHideSearch) ) {_handle.text(text2)}
    }

    _handle.click(function () {
      if (_tray.is(':hidden')) {
        _tray.stop(true, false).slideDown(speed);
        _handle.removeClass('openIt').attr('aria-expanded', true);
        if (_this.is(_showHideSearch) ) {_handle.text(text2)}
      } else {
        _tray.stop(true, false).slideUp(speed, function(){
          _handle.addClass('openIt').attr('aria-expanded', false);
          if (_this.is(_showHideSearch) ) {_handle.text(text1)}
        })
      }
    })
  })

  // 查詢區表單元件根據前方 td 加 aria-label
  var _searchItem = $('.searchOnLp').find('.layout').find('td:nth-child(even)').children('input:only-child, select:only-child');
  _searchItem.each(function(){
    $(this).attr( 'aria-label' , $(this).parent('td').prev().text());
  })

  // 日期區間 duration input 加 aria-label
  $('.duration').find('input').first().attr('aria-label', '起始日期').end().last().attr('aria-label', '結束日期');
  // --------------------------------------------------------------- //

  
  // footer 的 「友善連結」「版權宣告」在行動版時開合
  // --------------------------------------------------------------- //
  var _footerLinkItem = $('.webFooter').find('.rightLinks').children('li');

  _footerLinkItem.on( 'click', function(){
    let _this = $(this);
    let _ftUl = _this.children('ul');
    if (ww < wwNormal) {
      if ( _ftUl.is(':hidden') ){
        _this.addClass('closeIt');
        _ftUl.stop().slideDown(300);
      } else {
        _this.removeClass('closeIt');
        _ftUl.stop().slideUp(300, function() {
          _ftUl.removeAttr('style');
        });
      }
    }
  })



  // 問答列表 展開／收合
  // --------------------------------------------------------------- //
  $('.qaList').each( function () {
    let _showHideItems = $(this).children('ul').children('li');
    let _ctrlBtn = _showHideItems.find('.ctrlBtn');
    let _answer = _showHideItems.find('.a');

    _ctrlBtn.click(function () {
      let _this = $(this);
      let _thisQ = _this.parent('.q');
      let _thisA = _thisQ.next();
      if ( _thisA.is(':visible')) {
        _thisA.slideUp(400);
        _this.removeClass('closeIt').attr('aria-expanded', false);
      } else {
        _ctrlBtn.removeClass('closeIt');
        _answer.not(_thisA).slideUp(400);
        _thisA.slideDown(400);
        _this.addClass('closeIt').attr('aria-expanded', true);
      }
    });
  });
  // --------------------------------------------------------------- //

  // 燈箱 
  // --------------------------------------------------------------- //
  var _lightbox = $('.lightbox');
  var _hideLightbox = _lightbox.find('.closeThis');
  const lbxSpeed = 400;

  _lightbox.before('<div class="coverAll"></div>');
  _lightbox.append('<button type="button" class="skip">焦點移到 "關閉此燈箱"</button>');
  var _cover = $('.coverAll');
  var _skipToClose = _lightbox.find('.skip');

  _skipToClose.focus( function () {
    _hideLightbox.focus();
  })

  // 關燈箱
  _hideLightbox.click(function(){
    let _targetLbx = $(this).parents('.lightbox');
    _targetLbx.stop(true, false).fadeOut(lbxSpeed,
      function(){
        _cpBigPhoto.find('.flowList').find('li').hide();
      }
    );
    _targetLbx.prev(_cover).fadeOut(lbxSpeed);
    _body.removeClass('noScroll');
  })

  _cover.click(function(){
    let _targetLbx = $(this).next('.lightbox');
    $(this).fadeOut(lbxSpeed);
    _body.removeClass('noScroll');
    _targetLbx.stop(true, false).fadeOut(lbxSpeed,
      function(){
        _cpBigPhoto.find('.flowList').find('li').hide();
      }
    );
  })

  _lightbox.on('keydown', function(e){
    if ( e.keyCode == 27) {
      _hideLightbox.trigger('click');
    }
  })


  // --------------------------------------------------------------- //


  // .photoflow：cp頁的相關圖片（Related Photos）
  // --------------------------------------------------------------- //
  // 點擊圖片要開燈箱並顯示大圖
  var _photoflow = $('.photoflow');
  var _cpBigPhoto = $('.lightbox.bigPhotos');
  var photoIndex;
  var _keptFlowItem;
  var www = _window.width();

  _photoflow.each( function(){
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    _flowList.wrap('<div class="flowShow"></div>');
    let _flowItem = _flowList.children('li');
    let slideDistance = _flowItem.first().outerWidth(true);
    let slideCount = _flowItem.length;
    let _btnRight = _this.find('.arrowBtn.next');
    let _btnLeft = _this.find('.arrowBtn.prev');
    const speed = 400;
    const actClassName = 'active';
    let i = 0;
    let j;
    let _dots = '';

    // 產生 indicator 和 自訂屬性 data-index
    _floxBox.append('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find(".flowNav>ul");
    for (let n = 1; n <= slideCount; n++) {
      _dots = _dots + '<li>'+ n +'</li>';
      _flowItem.eq(n-1).attr('data-index', n-1);
    }
    _indicator.append(_dots);

    // 複製到燈箱中 *** //
    _floxBox.clone().insertBefore(_skipToClose);

    let _indicatItem = _indicator.find('li');
    _indicatItem.eq(i).addClass(actClassName);
    _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);


    // 依據可視的 slide 項目，決定 indicator 樣式
    indicatReady();
    function indicatReady() {
      _indicatItem.removeClass(actClassName);
      _indicatItem.eq(i).addClass(actClassName);
      if (www < wwSlim) {
        if (slideCount > 1) {
          flownavShow();
        } else {
          flownavHide();
        }
      }
      
      if (www >= wwSlim) {
        if (slideCount <= 2) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
        }
      }

      if (www >= wwMedium) {
        if (slideCount <= 3) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
          _indicatItem.eq((i + 2) % slideCount).addClass(actClassName);
        }
      }

      if (www >= wwNormal) {
        if (slideCount <= 4) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
          _indicatItem.eq((i + 2) % slideCount).addClass(actClassName);
          _indicatItem.eq((i + 3) % slideCount).addClass(actClassName);
        }
      }
    }

    function flownavShow(){
      _indicator.add(_btnRight).add(_btnLeft).show();
    }

    function flownavHide(){
      _indicator.add(_btnRight).add(_btnLeft).hide();
    }

    function slideForward(){
      _flowList.stop(true, false).animate({'margin-left': -1 * slideDistance }, speed, function(){
        j = (i + 1) % slideCount;
        _flowItem.eq(i).appendTo(_flowList);
        _indicatItem.eq(i).removeClass(actClassName);
        _indicatItem.eq(j).addClass(actClassName);
        _flowList.css('margin-left', 0);
        if (ww >= wwSlim) {
          _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
        }
        if (ww >= wwMedium) {
          _indicatItem.eq((j + 2) % slideCount).addClass(actClassName);
        }
        if (ww >= wwNormal) {
          _indicatItem.eq((j + 3) % slideCount).addClass(actClassName);
        }
        i = j;
      });
    }
    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css("margin-left", -1 * slideDistance);

      _flowList.stop(true, false).animate({ "margin-left": 0 }, speed, function () {
          _indicatItem.eq(j).addClass(actClassName);
          if (ww >= wwNormal) {
            _indicatItem.eq((i + 3) % slideCount).removeClass(actClassName);
          } else if (ww >= wwMedium) {
            _indicatItem.eq((i + 2) % slideCount).removeClass(actClassName);
          } else if (ww >= wwSlim) {
            _indicatItem.eq((i + 1) % slideCount).removeClass(actClassName);
          } else {
            _indicatItem.eq(i).removeClass(actClassName);
          }
          i = j;
        });
    }

    // 點擊向右箭頭
    _btnRight.click(function () { 
      slideForward();
    });

    // 點擊向左箭頭
    _btnLeft.click(function () {
      slideBackward();
    });

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {slideBackward();},
      swipeLeft: function () {slideForward();},
      threshold: 20,
    });




    // 點擊.photoflow的圖片，開燈箱顯示大圖 ***
    _flowItem.children('a').click(function(){
      _keptFlowItem = $(this);
      photoIndex = _keptFlowItem.parent().attr('data-index');
      _cpBigPhoto.stop(true, false).fadeIn().find('.flowList').find('li').filter( function(){
        return $(this).attr('data-index') == photoIndex;
      }).show();
      _hideLightbox.focus();
      _cover.stop(true, false).fadeIn();
      _body.addClass('noScroll');
    })


    let winResizeTimer1;
    _window.resize(function () {
      clearTimeout(winResizeTimer1);
      winResizeTimer1 = setTimeout(function () {
        www = _window.width();
        slideDistance = _flowItem.first().outerWidth(true);
        indicatReady();
      }, 200);
    });

  });
  // --------------------------------------------------------------- //

  // cp 頁大圖燈箱
  // --------------------------------------------------------------- //
  _cpBigPhoto.each(function(){
    let _this = $(this);
    // let _photoBox = _this.find('.flowBox').find('.flowList');
    let _photoList = _this.find('.flowList');
    let _photoItem = _photoList.children('li');
    let photoCount = _photoItem.length;
    let _btnRight = _this.find('.arrowBtn.next');
    let _btnLeft = _this.find('.arrowBtn.prev');
    let _hideBigPhoto = _this.find('.closeThis');

    const speed = 400;
    let i, j;

    _photoItem.find('img').unwrap('a');

    // 點擊向右箭頭
    _btnRight.click(function(){
      i = Number( _photoItem.filter(':visible').attr('data-index') );
      j = (i+1) % photoCount;

      _photoItem.filter( function(){
        return $(this).attr('data-index') == i;
      }).stop(true, false).fadeOut(speed, function(){
        $(this).hide();
      });
      _photoItem.filter( function(){
        return $(this).attr('data-index') == j;
      }).stop(true, false).fadeIn(speed);
    })
    
    // 點擊向左箭頭
    _btnLeft.click(function(){
      i = Number(_photoItem.filter(':visible').attr('data-index'));
      j = (i-1+photoCount) % photoCount;

      _photoItem.filter(function(){
        return $(this).attr('data-index') == i;
      }).stop(true, false).fadeOut(speed, function(){
        $(this).hide();
      });
      _photoItem.filter( function(){
        return $(this).attr('data-index') == j;
      }).stop(true, false).fadeIn(speed);
    })

    _cpBigPhoto.on('keydown', function(e){
      if ( e.keyCode == 37) {
        _btnLeft.trigger('click');
      }
      if ( e.keyCode == 39) {
        _btnRight.trigger('click');
      }
  
    })
  

    // 關閉大圖燈箱
    _hideBigPhoto.add(_cover).click(function(){
      _photoItem.hide();
      _keptFlowItem.focus();
    })
  })
  // --------------------------------------------------------------- //



  // 內頁錨點
  // --------------------------------------------------------------- //
  var _cpAnchors = $('.cpAnchors').find('li>a');
  _cpAnchors.on('click', function(e) {
    e.preventDefault();
    var hash = this.hash;
    var scrollHeight = $(hash).offset().top;
    
    _html.animate({
      scrollTop: scrollHeight
    }, 800, function(){
      _html.animate({scrollTop: scrollHeight - _webHeader.outerHeight()}, 500);
    });

  });  
  // --------------------------------------------------------------- //


  // 改變瀏覽器寬度 window resize 
  // --------------------------------------------------------------- //
  var winResizeTimer;
  _window.resize(function () {
    clearTimeout(winResizeTimer);
    winResizeTimer = setTimeout( function () {

      wwNew = _window.width();
      
      // 由小螢幕到寬螢幕
      if( ww < wwNormal && wwNew >= wwNormal ) {
        if (_sidebar.hasClass('reveal')) {
          _sidebar.removeClass('reveal');
          _sidebarCtrl.removeClass('closeIt');
          _sidebarMask.hide();
          _body.removeClass('noScroll');
        }

        _body.removeAttr('style');
        _webHeader.removeClass('fixed');
        _search.removeClass('reveal').removeAttr('style')
        hh = _webHeader.outerHeight();
        fixHeadThreshold =  hh - _menu.innerHeight();
        _window.trigger('scroll');
      }

      // 由寬螢幕到小螢幕
      if( ww >= wwNormal && wwNew < wwNormal ){
        hh = _webHeader.outerHeight();
        fixHeadThreshold = 0;
        _body.removeAttr('style');
        if ( ! _webHeader.hasClass('mp') ) {
          _window.trigger('scroll');
        }
      }
      ww = wwNew;
    }, 200);
  });
  // window resize  end -------------------------------------------- //
  


  // --------------------------------------------------------------- //
  // ----------------- 外掛套件 slick 參數設定 --------------------- //
  // --------------------------------------------------------------- //

  // 首頁大圖輪播
  // --------------------------------------------------------------- //
  const _bbImages = $('.bigBanner').find('.bbImages');
  _bbImages.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 5000,
    speed: 1000,
    autoplay: false,
    arrows: true,
    dots: true,
    fade: true,
    infinite: true,
    zIndex:8
  });

  // --------------------------------------------------------------- //



  // 探索國家故事
  // --------------------------------------------------------------- //
  const _exploreFlow = $('.explore').find('.flow');
  _exploreFlow.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 5000,
    speed: 800,
    autoplay: false,
    arrows: true,
    dots: true,
    fade: false,
    infinite: true,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2.35
        }
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 3.5
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4.01
        }
      }
    ]
  });

  // 把向左箭頭搬移到向右箭頭之前（移到 .slick-list 之後）
  _exploreFlow.find('.slick-arrow.slick-prev').insertBefore( _exploreFlow.find('.slick-arrow.slick-next'));

  // --------------------------------------------------------------- //



  // 近期活動 EVENTS
  // --------------------------------------------------------------- //
  const _eventPoster = $('.events').find('.images');
  const _eventTitle = $('.events').find('.titles');
  
  // 海報區
  _eventPoster.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: _eventTitle,
    speed: 800,
    autoplay: false,
    arrows: false,
    dots: true,
    fade: false,
    infinite: true,
    mobileFirst: true,
    vertical: false,
    responsive: [
      {
        breakpoint: wwMedium,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: wwNormal,
        settings: {
          slidesToShow: 3,
        }
      }
    ]
  });

  // 文字區
  _eventTitle.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: _eventPoster,
    autoplay: false,
    arrows: true,
    dots: false,
    fade: true
  })

  // 把向左箭頭搬移到向右箭頭之前（移到 .slick-list 之後）
  _eventTitle.find('.slick-arrow.slick-prev').insertBefore( _eventTitle.find('.slick-arrow.slick-next'));
  // --------------------------------------------------------------- //



  // 相片內容頁
  // --------------------------------------------------------------- //
  var _photoSlide = $('.photoSlide');
  var _photoShow = _photoSlide.find('.photoShow');
  var _photoNav = _photoSlide.find('.photoNav');
  const phsLength = _photoShow.find('.flowItem').length;

  // 大圖區
  _photoShow.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: _photoNav,
    speed: 800,
    autoplay: false,
    arrows: true,
    dots: true,
    fade: true,
    infinite: true,
  })

  // 小圖區
  _photoNav.slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: _photoShow,
    speed: 800,
    autoplay: false,
    arrows: true,
    dots: false,
    fade: false,
    infinite: true,
    centerMode: true,
    focusOnSelect: true,
    variableWidth: true,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: wwMedium,
        settings: {
          slidesToShow: 5,
        }
      }
    ],
    responsive: [
      {
        breakpoint: wwNormal,
        settings: {
          slidesToShow: 7,
        }
      }
    ]

  })

  _photoShow.append('<div class="total">' + phsLength +'</div>');



  // --------------------------------------------------------------- //

  // 圖書內容頁 *** 未完 ***
  // --------------------------------------------------------------- //
  var _coverAndPages = $('.bookDetails').find('.coverAndPages');
  var _coverAndPagesLightbox = $('.lightbox.bigImages');
  _coverAndPages.clone().insertBefore(_coverAndPagesLightbox.find('.skip') );

  _coverAndPages.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay:false,
    speed: 800,
    autoplay: false,
    arrows: true,
    dots: true,
    fade:false
  })

  _coverAndPagesLightbox.find('.coverAndPages').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay:false,
    speed: 800,
    autoplay: false,
    arrows: true,
    dots: true,
    fade:true
  })

  // _coverAndPagesLightbox.show();
  // --------------------------------------------------------------- //





  
  // --------------------------------------------------------------- //
  // --------------- 外掛套件 slick 參數設定 END ------------------- //
  // --------------------------------------------------------------- //




	// rwd Table 
  // --------------------------------------------------------------- //
	// 把 th 的內容複製到對應的td的 data-th 屬性值
	var _rwdTable = $('.rwdTable');
	_rwdTable.each(function () {
		let _this = $(this);
		let _th = _this.find('thead>tr>th');
		let count = _th.length;
		let _tr = _this.find('tbody').children('tr');

		_tr.each(function () {
			let _td = $(this).children('td');
			for (let i = 0; i < count; i++) {
				_td.eq(i).attr('data-th', _th.eq(i).text());
			}
		})
	})
})