import React from 'react';

class Overlay extends React.Component {

    state = {
        position: {
            top: 0,
            left: 0
        },
        size: {
            width: 0,
            height: 0
        },
        padding: {
            paddingLeft : 0,
            paddingRight : 0,
            paddingTop : 0,
            paddingBottom : 0
        },
        margin: {
            marginLeft : 0,
            marginRight: 0,
            marginTop : 0,
            marginBottom : 0
        }
    };

    constructor(props) {
        super(props);
        if ('position' in props) {
            this.state.position = props.position;
        }
        if ('size' in props) {
            this.state.size = props.size;
        }
        if ('padding' in props) {
            this.state.padding = props.padding;
        }
        if ('margin' in props) {
            this.state.margin = props.margin;
        }
    }

    componentWillReceiveProps(nextProps) {
        if ('reset' in nextProps && nextProps.reset === true) {
            this.resetState();
        }
        else {
            if ('position' in props) {
                this.state.position = props.position;
            }
            if ('size' in props) {
                this.state.size = props.size;
            }
            if ('padding' in props) {
                this.state.padding = props.padding;
            }
            if ('margin' in props) {
                this.state.margin = props.margin;
            }
        }
    }

    resetState = () => {
        this.setState({
            position: {
                top: 0,
                left: 0
            },
            size: {
                width: 0,
                height: 0
            },
            padding: {
                "padding-left" : 0,
                "padding-right" : 0,
                "padding-top" : 0,
                "padding-bottom": 0
            },
            margin: {
                "margin-left" : 0,
                "margin-right": 0,
                "margin-top" : 0,
                "margin-bottom": 0
            }
        });
    };

    render() {
        return (
            <div key="overlay-box" className="stylizer-overlay-box" style={ this.state.position }>
                <div key="overlay-margin" className="stylizer-overlay-margin" style={ this.state.margin }>
                    <div key="overlay-padding" className="stylizer-overlay-padding" style={ this.state.padding }>
                        <div key="overlay-content" className="stylizer-overlay-content" style={ this.state.size }>
                            { null }
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export default Overlay;