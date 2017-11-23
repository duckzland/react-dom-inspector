import React from 'react';
import ScrollArea from 'react-scrollbar';
import { get } from 'lodash';
import HamburgerIcon from '../../node_modules/react-icons/lib/io/navicon-round';
import HoverIcon from '../../node_modules/react-icons/lib/io/compose';
import RevertIcon from '../../node_modules/react-icons/lib/io/trash-b';
import CloseIcon from '../../node_modules/react-icons/lib/io/close';
import SaveIcon from '../../node_modules/react-icons/lib/io/refresh';
import LayoutIcon from '../../node_modules/react-icons/lib/io/code-working';
import DOMHelper from '../modules/DOMHelper';
import BorderPanel from './Panels/Border';
import PositionPanel from './Panels/Position';
import SelectorPanel from './Panels/Selector';
import SpacingPanel from './Panels/Spacing';
import StylesPanel from './Panels/Styles';
import TypographyPanel from './Panels/Typography';


export default class Editor extends React.Component {

    state = {
        active: 'spacing',
        node: false,
        root: false,
        errors: {}
    };

    styleElement = false;

    config = {
        headerText: 'Editor',
        emptyText: 'No Element Selected'
    };

    constructor(props) {
        super(props);

        this.styleElement = (new DOMHelper()).styleSheet({id: 'stylizer-source'}, 'style');

        if ('config' in props)  {
            Object.assign(this.config, props.config);
        }

        if ('node' in props) {
            this.state.node = props.node;
        }

        if ('root' in props) {
            this.state.root = props.root;
        }
    };

    componentWillReceiveProps(nextProps) {
        if ('refresh' in nextProps && nextProps.refresh) {
            this.styleElement = (new DOMHelper()).styleSheet({id: 'stylizer-source'}, 'style');
        }
        this.state.node = nextProps.node;
        this.getStyling();
    }

    getStyling = () => {
        this.state.node && 'generateStyling' in this.state.node && this.state.node.generateStyling();
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

        (name !== 'selector') ? node.storeStyling(name, value) : node.storeSelector(value);

        styleElement.insertRule(node.getStyling());

        return this;
    };

    onChangeTab = (tabKey) => {
        this.setState({ active: tabKey });
    };

    onScroll = (value) => {
        this.setState({ scroll: value});
    };

    render() {

        let { onScroll, onChangeTab, state, config } = this;
        let ActivePanel = [];

        const { root, node } = state;
        const { minimize } = root.state;
        const AllowedTabs = ['selector', 'spacing', 'border', 'styles', 'typography'];

        const editorProps = get(config, 'editorProps', {
            key: 'stylizer-editor-panel',
            className: 'stylizer-panels stylizer-editor-panel'
        });

        const headerProps = get(config, 'headerProps', {
            key: 'stylizer-editor-header',
            className: 'stylizer-header'
        });

        const headerTextProps = get(config, 'headerTextProps', {
            key: 'stylizer-editor-header-text',
            className: 'stylizer-header-text'
        });

        const headerActionProps = get(config, 'headerActionProps', {
            key: 'stylizer-editor-header-actions',
            className: 'stylizer-header-actions'
        });

        const layoutIconProps = get(config, 'layoutIconProps', {
            size: 16,
            transform: root.state.vertical === false ? 'rotate(90)' : '',
            onClick: () => root.toggleLayout()
        });

        const hoverIconProps = get(config, 'hoverIconProps', {
            size: 16,
            color: root.state.hover ? '#13a6d9' : '',
            onClick: () => root.toggleHoverInspector()
        });

        const revertIconProps = get(config, 'revertIconProps', {
            size: 16,
            onClick: () => root.revertData()
        });

        const saveIconProps = get(config, 'saveIconProps', {
            size: 16,
            onClick: () => root.saveData()
        });

        const closeIconProps = get(config, 'closeIconProps', {
            size: 16,
            onClick: () => root.killApp()
        });

        const hamburgerIconProps = get(config, 'hamburgerIconProps', {
            size: 16,
            onClick: () => root.toggleMinimize()
        });

        const tabsWrapperProps = get(config, 'tabsWrapperProps', {
            key: 'stylizer-tabs-wrapper',
            className: 'stylizer-tabs-wrapper'
        });

        const tabsProps = get(config, 'tabsProps', {
            key: 'stylizer-tabs',
            className: 'stylizer-tabs'
        });

        const scrollAreaProps = get(config, 'scrollAreaProps', {
            key: "stylizer-tab-contents",
            speed: 0.8,
            className: "stylizer-tabs-contents",
            contentClassName: "content",
            horizontal: true,
            onScroll: onScroll,
        });

        const emptyProps = get(config, 'emptyProps', {
            className: 'stylizer-selector-empty'
        });

        const panelProps = get(config, 'panelProps', {
            key: 'stylizer-active-panel-' + (node && node.uuid ? node.uuid : 'empty'),
            root: this,
            scroll: state.scroll
        });

        switch (state.active) {
            case 'selector' :
                ActivePanel.push(<SelectorPanel { ...state } { ...panelProps }/>);
                break;
            case 'border' :
                ActivePanel.push(<BorderPanel { ...state } { ...panelProps } />);
                break;
            case 'spacing' :
                ActivePanel.push(<SpacingPanel { ...state } { ...panelProps } />);
                break;
            case 'styles' :
                ActivePanel.push(<StylesPanel { ...state } { ...panelProps } />);
                break;
            case 'typography' :
                ActivePanel.push(<TypographyPanel { ...state } { ...panelProps } />);
                break;
        }

        return (
            <div { ...editorProps }>
                <h3 { ...headerProps }>
                    <span { ...headerTextProps }>
                        { config.headerText }
                    </span>
                    <span { ...headerActionProps }>
                        { !minimize && <LayoutIcon { ...layoutIconProps } /> }
                        { !minimize && <HoverIcon { ...hoverIconProps } /> }
                        { !minimize && <RevertIcon { ...revertIconProps } /> }
                        { !minimize && <SaveIcon { ...saveIconProps } /> }
                        { !minimize && <CloseIcon { ...closeIconProps } /> }
                        <HamburgerIcon { ...hamburgerIconProps } />
                    </span>
                </h3>

                { node
                    ? <div { ...tabsWrapperProps }>
                        <div { ...tabsProps }>
                            { AllowedTabs.map((TabKey) => {
                                const selectorItemProps = get(config, 'selectorItemProps', {
                                    key: get(config, 'panelItemPrefix', 'stylizer-tab-') + TabKey,
                                    className: [ get(config, 'panelItemPrefix', 'stylizer-tab-') + 'element', state.active === TabKey ? 'active' : null ].join(' '),
                                    onClick: () => onChangeTab(TabKey)
                                });

                                return ( <div { ...selectorItemProps }>{ TabKey }</div> )
                            }) }
                        </div>
                        <ScrollArea { ...scrollAreaProps }>{ ActivePanel }</ScrollArea>
                    </div>

                    : <div { ...tabsWrapperProps }>
                        <div { ...emptyProps }>{ config.emptyText }</div>
                    </div>
                }
            </div>
        )
    };
}