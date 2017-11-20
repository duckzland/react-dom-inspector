import React from 'react';
import ScrollArea from 'react-scrollbar';
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


class Editor extends React.Component {

    state = {
        active: 'spacing',
        node: false,
        root: false,
        errors: {}
    };

    styleElement = false;

    config = {
        headerText: 'Editor'
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

        let { onChangeTab, state } = this;
        const { root, node } = state;

        let ActivePanel = [], nodeKey = node && node.uuid ? node.uuid : 'empty';
        switch (state.active) {
            case 'selector' :
                ActivePanel.push(<SelectorPanel key={ 'stylizer-active-panel-' + nodeKey } { ...state } root={ this } />);
                break;
            case 'border' :
                ActivePanel.push(<BorderPanel key={ 'stylizer-active-panel-' + nodeKey } { ...state } root={ this } />);
                break;
            case 'spacing' :
                ActivePanel.push(<SpacingPanel key={ 'stylizer-active-panel-' + nodeKey } { ...state } root={ this } />);
                break;
            case 'styles' :
                ActivePanel.push(<StylesPanel key={ 'stylizer-active-panel-' + nodeKey } { ...state } root={ this } />);
                break;
            case 'typography' :
                ActivePanel.push(<TypographyPanel key={ 'stylizer-active-panel-' + nodeKey } { ...state } root={ this } />);
                break;
        }

        return (
            <div key="stylizer-editor-panel" className="stylizer-panels stylizer-editor-panel">
                <h3 key="stylizer-editor-header" className="stylizer-header">
                    <span key="stylizer-editor-header-text" className="stylizer-header-text">
                        { this.config.headerText }
                    </span>
                    <span key="stylizer-editor-header-actions" className="stylizer-header-actions">
                        { !root.state.minimize && <LayoutIcon size="16" transform={ root.state.vertical === false ? 'rotate(90)' : '' } onClick={ () => root.toggleLayout() } /> }
                        { !root.state.minimize && <HoverIcon size="16" color={ root.state.hover ? '#13a6d9' : '' } onClick={ () => root.toggleHoverInspector() } /> }
                        { !root.state.minimize && <RevertIcon size="16" onClick={ () => root.revertData() } /> }
                        { !root.state.minimize && <SaveIcon size="16" onClick={ () => root.saveData() } /> }
                        { !root.state.minimize && <CloseIcon size="16" onClick={ () => root.killApp() } /> }
                        <HamburgerIcon size="16" onClick={ () => root.toggleMinimize() } />
                    </span>
                </h3>

                {
                    node
                        ?   <div key="stylizer-tabs-wrapper" className="stylizer-tabs-wrapper">
                                <div key="stylizer-tabs" className="stylizer-tabs">
                                    {
                                        ['selector', 'spacing', 'border', 'styles', 'typography'].map((TabKey) => {
                                            let className = ['stylizer-tab-element'];
                                            if (state.active === TabKey) {
                                                className.push('active');
                                            }
                                            className = className.join(' ');
                                            return (
                                                <div key={ 'stylizer-tabs-' + TabKey }
                                                     className={ className }
                                                     onClick={ () => onChangeTab(TabKey) }>
                                                    { TabKey }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <ScrollArea
                                    key="stylizer-tab-contents"
                                    speed={ 0.8 }
                                    className="stylizer-tabs-contents"
                                    contentClassName="content"
                                    horizontal={ true }>
                                    { ActivePanel }
                                </ScrollArea>
                            </div>

                        :   <div key="stylizer-tabs-wrapper" className="stylizer-tabs-wrapper">
                                <div className="stylizer-selector-empty">
                                    No Element Selected
                                </div>
                            </div>
                }
            </div>
        )
    };
}

export default Editor;