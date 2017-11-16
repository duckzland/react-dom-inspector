import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Inspector from './lib/views/Inspector';

ReactDOM.render(
    <Inspector config={ { maxDepth: 2 } }/>,
    document.getElementById('dom-inspector')
);