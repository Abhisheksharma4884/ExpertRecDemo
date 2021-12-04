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

    const initialQueryRef = useRef(true);

    useEffect(() => {
        if (!initialQueryRef.current && Query.length) {
            const timeoutId = setTimeout(() => {
                getSuggestions(Query);
            }, 250);

            return () => clearTimeout(timeoutId);
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
            case "ITALIAN COLLECTION": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/italiandesk.png';
                break;
            case "AMERICAN COLLECTION": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/americandesk.png';
                break;
            case "MALAYSIAN COLLECTION": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/malaysiandesk.png';
                break;
            case "TURKISH COLLECTION": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/turkishdesk.png';
                break;
            case "EMPEROR COLLECTION": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/emperordesk.png';
                break;
            case "GERMAN COLLECTION": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/germandesk.png';
                break;
            case "VIETNAM COLLECTION": flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/vietnamdesk.png';
                break;
            default: flagUrl = 'https://www.royaloakindia.com/royaloak-react/public/react-images/pdpFlagsDesk/americandesk.png';
                break;
        }
        return flagUrl;
    }

    return (
        <>
            <div style={{ width: "350px", margin: "0 auto", position: "relative", marginTop: "50px" }}>
                <div style={{ position: "relative" }}>
                    <input
                        type="text"
                        value={Query}
                        onChange={e => handleChange(e)}
                        className="searchBoxInput"
                    />
                    <img alt="searchIcon" style={{ position: "absolute", width: "18px", top: "50%", transform: "translateY(-50%)", right: "5px" }} src="https://www.royaloakindia.com/royaloak-react/public/react-images/iconSearch.webp" />
                </div>
                {ShowDropdown ?
                    <div className="dropdown-wrapper">
                        <div className="search-suggestion-box">
                            <div className="" style={{ borderRight: "1px solid rgb(214,214,214)", textAlign: "left" }}>
                                <div className="search-box-product-titles">
                                    TOP SEARCHES
                                </div>
                                {Suggestions?.map(item => {
                                    return (
                                        <div onMouseOver={e => handleSuggestionHover(e, item.suggestion)} className="suggestion-list from-left text-ellipses">
                                            {parse(item.suggestion?.replace(Query, `<span className="bold-text">${Query}</span>`))}
                                        </div>
                                    )
                                })}
                                <div className="search-box-product-titles">
                                    TOP COLLECTION
                                </div>
                                {Facets?.collectionname?.map(collection => {
                                    return (
                                        <div onMouseOver={e => handleSuggestionHover(e, collection.name + " " + Query.toUpperCase())} className="suggestion-list from-left text-ellipses">
                                            <img alt="countryImage" src={getFlag(collection.name)}
                                                width="20" height="14" />
                                            <span style={{ paddingLeft: "8px" }}>
                                                {collection.name}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="" style={{ textAlign: "left", display: "flex", flexDirection: "column", width: "100%", padding: "0 0 0 11px" }}>
                                <div className="search-box-product-main-title">
                                    Popular Products in ' {Lquery} '
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                    {Results?.map((result) => {
                                        return (
                                            <div className="pr1" style={{ width: "33.33%" }}>
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
