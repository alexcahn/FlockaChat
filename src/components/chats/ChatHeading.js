import React, { Component } from 'react'

export default class ChatHeading extends Component {
    render() {
        const { name, numberOfUsers } = this.props
        return (
            <div className="chat-header">
                <div className="user-info">
                    <div className="user-name">{name}</div>
                    <div className="status">
                        <span>{numberOfUsers ? numberOfUsers : null} online</span>
                    </div>
                </div>
            </div>
        );
    }
}



