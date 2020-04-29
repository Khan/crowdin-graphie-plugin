(function () {
    var $ = Zepto;
    var copySourceElemSelector = '#translation_container #action_copy_source';
    var GRAPHIE_REGEX =
      /(?:web\+graphie|https):\/\/ka-perseus-graphie\.[^\/]+\/[0-9a-f]{40}(?:\.png)?/g;

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

    var openGraphieEditor = function (graphieLink) {
      var graphieEditorUrl = 'http://graphie-to-png.kasandbox.org/';
      if (graphie_link) {
        window.open(graphieEditorUrl + '/?preload=' + graphieLink);
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
        $openGraphieBtn =
          $('<button id="open_graphie" tabindex="-1" class="btn btn-icon">G</button>');
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
            return match ? match[0] : null;
          } else {
            return null;
          }
        };

        var openGraphie = function() {
            // First try finding graphie in translated string (if it exists)
            // otherwise, take it from the source string
            var link = findGraphieLink($('#translation').val());
            if (link) {
              openGraphieEditor(link);
            } else {
              var sourceStringNodes = document.getElementById("source_phrase_container").childNodes[0]
              for (var node of sourceStringNodes.childNodes) {
                link = findGraphieLink(node.data);
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
