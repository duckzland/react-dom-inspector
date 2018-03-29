import React from 'react';
import ScrollArea from 'react-scrollbar';
import { get } from 'lodash';
import HamburgerIcon from '../../node_modules/react-icons/lib/io/navicon-round';
import DOMHelper from '../modules/DOMHelper';
import Configurator from '../modules/Config';
import FontLoader from '../modules/FontLoader';
import ImageLoader from '../modules/ImageLoader';
import BorderPanel from './Panels/Border';
import SelectorPanel from './Panels/Selector';
import SpacingPanel from './Panels/Spacing';
import StylesPanel from './Panels/Styles';
import TypographyPanel from './Panels/Typography';
import LayoutPanel from './Panels/Layout';

/**
 * Class for generating the Editor element markup
 *
 * @author jason.xie@victheme.com
 */
export default class Editor extends React.Component {

    state = {
        active: 'selector',
        node: false,
        root: false,
        errors: {}
    };

    styleElement = false;
    config = false;

    constructor(props) {
        super(props);

        this.config = 'config' in props ? props.config : new Configurator();
        
        this.styleElement = (new DOMHelper(props.document)).styleSheet({ id: props.stylizerID }, 'style');

        if ('node' in props) {
            this.state.node = props.node;
        }

        if ('root' in props) {
            this.state.root = props.root;
        }

        if (this.config.get('googleFontAPI') && !props.fontLoader) {
            (new FontLoader(this.config.get('googleFontAPI')));
        }

        if (this.config.get('imageLoader.loader') && this.config.get('imageLoader.fetch')) {
            (new ImageLoader(this.config.get('imageLoader.loader'), [])).fetch();
        }
    };

    componentWillReceiveProps(nextProps) {
        let reset = false;
        if ('refresh' in nextProps && nextProps.refresh) {
            this.styleElement = (new DOMHelper(nextProps.document)).styleSheet({id: nextProps.root.getStyleSourceID()}, 'style');
            reset = true;
        }
        this.state.node = nextProps.node;
        this.getStyling(reset);
    };

    getStyling = (reset = false) => {
        this.state.node && 'generateStyling' in this.state.node && this.state.node.generateStyling(reset);
    };

    rebuildStyling = (e) => {

        const { name, value } = e.target;
        const { styleElement, state } = this;
        const { node } = state;

        for (var i = 0; i < styleElement.cssRules.length; i++) {
            if (styleElement.cssRules[i].selectorText === node.selector) {
                styleElement.deleteRule(i);
            }
        }
        (name !== 'selector') ? node.storeStyle(name, value) : node.storeSelector(value);

        styleElement.insertRule(node.getStyling(), styleElement.cssRules.length);

        return this;
    };

    onChangeTab = (tabKey) => {
        this.setState({ active: tabKey });
    };

    render() {

        let { onChangeTab, props, state, config } = this;
        let ActivePanel = [];

        const { root } = props;
        const { node } = state;
        const { polyglot } = root;

        const AllowedTabs = ['selector', 'layout', 'spacing', 'border', 'styles', 'typography'];

        const editorProps = config.get('editor.props.element', {
            key: 'stylizer-editor-panel',
            className: 'stylizer-panels stylizer-editor-panel'
        });

        const headerProps = config.get('editor.props.header', {
            key: 'stylizer-editor-header',
            className: 'stylizer-header'
        });

        const headerTextProps = config.get('editor.props.headerText', {
            key: 'stylizer-editor-header-text',
            className: 'stylizer-header-text'
        });

        const headerActionProps = config.get('editor.props.headerAction', {
            key: 'stylizer-editor-header-actions',
            className: 'stylizer-header-actions'
        });

        const hamburgerIconProps = config.get('editor.props.hamburgerIcon', {
            size: 16,
            onClick: () => root.toggleMinimize()
        });

        const hamburgerIconLabel = config.get('editor.props.hamburgerIconLabel', {
            title: polyglot.t('Minimize Editor')
        });

        const tabsWrapperProps = config.get('editor.props.tabsWrapper', {
            key: 'stylizer-tabs-wrapper',
            className: 'stylizer-tabs-wrapper'
        });

        const tabsProps = config.get('editor.props.panelTabs', {
            key: 'stylizer-tabs',
            className: 'stylizer-tabs'
        });

        const emptyProps = config.get('editor.props.empty', {
            className: 'stylizer-selector-empty'
        });

        const panelProps = config.get('editor.panel.panelElement', Object.assign(state, {
            key: 'stylizer-active-panel-' + (node && node.uuid ? node.uuid : 'empty'),
            root: this,
            mainRoot: props.root,
            scroll: state.scroll
        }));

        switch (state.active) {
            case 'selector' :
                ActivePanel.push(<SelectorPanel { ...panelProps } />);
                break;
            case 'layout' :
                ActivePanel.push(<LayoutPanel { ...panelProps } />);
                break;
            case 'border' :
                ActivePanel.push(<BorderPanel { ...panelProps } />);
                break;
            case 'spacing' :
                ActivePanel.push(<SpacingPanel { ...panelProps } />);
                break;
            case 'styles' :
                ActivePanel.push(<StylesPanel { ...panelProps } />);
                break;
            case 'typography' :
                ActivePanel.push(<TypographyPanel { ...panelProps } />);
                break;
        }

        return (
            <div { ...editorProps }>
                <h3 { ...headerProps }>
                    <span { ...headerTextProps }>
                        { polyglot.t('Editor') }
                    </span>
                    <span { ...headerActionProps }>
                        <span { ...hamburgerIconLabel }><HamburgerIcon { ...hamburgerIconProps } /></span>
                    </span>
                </h3>

                { node
                    ? <div { ...tabsWrapperProps }>
                        <div { ...tabsProps }>
                            { AllowedTabs.map((TabKey) => {
                                const selectorItemProps = config.get('editor.props.selectorItem', {
                                    key: config.get('editor.tabPrefix', 'stylizer-tab-') + TabKey,
                                    className: [ config.get('editor.tabPrefix', 'stylizer-tab-') + 'element', state.active === TabKey ? 'active' : null ].join(' '),
                                    onClick: () => onChangeTab(TabKey)
                                });

                                return ( <div { ...selectorItemProps }>{ TabKey }</div> )
                            }) }
                        </div>
                        { ActivePanel }
                    </div>

                    : <div { ...tabsWrapperProps }>
                        <div { ...emptyProps }>{ polyglot.t('No Element Selected') }</div>
                    </div>
                }

            </div>
        )
    };
}