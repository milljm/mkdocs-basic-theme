function getSearchTerm()
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == 'q')
        {
            return sParameterName[1];
        }
    }
}

$(document).ready(function() {

    var search_term = getSearchTerm(),
        $search_modal = $('#mkdocs_search_modal');

    if(search_term){
        $search_modal.modal();
    }

    // make sure search input gets autofocus everytime modal opens.
    $search_modal.on('shown.bs.modal', function () {
        $search_modal.find('#mkdocs-search-query').focus();
    });

    // Highlight.js
    hljs.initHighlightingOnLoad();
    $('table').addClass('table table-striped table-hover');

    // Improve the scrollspy behaviour when users click on a TOC item.
    $(".nav a").on("click", function() {
        var clicked = this;
        setTimeout(function() {
            var active = $('.nav li.active a');
            active = active[active.length - 1];
            if (clicked !== active) {
                $(active).parent().removeClass("active");
                $(clicked).parent().addClass("active");
            }
        }, 50);
    });

});


$('body').scrollspy({
    target: '.bs-sidebar',
});

/* Toggle the `clicky` class on the body when clicking links to let us
   retrigger CSS animations. See ../css/base.css for more details. */
$('a').click(function(e) {
    $('body').toggleClass('clicky');
});

/* Prevent disabled links from causing a page reload */
$("li.disabled a").click(function() {
    event.preventDefault();
});

var themes = {
    "default": "//mooseframework.org/source_packages/bootswatch/default/bootstrap-custom.min.css",
    "dorkmode": "//mooseframework.org/source_packages/bootswatch/moosedocs/bootstrap-custom.min.css",
    "readthedocs": "//mooseframework.org/source_packages/bootswatch/readthedocs/readthedocs.css",
    "cosmo" : "//mooseframework.org/source_packages/bootswatch/cosmo/bootstrap.min.css",
    "cyborg" : "//mooseframework.org/source_packages/bootswatch/cyborg/bootstrap.min.css",
    "flatly" : "//mooseframework.org/source_packages/bootswatch/flatly/bootstrap.min.css",
    "journal" : "//mooseframework.org/source_packages/bootswatch/journal/bootstrap.min.css",
    "readable" : "//mooseframework.org/source_packages/bootswatch/readable/bootstrap.min.css",
    "simplex" : "//mooseframework.org/source_packages/bootswatch/simplex/bootstrap.min.css",
    "slate" : "//mooseframework.org/source_packages/bootswatch/slate/bootstrap.min.css",
    "united" : "//mooseframework.org/source_packages/bootswatch/united/bootstrap.min.css"
}

$(function(){
    function getCookie(c_name) {
	if (document.cookie.length > 0) {
	    c_start = document.cookie.indexOf(c_name + "=");
	    if (c_start != -1) {
		c_start = c_start + c_name.length + 1;
		c_end = document.cookie.indexOf(";", c_start);
		if (c_end == -1) c_end = document.cookie.length;
		return unescape(document.cookie.substring(c_start, c_end));
	    }
	}
	return "default";
    }

    function setCookie(c_name, value) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + 7);
	document.cookie = c_name + "=" + escape(value) + ";path=/;expires=" + exdate.toUTCString();
    }

    var setTheme = getCookie('setTheme');

    var themesheet = $('<link href="'+themes[getCookie('setTheme')]+'" rel="stylesheet" />');

    themesheet.appendTo('head');

    $('.theme-link').click(function(){
	var themeurl = themes[$(this).attr('data-theme')];
	setCookie('setTheme', $(this).attr('data-theme'));
	themesheet.attr('href',themeurl);
    });
});
