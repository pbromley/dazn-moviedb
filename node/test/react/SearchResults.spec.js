'use strict';
import React from 'react';
import ReactDOM from "react-dom";
import ReactTestUtils from "react-dom/test-utils";
import {expect} from 'chai';
import shortid from 'shortid';
import {Provider} from "../../src/react/context/store";
import ConnectedSearchResults, {
    generateKnownFor,
    getAirOrReleaseDate,
    getNameOrTitle,
    getOverviewOrKnownFor,
    SearchResults
} from "../../src/react/SearchResults.react";

describe('SearchResults.react', () => {

    let amount;

    beforeEach(() => {
        amount = Math.ceil(Math.random() * 5);
    });

    it('should render', () => {
        const component = ReactTestUtils.renderIntoDocument(<SearchResults search={{results: []}}/>);
        const node = ReactDOM.findDOMNode(component);

        expect(node.tagName).to.equal('DIV');
        expect(node.className).to.equal('search-results-container');
        expect(node.children.length).to.equal(0);
    });

    it('should render with search results', () => {
        const searchWithResults = {
            results: [{id: shortid()}]
        };
        const component = ReactTestUtils.renderIntoDocument(<SearchResults search={searchWithResults}/>);
        const node = ReactDOM.findDOMNode(component);

        expect(node.tagName).to.equal('DIV');
        expect(node.className).to.equal('search-results-container');
        expect(node.children.length).to.equal(1);
        expect(node.children[0].className).to.equal('search-result-container');
    });

    it('should render with no search results flag set', () => {
        const searchWithNoResultsFlag = {
            results: [],
            noResults: true
        };
        const component = ReactTestUtils.renderIntoDocument(<SearchResults search={searchWithNoResultsFlag}/>);
        const node = ReactDOM.findDOMNode(component);

        expect(node.tagName).to.equal('DIV');
        expect(node.className).to.equal('search-results-container');
        expect(node.children.length).to.equal(1);
        expect(node.children[0].tagName).to.equal("H2");
        expect(node.children[0].textContent).to.equal("No Results");
    });


    it('should react to connected provider', () => {
        const component = ReactTestUtils.renderIntoDocument(<Provider><ConnectedSearchResults/></Provider>);
        const node = ReactDOM.findDOMNode(component);
        expect(node.tagName).to.equal('DIV');
        expect(node.className).to.equal('search-results-container');
        expect(node.children.length).to.equal(0);

        component.setState({search: {results: [{id: shortid()}]}});

        expect(node.children.length).to.equal(1);
        expect(node.children[0].className).to.equal('search-result-container');
    });

    it('should generate knownFor from name', () => {
        const names = [].fill(amount).map(() => ({name: shortid()}));
        expect(generateKnownFor(names)).to.equal(`(${names.map(({name}) => name).join(", ")})`);
    });

    it('should generate knownFor from title', () => {
        const titles = [].fill(amount).map(() => ({title: shortid()}));
        expect(generateKnownFor(titles)).to.equal(`(${titles.map(({title}) => title).join(", ")})`);
    });

    it('should generate name if present', () => {
        const name = shortid();
        expect(getNameOrTitle({name})).to.equal(name);
    });

    it('should generate title if name not present', () => {
        const title = shortid();
        expect(getNameOrTitle({title})).to.equal(title);
    });

    it('should generate air date if present', () => {
        const first_air_date = '20180101';
        expect(getAirOrReleaseDate({first_air_date})).to.equal('(2018)');
    });

    it('should generate release date if air_date not present', () => {
        const release_date = '20180101';
        expect(getAirOrReleaseDate({release_date})).to.equal('(2018)');
    });

    it('should not generate air or release date if either less than 4 characters in length', () => {
        const invalidDate = '201';
        expect(getAirOrReleaseDate({release_date: invalidDate})).to.equal('');
        expect(getAirOrReleaseDate({air_date: invalidDate})).to.equal('');
    });

    it('should generate overview if present', () => {
        const overview = shortid();
        expect(getOverviewOrKnownFor({overview})).to.equal(overview);
    });

    it('should generate known for if overview not present', () => {
        const name = shortid();
        const title = shortid();
        const known_for = [{name}, {title}];
        expect(getOverviewOrKnownFor({known_for})).to.equal(`(${name}, ${title})`);
    });


});