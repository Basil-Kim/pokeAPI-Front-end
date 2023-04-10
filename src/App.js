import Page from './Page'
import Pagination from './Pagination'
import axios from 'axios'
import './styles.css'
import Login from './components/login/Login'
import Cookies from 'universal-cookie'
import { useEffect, useState } from 'react'
import { Button, HStack, Text, Flex, Box } from '@chakra-ui/react'
import Dashboard from './components/dashboard/Dashboard'

function App() {
  const [pokemons, setPokemons] = useState([])
  const [pokeTypes, setPokeTypes] = useState([])
  const [currentPage, setPage] = useState(1)
  const [loggedIn, setLogin] = useState(false)
  const [loading, setLoading] = useState(loggedIn)
  const [isAdmin, setAdmin] = useState(false)
  const compCookies = new Cookies()

  //TODO: this is for deployment as we need cookies and local storage to be set by user.

  const [localStorageEnabled, setLocalStorageEnabled] = useState(true)
  const [cookiesEnabled, setCookiesEnabled] = useState(true)

  useEffect(() => {
    // Check if local storage is enabled
    try {
      const storage = window.localStorage
      storage.setItem('__test__', '__test__')
      storage.removeItem('__test__')
    } catch (error) {
      setLocalStorageEnabled(false)
    }

    // Check if cookies are enabled
    const cookies = navigator.cookieEnabled
    if (!cookies) {
      setCookiesEnabled(false)
    }
  }, [])

  // END OF CHECK

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = checkLoggedInStatus()
    // Update state

    if (!isLoggedIn) {
      setLogin(false)
      return
    } else if (!isLoggedIn && loggedIn) {
      requestToken()
    }

    setLogin(isLoggedIn)

    setLoading(false)

    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')

        if (!accessToken) requestToken()

        const headers = { Bearer: accessToken }

        const response = await axios.get(
          //TODO:Change after backend deployed
          'https://pokeserver-m6v1.onrender.com/api/v1/pokemons',
          { headers },
        )

        if (response) {
          setPokemons(response.data)
        }
      } catch (error) {
        //TODO: log errors
   
      }
    }

    if (loggedIn) {
      fetchData()
      const isAdmin = compCookies.get('isAdmin')
      if (isAdmin) {
        setAdmin(true)
      } else {
        setAdmin(false)
      }

      // Log user out after 5 minutes
      if (loggedIn) {
        const logoutTime = setTimeout(() => {
          handleLogout()
        }, 1800000)

        return () => {
          clearTimeout(logoutTime)
        }
      }
      /////////////////////////////////////////
    }
  }, [loggedIn])

  useEffect(() => {
    const pokeTypesData = localStorage.getItem('pokeTypes')

    if (pokeTypesData) {
      const typesArr = pokeTypesData.split(',')

      setPokeTypes(typesArr)
    } else {
      const getTypes = async () => {
        try {
          const response = await axios(
            'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json',
          )
          const data = response.data

          const pokeTypes = data.map((i) => i.english)

          localStorage.setItem('pokeTypes', pokeTypes)
        } catch (error) {
          //TODO: log error and resolve issue (possible case for logout?)
        }
      }
      getTypes()
    }
  }, [])

  const checkLoggedInStatus = () => {
    const refreshToken = compCookies.get('refreshToken')
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken && !refreshToken) return false
    return true
  }

  const requestToken = async () => {
    try {
      const refreshToken = compCookies.get('refreshToken')
      if (!refreshToken) setLogin(false)
      if (refreshToken) {
        const headers = { Refresh: refreshToken }
        const response = await axios.post(
          'https://pokeserver-m6v1.onrender.com/requestNewAccessToken',
          {},
          { headers },
        )

        if (response) {
          localStorage.setItem('accessToken', response.headers.bearer)
        }

      }
    } catch (error) {
      console.log(error)
    }
  }


  const handleLogout = async () => {
    try {
      const username = localStorage.getItem('username')

      if (!username) {
        localStorage.clear()
        setLogin(false)
        return
      }

      const reqBody = {
        username: username,
      }

      const response = await axios.post('https://pokeserver-m6v1.onrender.com/logout', reqBody)
      if (!response) {

        setLogin(false)
        return
      }
      compCookies.remove('refreshToken')
      compCookies.remove('isAdmin')
      localStorage.removeItem('username')
      localStorage.removeItem('accessToken')
      setLogin(false)
    } catch (error) {

      setLogin(false)
    }
  }

  return (
    <>
      {!localStorageEnabled || !cookiesEnabled ? (
        <Box>
          <Text>Please set cookies and local storage</Text>
        </Box>
      ) : loading ? (
        <div>Loading...</div>
      ) : loggedIn ? (
        <>
          <Flex justifyContent={'center'}>
            <HStack
              style={{
                backgroundColor: 'lightgray',
                height: '50px',
                border: '1px solid black',
                borderRadius: '.5rem',
                display: 'inline-flex',
                margin: '1rem 5rem',
                overflow: 'hidden',
              }}
            >
              <Text
                width={'500px'}
                fontFamily={'poke-font'}
                fontSize={'50px'}
                zIndex={100}
                color={'teal.300'}
                textShadow="0px 1px 4px black"
                p="2"
              >
                POKEDEX
              </Text>

              {isAdmin ? <Dashboard/> : null}

              <Button onClick={handleLogout}>Logout</Button>
            </HStack>
          </Flex>
          <Pagination pokeTypes={pokeTypes} pokemons={pokemons} PAGESIZE={6} />
        </>
      ) : (
        <Login onLogin={() => setLogin(true)}></Login>
      )}
    </>
  )
}

export default App
