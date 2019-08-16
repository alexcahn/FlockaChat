import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class SideBar extends Component {
    constructor(props)

    render() {
        return (
            <div
                className={`user`}
                onClick={() => { onClick(chat) }}
            >
                <div className="user-photo">{name[0].toUpperCase()}</div>
                <div className="user-info">
                    <div className="name">{name}</div>
                    {lastMessage && <div className="last-message">{lastMessage}</div>}
                </div>

            </div>
        )
    }
}