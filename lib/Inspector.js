import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Parser from './Parser';


class Inspector extends Component {

    construct() {
        this.parser = new Parser('text');
    }

    render() {
        return (
            <div className="test">
                Testing testing
            </div>
        )
    }
}