import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Inspector from './components';

const Element = document.getElementById('dom-inspector');
ReactDOM.render(
    <Inspector
        iterator={{
            maxDepth: Element.getAttribute('data-iterator-max-depth')
        }}
        editor={{
            domID: Element.getAttribute('id'),
            googleFontAPI: Element.getAttribute('data-google-font-api'),
            imageFetch: Element.getAttribute('data-image-fetch'),
            imageLoader: JSON.parse(Element.getAttribute('data-image-loader')),
            imageLibrary: JSON.parse(Element.getAttribute('data-image-library'))
        }}
    />,
    Element
);