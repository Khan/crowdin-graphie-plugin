(function () {
    var $ = Zepto;
    var copySourceElemSelector = '#translation_container #action_copy_source';
    var GRAPHIE_REGEX = /\!\[[^\]]*\]\(web\+graphie[^)]+\)/g;

    // Catch the keyboard shortcut specified in manifest
    chrome.runtime.onMessage.addListener(function(message) {
        switch (message.action) {
            case "open-graphie":
                $('#open_graphie').click();
                break;
            default:
                break;
        }
    });

    var openGraphieEditor = function (graphie_link) {
      var graphieEditorUrl = 'http://graphie-to-png.kasandbox.org/';
      if (graphie_link) {
        window.open(graphieEditorUrl + '/?preload=' + graphie_link);
      }
    };

    var whenElemIsReady = function (selector, cb) {

        if ($(selector).length > 0) {
            cb();
        } else {
            setTimeout(function () {
                whenElemIsReady(selector, cb);
            }, 100)
        }
    };

    var initializePlugin = function() {

        // Create a new button
        $openGraphieBtn = $('<button id="open_graphie" tabindex="-1" class="btn btn-icon">G</button>');
        var shortcut = " (Alt+G)";
        title = "Open Graphie " + shortcut;
        // Tune style of the button
        $openGraphieBtn.attr("title", title);
        $openGraphieBtn.css('font-size', '12px');
        $openGraphieBtn.css('border', '2px solid gray');
        $openGraphieBtn.css('padding', '2px');

        $copySourceBtn = $(copySourceElemSelector);
        $menu = $copySourceBtn.parent();
        $menu.append($openGraphieBtn);

        var findGraphieLink = function(text) {
          if (typeof text == "string") {
            var match = text.match(GRAPHIE_REGEX);
            return (match ? match[0] : null)
          } else {
            return null;
          }
        };

        var openGraphie = function() {
            var text = $('#translation').val();
            // Find graphie in translated string, if it exists
            // otherwise, take it from the source string
            if (text != '') {
              openGraphieEditor(findGraphieLink(text));
            } else {
              var sourceStringNodes = document.getElementById("source_phrase_container").childNodes[0]
              for (var node of sourceStringNodes.childNodes) {
                var link = findGraphieLink(node.data);
                if (link) {
                  openGraphieEditor(link);
                  // Open only first instance of Graphie link
                  break;
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
