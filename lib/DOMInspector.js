import React from 'react';
import ReactDOM from 'react-dom';
import DOMIterator from './DOMIterator';
import CSSParser from './CSSParser';


class DOMInspector extends React.Component {

    constructor(props) {
        super(props);
        this.parser = new DOMIterator();
    }

    render() {
        return (
            <div className="test">
                Testing testing
            </div>
        )
    }
}

export default DOMInspector;