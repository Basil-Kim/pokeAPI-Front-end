import React from 'react';
import PokeCard from './PokeCard';
import { HStack } from '@chakra-ui/react';

export default function Page(props) {
  const { pokemons, PAGESIZE, currentPage } = props;
  const startIndex = (currentPage - 1) * PAGESIZE;
  const endIndex = startIndex + PAGESIZE;
  let slicePokemons = pokemons.slice(startIndex, endIndex);

  // Set the width of each PokeCard


  // Style the HStack to display its children in multiple rows
  const hStackStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto auto',
  };

  // Render the PokeCards with the specified width and add a margin
  const pokeCards = slicePokemons.map(pokemon => (
    <PokeCard key={pokemon.id} pokemon={pokemon} style={{ width: 'auto', margin: '2.5rem', height: '50px' }} />
  ));

  // Group the PokeCards into arrays of 5 and render each array as a div within the HStack
  const pokeCardRows = [];
  for (let i = 0; i < pokeCards.length; i += 3) {
    pokeCardRows.push(pokeCards.slice(i, i + 3));
  }
  const pokeCardRowDivs = pokeCardRows.map((row, index) => (
    <div key={index} style={{ display: 'flex', justifyContent: 'center' , }}>
      {row}
    </div>
  ));

  // Render the HStack with the modified styling and PokeCards
  return (
    <HStack height={'100%'} width={'100%'} minWidth={'80%'} style={hStackStyles}>
      {pokeCardRowDivs}
    </HStack>
  );
}
