import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import Iterator from './modules/Iterator';
import DOMHelper from './modules/DOMHelper';
import FontLoader from './modules/FontLoader';
import ImageLoader from './modules/ImageLoader';
import Configurator from './modules/Config';
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

    config = false;
    allowNavigator = true;
    iteratorHelper = false;
    DOMHelper = false;
    hoverCache = false;
    fontLoader = false;

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
        
        this.iteratorHelper = new Iterator();
        this.DOMHelper = new DOMHelper();
        this.fontLoader = new FontLoader(get(this, 'config.googleFontApi', false));

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
        const { config } = this;
        const mountNode = ReactDOM.findDOMNode(document.getElementById(config.get('domID')));
        const unmount = ReactDOM.unmountComponentAtNode(mountNode);
        if (unmount) {
            this.destroyEvent();
            document.body.removeAttribute('stylizer-active');
            this.iteratorHelper.destroy();
        }
    };

    cloneSheet = () => {
        let sheet = document.createElement('style');
        sheet.id = 'stylizer-source';
        sheet.innerHTML = document.getElementById('stylizer-original').innerHTML;
        sheet.classList.add('stylizer-sheet');
        document.body.appendChild(sheet);
    };

    wipeData = () => {
        const { props, convertData } = this;
        const storage = document.getElementById('stylizer-source');
        const sheet = storage.sheet ? storage.sheet : storage.styleSheet;

        storage
            && props
            && props.onWipe
            && props.onWipe(convertData(storage));

        sheet
            && sheet.cssRules
            && forEach(sheet.cssRules, (rule, delta) => {
                if ('removeRule' in sheet) {
                    sheet.removeRule(delta);
                }
                else if ('deleteRule' in sheet) {
                    sheet.deleteRule(0);
                }
            });

        this.setState({ refresh: true });
    };

    revertData = () => {
        const { props, convertData, cloneSheet } = this;
        const storage = document.getElementById('stylizer-source');

        storage
            && props
            && props.onRevert
            && props.onRevert(convertData(storage));

        storage
            && document.body.removeChild(storage)
            && cloneSheet();

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
        const { props, convertData } = this;
        const storage = document.getElementById('stylizer-source');

        storage
            && props
            && props.onSave
            && props.onSave(convertData(storage));

        return true;
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

        if (this.detectIfInsideStylizer(node)
            || node.nodeName.toLowerCase().match(new RegExp('(img|style|script|link)', 'g'))) {
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

        if (this.detectIfInsideStylizer(node)
            || node.nodeName.toLowerCase().match(new RegExp('(img|style|script|link|html|body)', 'g'))) {
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

    render() {
        const { config, state, props, allowNavigator, DOMHelper, iteratorHelper } = this;
        const { iterator, editor } = props;

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
            refresh: state.refresh
        });

        const editorPanelProps = config.get('editorPanelProps', {
            key: 'stylizer-editor-element',
            config: editor,
            root: this,
            node: state.node,
            DOMHelper: DOMHelper,
            refresh: state.refresh
        });

        const overlayProps = config.get('overlayProps', {
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