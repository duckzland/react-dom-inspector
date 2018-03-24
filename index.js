import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Inspector from './components';

const Element = document.getElementById('dom-inspector');

ReactDOM.render(
    <Inspector
        config={{
            domID: Element.getAttribute('id'),
            pageSrc: Element.getAttribute('data-page-src'),

            // Optional
            allowNavigator: true,
            advancedMode: false,
            viewmode: 'desktop',
            minimize: false,
            vertical: false
        }}
        iterator={{
            maxDepth: Element.getAttribute('data-iterator-max-depth'),
            InspectorPanelStartingDepth: 2
        }}
        editor={{
            domID: Element.getAttribute('id'),
            googleFontAPI: Element.getAttribute('data-google-font-api'),
            imageFetch: Element.getAttribute('data-image-fetch'),
            imageLoader: JSON.parse(Element.getAttribute('data-image-loader')),
            imageLibrary: JSON.parse(Element.getAttribute('data-image-library')),
        }}

        controlbar= {{
        }}

        translation={JSON.parse(Element.getAttribute('data-translation'))}
    />,
    Element
);