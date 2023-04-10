import { useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  FormControl,
  InputRightElement,
  useToast,
} from '@chakra-ui/react'
import { FaUserAlt, FaLock } from 'react-icons/fa'
import PokeBall from '../pokeball/PokeBall'
import { decodeToken } from 'react-jwt'

const Login = ({ onLogin }) => {
  const CFaUserAlt = chakra(FaUserAlt)
  const CFaLock = chakra(FaLock)
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const cookies = new Cookies()
  const toast = useToast()
  const [loggedIn, setLoggedIn] = useState(false)
  const handleShowClick = () => setShowPassword(!showPassword)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const reqBody = {
      username: username,
      password: password,
    }
    try {
      //TODO: Change this after back-end deployed
      const response = await axios.post(`https://pokeserver-m6v1.onrender.com/login`, reqBody)

      if (response.status !== 200) {
        localStorage.clear();
        cookies.remove('accessToken');
        setLoggedIn(false)
        return
      }

      const refreshToken = response.headers.refresh
      const accessToken = response.headers.bearer

      const decodedToken = decodeToken(accessToken)
      const isAdmin = decodedToken.role

      if (isAdmin === 'admin') cookies.set('isAdmin', 'true')

      
      localStorage.setItem('accessToken', accessToken)

      const maxAge = 100
      cookies.set('refreshToken', refreshToken, { maxAge })

      const refreshDecoded = decodeToken(refreshToken)


      localStorage.setItem('username', username)

      setLoggedIn(true)

      onLogin()
    } catch (error) {
      //TODO: log errors

      toast({
        title: 'Login failed',
        description: 'Please check your username and password and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }


  return (
    <div overflow={'hidden'} style={{ marginTop: '-7.5%' }}>
      <Flex
        flexDirection="column"
        width="100vw"
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
        >
          <PokeBall/>
          <Heading
            overflow={'hidden'}
            color="teal.400"
            fontFamily={'poke-font'}
            size={'4xl'}
          >
            Pokedex
          </Heading>
          <Box minW={{ base: '90%', md: '468px' }}>
            <form>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input
                      type="text"
                      placeholder="username"
                      required={true}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<CFaLock color="gray.300" />}
                    />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      required={true}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
        
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="teal"
                  width="full"
                  onClick={handleSubmit}
                >
                  Login
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
        <Box>
          Register{' '}
          <Link color="teal.500" href="#">
            Sign Up
          </Link>
        </Box>
      </Flex>
    </div>
  )
}

export default Login
