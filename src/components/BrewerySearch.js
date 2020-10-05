import React from 'react';
import Autosuggest from 'react-autosuggest';
import { debounce } from 'throttle-debounce';
import styled from '@emotion/styled-base';

const API_SERVER_HOST =
  process.env.REACT_APP_API_SERVER_HOST || 'https://api.openbrewerydb.org';

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
  <div className="text-lg p-4">{suggestion.name}</div>
);

const BrewerySearchContainer = styled('div')`
  padding: 15px;
`;

const BrewerySearchHeading = styled('h4')`
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const BrewerySearch = () => {
  const [query, setQuery] = React.useState('');
  const [brewery, setBrewery] = React.useState({});
  const [suggestions, setSuggestions] = React.useState([]);

  const getSuggestions = async () => {
    try {
      const request = await fetch(
        `${API_SERVER_HOST}/breweries/autocomplete?query=${query}`
      );
      const payload = await request.json();
      setSuggestions(payload);
    } catch (e) {
      setSuggestions([]);
      console.error(e);
      alert(
        'Error fetching results, please try to refresh or check back later.'
      );
    }
  };

  const debouncedGetSuggestions = debounce(500, getSuggestions);

  const onChange = (event, { newValue }) => {
    console.log(newValue);
    setQuery(newValue);
  };

  const onSuggestionSelected = async (_event, { suggestion }) => {
    const selectedBrewery = suggestion;

    try {
      const request = await fetch(
        `${API_SERVER_HOST}/breweries/${selectedBrewery.id}`
      );
      const payload = await request.json();
      setBrewery(payload);
      console.log(payload);
    } catch (e) {
      console.error(e);
      alert(
        'Error fetching results, please try to refresh or check back later.'
      );
    }
  };
  const onSuggestionsFetchRequested = ({ value }) => {
    debouncedGetSuggestions(value);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: 'Type a brewery name',
    onChange,
    value: query,
    className:
      'shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline mb-4',
  };

  return (
    <BrewerySearchContainer>
      <BrewerySearchHeading>Brewery Search</BrewerySearchHeading>

      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
      />

      {/* <Brewery brewery={brewery} /> */}
    </BrewerySearchContainer>
  );
};

export default BrewerySearch;
