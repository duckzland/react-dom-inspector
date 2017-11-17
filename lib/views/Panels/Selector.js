import React from 'react';

class Selector extends React.Component {

    constructor(props) {
        super(props);
    };

    changeSelector = (e) => {

    };

    render() {

        const { changeSelector } = this;
        //console.log(this.props);

        return (
            <div key="stylizer-tab-selector" className="stylizer-tab-content stylizer-content">
                <div className="form-item">
                    <label>Selector</label>
                    <input type="text" value="tester" name="stylizer[selector]" onChange={ (e) => changeSelector(e) } />
                </div>
            </div>
        )
    };
}

export default Selector;