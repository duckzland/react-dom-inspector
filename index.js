import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Inspector from './lib/views/Inspector';
import './assets/styles.less';

ReactDOM.render(
    <Inspector iterator={ { maxDepth: 2 } } editor={{}} />,
    document.getElementById('dom-inspector')
);