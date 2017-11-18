import React from 'react';
import { get, forEach } from 'lodash';

class Spacing extends React.Component {

    state = {
        node: false,
        stored: [],
    };

    constructor(props) {
        super(props);
        this.state.node = 'node' in props ?  props.node : false;
        this.state.stored = get('node.stored.position');
    };

    componentWillReceiveProps(nextProps) {
        this.state.node = nextProps.node;
    };

    render() {

        const { props, state } = this;
        const { node } = state;
        const { root } = props;

        const ElementMaps = [
            {
                key: 'size',
                title: 'Size',
                elements: [
                    { title: 'Width', target: 'width' },
                    { title: 'Height', target: 'height' }
                ]
            },
            {
                key: 'margin',
                title: 'Margin',
                elements: [
                    { title: 'top', target: 'margin-top' },
                    { title: 'left', target: 'margin-left' },
                    { title: 'right', target: 'margin-right' },
                    { title: 'bottom', target: 'margin-bottom' },
                ]
            },
            {
                key: 'padding',
                title: 'Padding',
                elements: [
                    { title: 'top', target: 'padding-top' },
                    { title: 'left', target: 'padding-left' },
                    { title: 'right', target: 'padding-right' },
                    { title: 'bottom', target: 'padding-bottom' },
                ]
            }
        ];

        return (
            <div key="stylizer-tab-spacing" className="stylizer-tab-content stylizer-content">
                {
                    ElementMaps.map( (row) => {
                        return (
                            <div key={ row.title } className="stylizer-form-group">
                                <h3 className="stylizer-form-header">
                                    { row.title }
                                </h3>
                                <div className="stylizer-form-row">
                                    { row.elements && row.elements.map( (el) => {
                                        return (
                                            <div key={ el.target } className="stylizer-form-item">
                                                <label>{ el.title }</label>
                                                <input type="text" key={ 'input-' + el.target + '-' + node.uuid } defaultValue={ get(node, 'styles.' + el.target, '') } name={ 'stored.' + el.target } onChange={ (e) => root.rebuildStyling(e) } />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    };
}


export default Spacing;