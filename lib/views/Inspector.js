import React from 'react';
import ReactDOM from 'react-dom';
import Iterator from '../modules/Iterator';
import InspectorPanel from './InspectorPanel';
import EditorPanel from './EditorPanel';
import Overlay from './Overlay';
import { forEach } from 'lodash';

class Inspector extends React.Component {

    state = {
        minimize: false,
        activateNode: false,
        hover: false,
        saving: false,
        vertical: true,
        overlay: {}
    };

    eventBinded = {
        click: false,
        mousemove: false
    };

    allowNavigator = true;
    iterator = false;
    hoverCache = false;
    originalData = null;
    storedData = {};

    constructor(props) {
        super(props);
        if ('minimize' in props) {
            this.state.minimize = props.minimize;
        }
        if ('allowNavigator' in props) {
            this.allowNavigator = props.allowNavigator;
        }
        this.iterator = new Iterator();
        this.storeData();
    };

    componentWillMount() {
        document.body.setAttribute('stylizer-active', this.state.minimize ? 'true' : 'false');
        document.body.setAttribute('stylizer-vertical', this.state.vertical ? 'true' : 'false');
        this.state.hover ? this.bindEvent('mousemove') : this.destroyEvent('mousemove');
        this.state.minimize ? this.destroyEvent('all') : this.bindEvent('click');
    };

    componentDidUpdate() {
        document.body.setAttribute('stylizer-active', this.state.minimize ? 'true' : 'false');
        document.body.setAttribute('stylizer-vertical', this.state.vertical ? 'true' : 'false');
        this.state.hover ? this.bindEvent('mousemove') : this.destroyEvent('mousemove');
        this.state.minimize ? this.destroyEvent('all') : this.bindEvent('click');
        this.state.activateNode = false;
    };

    bindEvent = (event = 'all') => {
        if (!this.eventBinded.click && (event === 'click' || event === 'all')) {
            document.addEventListener('click', this.captureNode, false);
            this.eventBinded.click = true;
        }

        if (!this.eventBinded.mousemove && (event === 'mousemove' || event === 'all')) {
            document.addEventListener('mousemove', this.moveOverlay, false);
            this.eventBinded.mousemove = true;
        }
    };

    destroyEvent = (event = 'all') => {
        if (this.eventBinded.click && (event === 'click' || event === 'all')) {
            document.removeEventListener('click', this.captureNode);
            this.eventBinded.click = false;
        }

        if (this.eventBinded.mousemove && (event === 'mousemove' || event === 'all')) {
            document.removeEventListener('mousemove', this.moveOverlay);
            this.eventBinded.mousemove = false;
        }
    };

    // @todo merge all of this toggle mess into a single unified method or inject them to jsx directly.
    toggleMinimize = () => {
        this.setState({ minimize: !this.state.minimize });
    };

    toggleHoverInspector = () => {
        this.setState({ hover: !this.state.hover });
    };

    toggleLayout = () => {
        this.setState({ vertical: !this.state.vertical });
    };

    killApp = () => {

        // @todo make the id as props / config
        let mountNode = ReactDOM.findDOMNode(document.getElementById('dom-inspector'));
        let unmount = ReactDOM.unmountComponentAtNode(mountNode);
        if (unmount) {
            this.destroyEvent();
            document.body.removeAttribute('stylizer-active');
            this.iterator.destroy();
        }
    };

    storeData = () => {

        if (this.originalData !== null) {
            return;
        }

        let sheets = document.styleSheets, sheet = false;
        for (var i in sheets) {
            let styleNode = sheets[i].ownerNode;
            if (styleNode && styleNode.getAttribute('id') === 'jxdev-stylizer') {
                sheet = sheets[i];
                break;
            }
        }

        if (sheet) {
            this.originalData = sheet.rules || sheet.cssRules;
        }
    };

    // @todo expand this with css parser and iterator resets!
    revertData = () => {
        this.storedData = this.originalData;
    };

    // @todo expand this with props hooks to save to database with ajax!
    saveData = () => {

    };

    setActiveNode = (node) => {
        this.setState({ node: node });
    };

    // @todo clean this mess up, maybe create a single function to track parents?
    detectIfInsideStyllizer = (e) => {
        let bailOut = false;

        if (e.path) {
            forEach(e.path, (parent) => {

                if (parent.id && parent.id === 'dom-inspector') {
                    bailOut = true;
                }
                else if (parent.className && parent.className.match) {
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
        else {
            let tracker = e;
            while (tracker) {
                if (tracker.hasAttribute && tracker.hasAttribute('stylizer-inspector')) {
                    bailOut = true;
                    break;
                }
                tracker = tracker.parentElement;
            }
        }

        return bailOut;
    };

    // @todo clean this mess up
    retrieveOrBuildStorage = (node) => {
        let tracker = node, nodeToParentDepth = 1;
        // @todo this is duplicate function, maybe merge with detectIfInsideStylizer?
        while (tracker) {
            if (tracker.hasAttribute && tracker.hasAttribute('stylizer-uuid')) {
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
        let node = e.target;
        if (node.nodeName.toLowerCase() === 'a') {
            e.preventDefault();
        }

        if (this.detectIfInsideStyllizer(node) || node.nodeName.toLowerCase() === 'img') {
            return true;
        }

        let StoreObject = this.retrieveOrBuildStorage(node);
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

    moveOverlay = (e) => {
        let node = e.target, nodeName = node.nodeName.toLowerCase();
        if (this.detectIfInsideStyllizer(e)
            || nodeName === 'img'
            || nodeName === 'html'
            || nodeName === 'body') {
            this.hoverCache = false;
            this.setState({overlay: false});
            return true;
        }

        if (this.hoverCache === e) {
            return true;
        }

        this.hoverCache = e;
        this.setState({overlay: node});
        this.captureNode(e);
    };

    render() {
        const { state, props, allowNavigator } = this;
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
                <Overlay node={ state.overlay } />
            </div>
        )
    };
}

export default Inspector;