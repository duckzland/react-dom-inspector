import React from 'react';
import ReactDOM from 'react-dom';
import Iterator from './modules/Iterator';
import DOMHelper from './modules/DOMHelper';
import FontLoader from './modules/FontLoader';
import InspectorPanel from './views/Inspector';
import EditorPanel from './views/Editor';
import Overlay from './views/Overlay';
import { forEach, get } from 'lodash';
import './../assets/styles.less';

/**
 * Main Inspector Component for generating the inspector and editor element
 *
 * @author jason.xie@victheme.com
 */
export default class Inspector extends React.Component {

    state = {
        minimize: false,
        node: false,
        hover: false,
        saving: false,
        vertical: false,
        refresh: false,
        overlay: {}
    };

    eventBinded = {
        click: false,
        mousemove: false
    };

    config = {
        domID: 'dom-inspector'
    };
    allowNavigator = true;
    iterator = false;
    DOMHelper = false;
    hoverCache = false;

    constructor(props) {
        super(props);
        if ('minimize' in props) {
            this.state.minimize = props.minimize;
        }
        if ('allowNavigator' in props) {
            this.allowNavigator = props.allowNavigator;
        }
        if ('config' in props) {
            this.config = props.config;
        }
        this.iterator = new Iterator();
        this.DOMHelper = new DOMHelper();

        if (this.config.googleFontAPI) {
            this.fontLoader = new FontLoader(this.config.googleFontApi);
        }

        this.cloneSheet();
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
        this.state.refresh = false;
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
        let mountNode = ReactDOM.findDOMNode(document.getElementById(this.config.domID));
        let unmount = ReactDOM.unmountComponentAtNode(mountNode);
        if (unmount) {
            this.destroyEvent();
            document.body.removeAttribute('stylizer-active');
            this.iterator.destroy();
        }
    };

    cloneSheet = () => {
        let sheet = document.createElement('style');
        sheet.id = 'stylizer-source';
        sheet.innerHTML = document.getElementById('stylizer-original').innerHTML;
        sheet.classList.add('stylizer-sheet');
        document.body.appendChild(sheet);
    };

    revertData = () => {
        let sheet = document.getElementById('stylizer-source');
        sheet && document.body.removeChild(sheet);
        this.cloneSheet();
        this.setState({refresh: true});
    };

    // @todo expand this with props hooks to save to database with ajax!
    saveData = () => {

    };

    setActiveNode = (node) => {
        this.setState({
            node: node
        });
    };

    detectIfInsideStylizer = (node) => {
        return this.DOMHelper.closest(node, {id: 'dom-inspector', className: '\\bstylizer\\b', hasAttribute: 'stylizer-inspector'}, 'boolean');
    };

    retrieveOrBuildStorage = (node) => {
        let tracker = this.DOMHelper.closest(node, {hasAttribute: 'stylizer-uuid'}, 'both');
        if (tracker.depth > 1) {
            let Store = this.iterator.find(tracker.node.getAttribute('stylizer-uuid'));
            this.iterator.iterate(tracker.node, Store, Store.depth, Store.depth + tracker.depth, Store.tree);
        }

        tracker = null;
        let targetNode = this.iterator.find(node.getAttribute('stylizer-uuid'));
        return targetNode ? targetNode : false;
    };

    captureNode = (e) => {
        let node = e.target;
        if (node.nodeName.toLowerCase() === 'a') {
            e.preventDefault();
        }

        if (this.detectIfInsideStylizer(node)
            || node.nodeName.toLowerCase().match(new RegExp('(img|style|script|link)', 'g'))) {
            return true;
        }

        let StoreObject = this.retrieveOrBuildStorage(node);
        if (StoreObject) {
            this.setState({
                node: StoreObject,
                hover: false,
                overlay: false
            });
        }
    };

    moveOverlay = (e) => {
        let node = e.target;

        if (this.detectIfInsideStylizer(node)
            || node.nodeName.toLowerCase().match(new RegExp('(img|style|script|link|html|body)', 'g'))) {
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
            this.setState({
                node: StoreObject
            });
        }
    };

    render() {
        const { config, state, props, allowNavigator } = this;
        const { iterator, editor } = props;

        const inspectorProps = get(config, 'inspectorProps', {
            key: 'stylizer-inspector',
            className: [ 'stylizer-inspector', state.minimize ? 'minimize' : null, !allowNavigator ? 'no-navigator' : null ].join(' '),
            'stylizer-inspector': "true"
        });

        const inspectorPanelProps = get(config, 'inspectorPanelProps', {
            key: 'stylizer-inspector-element',
            config: iterator,
            root: this,
            iterator: this.iterator,
            node: state.activateNode,
            refresh: state.refresh
        });

        const editorPanelProps = get(config, 'editorPanelProps', {
            key: 'stylizer-editor-element',
            config: editor,
            root: this,
            node: state.node,
            refresh: state.refresh
        });

        const overlayProps = get(config, 'overlayProps', {
            node: state.overlay
        });

        return (
            <div { ...inspectorProps }>
                { allowNavigator && <InspectorPanel { ...inspectorPanelProps }/> }
                <EditorPanel { ...editorPanelProps } />
                <Overlay { ...overlayProps } />
            </div>
        )
    };
}