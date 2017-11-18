import React from 'react';
import ReactDOM from 'react-dom';
import Iterator from './modules/Iterator';
import DOMHelper from './modules/DOMHelper';
import InspectorPanel from './views/Inspector';
import EditorPanel from './views/Editor';
import Overlay from './views/Overlay';
import { forEach } from 'lodash';
import './../assets/styles.less';

export default class Inspector extends React.Component {

    state = {
        minimize: false,
        activateNode: false,
        hover: false,
        saving: false,
        vertical: false,
        overlay: {}
    };

    eventBinded = {
        click: false,
        mousemove: false
    };

    allowNavigator = true;
    iterator = false;
    DOMHelper = false;
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
        this.DOMHelper = new DOMHelper();
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
        this.originalData = this.DOMHelper.styleSheet({id: 'jxdev-stylizer'}, 'content');
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

    detectIfInsideStylizer = (node) => {
        return this.DOMHelper.closest(node, {id: 'dom-inspector', className: '\\bstylizer\\b', hasAttribute: 'stylizer-inspector'}, 'boolean');
    };

    retrieveOrBuildStorage = (node) => {
        let tracker = this.DOMHelper.closest(node, {hasAttribute: 'stylizer-uuid'}, 'both');
        if (tracker.depth > 1) {
            let Store = this.iterator.findNode(tracker.node.getAttribute('stylizer-uuid'));
            this.iterator.iterate(tracker.node, Store, Store.depth, Store.depth + tracker.depth, Store.tree);
        }

        tracker = null;
        let targetNode = this.iterator.findNode(node.getAttribute('stylizer-uuid'));
        return targetNode ? targetNode : false;
    };

    captureNode = (e) => {
        let node = e.target;
        if (node.nodeName.toLowerCase() === 'a') {
            e.preventDefault();
        }

        if (this.detectIfInsideStylizer(node) || node.nodeName.toLowerCase() === 'img') {
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
        let node = e.target,
            nodeName = node.nodeName.toLowerCase();

        if (this.detectIfInsideStylizer(node)
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
        this.state.overlay = node;

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