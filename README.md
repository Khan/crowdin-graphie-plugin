# crowdin-graphie-plugin
Browser plugin for opening Graphie links from Crowdin strings in Graphie editor.

See [this forum post](https://international-forum.khanacademy.org/t/browser-plugins-for-opening-graphie-links/2338) for details.

(currently, the plugin is only published on [Chrome](https://chrome.google.com/webstore/detail/crowdin-open-graphie/kbjhneeomndnpbacddhjonanichjfpha))

## Publishing a new version of the plugin

1. Bump version in manifest.json

2. Create zip file

```sh
    ./pack_plugin.sh
```

3. Upload the zip file and publish.

    - https://chrome.google.com/webstore/developer/dashboard

