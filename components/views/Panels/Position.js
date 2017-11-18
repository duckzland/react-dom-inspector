import React from 'react';

class Position extends React.Component {

    constructor(props) {
        super(props);
    };

    changeSelector = (e) => {

    };

    render() {

        const { changeSelector } = this;

        return (
            <div key="stylizer-tab-position" className="stylizer-tab-content stylizer-content">
                <div className="form-item">
                    <label>Position</label>
                    <input type="text" value="tester" name="stylizer[selector]" onChange={ (e) => changeSelector(e) } />
                </div>
            </div>
        )
    };
}


export default Position;