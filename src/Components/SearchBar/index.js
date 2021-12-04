import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import parse from 'html-react-parser';

function SearchBar() {
    const [Query, setQuery] = useState("");
    const [Suggestions, setSuggestions] = useState([]);
    const [Facets, setFacets] = useState({});
    const [Results, setResults] = useState([]);
    const [Lquery, setLquery] = useState("");
    const [ShowDropdown, setShowDropdown] = useState(false);

    const [Collections, setCollections] = useState([
        {
            "count": 46,
            "name": "Italian Collection",
            "selected": false
        },
        {
            "count": 39,
            "name": "American Collection",
            "selected": false
        },
        {
            "count": 35,
            "name": "Malaysian Collection",
            "selected": false
        },
        {
            "count": 10,
            "name": "Turkish Collection",
            "selected": false
        },
        {
            "count": 9,
            "name": "Emperor Collection",
            "selected": false
        },
        {
            "count": 9,
            "name": "German Collection",
            "selected": false
        },
        {
            "count": 8,
            "name": "Vietnam Collection",
            "selected": false
        }
    ])

    const initialQueryRef = useRef(true);
    const onBlurRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (onBlurRef.current && !onBlurRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onBlurRef]);

    useEffect(() => {
        if (!initialQueryRef.current) {
            if (Query.length) {
                const timeoutId = setTimeout(() => {
                    getSuggestions(Query);
                }, 250);

                return () => clearTimeout(timeoutId);
            }
            else {
                setShowDropdown(false);
            }
        }
        else {
            initialQueryRef.current = false;
        }
    }, [Query])

    const handleChange = (e) => {
        setQuery(e.target.value);
    }

    const handleSuggestionHover = (e, item) => {
        getResults(item);
    }

    const getResults = (searchQuery) => {
        axios.get(`https://searchv7.expertrec.com/v6/search/eb17a931b1ab4950928cabbf42527715/?user=&q=${searchQuery}&size=6&suggestions=1&maxSuggestions=6`)
            .then((res) => {
                setResults(res.data?.results);
                setLquery(res.data?.["1query"]);
            })
    }

    const getSuggestions = (searchQuery) => {
        axios.get(`https://searchv7.expertrec.com/v6/search/eb17a931b1ab4950928cabbf42527715/?user=&q=${searchQuery}&size=6&suggestions=1&maxSuggestions=6`)
            .then((res) => {
                setSuggestions(res.data?.suggestions);
                setFacets(res.data?.facets);
                setResults(res.data?.results);
                setLquery(res.data?.["1query"]);
                setShowDropdown(true);
            })
    }

    const getFlag = (country) => {
        let flagUrl;
        switch (country) {
            case "Italian Collection": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/italiandesk.png';
                break;
            case "American Collection": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/americandesk.png';
                break;
            case "Malaysian Collection": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/malaysiandesk.png';
                break;
            case "Turkish Collection": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/turkishdesk.png';
                break;
            case "Emperor Collection": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/emperordesk.png';
                break;
            case "German Collection": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/germandesk.png';
                break;
            case "Vietnam Collection": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/vietnamdesk.png';
                break;
            default: flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/americandesk.png';
                break;
        }
        return flagUrl;
    }

    return (
        <>
            <div className="search-box-container">
                <div style={{ position: "relative" }}>
                    <input
                        type="text"
                        value={Query}
                        onChange={e => handleChange(e)}
                        className="searchBoxInput"
                        placeholder="Find your furniture..."
                    />
                    <img alt="searchIcon" className="search-icon" src="https://www.royaloakindia.com/royaloak-react/public/react-images/iconSearch.webp" />
                </div>
                {ShowDropdown ?
                    <div className="dropdown-wrapper" ref={onBlurRef}>
                        <div className="search-suggestion-box">
                            <div className="suggestion-list-wrapper">
                                <div className="search-box-product-titles">
                                    TOP SEARCHES
                                </div>
                                {Suggestions?.map((item, index) => {
                                    return (
                                        <div key={index} onMouseOver={e => handleSuggestionHover(e, item.suggestion)} className="suggestion-list suggestion-highlight from-left text-ellipses">
                                            {parse(item.suggestion?.replace(Query, `<span className="bold-text">${Query}</span>`))}
                                        </div>
                                    )
                                })}
                                <div className="top-collection-wrapper">
                                    <div className="search-box-product-titles">
                                        TOP COLLECTION
                                    </div>
                                    {Collections.map((collection, index) => {
                                        return (
                                            <div key={index} onMouseOver={e => handleSuggestionHover(e, collection.name + " " + Query)} className="suggestion-list suggestion-highlight from-left text-ellipses">
                                                <img alt="countryImage" src={getFlag(collection.name)}
                                                    width="20" height="14" />
                                                <span style={{ paddingLeft: "8px" }}>
                                                    {collection.name}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="product-list-wrapper">
                                <div className="search-box-product-main-title">
                                    Popular Products in ' {Lquery} '
                                </div>
                                <div className="results-wrapper">
                                    {Results?.map((result, index) => {
                                        return (
                                            <div key={index} className="pr1" style={{ width: "33.33%" }}>
                                                <a rel="noreferrer" href="https://www.royaloakindia.com/product/venice-italian-fabric-sofa-3s" target="_blank" title={result.productname} itemProp="url">
                                                    <img alt="productImage" src={result.productimage} itemProp="image" style={{ width: "100%", height: "110px", objectFit: "fill" }} />
                                                    <div>
                                                        <h4 className="hidden-sm hidden-md hidden-xs text-ellipses search-box-product-name" style={{ marginTop: "2px" }}>
                                                            {result.productname}
                                                        </h4>
                                                        <div className="price-old">
                                                            <span className="product-price-suggestion-box">
                                                                Rs {result.sellingprice}
                                                                <span className="oldPriceBeforeDiscount price-strike">
                                                                    Rs {result.mrpprice}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    ""
                }
            </div>
        </>
    )
}

export default SearchBar
