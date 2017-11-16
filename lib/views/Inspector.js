import React from 'react';
import ReactDOM from 'react-dom';
import InspectorPanel from './InspectorPanel';
import EditorPanel from './EditorPanel';

class Inspector extends React.Component {

    state = {
        minimize: false
    };

    constructor(props) {
        super(props);
        if ('minimize' in props) {
            this.state.minimize = props.minimize;
        }
    }

    componentWillMount() {
        document.body.setAttribute('stylizer-active', this.state.minimize);
    }
    componentDidUpdate() {
        document.body.setAttribute('stylizer-active', this.state.minimize);
    }

    toggleMinimize = () => {
        this.setState({ minimize: !this.state.minimize });
    };

    render() {
        const { state, props } = this;
        const { iterator, editor } = props;
        let className = [
            'stylizer-inspector'
        ];
        if (state.minimize) {
            className.push('minimize');
        }

        className = className.join(' ');

        return (
            <div key="stylizer-inspector" className={ className }>
                <InspectorPanel key="stylizer-iterator-element" config={ iterator } root={ this } />
                <EditorPanel key="stylizer-editor-element" config={ editor } root={ this } />
            </div>
        )
    };
}

export default Inspector;