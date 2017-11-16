import React from 'react';
import ReactDOM from 'react-dom';
import Iterator from '../modules/Iterator';
import InspectorPanel from './InspectorPanel';
import EditorPanel from './EditorPanel';
import { forEach } from 'lodash';

class Inspector extends React.Component {

    state = {
        minimize: false,
        activateNode: false
    };

    eventBinded = false;
    allowNavigator = true;
    iterator = false;

    constructor(props) {
        super(props);
        if ('minimize' in props) {
            this.state.minimize = props.minimize;
        }
        if ('allowNavigator' in props) {
            this.allowNavigator = props.allowNavigator;
        }
        this.iterator = new Iterator();
    };

    componentWillMount() {
        document.body.setAttribute('stylizer-active', this.state.minimize ? 'true' : 'false');
        this.state.minimize ? this.destroyEvent() : this.bindEvent();
    };

    componentDidUpdate() {
        document.body.setAttribute('stylizer-active', this.state.minimize ? 'true' : 'false');
        this.state.minimize ? this.destroyEvent() : this.bindEvent();
        this.state.activateNode = false;
    };

    bindEvent = () => {
        if (!this.eventBinded) {
            document.addEventListener('click', this.captureNode, false);
            this.eventBinded = true;
        }
    };

    destroyEvent = () => {
        if (this.eventBinded) {
            document.removeEventListener('click', this.captureNode);
            this.eventBinded = false;
        }
    };

    toggleMinimize = () => {
        this.setState({ minimize: !this.state.minimize });
    };

    setActiveNode = (node) => {
        this.setState({ node: node });
        Array.from(document.getElementsByClassName('stylizer-element-active')).forEach((element) => {
            element.classList.remove('stylizer-element-active');
        });
        node.trackNode().classList.add('stylizer-element-active');
    };

    detectIfInsideStyllizer = (e) => {
        let bailOut = false;
        if (e.path) {
            forEach(e.path, (parent) => {

                if (parent.id && parent.id === 'dom-inspector') {
                    bailOut = true;
                }
                else if (parent.className) {
                    let string = parent.className.match(/\bstylizer\b/);
                    if (string && string.length !== -1) {
                        bailOut = true;
                    }
                }
                else if (parent.hasAttribute && parent.hasAttribute('stylizer-inspector')) {
                    bailOut = true;
                }

                if (bailOut) {
                    return false;
                }
            });
        }
        return bailOut;
    };

    retrieveOrBuildStorage = (node) => {
        let tracker = node, nodeToParentDepth = 1;
        while (tracker) {
            if (tracker.hasAttribute('stylizer-uuid')) {
                break;
            }
            tracker = tracker.parentElement;
            nodeToParentDepth++;
        }

        if (nodeToParentDepth > 1) {
            let Store = this.iterator.findNode(tracker.getAttribute('stylizer-uuid'));
            this.iterator.iterate(tracker, Store, Store.depth, Store.depth + nodeToParentDepth, Store.tree);
        }

        let targetNode = this.iterator.findNode(node.getAttribute('stylizer-uuid'));
        if (targetNode) {
            return targetNode;
        }

        return false;
    };

    captureNode = (e) => {
        if (this.detectIfInsideStyllizer(e)) {
            return true;
        }

        let node = e.target, StoreObject = this.retrieveOrBuildStorage(node);

        if (node.nodeName.toLowerCase() === 'img') {
            return true;
        }

        if (node.nodeName.toLowerCase() === 'a') {
            e.preventDefault();
        }

        if (StoreObject) {
            if (!this.allowNavigator) {
                this.setActiveNode(StoreObject);
            }
            else {
                // Let navigator refresh their markup
                this.setState({ activateNode: StoreObject });
            }
        }
    };

    render() {
        const { state, props, allowNavigator, activateNode } = this;
        const { iterator, editor } = props;
        let className = [
            'stylizer-inspector'
        ];
        if (state.minimize) {
            className.push('minimize');
        }
        if (!allowNavigator) {
            className.push('no-navigator');
        }

        className = className.join(' ');

        return (
            <div key="stylizer-inspector" className={ className } stylizer-inspector="true">
                { allowNavigator && <InspectorPanel key="stylizer-iterator-element" config={ iterator } root={ this } iterator={ this.iterator } activateNode={ state.activateNode }/> }
                <EditorPanel key="stylizer-editor-element" config={ editor } root={ this } node={ state.node } />
            </div>
        )
    };
}

export default Inspector;