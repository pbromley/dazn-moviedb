import React, {Component} from 'react';
import api from '../../lib/movieDbApi'

const initialState = {
    search: {
        results: []
    }
};

const SEARCH_SUCCESS_KEY = 'searchSuccess';
const NO_SEARCH_RESULTS_KEY = 'noSearchResults';
const CLEAR_SEARCH_RESULTS_KEY = 'clearSearchResults';

const searchSuccess = response => ({
    key: SEARCH_SUCCESS_KEY,
    data: {response}
});
const clearSearchResults = () => ({key: CLEAR_SEARCH_RESULTS_KEY});
const noSearchResults = () => ({key: NO_SEARCH_RESULTS_KEY});

const addImageUrl = results =>
    results.map(result => ({
        ...result,
        imageUrl: api.common.getImage({file: (result.poster_path || result.profile_path).substring(1), size: 'w500'})
    }));

const dataHandler = actionResponse => {
    const {key, data} = actionResponse;

    switch (key) {
        case SEARCH_SUCCESS_KEY:
            return {search: {results: addImageUrl(data.response.results)}};
        case CLEAR_SEARCH_RESULTS_KEY:
            return {search: {...initialState.search}};
        case NO_SEARCH_RESULTS_KEY:
            return {search: {...initialState.search, noResults: true}};
    }
};

const allActions = {
    search: searchTerm => new Promise((resolve, reject) => {
        const searchOpts = {
            query: searchTerm
        };

        if (searchTerm.trim().length) {
            api.search.getMulti(searchOpts, responseText => {
                const response = JSON.parse(responseText);

                if (response.results.length) {
                    resolve(dataHandler(searchSuccess(response)));
                } else {
                    resolve(dataHandler(noSearchResults()));
                }
            }, reject);
        } else {
            resolve(dataHandler(clearSearchResults()));
        }
    })
};

const createStore = function (state, actionsToBind) {

    const Context = React.createContext({});
    const Consumer = Context.Consumer;
    let providerComponent;

    const boundActions = Object.keys(actionsToBind).reduce((nextActions, key) => ({
        ...nextActions,
        [key]: (...args) => {
            actionsToBind[key](...args).then(result => providerComponent.setState(result));
        }
    }), {});

    class Provider extends Component {
        constructor(props) {
            super(props);
            providerComponent = this;
            this.state = state;
        }

        render() {
            return (
                <Context.Provider value={this.state}>
                    {this.props.children}
                </Context.Provider>
            )
        }
    }

    const connect = ComponentToConnect => {
        return () => (
            <Consumer>
                {state => (
                    <ComponentToConnect {...state} />
                )}
            </Consumer>
        );
    };

    return {
        Provider,
        Consumer,
        actions: boundActions,
        connect
    }
};

export const {
    Provider,
    Consumer,
    actions,
    connect
} = createStore(initialState, allActions);