import React from 'react';
import './cardStyles.scss';
import {Text, Image} from "@chakra-ui/react";

export default function PokeCard(props) {

    const {pokemon} = props
    const pokeId = String(pokemon.id);
    const idNum = pokeId.length === 3 ? pokeId : pokeId.length === 2 ? '0' + pokeId : pokeId.length === 1 ? '00' + pokeId : pokeId;
    const pokeTypes = pokemon.type.map( (pokeType, index) => {
      let isLast = index === pokemon.type.length-1;
      let char = isLast ? "" : " & ";
      return String(pokeType + char)
    })

    const statsArray = Object.entries(pokemon.base)


    const pokeStats = statsArray.map(([name, value])=>{
      return `${name}: ${value}`
    })

  return (
    

    <div className="flip" >
 
<div className='front'>
  <Image src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${idNum}.png`} boxSize={'175px'} marginTop={'1rem'}/>
</div>

    <div className="back">
       <Text fontFamily={'poke-font'} fontWeight={'500'} color={'black'} fontSize={'xl'}>{String(pokemon.name.english)}</Text>
 
       <Text fontWeight={'500'} color={'black'} fontSize={'sm'}>Poke Id: {String(pokemon.id)}</Text>
       <Text fontWeight={'500'} color={'black'} fontSize={'sm'}></Text>  <Text fontWeight={'500'} color={'black'} fontSize={'sm'}>Types: { 
        pokeTypes
        }</Text>
      <Text fontWeight={'500'} color={'black'} fontSize={'sm'}>Base Stats</Text>
        {
          pokeStats.map((stat, index) => {
            return <Text fontWeight={'500'} color={'black'} fontSize={'sm'} key={index}>{String(stat)}</Text>
          })
        }

        
    </div>
</div>
  )
}
