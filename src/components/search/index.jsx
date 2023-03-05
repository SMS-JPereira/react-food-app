import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../App'
import './styles.css'

const Search = (props) => {
    const { theme } = useContext(ThemeContext)

    const { getDataFromSearchComponent, apiCalledSuccess, setApiCalledSuccess } = props

    const [inputValue, setInputValue] = useState('')

    const handleInputValue = (event) => {
        const { value } = event.target;
        // set the updated value
        setInputValue(value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        getDataFromSearchComponent(inputValue)
    }

    useEffect(() => {
        if (apiCalledSuccess) {
            setInputValue('')
            setApiCalledSuccess(false)
        }
    }, [apiCalledSuccess, setApiCalledSuccess])

    return (
        <form className="Search" onSubmit={handleSubmit}>
            <input name="search" onChange={handleInputValue} value={inputValue} placeholder="Search Recipes" id="search" />
            <button style={theme ? { backgroundColor: "#12343b" } : {}} type="submit">Search</button>
        </form>
    );
};

export default Search;