'use strict';
import React, {Component} from "react";
import {connect} from './context/store';
import SearchResult from './SearchResult.react';

export const generateKnownFor = knownFor => knownFor ?
    `(${knownFor.reduce((acc, current) => `${acc}, ${getNameOrTitle(current)}`, '').substring(2)})` :
    '';

export const getNameOrTitle = searchResult => searchResult.name || searchResult.title;
export const getAirOrReleaseDate = searchResult => {
    const date = searchResult.first_air_date || searchResult.release_date;
    return date && date.length > 3 ? `(${date.substring(0, 4)})` : '';
};

export const getOverviewOrKnownFor = result => result.overview || generateKnownFor(result.known_for);

export class SearchResults extends Component {
    constructor(props) {
        super(props);
    }

    renderResults({results, noResults}) {
        if (results.length) {
            return results.map(result =>
                <SearchResult key={result.id} imageUrl={result.imageUrl} name={getNameOrTitle(result)}
                              overview={getOverviewOrKnownFor(result)}
                              date={getAirOrReleaseDate(result)}/>);
        } else if (noResults) {
            return <h2>No Results</h2>;
        }
    }

    render() {
        return (
            <div className="search-results-container">
                {this.renderResults(this.props.search)}
            </div>
        )
    }
}

export default connect(SearchResults);