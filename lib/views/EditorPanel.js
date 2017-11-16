import React from 'react';
import BorderPanel from './Panels/Border';
import PositionPanel from './Panels/Position';
import SelectorPanel from './Panels/Selector';
import SpacingPanel from './Panels/Spacing';
import StylesPanel from './Panels/Styles';
import TypographyPanel from './Panels/Typography';


class EditorPanel extends React.Component {

    state = {
        active: 'selector'
    };

    config = {
        headerText: 'Editor'
    };

    constructor(props) {
        super(props);
        if ('config' in props)  {
            Object.assign(this.config, props.config);
        }
    };

    changeSelector() {

    }

    onChangeTab = (tabKey) => {
        this.setState({active: tabKey});
    };

    render() {

        const { onChangeTab, state } = this;
        let ActivePanel = [];
        switch (state.active) {
            case 'selector' :
                ActivePanel.push(<SelectorPanel key="stylizer-active-panel" root={ this } />);
                break;
            case 'position' :
                ActivePanel.push(<PositionPanel key="stylizer-active-panel" root={ this } />);
                break;
            case 'border' :
                ActivePanel.push(<BorderPanel key="stylizer-active-panel" root={ this } />);
                break;
            case 'spacing' :
                ActivePanel.push(<SpacingPanel key="stylizer-active-panel" root={ this } />);
                break;
            case 'styles' :
                ActivePanel.push(<StylesPanel key="stylizer-active-panel" root={ this } />);
                break;
            case 'typography' :
                ActivePanel.push(<TypographyPanel key="stylizer-active-panel" root={ this } />);
                break;

        }

        return (
            <div key="stylizer-editor-panel" className="stylizer-panels stylizer-editor-panel">
                <h3 key="stylizer-editor-header" className="stylizer-header">
                    { this.config.headerText }
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
                    <div key="stylizer-tab-contents" className="stylizer-tabs-contents">
                        { ActivePanel }
                    </div>
                </div>
            </div>
        )
    };
}

export default EditorPanel;