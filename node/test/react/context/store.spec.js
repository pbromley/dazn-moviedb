'use strict';
import React from 'react';
import {expect} from 'chai'
import ReactTestUtils from 'react-dom/test-utils';
import shortid from 'shortid';
import ShallowRenderer from 'react-test-renderer/shallow';
import {spy} from 'sinon';
import {Provider, Consumer, actions, connect} from "../../../src/react/context/store";
import movieApi from '../../../src/lib/movieDbApi';

describe("Store", () => {

    it("should create store", () => {
        expect(Provider).to.exist;
        expect(Consumer).to.exist;
        expect(actions).to.exist;
    });

    it("Provider should use initial state", () => {
        const component = ReactTestUtils.renderIntoDocument(<Provider/>);
        expect(component.state).to.deep.equal({
            search: {
                results: []
            }
        });
    });

    it("Provider should render children", () => {
        const randomId = shortid();
        const shallow = new ShallowRenderer();
        shallow.render(
            <Provider>
                <div>{randomId}</div>
            </Provider>);

        const component = shallow.getRenderOutput();

        expect(component.props.children).to.deep.equal(<div>{randomId}</div>);
    });

    it("Consumer should be connected to Provider", () => {
        const stateChangeListener = spy();
        const consumer = (
            <Consumer>
                {stateChangeListener}
            </Consumer>
        );

        const provider = ReactTestUtils.renderIntoDocument(<Provider>{consumer}</Provider>);
        const testState = {something: shortid()};

        provider.setState(testState);

        expect(stateChangeListener.called).to.equal(true);
        expect(stateChangeListener.callCount).to.equal(2);
        expect(stateChangeListener.getCall(0).args[0]).to.deep.equal({
            search: {results: []}
        });
        expect(stateChangeListener.getCall(1).args[0]).to.deep.equal({
            ...testState,
            search: {results: []}
        })
    });

    it("search action should call search on movie api", () => {
        const searchTerm = shortid();
        const mockedApiSearch = spy();

        ReactTestUtils.renderIntoDocument(<Provider/>);

        movieApi.search.getMulti = mockedApiSearch;
        actions.search(searchTerm);

        expect(mockedApiSearch.called).to.equal(true);
        expect(mockedApiSearch.getCall(0).args[0]).to.deep.equal({query: searchTerm});
    });

    it('connect should return a function', () => {
        expect(typeof connect).to.equal('function');
    });

    it('connect function should connect component to store', () => {
        const spied = spy();

        const ToConnect = props => <div>{spied(props)}</div>;

        const Connected = connect(ToConnect);
        const component = ReactTestUtils.renderIntoDocument(
            <Provider>
                <Connected/>
            </Provider>
        );

        const initialExpectedState = {
            search: {
                results: []
            }
        };
        const expectedState = {[shortid()]: shortid()};
        component.setState(expectedState);

        expect(spied.called).to.equal(true);
        expect(spied.callCount).to.equal(2);
        expect(spied.getCall(0).args[0]).to.deep.equal(initialExpectedState);
        expect(spied.getCall(1).args[0]).to.deep.equal({...initialExpectedState, ...expectedState});
    });

    describe('actions', () => {
        const multiSearch = movieApi.search.getMulti;

        afterEach(() => {
            movieApi.search.getMulti = multiSearch;
        });

        it('should set search results on state on Provider search success', done => {
            const apiResults = {results: [{[shortid()]: shortid(), poster_path: `/${shortid()}`}]};
            const expectedStateData = {
                search: {
                    results: [{
                        ...apiResults.results[0],
                        imageUrl: `${movieApi.common.images_uri}w500${apiResults.results[0].poster_path}`
                    }]
                }
            };

            movieApi.search.getMulti = (opts, callback) => {
                callback(JSON.stringify(apiResults));
            };

            const localSetState = value => {
                try {
                    expect(value).to.deep.equal(expectedStateData);
                    done();
                } catch (e) {
                    done(e);
                }
            };

            const provider = ReactTestUtils.renderIntoDocument(<Provider/>);
            provider.setState = localSetState;

            actions.search(shortid());
        });

        it('should clear search results on Provider state when search term is empty', done => {
            const apiResults = {results: [{}]};
            const expectedStateData = {
                search: {
                    results: []
                }
            };

            movieApi.search.getMulti = (opts, callback) => {
                callback(JSON.stringify(apiResults));
            };

            const localSetState = value => {
                try {
                    expect(value).to.deep.equal(expectedStateData);
                    done();
                } catch (e) {
                    done(e);
                }
            };

            const provider = ReactTestUtils.renderIntoDocument(<Provider/>);
            provider.setState = localSetState;

            actions.search('');
        });

        it('should clear search results on Provider state and set no results flag when no results returned from api', done => {
            const apiResults = {results: []};
            const expectedStateData = {
                search: {
                    results: [],
                    noResults: true
                }
            };

            movieApi.search.getMulti = (opts, callback) => {
                callback(JSON.stringify(apiResults));
            };

            const localSetState = value => {
                try {
                    expect(value).to.deep.equal(expectedStateData);
                    done();
                } catch (e) {
                    done(e);
                }
            };

            const provider = ReactTestUtils.renderIntoDocument(<Provider/>);
            provider.setState = localSetState;

            actions.search(shortid());
        });

        describe("decorate results with full imageUrl", () => {

            const runTest = (apiResults, expectedStateData, done) => {
                movieApi.search.getMulti = (opts, callback) => {
                    callback(JSON.stringify(apiResults));
                };

                const localSetState = value => {
                    try {
                        expect(value).to.deep.equal(expectedStateData);
                        done();
                    } catch (e) {
                        done(e);
                    }
                };

                const provider = ReactTestUtils.renderIntoDocument(<Provider/>);
                provider.setState = localSetState;

                actions.search(shortid());
            };

            it('when poster_path present', done => {
                const apiResults = {results: [{[shortid()]: shortid(), poster_path: `/${shortid()}`}]};
                const expectedStateData = {
                    search: {
                        results: [{
                            ...apiResults.results[0],
                            imageUrl: `${movieApi.common.images_uri}w500${apiResults.results[0].poster_path}`
                        }]
                    }
                };

                runTest(apiResults, expectedStateData, done);
            });

            it('when profile_path present', done => {
                const apiResults = {results: [{[shortid()]: shortid(), profile_path: `/${shortid()}`}]};
                const expectedStateData = {
                    search: {
                        results: [{
                            ...apiResults.results[0],
                            imageUrl: `${movieApi.common.images_uri}w500${apiResults.results[0].profile_path}`
                        }]
                    }
                };

                runTest(apiResults, expectedStateData, done);
            });
        });
    });

});