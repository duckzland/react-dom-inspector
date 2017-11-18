import React from 'react';

class Border extends React.Component {

    constructor(props) {
        super(props);
    };

    changeSelector = (e) => {

    };

    render() {

        const { changeSelector } = this;

        return (
            <div key="stylizer-tab-border" className="stylizer-tab-content stylizer-content">
                <div className="form-item">
                    <label>Border</label>
                    <input type="text" value="tester" name="stylizer[selector]" onChange={ (e) => changeSelector(e) } />
                </div>
            </div>
        )
    };
}

export default Border;