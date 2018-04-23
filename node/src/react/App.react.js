'use strict';
import React, {Component} from 'react';
import Search from './Search.react';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="main-container">
                <Search/>
            </div>
        );
    }
}