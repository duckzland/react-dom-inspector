import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Inspector from './components';

ReactDOM.render(
    <Inspector iterator={ { maxDepth: 2 } } editor={{}} />,
    document.getElementById('dom-inspector')
);