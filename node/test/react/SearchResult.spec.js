'use strict';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {expect} from 'chai';
import shortid from 'shortid';
import SearchResult from "../../src/react/SearchResult.react";

describe('SearchResult.react', () => {

    it('should render', () => {
        const shallow = new ShallowRenderer();

        const imageUrl = shortid();
        const name = shortid();
        const overview = shortid();
        const date = shortid();

        shallow.render(<SearchResult imageUrl={imageUrl} name={name} overview={overview} date={date}/>);

        const component = shallow.getRenderOutput();

        expect(component.type).to.equal('div');
        expect(component.props.className).to.equal('search-result-container');
        expect(component.props.children).to.deep.equal([
            <div className="result-image">
                <img src={imageUrl}/>
            </div>,
            <div className="result-details">
                <h2>{name}</h2>
                <span className="muted-text">{date}</span>
                <span>{overview}</span>
            </div>
        ])
    });
});