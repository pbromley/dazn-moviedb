'use strict';
import React, {Component} from 'react';
import {Provider} from './context/store';
import Search from './Search.react';
import SearchResults from './SearchResults.react';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="main-container">
                <Provider>
                    <Search/>
                    <SearchResults/>
                </Provider>
            </div>
        );
    }
}