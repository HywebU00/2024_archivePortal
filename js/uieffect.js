$(function(){

  var _html = $('html');
  var _body = $('body');
  var _window = $(window);

  var ww = _window.width();
  var wwNew = ww;

  const wwMedium = 700; //此值以下是手機
  const wwNormal = 1000; //此值以上是電腦
  const wwMaximum = 1440; // 最大寬度

  var _webHeader = $('.webHeader');
  var _menu = _webHeader.find('.menu'); // 寬版主選單
  var _goTop = $('.goTop');

  // _html.removeClass('no-js');


  // 製作側欄選單遮罩
  // --------------------------------------------------------------- //
  _body.append('<div class="sidebarMask"></div>');
  var _sidebarMask = $('.sidebarMask');
  // --------------------------------------------------------------- //



  // 行動版側欄
  // --------------------------------------------------------------- //
  var _sidebar = $('.sidebar');
  var _sidebarCtrl = $('.sidebarCtrl');

  // 找出_menu中有次選單的li 
  _menu.find('li').has('ul').addClass('hasChild');
  
  // 行動版「主選單」 
  _menu.clone().prependTo(_sidebar);  // 複製「主選單」到側欄給行動版用
  $('.headNav').clone().appendTo(_sidebar);  // 複製「topLinks」到側欄給行動版用

  var _sidebarMenu = _sidebar.find('.menu');
  var _hasChildMobile = _sidebarMenu.find('.hasChild>a');


  // 行動版側欄，顯示／隱藏
  // --------------------------------------------------------------- //
  var _sidebarA = _sidebar.find('a, button');
  const sbA_lastIndex = _sidebarA.length - 1;
  var _sidebarA_first = _sidebarA.eq(0);
  var _sidebarA_last = _sidebarA.eq(sbA_lastIndex);

  // 點擊漢堡圖示
  _sidebarCtrl.on('click' ,function(){
    if (_sidebar.hasClass('reveal')) {
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
          // _sidebarA_first.trigger('focus');
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

  _sidebarA_last.on('keydown', function(e){
    if ( e.which === 9 && !e.shiftKey ) {
      e.preventDefault();
      _sidebarCtrl.trigger('focus');
    }
  })


  // --------------------------------------------------------------- //



  // 窄版側欄「主選單」開合
  // --------------------------------------------------------------- //
  _hasChildMobile.on( 'click', 
    function(e){
      e.preventDefault();

      let _this = $(this);
      let _subMenu = _this.next('ul');

      if (_subMenu.is(':hidden')) {
        _subMenu.stop(true, false).slideDown();
        _this.parent().addClass('closeIt').siblings().removeClass('closeIt').find('ul:visible').slideUp().parent().removeClass('closeIt');
      } else {
        _subMenu.stop(true, false).slideUp().find('ul:visible').slideUp();
        _subMenu.find('.closeIt').removeClass('closeIt');
        _this.parent().removeClass('closeIt');
      }
    }
  )
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
      _this.blur();
      _thisParentLi.removeClass('turn here').find('button').remove();
      _thisSubMenu.stop(true, false).slideUp(speed, function(){
        _thisSubMenu.removeAttr('style');
      })
    })

  });

  liA.on( 'focus', function(){
    $(this).parent('li').siblings().removeClass('here turn').find('ul').hide();
  })



  // 離開 _menu 隱藏所有次選單
  $('*').on( 'focus', function(){
    if( $(this).parents('.menu').length == 0 ){
      _menu.find('.hasChild').removeClass('here').find('ul').removeAttr('style');
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
    } else {
      _webHeader.removeClass('fixed');
      _body.removeAttr('style');
    }

    // goTop button 顯示、隱藏
    // ----------------------------------------------- //
    if (_window.scrollTop() > 200) {
      _goTop.addClass('show');
    } else {
      _goTop.removeClass('show');
    }
  })
  _window.trigger('scroll');
  // --------------------------------------------------------------- //




  // 版頭查詢區開合（手機版）
  // --------------------------------------------------------------- //
  var _searchCtrl = $('.searchCtrl');
  var _search = $('.search');
  _search.append('<button class="skip" type="button">回到控制開關</button>');
  var _skipSearch = _search.find('.skip');
  const srSpeed = 320;

  _searchCtrl.on( 'click', function(){
    if( _search.hasClass('reveal')) {
      _search.slideUp(srSpeed, function(){
        _search.removeClass('reveal');
      })
      _searchCtrl.removeClass('closeIt');
      setTimeout(function(){_search.hide()}, srSpeed);
    } else {
      _search.slideDown(srSpeed, function(){
        _search.addClass('reveal');
        _searchCtrl.addClass('closeIt');
        setTimeout (function(){_search.find('input[type="text"]').trigger('focus')}, srSpeed);
      });
    }
  })

  // skip, 回到查詢控制開關
  _skipSearch.on( 'focus', function(){
    _searchCtrl.trigger('focus');
  })
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
  const text1 = _fatFootCtrl.text(); // 收合
  const text2 = _fatFootCtrl.attr('data-altText'); // 開啟

  if ( _footSiteTree.is(':hidden')) {
    _fatFootCtrl.addClass('closed').text(text2);
  } else {
    _fatFootCtrl.removeClass('closed').text(text1);
  }
  
  _fatFootCtrl.on( 'click', function(){
    if ( _footSiteTree.is(':visible')) {
      _footSiteTree.slideUp();
      $(this).addClass('closed').text(text2);
    } else {
      _footSiteTree.slideDown();
      $(this).removeClass('closed').text(text1);
    }
  })
  // --------------------------------------------------------------- //


  // 回到頁面頂端 Go Top
  // --------------------------------------------------------------- //
  _goTop.on( 'click', function(){
    _html.stop(true,false).animate({scrollTop: 0}, 800, function(){
      $('.goCenter').trigger('focus');
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



  // 可收合區 
  // --------------------------------------------------------------- //
  _drawer = $('.drawer');
  _drawer.each(function () {
    let _this = $(this);
    let _handle = _this.find('.handle');
    let _tray = _this.find('.tray');
    let _showHideSearch = _this.filter('.searchOnLp');
    const speed = 500;
    const text1 = "顯示查詢條件";
    const text2 = "隱藏查詢條件";

    if ( _tray.is(':hidden')) {
      _handle.addClass('openIt');
      
    } else {
      _handle.removeClass('openIt');
    }


    _handle.click(function () {
      if (_tray.is(':hidden')) {
        _tray.stop(true, false).slideDown(speed);
        _handle.removeClass('openIt');
        if ( _handle.parent('.searchOnLp').length == 1 ) {
          _handle.text(text2);
        }
      } else {
        _tray.stop(true, false).slideUp(speed, function(){
         _handle.addClass('openIt');
          if (_handle.parent('.searchOnLp').length == 1 ) {
           _handle.text(text1);
          }
        })
      }
    })
  })

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
  $('.bigBanner').find('.flow').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 5000,
    speed: 800,
    autoplay: true,
    arrows: true,
    dots: true,
    fade: true,
    infinite: true,
    zIndex:8
  });

  // 探索國家故事
  // --------------------------------------------------------------- //
  $('.explore').find('.flow').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 5000,
    speed: 800,
    autoplay: true,
    arrows: true,
    dots: true,
    fade: false,
    infinite: true,
    mobileFirst: true,
    vertical: false,
    responsive: [
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 3,
          centerMode: true,
          centerPadding: '0'
        }
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4,
        }
      }
    ]
  });

  // 近期活動 EVENTS
  // --------------------------------------------------------------- //
  // 海報區
  var _eventPoster = $('.events').find('.flow');
  var _eventTitle = $('.events').find('.titles');

  _eventPoster.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: _eventTitle,
    autoplaySpeed: 5000,
    speed: 800,
    autoplay: false,
    arrows: true,
    dots: true,
    fade: false,
    infinite: true,
    mobileFirst: true,
    vertical: false,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
        }
      }
    ],
    responsive: [
      {
        breakpoint: 1300,
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
    arrows: false,
    dots: false,
    fade: true
  })

  
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