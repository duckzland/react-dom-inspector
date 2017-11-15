import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DOMInspector from './lib/DOMInspector';

ReactDOM.render(
    <DOMInspector/>,
    document.getElementById('dom-inspector')
);