/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/js/admin.js":
/*!*******************************!*\
  !*** ./src/admin/js/admin.js ***!
  \*******************************/
/***/ (() => {

eval("jQuery(document).ready(function ($) {\n  var search = $('.js-favorite-artists-search-submit');\n  var searchInput = $('.js-artists-search-input');\n  var searchMsg = $('.js-add-artist-message');\n  var save = $('.js-favorite-artists-search-save');\n  var reset = $('.js-favorite-artists-search-reset');\n  var deleteArtist = $('.js-favorite-artists-delete');\n  var deleteMsg = $('.js-delete-artist-message');\n  var adminTabs = $('ul.fa-tabs li');\n  var adminContent = $('.fa-tab-content');\n\n  // Search for an artist and suggest a result.\n  $(search).click(function (e) {\n    e.preventDefault();\n    var thisSearch = $(e.currentTarget);\n    $(searchMsg).html('Searching...');\n    var searchQuery = $('#artists-search').val();\n    var nonce = $(thisSearch).attr('data-nonce');\n    $.ajax({\n      type: 'post',\n      dataType: 'json',\n      url: ajaxurl,\n      data: {\n        action: 'do_search',\n        search_query: searchQuery,\n        nonce: nonce\n      },\n      success: function success(response) {\n        if (response.type === 'artist') {\n          $(searchInput).val(response.name).attr({\n            value: response.id\n          });\n          $(searchInput).prop('disabled', true);\n          $(thisSearch).hide();\n          $(searchMsg).html('Add ' + response.name + '?');\n          $(save).add(reset).show();\n          $(deleteMsg).html('');\n        } else {\n          $(searchMsg).html('Something went wrong :(');\n        }\n      },\n      error: function error() {\n        $(searchMsg).html('Something went wrong :(');\n      }\n    });\n  });\n\n  //Save selected artist to list.\n  $(save).click(function (e) {\n    e.preventDefault();\n    var thisSave = $(e.currentTarget);\n    $(searchMsg).html('saving...');\n    var artistsId = searchInput.attr('value');\n    var artistsName = searchInput.val();\n    var nonce = $(thisSave).attr('data-nonce');\n    $.ajax({\n      type: 'post',\n      dataType: 'json',\n      url: ajaxurl,\n      data: {\n        action: 'save_id',\n        artists_id: artistsId,\n        nonce: nonce\n      },\n      success: function success() {\n        $(searchMsg).html(artistsName + ' Added!');\n        $(thisSave).hide();\n        $(reset).html('Search and add more');\n        $('.js-artists-list ul li.hide-me').hide();\n        $('.js-artists-list ul').append('<li><a class=\"js-favorite-artists-delete\" data-nonce=' + nonce + ' data-artist-id=' + artistsId + ' href=\"#\"><span class=\"dashicons dashicons-trash\"></span></a><span>' + artistsName + '</span></li>');\n      },\n      error: function error() {\n        $(searchMsg).html('Artist not added :(');\n        $(thisSave).hide();\n        $(reset).html('Try again');\n      }\n    });\n  });\n\n  // Reset search.\n  $('#artists-section').on('click', '.js-favorite-artists-search-reset, .js-favorite-artists-delete', function (e) {\n    e.preventDefault();\n    $(search).show();\n    $(save).add(reset).hide();\n    $(searchMsg).html('');\n    $(searchInput).val('').prop('disabled', false);\n  });\n\n  //Delete selected artist from list.\n  $('.js-artists-list').on('click', '.js-favorite-artists-delete', function (e) {\n    e.preventDefault();\n    var thisItem = $(e.currentTarget);\n    $(deleteMsg).html('deleting...');\n    var artistsId = $(thisItem).attr('data-artist-id');\n    var nonce = $(thisItem).attr('data-nonce');\n    $.ajax({\n      type: 'post',\n      dataType: 'json',\n      url: ajaxurl,\n      data: {\n        action: 'delete_id',\n        artists_id: artistsId,\n        nonce: nonce\n      },\n      success: function success() {\n        $(deleteMsg).html('Artist deleted!');\n        $(thisItem).closest('li').remove();\n      },\n      error: function error() {\n        $(deleteMsg).html('Artist not deleted :(');\n      }\n    });\n  });\n\n  // Admin settings tabs.\n  $(adminTabs).click(function (e) {\n    var thisTab = $(e.currentTarget);\n    var tabId = $(thisTab).attr('data-tab');\n    $(adminTabs).removeClass('current');\n    $(adminContent).removeClass('current');\n    $(thisTab).addClass('current');\n    $('#' + tabId).addClass('current');\n  });\n});\n\n//# sourceURL=webpack://favorite-artists/./src/admin/js/admin.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/admin/js/admin.js"]();
/******/ 	
/******/ })()
;