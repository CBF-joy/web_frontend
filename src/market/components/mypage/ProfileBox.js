import React from 'react';
import { Button } from '@material-ui/core';

class ProfileBox extends React.Component {
    state = {
        type: 'password',
    }


    handleClick = () => this.setState(({ type }) => ({
        type: type === 'text' ? 'password' : 'text'
    }))


    render() {
        const { label, value } = this.props

        return (
            <label >{label}
                <input type={this.state.type}
                    inputmode="numeric" minlength="40" maxlength="40" size="40"
                    style={{ marginRight: '1rem' }} readOnly value={value} />
                <Button variant="outlined" size="small" onClick={this.handleClick}>{this.state.type === 'text' ? 'Hide' : 'Show'}</Button>
                <br />
            </label>
        )
    }
}

export default ProfileBox;