import fetch from 'isomorphic-fetch'

export const SELECT_CATEGORY = 'SELECT_CATEGORY'
export const FILTER_TIME = 'FILTER_TIME'
export const INVALIDATE_CATEGORY = 'INVALIDATE_CATEGORY'
export const REQUEST_ARTICLES = 'REQUEST_ARTICLES'
export const RECEIVE_ARTICLES = 'RECEIVE_ARTICLES'

export function selectedCategory( category) {
    return { type: SELECT_CATEGORY, category, }
}

export function invalidateCategory ( category) {
    return {type: INVALIDATE_CATEGORY, category}
}

export function requestStories( category ) {
    return { type: REQUEST_ARTICLES, category, }
}

export function receiveArticles( category, json ) {
    return {
        type: RECEIVE_ARTICLES,
        category,
        articles: json,
        receivedAt: Date.now( ),
    }
}

export function fetchArticles( category, apiKey = '73e6f1e508994f288d5df6548e902fda' ) {
    return dispatch => {
        dispatch(requestStories( category ))
        return fetch( `https://api.nytimes.com/svc/topstories/v2/${ category }.json?api-key=${ apiKey }` ).then(response => {
            if ( response.status !== 200 ) {
                console.log( `ERROR: ${ response.status }` );
                return;
            }
            response
                .json( )
                .then(( json ) => {
                    dispatch(receiveArticles( json ))
                });
        }).catch(( err ) => {
            console.log( 'Fetch Error :-S', err );
        })
    }
}

function shouldFetchPosts( state, category ) {
    const articles = state.articles[category]
    if (!articles) {
        return true
    } else if (category.isFetching) {
        return false
    } else {
        return category.didInvalidate
    }
}

export function fetchArticlesIfNeeded ( category ) {
    return ( dispatch, getState ) => {
        if(shouldFetchPosts(getState(), category)){
            return dispatch((fetchArticles(category)))
        }else {
            return Promise.resolve()
        }
    }
}
