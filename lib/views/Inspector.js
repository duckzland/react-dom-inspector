import React from 'react';
import InspectorPanel from './InspectorPanel';
import EditorPanel from './EditorPanel';

class Inspector extends React.Component {
    render() {
        const { iterator, editor } = this.props;
        return (
            <div key="stylizer-inspector" className="stylizer-inspector">
                <InspectorPanel key="stylizer-iterator-element" config={ iterator } />
                <EditorPanel key="stylizer-editor-element" config={ editor} />
            </div>
        )
    };
}

export default Inspector;