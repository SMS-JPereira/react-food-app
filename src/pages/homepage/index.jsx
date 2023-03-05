import { useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { ThemeContext } from "../../App"
import FavoriteItem from "../../components/favorite-item"
import RecipeItem from "../../components/recipe-item"
import Search from "../../components/search"
import './styles.css'

const reducer = (state, action) => {
    switch (action.type) {
        case 'filterFavorites':
            console.log(action);
            return {
                ...state,
                filteredValue: action.value
            };

        default:
            return state;
    }
}

const initialState = {
    filteredValue: ''
}

function Homepage() {
    // loading state
    const [loadingState, setLoadingState] = useState(false)

    // save results that we receive from api
    const [recipes, setRecipes] = useState([])

    // favorites data state
    const [favorites, setFavorites] = useState([])

    // state for API is successfull or not
    const [apiCalledSuccess, setApiCalledSuccess] = useState(false)

    // use reducer functionality
    const [filteredState, dispatch] = useReducer(reducer, initialState)

    const { theme } = useContext(ThemeContext)

    const getDataFromSearchComponent = (getData) => {
        // keep the loading state as true before we are calling the api
        setLoadingState(true)

        // calling the API
        async function getRecipes() {
            const apiResponse = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=51f33aa6df254544ba433669cf2757de&query=${getData}`)
            const result = await apiResponse.json()
            const { results } = result
            if (results && results.length > 0) {
                setLoadingState(false)
                setRecipes(results)
                setApiCalledSuccess(true)
            }
        }

        getRecipes()
    }

    const addToFavorites = useCallback((getCurrentRecipeItem) => {
        let cpyFavorites = [...favorites]

        const index = cpyFavorites.findIndex(item => item.id === getCurrentRecipeItem.id)
        if (index === -1) {
            cpyFavorites.push(getCurrentRecipeItem)
            setFavorites(cpyFavorites)
            // save the favorites in local storage
            localStorage.setItem('favorites', JSON.stringify(cpyFavorites))
            window.scrollTo({ top: '0', behavior: 'smooth' })
        } else {
            alert(`The recipe '${getCurrentRecipeItem.title}' is already present in Favorites.`)
        }
    }, [favorites])

    // const addToFavorites = (getCurrentRecipeItem) => {
    //     let cpyFavorites = [...favorites]

    //     const index = cpyFavorites.findIndex(item => item.id === getCurrentRecipeItem.id)
    //     if (index === -1) {
    //         cpyFavorites.push(getCurrentRecipeItem)
    //         setFavorites(cpyFavorites)
    //         // save the favorites in local storage
    //         localStorage.setItem('favorites', JSON.stringify(cpyFavorites))
    //     } else {
    //         alert(`The recipe '${getCurrentRecipeItem.title}' is already present in Favorites.`)
    //     }
    // }

    const removeFromFavorites = (getCurrentFavoriteId) => {
        let cpyFavorites = [...favorites]
        cpyFavorites = cpyFavorites.filter(item => item.id !== getCurrentFavoriteId)
        setFavorites(cpyFavorites)
        localStorage.setItem('favorites', JSON.stringify(cpyFavorites))
    }

    useEffect(() => {
        // console.log('runs only once on page load');
        const extractFavoritesFromLocalStorageOnPageLoad = JSON.parse(localStorage.getItem('favorites'))
        setFavorites(extractFavoritesFromLocalStorageOnPageLoad)
    }, [])

    const filteredFavoriteItems = favorites.filter((item) =>
        item.title.toLowerCase().includes(filteredState.filteredValue)
    )

    // const renderRecipes = useCallback(() => {
    //     if (recipes && recipes.length > 0) {
    //         return (
    //             recipes.map((item) => (
    //                 <RecipeItem
    //                     addToFavorites={() => addToFavorites(item)}
    //                     id={item.id}
    //                     image={item.image}
    //                     title={item.title}
    //                 />
    //             ))
    //         )
    //     }
    // }, [recipes, addToFavorites])

    return (
        <div className="homepage">
            <Search
                getDataFromSearchComponent={getDataFromSearchComponent}
                apiCalledSuccess={apiCalledSuccess}
                setApiCalledSuccess={setApiCalledSuccess}
            />
            {/*  show favorites items */}
            <div className="favorites-wrapper">
                <h1 style={theme ? { color: "#12343b" } : {}} className="favorites-title">Favorites</h1>
                <div className="search-favorites">
                    <input onChange={(event) =>
                        dispatch({ type: 'filterFavorites', value: event.currentTarget.value })}
                        value={filteredState.filteredValue}
                        name="searchfavorites"
                        placeholder="Search Favorites"
                    />
                </div>
                <div className="favorites">
                    {
                        !filteredFavoriteItems.length && <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }} className="no-items">No favorites are found</div>
                    }
                    {
                        filteredFavoriteItems && filteredFavoriteItems.length > 0
                            ? filteredFavoriteItems.map((item) => (
                                <FavoriteItem
                                    key={item.id}
                                    removeFromFavorites={() => removeFromFavorites(item.id)}
                                    id={item.id}
                                    image={item.image}
                                    title={item.title}
                                />
                            ))
                            : null
                    }
                </div>
            </div>
            {/*  show favorites items */}

            {/*  show loading state */}
            {
                loadingState && <div className="loading">Loading recipes! Please wait.</div>
            }
            {/*  show loading state */}

            {/*  map through all the recipes */}
            <div className="items">
                {
                    useMemo(() =>
                        !loadingState && recipes && recipes.length > 0
                            ? recipes.map((item) => (
                                <RecipeItem
                                    key={item.id}
                                    addToFavorites={() => addToFavorites(item)}
                                    id={item.id}
                                    image={item.image}
                                    title={item.title}
                                />
                            ))
                            : null,
                        [loadingState, recipes, addToFavorites]
                    )

                    // renderRecipes()

                    // recipes && recipes.length > 0
                    //     ? recipes.map((item) => (
                    //         <RecipeItem
                    //             addToFavorites={() => addToFavorites(item)}
                    //             id={item.id}
                    //             image={item.image}
                    //             title={item.title}
                    //         />
                    //     ))
                    //     : null
                }
            </div>
            {/*  map through all the recipes */}
            {
                !loadingState && !recipes.length && <div className="no-items">No recipes are found</div>
            }
        </div>
    )
}

export default Homepage