'use strict';
import React from 'react';
import mock from 'mock-require';
import {expect} from 'chai';
import {spy} from 'sinon';
import App from '../../src/react/App.react';

describe('Initial app', () => {

    const originalGetElementById = document.getElementById;

    before(() => {
        delete require.cache[require.resolve('react-dom')];
    });

    after(() => {
        mock.stopAll();
        document.getElementById = originalGetElementById;
    });

    it('should mount app onto correct id', () => {
        document.getElementById = spy();
        mock('react-dom', {
            render: component => {
                expect(component).to.deep.equal(<App/>);
                expect(document.getElementById.called).to.equal(true);
                expect(document.getElementById.getCall(0).args[0]).to.equal('app');
            }
        });

        require('../../src/react/initialise-app');
    });
});