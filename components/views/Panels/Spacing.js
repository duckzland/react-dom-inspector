import React from 'react';
import { get, forEach } from 'lodash';

class Spacing extends React.Component {

    state = {
        node: false
    };

    constructor(props) {
        super(props);
        this.state.node = 'node' in props ?  props.node : false;
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
                    { title: 'bottom', target: 'margin-bottom' }
                ]
            },
            {
                key: 'padding',
                title: 'Padding',
                elements: [
                    { title: 'top', target: 'padding-top' },
                    { title: 'left', target: 'padding-left' },
                    { title: 'right', target: 'padding-right' },
                    { title: 'bottom', target: 'padding-bottom' }
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
                                        let className = ['stylizer-form-item', 'stylizer-label-inline'];
                                        if (root.hasError('styles.' + el.target)) {
                                            className.push('stylizer-has-error');
                                        }
                                        return (
                                            <div key={ el.target + '-' + className.join('-') } className={ className.join(' ') }>
                                                <label className="stylizer-form-label">{ el.title }</label>
                                                <input type="text"
                                                       className="stylizer-form-input"
                                                       name={ 'styles.' + el.target }
                                                       key={ 'input-' + el.target + '-' + node.uuid }
                                                       defaultValue={ get(node, 'styles.' + el.target) }
                                                       onBlur={ (e) => root.rebuildStyling(e) } />
                                                {
                                                    root.hasError('styles.' + el.target)
                                                    && <div key={ 'input-' + el.target + '-error-' + node.uuid + '-' + node.selector }
                                                            className="stylizer-error-bag">
                                                            Invalid CSS value
                                                        </div>
                                                }
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