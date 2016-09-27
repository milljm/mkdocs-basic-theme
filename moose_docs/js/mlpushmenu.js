/**
 * mlpushmenu.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
;





(function(window) {

  'use strict';

  function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  // taken from https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js
  function hasParent(e, id) {
    if (!e) return false;
    var el = e.target || e.srcElement || e || false;
    while (el && el.id != id) {
      el = el.parentNode || false;
    }
    return (el !== false);
  }

  // returns the depth of the element "e" relative to element with id=id
  // for this calculation only parents with classname = waypoint are considered
  function getLevelDepth(e, id, waypoint, cnt) {
    cnt = cnt || 0;
    if (e.id.indexOf(id) >= 0) return cnt;
    if (classie.has(e, waypoint)) {
      ++cnt;
    }
    return e.parentNode && getLevelDepth(e.parentNode, id, waypoint, cnt);
  }

  // http://coveroverflow.com/a/11381730/989439
  function mobilecheck() {
    var check = false;
    (function(a) {
      if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }

  // returns the closest element to 'e' that has class "classname"
  function closest(e, classname) {
    if (classie.has(e, classname)) {
      return e;
    }
    return e.parentNode && closest(e.parentNode, classname);
  }

  function mlPushMenu(el, trigger, options) {
    this.el = el;
    this.trigger = trigger;
    this.options = extend(this.defaults, options);
    // support 3d transforms
    this.support = Modernizr.csstransforms3d;
    if (this.support) {
      this._init();
    }
  }

  mlPushMenu.prototype = {
    defaults: {
      // overlap: there will be a gap between open levels
      // cover: the open levels will be on top of any previous open level
      type: 'overlap', // overlap || cover
      // space between each overlaped level
      levelSpacing: 40,
      // classname for the element (if any) that when clicked closes the current level
      backClass: 'mp-back'
    },
    menuState: [],
    _storeState: function() {
      if ('sessionStorage' in window) {
        window.sessionStorage.setItem('mooseMenuState', JSON.stringify(this.menuState));
      }
    },
    _restoreState: function() {
      var body = document.getElementsByTagName('body')[0];
      var savedState = this.menuState.slice();
      var j, id;

      this.menuState = [];
      if (savedState.length > 0)
      {
        // press hamburger
        if (savedState[0] == true) {
          this._openMenu();
        } else {
          this.menuState = savedState;
          return;
        }

        // open sublevels
        for (j = 1; j < savedState.length; ++j) {
          id = savedState[j];
          console.log('state item', j, id);

          this.menuItems.forEach(function(el, i) {
            var subLevel = el.querySelector('div.mp-level');
            if (subLevel && subLevel.getAttribute('data-unique-id') === id) {
              console.log("clicked on",  el.querySelector('a'));
              el.querySelector('a').click();
              body.classList.add('clicky');
              return;
            }
          });
        }
      }
    },
    _init: function() {
      // if menu is open or not
      this.open = false;
      // level depth
      this.level = 0;
      // the moving wrapper
      this.wrapper = document.getElementById('mp-pusher');
      // the mp-level elements
      this.levels = Array.prototype.slice.call(this.el.querySelectorAll('div.mp-level'));
      // the scroller element
      this.scroller = document.getElementById('scroller');
      // save the depth of each of these mp-level elements
      var self = this;
      this.levels.forEach(function(el, i) {
        el.setAttribute('data-level', getLevelDepth(el, self.el.id, 'mp-level'));
      });
      // the menu items
      this.menuItems = Array.prototype.slice.call(this.el.querySelectorAll('li'));
      // if type == "cover" these will serve as hooks to move back to the previous level
      this.levelBack = Array.prototype.slice.call(this.el.querySelectorAll('.' + this.options.backClass));
      // event type (if mobile use touch events)
      this.eventtype = mobilecheck() ? 'touchstart' : 'click';
      // add the class mp-overlap or mp-cover to the main element depending on options.type
      classie.add(this.el, 'mp-' + this.options.type);
      // initialize / bind the necessary events
      this._initEvents();
      // initialize breadcrumbs
      this.breadcrumbs = $('div.mp-level').find('h2');
    },
    _initEvents: function() {
      var self = this;

      // the menu should close if clicking somewhere on the body
      var bodyClickFn = function(el) {
        self._resetMenu();
        el.removeEventListener( self.eventtype, bodyClickFn );
      };

      // open (or close) the menu
      this.trigger.addEventListener(this.eventtype, function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        if (self.open) {
          self._resetMenu();
        } else {
          // let's see if we want the hamburger to open up a saved menu state
          if (self.menuState.length > 0) {
            self.menuState[0] = true;
            self._restoreState();
          } else {
            self._openMenu();
            // the menu should close if clicking somewhere on the body (excluding clicks on the menu)
            document.addEventListener(self.eventtype, function(ev) {
              if (self.open && !hasParent(ev.target, self.el.id)) {
                bodyClickFn(this);
              }
            });
          }
        }
      });

      // opening a sub level menu
      var uniqueID = 0;
      this.menuItems.forEach(function(el, i) {
        // check if it has a sub level
        var subLevel = el.querySelector('div.mp-level');
        if (subLevel) {
          subLevel.setAttribute('data-unique-id', uniqueID++);
          el.querySelector('a').addEventListener(self.eventtype, function(ev) {
            ev.preventDefault();
            var level = closest(el, 'mp-level').getAttribute('data-level');
            if (self.level <= level) {
              ev.stopPropagation();
              classie.add(closest(el, 'mp-level'), 'mp-level-overlay', 'mp-level-submenu');
              self._openMenu(subLevel);
            }
          });
        }
      });

      // closing the sub levels :
      // by clicking on the visible part of the level element
      this.levels.forEach(function(el, i) {
        el.addEventListener(self.eventtype, function(ev) {
          ev.stopPropagation();
          var level = el.getAttribute('data-level');
          if (self.level > level) {
            self.level = level;
            self._closeMenu();
          }
        });
      });

      // by clicking on a specific element
      this.levelBack.forEach(function(el, i) {
        el.addEventListener(self.eventtype, function(ev) {
          ev.preventDefault();
          var level = closest(el, 'mp-level').getAttribute('data-level');
          if (self.level <= level) {
            ev.stopPropagation();
            self.level = closest(el, 'mp-level').getAttribute('data-level') - 1;
            self.level === 0 ? self._resetMenu() : self._closeMenu();
          }
        });
      });

      // restore a previously saved menu state
      if ('sessionStorage' in window) {
        self.menuState = JSON.parse(window.sessionStorage.getItem('mooseMenuState')) || [];
        self._restoreState();
      }
    },
    _openMenu: function(subLevel) {
      // increment level depth
      ++this.level;
      this.menuState.push((subLevel && subLevel.getAttribute('data-unique-id')) || true);
      this._storeState();

      // move the main wrapper
      var levelFactor = (this.level - 1) * this.options.levelSpacing,
        translateVal = this.options.type === 'overlap' ? this.el.offsetWidth + levelFactor : this.el.offsetWidth;

      this._setTransform('translate3d(' + translateVal + 'px,0,0)');
      this._setScrollerTransform(translateVal + 'px');

      if (subLevel) {
        if (this.menuState.length === 2) {
          this._breadCrumbs(1, 0);
        } else {
          this._breadCrumbs(1, subLevel.getAttribute('data-unique-id'));
        }
        // reset transform for sublevel
        this._setTransform('', subLevel);
        // need to reset the translate value for the level menus that have the same level depth and are not open
        for (var i = 0, len = this.levels.length; i < len; ++i) {
          var levelEl = this.levels[i];
          if (levelEl != subLevel && !classie.has(levelEl, 'mp-level-open')) {
            this._setTransform('translate3d(-100%,0,0) translate3d(' + -1 * levelFactor + 'px,0,0)', levelEl);
            this._setScrollerTransform(-1 * levelFactor + 'px', levelEl);
          }
        }
      }
      // add class mp-pushed to main wrapper if opening the first time
      if (this.level === 1) {
        classie.add(this.wrapper, 'mp-pushed');
        this.open = true;
      }
      // add class mp-level-open to the opening level element
      classie.add(subLevel || this.levels[0], 'mp-level-open');
    },
    // close the menu
    _resetMenu: function() {
      this._setTransform('translate3d(0,0,0)');
      this._setScrollerTransform('10px');
      this.menuState[0] = false;
      this.level = 0;
      // remove class mp-pushed from main wrapper
      classie.remove(this.wrapper, 'mp-pushed');
      this._toggleLevels();
      this.open = false;
    },
    // close sub menus
    _closeMenu: function(subLevel) {
      var translateVal = this.options.type === 'overlap' ? this.el.offsetWidth + (this.level - 1) * this.options.levelSpacing : this.el.offsetWidth;
      this._setTransform('translate3d(' + translateVal + 'px,0,0)');
      this._setScrollerTransform(translateVal + 'px');
      this._toggleLevels();
    },
    // translate the el
    _setTransform: function(val, el) {
      el = el || this.wrapper;
      el.style.WebkitTransform = val;
      el.style.MozTransform = val;
      el.style.transform = val;
    },
    // modify the scroller
    _setScrollerTransform: function(val, el) {
      el = el || this.scroller;
      el.style.paddingRight = val;
    },

    // modify breadcrumb level
    _breadCrumbs: function(state, id) {
      var specific = id;
      if ( +state === 1 ) {
        // add breadcrumb
        // get current heading of sublevel, and add the breadcrumb class
        var crumb = $("div.mp-level.mp-level-open").eq([$("div.mp-level.mp-level-open").length - 1]).children().eq(0);
        $(crumb).addClass('mp-breadcrumb');
      } else {
        // remove breadcrumb. If the sublevel is 1, then just close the entire tree
        if (+this.level === 1) {
          for (var i = 0, len = this.breadcrumbs.length; i < len; ++i) {
            $(this.breadcrumbs[i]).removeClass('mp-breadcrumb');
          }
        } else if (specific != null) {
          // remove all breadcrumbs up to specific crumb
          for (var i = specific, len = this.breadcrumbs.length; i < len; ++i) {
            $(this.breadcrumbs[i]).removeClass('mp-breadcrumb');
          }
        } else {
          // get previous heading of sublevel, and remove the breadcrumb class
          var crumb = $("div.mp-level.mp-level-open").eq([$("div.mp-level.mp-level-open").length - 2]).find("h2").eq(0);
          $(crumb).removeClass('mp-breadcrumb');
        }
      }
    },

    // removes classes mp-level-open from closing levels
    _toggleLevels: function() {
      // go up one level in the stored state, unless we clicked the hamburger (then we retain state)
      if (this.menuState[0]) {
        if (+this.level != 1) {
          // remove specified breadcrumb
          this._breadCrumbs(0, this.menuState[this.level]);
        } else {
          // remove previous breadcrumb (back button was used)
          this._breadCrumbs(0);
        }
        this.menuState = this.menuState.slice(0, this.level);
      }
      this._storeState();
      for (var i = 0, len = this.levels.length; i < len; ++i) {
        var levelEl = this.levels[i];
        if (levelEl.getAttribute('data-level') >= this.level + 1) {
          classie.remove(levelEl, 'mp-level-open');
          classie.remove(levelEl, 'mp-level-overlay');
        } else if (Number(levelEl.getAttribute('data-level')) == this.level) {
          classie.remove(levelEl, 'mp-level-overlay');
        }
      }
    }
  }

  // add to global namespace
  window.mlPushMenu = mlPushMenu;

})(window);
