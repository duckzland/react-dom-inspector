import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Inspector from './components';

const Element = document.getElementById('dom-inspector');

ReactDOM.render(
    <Inspector config={JSON.parse(Element.getAttribute('data-config'))} />,
    Element
);