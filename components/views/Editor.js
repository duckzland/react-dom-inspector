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
import SelectorPanel from './Panels/Selector';
import SpacingPanel from './Panels/Spacing';
import StylesPanel from './Panels/Styles';
import TypographyPanel from './Panels/Typography';


export default class Editor extends React.Component {

    state = {
        active: 'typography',
        node: false,
        root: false,
        errors: {}
    };

    styleElement = false;

    config = {
        EditorPanelHeaderText: 'Editor',
        EditorPanelEmptyText: 'No Element Selected'
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

    render() {

        let { onChangeTab, state, config } = this;
        let ActivePanel = [];

        const { root, node } = state;
        const { minimize } = root.state;
        const AllowedTabs = ['selector', 'spacing', 'border', 'styles', 'typography'];

        const editorProps = get(config, 'EditorPanelEditorProps', {
            key: 'stylizer-editor-panel',
            className: 'stylizer-panels stylizer-editor-panel'
        });

        const headerProps = get(config, 'EditorPanelHeaderProps', {
            key: 'stylizer-editor-header',
            className: 'stylizer-header'
        });

        const headerTextProps = get(config, 'EditorPanelHeaderTextProps', {
            key: 'stylizer-editor-header-text',
            className: 'stylizer-header-text'
        });

        const headerActionProps = get(config, 'EditorPanelHeaderActionProps', {
            key: 'stylizer-editor-header-actions',
            className: 'stylizer-header-actions'
        });

        const layoutIconProps = get(config, 'EditorPanelLayoutIconProps', {
            size: 16,
            transform: root.state.vertical === false ? 'rotate(90)' : '',
            onClick: () => root.toggleLayout()
        });

        const hoverIconProps = get(config, 'EditorPanelHoverIconProps', {
            size: 16,
            color: root.state.hover ? '#13a6d9' : '',
            onClick: () => root.toggleHoverInspector()
        });

        const revertIconProps = get(config, 'EditorPanelRevertIconProps', {
            size: 16,
            onClick: () => root.revertData()
        });

        const saveIconProps = get(config, 'EditorPanelSaveIconProps', {
            size: 16,
            onClick: () => root.saveData()
        });

        const closeIconProps = get(config, 'EditorPanelCloseIconProps', {
            size: 16,
            onClick: () => root.killApp()
        });

        const hamburgerIconProps = get(config, 'EditorPanelHamburgerIconProps', {
            size: 16,
            onClick: () => root.toggleMinimize()
        });

        const tabsWrapperProps = get(config, 'EditorPanelTabsWrapperProps', {
            key: 'stylizer-tabs-wrapper',
            className: 'stylizer-tabs-wrapper'
        });

        const tabsProps = get(config, 'EditorPanelTabsProps', {
            key: 'stylizer-tabs',
            className: 'stylizer-tabs'
        });

        const emptyProps = get(config, 'EditorPanelEmptyProps', {
            className: 'stylizer-selector-empty'
        });

        const panelProps = get(config, 'EditorPanelPanelProps', {
            key: 'stylizer-active-panel-' + (node && node.uuid ? node.uuid : 'empty'),
            root: this,
            scroll: state.scroll,
            config: this.config
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
                        { config.EditorPanelHeaderText }
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
                                const selectorItemProps = get(config, 'EditorPanelSelectorItemProps', {
                                    key: get(config, 'EditorPanelPanelItemPrefix', 'stylizer-tab-') + TabKey,
                                    className: [ get(config, 'EditorPanelPanelItemPrefix', 'stylizer-tab-') + 'element', state.active === TabKey ? 'active' : null ].join(' '),
                                    onClick: () => onChangeTab(TabKey)
                                });

                                return ( <div { ...selectorItemProps }>{ TabKey }</div> )
                            }) }
                        </div>
                        { ActivePanel }
                    </div>

                    : <div { ...tabsWrapperProps }>
                        <div { ...emptyProps }>{ config.EditorPanelEmptyText }</div>
                    </div>
                }
            </div>
        )
    };
}