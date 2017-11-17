import React from 'react';
import ScrollArea from 'react-scrollbar';
import HamburgerIcon from 'react-icons/lib/io/navicon-round';
import HoverIcon from 'react-icons/lib/io/compose';
import RevertIcon from 'react-icons/lib/io/trash-b';
import CloseIcon from 'react-icons/lib/io/close';
import SaveIcon from 'react-icons/lib/io/refresh';
import LayoutIcon from 'react-icons/lib/io/code-working';
import BorderPanel from './Panels/Border';
import PositionPanel from './Panels/Position';
import SelectorPanel from './Panels/Selector';
import SpacingPanel from './Panels/Spacing';
import StylesPanel from './Panels/Styles';
import TypographyPanel from './Panels/Typography';


class EditorPanel extends React.Component {

    state = {
        active: 'selector',
        node: false,
        root: false
    };

    config = {
        headerText: 'Editor'
    };

    constructor(props) {
        super(props);
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
        this.state.node = nextProps.node;
    }

    changeSelector() {

    }

    onChangeTab = (tabKey) => {
        this.setState({active: tabKey});
    };

    render() {

        const { onChangeTab, state } = this;
        const { root } = state;

        let ActivePanel = [];
        switch (state.active) {
            case 'selector' :
                ActivePanel.push(<SelectorPanel key="stylizer-active-panel" { ...state } />);
                break;
            case 'position' :
                ActivePanel.push(<PositionPanel key="stylizer-active-panel" { ...state } />);
                break;
            case 'border' :
                ActivePanel.push(<BorderPanel key="stylizer-active-panel" { ...state } />);
                break;
            case 'spacing' :
                ActivePanel.push(<SpacingPanel key="stylizer-active-panel" { ...state } />);
                break;
            case 'styles' :
                ActivePanel.push(<StylesPanel key="stylizer-active-panel" { ...state } />);
                break;
            case 'typography' :
                ActivePanel.push(<TypographyPanel key="stylizer-active-panel" { ...state } />);
                break;

        }

        return (
            <div key="stylizer-editor-panel" className="stylizer-panels stylizer-editor-panel">
                <h3 key="stylizer-editor-header" className="stylizer-header">
                    <span key="stylizer-editor-header-text" className="stylizer-header-text">
                        { this.config.headerText }
                    </span>
                    <span key="stylizer-editor-header-actions" className="stylizer-header-actions">
                        { !root.state.minimize && <LayoutIcon size="16" onClick={ () => root.toggleLayout() } /> }
                        { !root.state.minimize && <HoverIcon size={ root.state.hover ? '20' : '16' } onClick={ () => root.toggleHoverInspector() } /> }
                        { !root.state.minimize && <RevertIcon size="16" onClick={ () => root.revertData() } /> }
                        { !root.state.minimize && <SaveIcon size="16" onClick={ () => root.saveData() } /> }
                        { !root.state.minimize && <CloseIcon size="16" onClick={ () => root.killApp() } /> }
                        <HamburgerIcon size="16" onClick={ () => root.toggleMinimize() } />
                    </span>
                </h3>
                <div key="stylizer-tabs-wrapper" className="stylizer-tabs-wrapper">
                    <div key="stylizer-tabs" className="stylizer-tabs">
                        {
                            ['selector', 'position', 'spacing', 'border', 'styles', 'typography'].map((TabKey, delta) => {
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
            </div>
        )
    };
}

export default EditorPanel;