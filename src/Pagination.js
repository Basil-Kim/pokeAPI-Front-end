import React, { useState, useEffect } from 'react'
import Page from './Page'
import './styles.css'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Flex,
} from '@chakra-ui/react'
import ModalMenu from './components/modal/ModalMenu'

export default function Pagination(props) {
  const { pokemons, PAGESIZE } = props
  const [currentPage, setCurrentPage] = useState(1)
  const [chosen, selectChosen] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const totalPages = chosen
    ? Math.ceil(chosen.length / PAGESIZE)
    : Math.ceil(pokemons.length / PAGESIZE)
  const maxVisibleButtons = 5
  let startButton = Math.max(currentPage - Math.floor(maxVisibleButtons / 2), 1)
  let endButton = Math.min(startButton + maxVisibleButtons - 1, totalPages)
  startButton = Math.max(endButton - maxVisibleButtons + 1, 1)
  const [pokeTypes, selectTypes] = useState([])

  const onSelect = (selected) => {
    selectTypes(selected)
  }

  useEffect(() => {
    const selectedPokemons = pokemons.filter((pokemon) =>
      pokemon.type.some((type) => pokeTypes.includes(type)),
    )
    selectChosen(selectedPokemons)
  }, [pokeTypes])

  return (
    <>
      <Page
        pokemons={chosen ? chosen : pokemons}
        PAGESIZE={PAGESIZE}
        currentPage={currentPage}
      />
      <Flex justifyContent={'center'}>
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className={currentPage <= 1 ? 'hide poke-button' : 'poke-button'}
          >
            Prev
          </button>
        )}
        {Array.from(
          { length: endButton - startButton + 1 },
          (_, index) => startButton + index - 1,
        ).map((element) => (
          <button
            key={element}
            onClick={() => setCurrentPage(element + 1)}
            className={
              element + 1 === currentPage
                ? 'activeButton poke-button'
                : 'poke-button'
            }
          >
            {element + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className={
              currentPage >= totalPages ? 'hide poke-button' : 'poke-button'
            }
          >
            Next
          </button>
        )}

        <button className="poke-button type-selector" onClick={onOpen}>
          Select Type
        </button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg='white'/>
        <ModalContent>
          <ModalHeader>Select Poke-Types</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            // style={{
            //   display: 'flex',
              
            //   alignItems: 'center',
            //   justifyContent: 'center',
            //   minHeight: '100vh',
            //   minWidth: '100vw',
            // }}
          >
            <ModalMenu
              onChange={onSelect}
              pokeTypes={props.pokeTypes}
              pokemons={pokemons}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button backgroundColor={'teal.300'} variant="ghost" onClick={onClose}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
