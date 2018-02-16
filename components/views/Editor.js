import React from 'react';
import ScrollArea from 'react-scrollbar';
import { get } from 'lodash';
import HamburgerIcon from '../../node_modules/react-icons/lib/io/navicon-round';
import HoverIcon from '../../node_modules/react-icons/lib/io/compose';
import DeleteIcon from '../../node_modules/react-icons/lib/io/trash-b';
import RevertIcon from '../../node_modules/react-icons/lib/fa/refresh';
import CloseIcon from '../../node_modules/react-icons/lib/io/close';
import SaveIcon from '../../node_modules/react-icons/lib/fa/floppy-o';
import LayoutIcon from '../../node_modules/react-icons/lib/io/code-working';
import DOMHelper from '../modules/DOMHelper';
import Configurator from '../modules/Config';
import FontLoader from '../modules/FontLoader';
import ImageLoader from '../modules/ImageLoader';
import BorderPanel from './Panels/Border';
import SelectorPanel from './Panels/Selector';
import SpacingPanel from './Panels/Spacing';
import StylesPanel from './Panels/Styles';
import TypographyPanel from './Panels/Typography';

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
        
        this.config = new Configurator({
            stylizerID: 'stylizer-source',
            EditorPanelHeaderText: 'Editor',
            EditorPanelEmptyText: 'No Element Selected'
        });
        
        if ('config' in props)  {
            this.config.insert(props.config);
        }
        
        this.styleElement = (new DOMHelper()).styleSheet({ id: this.config.get('stylizerID') }, 'style');

        if ('node' in props) {
            this.state.node = props.node;
        }

        if ('root' in props) {
            this.state.root = props.root;
        }

        if (this.config.get('googleFontAPI')) {
            (new FontLoader(this.config.get('googleFontAPI')));
        }

        if (this.config.get('imageLoader') && this.config.get('imageFetch')) {
            (new ImageLoader(this.config.get('imageLoader'), [])).fetch();
        }
    };

    componentWillReceiveProps(nextProps) {
        let reset = false;
        if ('refresh' in nextProps && nextProps.refresh) {
            this.styleElement = (new DOMHelper()).styleSheet({id: 'stylizer-source'}, 'style');
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

        styleElement.insertRule(node.getStyling());

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
        const { minimize } = root.state;

        const AllowedTabs = ['selector', 'spacing', 'border', 'styles', 'typography'];

        const editorProps = config.get('EditorPanelEditorProps', {
            key: 'stylizer-editor-panel',
            className: 'stylizer-panels stylizer-editor-panel'
        });

        const headerProps = config.get('EditorPanelHeaderProps', {
            key: 'stylizer-editor-header',
            className: 'stylizer-header'
        });

        const headerTextProps = config.get('EditorPanelHeaderTextProps', {
            key: 'stylizer-editor-header-text',
            className: 'stylizer-header-text'
        });

        const headerActionProps = config.get('EditorPanelHeaderActionProps', {
            key: 'stylizer-editor-header-actions',
            className: 'stylizer-header-actions'
        });

        const layoutIconProps = config.get('EditorPanelLayoutIconProps', {
            size: 16,
            transform: root.state.vertical === false ? 'rotate(90)' : '',
            onClick: () => root.toggleLayout()
        });

        const hoverIconProps = config.get('EditorPanelHoverIconProps', {
            size: 16,
            color: root.state.hover ? '#13a6d9' : '',
            onClick: () => root.toggleHoverInspector()
        });

        const revertIconProps = config.get('EditorPanelRevertIconProps', {
            size: 16,
            onClick: () => root.revertData()
        });

        const deleteIconProps = config.get('EditorPanelDeleteIconProps', {
            size: 16,
            onClick: () => root.wipeData()
        });

        const saveIconProps = config.get('EditorPanelSaveIconProps', {
            size: 16,
            onClick: () => root.saveData()
        });

        const closeIconProps = config.get('EditorPanelCloseIconProps', {
            size: 16,
            onClick: () => root.killApp()
        });

        const hamburgerIconProps = config.get('EditorPanelHamburgerIconProps', {
            size: 16,
            onClick: () => root.toggleMinimize()
        });

        const layoutIconLabel = config.get('EditorPanelLayoutIconLabel', {
            title: 'Change the inspector orientation'
        });

        const hoverIconLabel = config.get('EditorPanelHoverIconLabel', {
            title: 'Enable mouse hover DOM selector'
        });

        const revertIconLabel = config.get('EditorPanelRevertIconLabel', {
            title: 'Reset unsaved changes'
        });

        const deleteIconLabel = config.get('EditorPanelDeleteIconLabel', {
            title: 'Delete both saved and unsaved changes'
        });

        const saveIconLabel = config.get('EditorPanelSaveIconLabel', {
            title: 'Save changes'
        });

        const closeIconLabel = config.get('EditorPanelCloseIconLabel', {
            title: 'Close Editor'
        });

        const hamburgerIconLabel = config.get('EditorPanelHamburgerIconLabel', {
            title: 'Minimize Editor'
        });

        const tabsWrapperProps = config.get('EditorPanelTabsWrapperProps', {
            key: 'stylizer-tabs-wrapper',
            className: 'stylizer-tabs-wrapper'
        });

        const tabsProps = config.get('EditorPanelTabsProps', {
            key: 'stylizer-tabs',
            className: 'stylizer-tabs'
        });

        const emptyProps = config.get('EditorPanelEmptyProps', {
            className: 'stylizer-selector-empty'
        });

        const panelProps = config.get('EditorPanelPanelProps', Object.assign(state, {
            key: 'stylizer-active-panel-' + (node && node.uuid ? node.uuid : 'empty'),
            root: this,
            scroll: state.scroll
        }));

        switch (state.active) {
            case 'selector' :
                ActivePanel.push(<SelectorPanel { ...panelProps } />);
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
                        { config.get('EditorPanelHeaderText') }
                    </span>
                    <span { ...headerActionProps }>
                        { !minimize && <span { ...layoutIconLabel }><LayoutIcon { ...layoutIconProps } /></span> }
                        { !minimize && <span { ...hoverIconLabel }><HoverIcon { ...hoverIconProps } /></span> }
                        { !minimize && <span { ...revertIconLabel }><RevertIcon { ...revertIconProps } /></span> }
                        { !minimize && <span { ...deleteIconLabel }><DeleteIcon { ...deleteIconProps } /></span> }
                        { !minimize && <span { ...saveIconLabel }><SaveIcon { ...saveIconProps } /></span> }
                        { !minimize && <span { ...closeIconLabel }><CloseIcon { ...closeIconProps } /></span> }
                        <span { ...hamburgerIconLabel }><HamburgerIcon { ...hamburgerIconProps } /></span>
                    </span>
                </h3>

                { node
                    ? <div { ...tabsWrapperProps }>
                        <div { ...tabsProps }>
                            { AllowedTabs.map((TabKey) => {
                                const selectorItemProps = config.get('EditorPanelSelectorItemProps', {
                                    key: config.get('EditorPanelPanelItemPrefix', 'stylizer-tab-') + TabKey,
                                    className: [ config.get('EditorPanelPanelItemPrefix', 'stylizer-tab-') + 'element', state.active === TabKey ? 'active' : null ].join(' '),
                                    onClick: () => onChangeTab(TabKey)
                                });

                                return ( <div { ...selectorItemProps }>{ TabKey }</div> )
                            }) }
                        </div>
                        { ActivePanel }
                    </div>

                    : <div { ...tabsWrapperProps }>
                        <div { ...emptyProps }>{ config.get('EditorPanelEmptyText') }</div>
                    </div>
                }
            </div>
        )
    };
}