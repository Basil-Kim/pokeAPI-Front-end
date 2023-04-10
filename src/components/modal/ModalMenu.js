import React, {useState, useEffect} from 'react'
import {
    Checkbox,
    HStack,
    Text
  } from '@chakra-ui/react'



export default function ModalMenu(props) {


    const [checkedItems, setCheckedItems] = useState([]);

    const handleCheckboxChange = (event) => {
      const isChecked = event.target.checked;
      const value = event.target.value;
    
      if (isChecked) {
        setCheckedItems((prevCheckedItems) => [...prevCheckedItems, value]);
      } else {
        setCheckedItems((prevCheckedItems) =>
          prevCheckedItems.filter((item) => item !== value)
        );
      }
    
      props.onChange(checkedItems);
    };
    
    const pokeTypes = props.pokeTypes;




useEffect(() => {
    props.onChange(checkedItems);
  }, [checkedItems, props]);

  return (
    <>
    {pokeTypes ? (
        pokeTypes.map((pokeType, index) => {
            return <HStack key={index}>
            <Checkbox value={pokeType} onChange={handleCheckboxChange} checked={checkedItems.includes(pokeType)}></Checkbox>
            <Text>{`${pokeType}`}</Text>
          </HStack>
        })
      ) : (
        <>No Poke Types</>
      )}
      </>
  )
}
