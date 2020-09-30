/*global chrome, document, window*/
/*global Zepto*/
/* eslint-disable no-var*/

(function() {
    var $ = Zepto;
    var copySourceElemSelector = '#translation_container #action_copy_source';
    var GRAPHIE_REGEX =
        // eslint-disable-next-line max-len
        /(?:web\+graphie|https):\/\/ka-perseus-graphie\.[^/]+\/[0-9a-f]{40}(?:\.png)?/g;

    // Catch the keyboard shortcut specified in manifest
    chrome.runtime.onMessage.addListener(function(message) {
        switch (message.action) {
        case 'open-graphie':
            $('#open_graphie').click();
            break;
        default:
            break;
        }
    });

    var openGraphieEditor = function(graphieLinks) {
        var graphieEditorUrl = 'http://graphie-to-png.kasandbox.org/';
        if (graphieLinks) {
            for (var link of graphieLinks) {
                window.open(`${graphieEditorUrl}/?preload=${link}`);
            }
        }
    };

    var whenElemIsReady = function(selector, cb) {
        if ($(selector).length > 0) {
            cb();
        } else {
            setTimeout(function() {
                whenElemIsReady(selector, cb);
            }, 100);
        }
    };

    var findGraphieLinks = function(text) {
        if (typeof text === 'string') {
            return text.match(GRAPHIE_REGEX);
        }
        return null;
    };

    var createBtn = function() {
        var $openGraphieBtn =
            $('<button id="open_graphie" tabindex="-1" class="btn btn-icon">'
            + 'G</button>');
        // Tune the button style
        var shortcut = '(Alt+G)';
        var title = `Open Graphie ${  shortcut}`;
        $openGraphieBtn.attr('title', title);
        $openGraphieBtn.css('font-size', '12px');
        $openGraphieBtn.css('border', '2px solid gray');
        $openGraphieBtn.css('padding', '2px');
        return $openGraphieBtn;
    };

    var initializePlugin = function() {

        // Create a new button
        var $openGraphieBtn = createBtn();

        // Append Crowdin menu, next to existing buttons
        var $copySourceBtn = $(copySourceElemSelector);
        var $menu = $copySourceBtn.parent();
        $menu.append($openGraphieBtn);

        var openGraphie = function() {
            // First try finding graphie in translated string (if it exists)
            // otherwise, take it from the source string
            var links = findGraphieLinks($('#translation').val());
            if (links) {
                openGraphieEditor(links);
            } else {
                var sourceStringNodes = document
                    .getElementById('source_phrase_container')
                    .childNodes[0];
                for (var node of sourceStringNodes.childNodes) {
                    links = findGraphieLinks(node.data);
                    if (links) {
                        openGraphieEditor(links);
                    }
                }
            }
        };

        $openGraphieBtn.on('click', openGraphie);
    };

    // Crowdin window is generated dynamically
    // so we need to wait for the parent element to be built
    whenElemIsReady(copySourceElemSelector, initializePlugin);
})();
