'use strict';
import React from 'react';
import ReactDOM from "react-dom";
import ReactTestUtils from "react-dom/test-utils";
import {expect} from 'chai';
import {spy} from 'sinon';
import {Search} from "../../src/react/Search.react";
import {actions} from "../../src/react/context/store";

describe('Search.react', () => {
    const originalSearch = actions.search;

    afterEach(() => {
        actions.search = originalSearch;
    });

    it('should render', () => {
        const component = ReactTestUtils.renderIntoDocument(<Search/>);
        const node = ReactDOM.findDOMNode(component);

        expect(component.state).to.deep.equal({
            searchTerm: ''
        });

        expect(node.tagName).to.equal('DIV');
        expect(node.className).to.equal('search-container');
        expect(node.children.length).to.equal(1);
        const input = node.children[0];
        expect(input.tagName).to.equal('INPUT');
        expect(input.getAttribute('placeholder')).to.equal('Search for movies, tv shows or people');
        expect(input.getAttribute('type')).to.equal('text');
        expect(input.value).to.equal('');
    });

    it('search input onChange should update state and fire search action', done => {
        const component = ReactTestUtils.renderIntoDocument(<Search />);
        const node = ReactDOM.findDOMNode(component);
        const expectedSearchTerm = 'me';
        const input = node.children[0];

        actions.search = spy(searchParam => {
            expect(component.state).to.deep.equal({
                searchTerm: expectedSearchTerm
            });
            expect(input.value).to.equal(expectedSearchTerm);
            expect(searchParam).to.equal(expectedSearchTerm);
            done();
        });

        ReactTestUtils.Simulate.change(input, {target: {value: expectedSearchTerm}});
    });
});