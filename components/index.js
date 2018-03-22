import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import Iterator from './modules/Iterator';
import DOMHelper from './modules/DOMHelper';
import Parser from './modules/Parser';
import Configurator from './modules/Config';
import ControlBar from './views/ControlBar';
import MessageBox from './views/MessageBox';
import InspectorPanel from './views/Inspector';
import EditorPanel from './views/Editor';
import AdvancedPanel from './views/Advanced';
import Overlay from './views/Overlay';
import { forEach, get, isFunction } from 'lodash';
import './../assets/styles.less';
import './../assets/codemirror.less';

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
        overlay: {},
        frameLoaded: false,
        viewmode: 'desktop',
        advanced: false
    };

    eventBinded = {
        click: false,
        mousemove: false
    };

    config = false;
    allowNavigator = true;
    iteratorHelper = false;
    DOMHelper = false;
    hoverCache = false;
    fontLoader = false;
    document = false;
    messageBox = false;

    constructor(props) {
        super(props);

        if ('minimize' in props) {
            this.state.minimize = props.minimize;
        }

        if ('allowNavigator' in props) {
            this.allowNavigator = props.allowNavigator;
        }

        this.config = new Configurator({
            domID: 'dom-inspector'
        });
        
        if ('config' in props) {
            this.config.insert(props.config);
        }
        
        this.iteratorHelper = new Iterator({
            root: this,
            sheetID: this.getStyleSourceID()
        });

        this.generateFrame();
    };

    componentWillMount() {
        document.body.setAttribute('stylizer-active', this.state.minimize ? 'true' : 'false');
        document.body.setAttribute('stylizer-vertical', this.state.vertical ? 'true' : 'false');
        document.body.setAttribute('stylizer-viewmode', this.state.viewmode);
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
            this.document.addEventListener('click', this.captureNode, false);
            this.eventBinded.click = true;
        }

        if (!this.eventBinded.mousemove && (event === 'mousemove' || event === 'all')) {
            this.document.addEventListener('mousemove', this.moveOverlay, false);
            this.eventBinded.mousemove = true;
        }
    };

    destroyEvent = (event = 'all') => {
        if (this.eventBinded.click && (event === 'click' || event === 'all')) {
            this.document.removeEventListener('click', this.captureNode);
            this.eventBinded.click = false;
        }

        if (this.eventBinded.mousemove && (event === 'mousemove' || event === 'all')) {
            this.document.removeEventListener('mousemove', this.moveOverlay);
            this.eventBinded.mousemove = false;
        }
    };

    generateFrame = () => {
        const { config } = this;
        const mountNode = ReactDOM.findDOMNode(document.getElementById(config.get('domID')));
        const frameReadyFunction = get(window, mountNode.getAttribute('data-onframeready'));
        const frameAppendFunction = get(window, mountNode.getAttribute('data-onframeappend'));
        const frameBeforeUnloadFunction = get(window, mountNode.getAttribute('data-onframebeforeunload'));

        this.setState({ frameLoaded: false });
        this.frameWrapper = document.getElementById('stylizer-frame-wrapper');
        this.frame = document.createElement('iframe');
        this.frame.classList.add('stylizer-' + this.state.viewmode);
        this.frame.setAttribute('id', 'stylizer-frame');
        this.frame.setAttribute('scrolling', 'no');
        this.frame.setAttribute('width', '100%');
        this.frame.setAttribute('height', '100%');
        this.frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        this.frame.setAttribute('src', this.config.get('pageSrc'));
        this.frame.onbeforeunload = (e) => {
            isFunction(frameBeforeUnloadFunction) && frameBeforeUnloadFunction(e, this);
        };
        this.frame.onload = (e) => {
            this.document = this.frame.contentWindow.document;
            this.DOMHelper = new DOMHelper(this.document);

            this.resizeFrame();
            this.cloneSheet();

            this.state.hover ? this.bindEvent('mousemove') : this.destroyEvent('mousemove');
            this.state.minimize ? this.destroyEvent('all') : this.bindEvent('click');

            isFunction(frameReadyFunction) && frameReadyFunction(e, this);

            this.setState({ frameLoaded: true });
        };

        this.frameWrapper.appendChild(this.frame);

        isFunction(frameAppendFunction) && frameAppendFunction(this.frame, this);
    };

    resizeFrame = () => {
        this.frame.style.height = Math.max(
            this.document.body.scrollHeight, this.document.documentElement.scrollHeight,
            this.document.body.offsetHeight, this.document.documentElement.offsetHeight,
            this.document.body.clientHeight, this.document.documentElement.clientHeight
        ) + 'px';
    };

    toggleMinimize = () => {
        this.setState({ minimize: !this.state.minimize });
    };

    toggleHoverInspector = () => {
        this.setState({ hover: !this.state.hover });
    };

    toggleLayout = () => {
        this.setState({ vertical: !this.state.vertical });
        this.resizeFrame();
    };

    toggleViewMode = (mode) => {
        this.state.viewmode = mode;
        this.state.refresh = true;
        this.frame.classList.remove('stylizer-desktop');
        this.frame.classList.remove('stylizer-tablet');
        this.frame.classList.remove('stylizer-mobile');
        this.frame.classList.add('stylizer-' + mode);
        document.body.setAttribute('stylizer-viewmode', this.state.viewmode);
        this.resizeFrame();
        this.iteratorHelper.reset();
        this.setState(this.state);
    };

    toggleEditorMode = () => {
        //
        this.setState({
            advanced: !this.state.advanced
        });
    };

    killApp = () => {
        const { config } = this;
        const mountNode = ReactDOM.findDOMNode(document.getElementById(config.get('domID')));
        const killFunction = get(window, mountNode.getAttribute('data-onkill'));
        const unmount = ReactDOM.unmountComponentAtNode(mountNode);

        if (unmount) {
            this.destroyEvent();
            document.body.removeAttribute('stylizer-active');
            this.iteratorHelper.destroy();
        }

        isFunction(killFunction) && killFunction();
    };

    prepareSheet = () => {
        !this.state.sheetPrepared
            && ['desktop', 'tablet', 'mobile'].map((type) => {
                const sheet = this.document.getElementById('stylizer-original-' + type);
                sheet.getAttribute('media')
                    && sheet.setAttribute('media-original', sheet.getAttribute('media'));

                sheet.setAttribute('media', 'max-width: 1px');
            });

        this.state.sheetPrepared = true;
    };

    cloneSheet = () => {

        this.prepareSheet();

        ['desktop', 'tablet', 'mobile'].map((type) => {
            const original = this.document.getElementById('stylizer-original-' + type);
            const sheet = this.document.createElement('style');
            const mediaAttr = original.getAttribute('media-original');

            sheet.id = 'stylizer-source-' + type;
            sheet.innerHTML = original.innerHTML;
            sheet.classList.add('stylizer-sheet');
            mediaAttr && sheet.setAttribute('media', mediaAttr);

            this.document.body.appendChild(sheet);
        });
    };

    wipeData = () => {
        const { convertData, config } = this;
        const mountNode = ReactDOM.findDOMNode(document.getElementById(config.get('domID')));
        const wipeFunction = get(window, mountNode.getAttribute('data-onwipe'));

        ['desktop', 'tablet', 'mobile'].map((type) => {
            const storage = this.document.getElementById('stylizer-source-' + type);
            const sheet = storage.sheet ? storage.sheet : storage.styleSheet;
            storage
                && isFunction(wipeFunction)
                && wipeFunction(convertData(storage), type, this);

            sheet
                && sheet.cssRules
                && forEach(sheet.cssRules, (rule, delta) => {
                    sheet.deleteRule(0);
                });
        });

        this.setState({ refresh: true });
    };
    
    getStyleOriginalID = () => {
        return this.state.viewmode ? 'stylizer-original-' + this.state.viewmode : 'stylizer-original-desktop';
    };
    
    getStyleSourceID = () => {
        return this.state.viewmode ? 'stylizer-source-' + this.state.viewmode : 'stylizer-source-desktop';
    };
    
    revertData = () => {
        const { convertData, cloneSheet, config } = this;
        const mountNode = ReactDOM.findDOMNode(document.getElementById(config.get('domID')));
        const revertFunction = get(window, mountNode.getAttribute('data-onrevert'));

        ['desktop', 'tablet', 'mobile'].map((type) => {
            const storage = this.document.getElementById('stylizer-source-' + type);
            storage
                && isFunction(revertFunction)
                && revertFunction(convertData(storage), type, this);

            storage
                && this.document.body.removeChild(storage)
        });

        cloneSheet();

        this.setState({ refresh: true });
    };

    convertData = (storage) => {
        const result = {
            storage: storage,
            styles: [],
            cssText: ''
        };

        const sheet = storage.sheet ? storage.sheet : storage.styleSheet;

        sheet
            && sheet.cssRules
            && forEach(sheet.cssRules, (rule) => {
                result.styles.push(rule.cssText);
            });

        result.cssText = result.styles.join("\n");

        return result;
    };

    saveData = () => {
        const { convertData, config } = this;
        const mountNode = ReactDOM.findDOMNode(document.getElementById(config.get('domID')));
        const saveFunction = get(window, mountNode.getAttribute('data-onsave'));

        ['desktop', 'tablet', 'mobile'].map((type) => {
            const storage = this.document.getElementById('stylizer-source-' + type);
            storage
                && isFunction(saveFunction)
                && saveFunction(convertData(storage), type, this);
        });

        return true;
    };

    setActiveNode = (node) => {
        this.setState({ node: node });
    };

    retrieveOrBuildStorage = (node) => {
        let tracker = this.DOMHelper.closest(node, {hasAttribute: 'stylizer-uuid'}, 'both');
        if (tracker.depth > 1) {
            let Store = this.iteratorHelper.find(tracker.node.getAttribute('stylizer-uuid'));
            this.iteratorHelper.iterate(tracker.node, Store, Store.depth, Store.depth + tracker.depth, Store.tree);
        }

        tracker = null;
        let targetNode = this.iteratorHelper.find(node.getAttribute('stylizer-uuid'));
        return targetNode ? targetNode : false;
    };

    captureNode = (e) => {
        const node = e.target;
        if (node.nodeName.toLowerCase() === 'a') {
            e.preventDefault();
        }

        if (node.nodeName.toLowerCase().match(new RegExp('(img|style|script|link)', 'g'))) {
            return true;
        }

        const StoreObject = this.retrieveOrBuildStorage(node);
        StoreObject && this.setState({
            node: StoreObject,
            hover: false,
            overlay: false
        });
    };

    moveOverlay = (e) => {
        const node = e.target;

        if (node.nodeName.toLowerCase().match(new RegExp('(img|style|script|link|html|body)', 'g'))) {
            this.hoverCache = false;
            this.setState({ overlay: false });
            return true;
        }

        if (this.hoverCache === e) {
            return true;
        }

        this.hoverCache = e;
        this.state.overlay = node;

        const StoreObject = this.retrieveOrBuildStorage(node);
        StoreObject && this.setState({
            node: StoreObject
        });
    };

    setMessage = (type, text, duration) => {
        if (!this.messageBox && this.refs.messageBox) {
            this.messageBox = this.refs.messageBox;
        }
        this.messageBox && this.messageBox.set(type, text, duration);
    };

    render() {
        const { config, state, props, allowNavigator, DOMHelper, iteratorHelper } = this;
        const { iterator, editor, controlbar } = props;

        const controllBarProps = config.get('controlBarProps', {
            key: 'stylizer-controlbar-element',
            config: controlbar,
            root: this,
            refresh: state.refresh
        });

        const inspectorProps = config.get('inspectorProps', {
            key: 'stylizer-inspector',
            className: [ 'stylizer-inspector', state.minimize ? 'minimize' : null, !allowNavigator ? 'no-navigator' : null ].join(' '),
            'stylizer-inspector': "true"
        });

        const inspectorPanelProps = config.get('inspectorPanelProps', {
            key: 'stylizer-inspector-element',
            config: iterator,
            root: this,
            iterator: iteratorHelper,
            node: state.node,
            document: this.document,
            stylizerID: this.getStyleSourceID(),
            refresh: state.refresh
        });

        const editorPanelProps = config.get('editorPanelProps', {
            key: 'stylizer-editor-element',
            config: editor,
            root: this,
            node: state.node,
            DOMHelper: DOMHelper,
            document: this.document,
            stylizerID: this.getStyleSourceID(),
            refresh: state.refresh
        });

        const advancedPanelProps = config.get('advancedPanelProps', {
            key: 'stylizer-editor-element',
            config: editor,
            root: this,
            node: state.node,
            DOMHelper: DOMHelper,
            document: this.document,
            stylizerID: this.getStyleSourceID(),
            refresh: state.refresh
        });

        const overlayProps = config.get('overlayProps', {
            frame: this.frame,
            wrapper: this.frameWrapper,
            node: state.overlay
        });

        const messageProps = config.get('messageProps', {
            ref: 'messageBox',
            root: this
        });

        return (
            <div { ...inspectorProps }>
                <ControlBar { ...controllBarProps } />
                { state.frameLoaded && !state.advanced && allowNavigator && <InspectorPanel { ...inspectorPanelProps }/> }
                { state.frameLoaded && !state.advanced && <EditorPanel { ...editorPanelProps } /> }
                { state.frameLoaded && !state.advanced && <Overlay { ...overlayProps } /> }
                { state.frameLoaded && state.advanced && <AdvancedPanel { ...advancedPanelProps } /> }
                { state.frameLoaded && <MessageBox { ...messageProps } /> }
                { !state.frameLoaded && <div className="loading-bar" /> }
            </div>
        )
    };
}