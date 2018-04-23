'use strict';
import React, {Component} from "react";
import {actions, connect} from './context/store';
import debounce from "debounce";

export class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: ''
        };
        this.updateSearch = this.updateSearch.bind(this);
    }

    updateSearch({target}) {
        this.setState({searchTerm: target.value}, () => {
            debounce(Search.search, 500)(this.state.searchTerm);
        });
    }

    static search(searchTerm) {
        actions.search(searchTerm);
    }

    render() {
        return (
            <div className="search-container">
                <input type="text" placeholder="Search for movies, tv shows or people" value={this.state.searchTerm}
                       onChange={this.updateSearch}/>
            </div>
        )
    }
}

export default connect(Search);