# React DOM Inspector

Javascript for crafting custom CSS by emulating Google Chrome Dev Bar tools

### Installing

Create the markup for the stylizer iframe

```
<!-- The markup where the target HTML would be, the markup will be injected to Iframe -->
<div id="stylizer-viewmode-frame">
    <div id="stylizer-frame-wrapper"></div>
</div>
```


Create the markup for the stylizer inspector element

```
<div id="dom-inspector"></div>
```


Create the javascript for starting the script, at the minimum we will
need these options, for more advanced usage, please see the example/index.html

```
<script>
    // Registering the element
    var Element = document.getElementById('dom-inspector');
    var CurrentHost = window.location.href;
    
    // Emulating callback when onKill event triggered
    function onKill() {
        // Code to execute when user click on the quit button
        console.log('Killed Triggered');
    }
    
    // Emulating callback when onSave event triggered
    function onSave(data) {
        // Code to execute when user click on saving button
        console.log('Save Triggered');
        console.log(data);
    }
    
    // Emulating callback when onWipe event triggered
    function onWipe(data) {
        // Code to execute when user is wiping the active state changes
        console.log('Wipe Triggered');
        console.log(data);
    }
    
    // Emulating callback when onRevert event triggered
    function onRevert(data) {
        // Code to execute when user is reverting to previously saved data
        console.log('Revert Triggered');
        console.log(data);
    }
    
    // Registering Callbacks as attribute, Note this is not the
    // same as jQuery.data() use jQuery.attr() to register this!
    Element.setAttribute('data-onkill', 'onKill');
    Element.setAttribute('data-onsave', 'onSave');
    Element.setAttribute('data-onwipe', 'onWipe');
    Element.setAttribute('data-onrevert', 'onRevert');

    // Main Configuration JSON
    Element.setAttribute('data-config', JSON.stringify({
    
        // The markup where the inspector will be build upon
        domID: 'dom-inspector',
        
        // Insert the google font api key
        googleFontAPI: 'xxx',
        
        // This is the source of the page that we want to edit
        pageSrc: 'site.html',
        imageLoader: {
            // Auto fetch image when booting
            fetch: true,
            loader: {
                upload: {
                    // The target script where will be called upon when user is uploading images
                    url: CurrentHost + "upload.php"
                },
                fetch: {
                    // The target script where to fetch the image data from
                    url: CurrentHost + "fetch.php"
                },
                remove: {
                    // the target script when user is removing image
                    url: CurrentHost + "remove.php"
                }
            },
            // Preloading images here
            library: [
                { id: 1, filename: "image1.jpg", url: CurrentHost + "images/image1.jpg", thumb: false },
                { id: 2, filename: "image2.jpg", url: CurrentHost + "images/image2.jpg", thumb: false },
                { id: 3, filename: "image3.jpg", url: CurrentHost + "images/image3.jpg", thumb: false },
                { id: 4, filename: "image4.jpg", url: CurrentHost + "images/image4.jpg", thumb: false },
                { id: 5, filename: "image5.jpg", url: CurrentHost + "images/image5.jpg", thumb: false },
                { id: 6, filename: "image6.jpg", url: CurrentHost + "images/image6.jpg", thumb: false },
                { id: 7, filename: "image7.jpg", url: CurrentHost + "images/image7.jpg", thumb: false },
                { id: 8, filename: "image8.jpg", url: CurrentHost + "images/image8.jpg", thumb: false },
                { id: 9, filename: "image9.jpg", url: CurrentHost + "images/image9.jpg", thumb: false },
                { id: 10, filename: "image10.jpg", url: CurrentHost + "images/image10.jpg", thumb: false }
            ]
        }
    }));
</script>
```

Loading the Javascript and CSS assets
```
<!-- Loading the minified stylesheet for the Inspector Element -->
<link href="assets/css/style.min.css" rel="stylesheet" type="text/css" />

<!-- Loading the Compiled Inspector javascript -->
<script src="assets/js/react-dom-inspector.min.js"></script>
```



## Authors

* **Jason Xie** - *Initial work* - [VicTheme.com](https://victheme.com)

## License

This project is licensed under the GNU General Public License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc

