/*global chrome*/

// This Js file is run in the background, see:
// https://developer.chrome.com/extensions/background_pages

// Catch keyboard shortcut defined in manifest.json
// and send it to the content script
chrome.commands.onCommand.addListener(function(command) {
    if (command === 'open-graphie') {
        // Send keyboard shortcut click to the current tab
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {'action': 'open-graphie'});
        });
    }
});
