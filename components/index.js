import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import Iterator from './modules/Iterator';
import DOMHelper from './modules/DOMHelper';
import Parser from './modules/Parser';
import FontLoader from './modules/FontLoader';
import Configurator from './modules/Config';
import ControlBar from './views/ControlBar';
import MessageBox from './views/MessageBox';
import InspectorPanel from './views/Inspector';
import EditorPanel from './views/Editor';
import AdvancedPanel from './views/Advanced';
import Overlay from './views/Overlay';
import { forEach, get, isFunction } from 'lodash';
import Polyglot from 'node-polyglot';
import './../assets/codemirror.less';
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
    frameDocument = false;
    messageBox = false;
    polyglot = false;

    constructor(props) {
        super(props);

        this.config = new Configurator({
            domID: 'dom-inspector'
        });
        
        if ('config' in props) {
            this.config.insert(props.config);
        }

        this.polyglot = new Polyglot();
        if ('translation' in props) {
            this.polyglot.extend(props.translation);
        }

        this.allowNavigator = this.config.get('allowNavigator', true);
        this.state.advanced = this.config.get('advancedMode', false);
        this.state.viewmode = this.config.get('viewmode', 'desktop');
        this.state.minimize = this.config.get('minimize', false);
        this.state.vertical = this.config.get('vertical', false);
        
        this.iteratorHelper = new Iterator({
            root: this,
            sheetID: this.getStyleSourceID()
        });

        this.generateFrame();
    };

    componentWillMount() {
        const { body } = document;
        const { minimize, vertical, viewmode } = this.state;

        body.setAttribute('stylizer-active', minimize ? 'true' : 'false');
        body.setAttribute('stylizer-vertical', vertical ? 'true' : 'false');
        body.setAttribute('stylizer-viewmode', viewmode);
    };

    componentDidUpdate() {
        const { body } = document;
        const { state, bindEvent, destroyEvent } = this;
        const { minimize, vertical, hover } = state;

        body.setAttribute('stylizer-active', minimize ? 'true' : 'false');
        body.setAttribute('stylizer-vertical', vertical ? 'true' : 'false');

        hover ? bindEvent('mousemove') : destroyEvent('mousemove');
        minimize ? destroyEvent('all') : bindEvent('click');

        state.activateNode = false;
        state.refresh = false;
    };

    bindEvent = (event = 'all') => {

        const { eventBinded, captureNode, moveOverlay, frameDocument } = this;

        if (!eventBinded.click && (event === 'click' || event === 'all')) {
            frameDocument.addEventListener('click', captureNode, false);
            eventBinded.click = true;
        }

        if (!eventBinded.mousemove && (event === 'mousemove' || event === 'all')) {
            frameDocument.addEventListener('mousemove', moveOverlay, false);
            eventBinded.mousemove = true;
        }
    };

    destroyEvent = (event = 'all') => {
        const { eventBinded, captureNode, moveOverlay, frameDocument } = this;

        if (eventBinded.click && (event === 'click' || event === 'all')) {
            frameDocument.removeEventListener('click', captureNode);
            eventBinded.click = false;
        }

        if (eventBinded.mousemove && (event === 'mousemove' || event === 'all')) {
            frameDocument.removeEventListener('mousemove', moveOverlay);
            eventBinded.mousemove = false;
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

        const { frame, frameWrapper, resizeFrame, cloneSheet, bindEvent, destroyEvent, state } = this;
        const { hover, minimize } = state;

        frame.classList.add('stylizer-' + this.state.viewmode);
        frame.setAttribute('id', 'stylizer-frame');
        frame.setAttribute('scrolling', 'no');
        frame.setAttribute('width', '100%');
        frame.setAttribute('height', '100%');
        frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        frame.setAttribute('src', this.config.get('pageSrc'));
        frame.onbeforeunload = (e) => {
            isFunction(frameBeforeUnloadFunction) && frameBeforeUnloadFunction(e, this);
        };
        frame.onload = (e) => {

            this.frameDocument = frame.contentWindow.document;
            this.DOMHelper = new DOMHelper(this.frameDocument);
            this.fontLoader = new FontLoader(this.config.get('googleFontAPI'), frame.contentWindow);

            resizeFrame();
            cloneSheet();

            hover ? bindEvent('mousemove') : destroyEvent('mousemove');
            minimize ? destroyEvent('all') : bindEvent('click');

            isFunction(frameReadyFunction) && frameReadyFunction(e, this);

            this.setState({ frameLoaded: true });

            // @bugfix wrong frame height size on boot
            resizeFrame();
        };

        frameWrapper.appendChild(frame);

        isFunction(frameAppendFunction) && frameAppendFunction(frame, this);
    };

    resizeFrame = () => {
        const { frame, frameDocument } = this;
        const { body, documentElement } = frameDocument;

        frame.style.height = Math.max(
                body.scrollHeight, documentElement.scrollHeight,
                body.offsetHeight, documentElement.offsetHeight,
                body.clientHeight, documentElement.clientHeight
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
        const { frame, state, resizeFrame, iteratorHelper } = this;
        const { body } = document;

        state.viewmode = mode;
        state.refresh = true;
        
        ['stylizer-desktop', 'stylizer-tablet', 'stylizer-mobile']
            .map(classText => frame.classList.remove(classText));

        frame.classList.add('stylizer-' + mode);
        body.setAttribute('stylizer-viewmode', state.viewmode);

        resizeFrame();
        iteratorHelper.reset();
        this.setState(state);
    };

    toggleEditorMode = () => {
        const { iteratorHelper, state} = this;

        iteratorHelper.reset();
        this.setState({
            advanced: !state.advanced
        });
    };

    killApp = () => {
        const { config, iteratorHelper, destroyEvent } = this;
        const mountNode = ReactDOM.findDOMNode(document.getElementById(config.get('domID')));
        const killFunction = get(window, mountNode.getAttribute('data-onkill'));
        const unmount = ReactDOM.unmountComponentAtNode(mountNode);

        if (unmount) {
            destroyEvent();
            document.body.removeAttribute('stylizer-active');
            iteratorHelper.destroy();
        }

        isFunction(killFunction) && killFunction();
    };

    prepareSheet = () => {
        const { state, frameDocument } = this;
        !state.sheetPrepared
            && ['desktop', 'tablet', 'mobile'].map((type) => {
                const sheet = frameDocument.getElementById('stylizer-original-' + type);
                sheet.getAttribute('media')
                    && sheet.setAttribute('media-original', sheet.getAttribute('media'));

                sheet.setAttribute('media', 'max-width: 1px');
            });

        state.sheetPrepared = true;
    };

    cloneSheet = () => {
        this.prepareSheet();

        const { frameDocument } = this;

        ['desktop', 'tablet', 'mobile'].map((type) => {
            const { fontLoader } = this;
            const original = frameDocument.getElementById('stylizer-original-' + type);
            const sheet = frameDocument.createElement('style');
            const mediaAttr = original.getAttribute('media-original');

            sheet.id = 'stylizer-source-' + type;
            sheet.innerHTML = original.innerHTML;
            sheet.classList.add('stylizer-sheet');
            mediaAttr && sheet.setAttribute('media', mediaAttr);

            frameDocument.body.appendChild(sheet);
            fontLoader.defer(fontLoader.parseFont, fontLoader, [sheet, true])
        });
    };

    wipeData = () => {
        const { convertData, config, frameDocument } = this;
        const mountNode = ReactDOM.findDOMNode(document.getElementById(config.get('domID')));
        const wipeFunction = get(window, mountNode.getAttribute('data-onwipe'));

        ['desktop', 'tablet', 'mobile'].map((type) => {

            const storage = frameDocument.getElementById('stylizer-source-' + type);
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
        const { viewmode } = this.state;
        return viewmode ? 'stylizer-original-' + viewmode : 'stylizer-original-desktop';
    };
    
    getStyleSourceID = () => {
        const { viewmode } = this.state;
        return viewmode ? 'stylizer-source-' + viewmode : 'stylizer-source-desktop';
    };
    
    revertData = () => {
        const { convertData, cloneSheet, config, frameDocument } = this;
        const mountNode = ReactDOM.findDOMNode(document.getElementById(config.get('domID')));
        const revertFunction = get(window, mountNode.getAttribute('data-onrevert'));

        ['desktop', 'tablet', 'mobile'].map((type) => {
            const storage = frameDocument.getElementById('stylizer-source-' + type);
            storage
                && isFunction(revertFunction)
                && revertFunction(convertData(storage), type, this);

            storage
                && frameDocument.body.removeChild(storage)
        });

        cloneSheet();

        this.setState({ refresh: true });
    };

    convertData = (storage) => {
        const { fontLoader } = this;
        const result = {
            storage: storage,
            styles: [],
            cssText: '',
            fonts: {}
        };

        const sheet = storage.sheet ? storage.sheet : storage.styleSheet;

        sheet
            && sheet.cssRules
            && forEach(sheet.cssRules, (rule) => {
                result.styles.push(rule.cssText);
            });

        result.cssText = result.styles.join("\n");

        result.fonts = fontLoader.parseFont(storage);

        return result;
    };

    saveData = () => {
        const { convertData, config, frameDocument } = this;
        const mountNode = ReactDOM.findDOMNode(document.getElementById(config.get('domID')));
        const saveFunction = get(window, mountNode.getAttribute('data-onsave'));

        ['desktop', 'tablet', 'mobile'].map((type) => {
            const storage = frameDocument.getElementById('stylizer-source-' + type);

            storage
                && isFunction(saveFunction)
                && saveFunction(convertData(storage), type, this);
        });

        return true;
    };

    parseFontFamily = () => {

    };

    setActiveNode = (node) => {
        this.setState({ node: node });
    };

    retrieveOrBuildStorage = (node) => {
        const { iteratorHelper, DOMHelper} = this;
        let tracker, Store, targetNode;

        tracker = DOMHelper.closest(node, { hasAttribute: 'stylizer-uuid' }, 'both');
        if (tracker.depth > 1) {
            Store = iteratorHelper.find(tracker.node.getAttribute('stylizer-uuid'));
            iteratorHelper.iterate(tracker.node, Store, Store.depth, Store.depth + tracker.depth, Store.tree);
        }

        tracker = null;
        targetNode = iteratorHelper.find(node.getAttribute('stylizer-uuid'));

        return targetNode ? targetNode : false;
    };

    captureNode = (e) => {
        const node = e.target;
        const { retrieveOrBuildStorage } = this;
        let StoreObject;

        if (node.nodeName.toLowerCase() === 'a') {
            e.preventDefault();
        }

        if (node.nodeName.toLowerCase().match(new RegExp('(img|style|script|link)', 'g'))) {
            return true;
        }

        StoreObject = retrieveOrBuildStorage(node);
        StoreObject && this.setState({
            node: StoreObject,
            hover: false,
            overlay: false
        });
    };

    moveOverlay = (e) => {
        const node = e.target;
        const { retrieveOrBuildStorage, state } = this;
        let StoreObject;

        if (node.nodeName.toLowerCase().match(new RegExp('(img|style|script|link|html|body)', 'g'))) {
            this.hoverCache = false;
            this.setState({ overlay: false });
            return true;
        }

        if (this.hoverCache === e) {
            return true;
        }

        this.hoverCache = e;
        state.overlay = node;

        StoreObject = retrieveOrBuildStorage(node);
        StoreObject && this.setState({
            node: StoreObject
        });
    };

    setMessage = (type, text, duration) => {
        const { refs } = this;
        let { messageBox } = this;

        if (!messageBox && refs.messageBox) {
            messageBox = refs.messageBox;
        }

        messageBox && messageBox.set(type, text, duration);
    };

    render() {
        const { config, state, props, allowNavigator, DOMHelper, iteratorHelper, fontLoader, getStyleSourceID, frame, frameWrapper, frameDocument, polyglot } = this;
        const { iterator, editor, controlbar } = props;
        const { refresh, minimize, node, overlay, advanced, frameLoaded } = state;

        const controllBarProps = config.get('controlBarProps', {
            key: 'stylizer-controlbar-element',
            config: controlbar,
            root: this,
            refresh: refresh
        });

        const inspectorProps = config.get('inspectorProps', {
            key: 'stylizer-inspector',
            className: [ 'stylizer-inspector', minimize ? 'minimize' : null, !allowNavigator ? 'no-navigator' : null ].join(' '),
            'stylizer-inspector': "true"
        });

        const inspectorPanelProps = config.get('inspectorPanelProps', {
            key: 'stylizer-inspector-element',
            config: iterator,
            root: this,
            iterator: iteratorHelper,
            node: node,
            document: frameDocument,
            stylizerID: getStyleSourceID(),
            refresh: refresh
        });

        const editorPanelProps = config.get('editorPanelProps', {
            key: 'stylizer-editor-element',
            config: editor,
            root: this,
            node: node,
            DOMHelper: DOMHelper,
            fontLoader: fontLoader,
            document: frameDocument,
            stylizerID: getStyleSourceID(),
            refresh: refresh
        });

        const advancedPanelProps = config.get('advancedPanelProps', {
            key: 'stylizer-editor-element',
            config: editor,
            root: this,
            node: node,
            DOMHelper: DOMHelper,
            document: frameDocument,
            stylizerID: getStyleSourceID(),
            refresh: refresh
        });

        const overlayProps = config.get('overlayProps', {
            frame: frame,
            wrapper: frameWrapper,
            node: overlay
        });

        const messageProps = config.get('messageProps', {
            ref: 'messageBox',
            root: this
        });

        const loaderProps = config.get('loaderProps', {
            className: 'stylizer-loading-bar',
            'data-text': polyglot.t('Loading ...')
        });

        return (
            <div { ...inspectorProps }>
                <ControlBar { ...controllBarProps } />
                { frameLoaded && !advanced && allowNavigator && <InspectorPanel { ...inspectorPanelProps }/> }
                { frameLoaded && !advanced && <EditorPanel { ...editorPanelProps } /> }
                { frameLoaded && !advanced && <Overlay { ...overlayProps } /> }
                { frameLoaded && advanced && <AdvancedPanel { ...advancedPanelProps } /> }
                { frameLoaded && <MessageBox { ...messageProps } /> }
                { !frameLoaded && <div { ...loaderProps } /> }
            </div>
        )
    };
}