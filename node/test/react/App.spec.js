'use strict';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {expect} from 'chai';

import App from '../../src/react/App.react';
import Search from '../../src/react/Search.react';

describe('App.react', () => {
    it('should render', () => {
        const shallow = new ShallowRenderer();
        shallow.render(<App/>);
        const component = shallow.getRenderOutput();

        expect(component.type).to.equal('div');
        expect(component.props.className).to.equal('main-container');

        expect(component.props.children).to.deep.equal(
            <Search/>
        )
    });
});