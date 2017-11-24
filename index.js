import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Inspector from './components';

ReactDOM.render(
    <Inspector iterator={ { maxDepth: 2 } } editor={{
        googleFontAPI: 'AIzaSyBGkmctzcaXne1HFbZKYz6iq9i6ROrVeaE'
    }} />,
    document.getElementById('dom-inspector')
);