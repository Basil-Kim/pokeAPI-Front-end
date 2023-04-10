import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts'

import {
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  Box,
  HStack
} from '@chakra-ui/react'
import axios from 'axios'

export default function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  const toast = useToast()
  const [freqStats, setFreq] = useState([])
  const [users, setUsers] = useState([])
  const [date, setDate] = useState([])
  const [topUser, setTop] = useState(null)
  const [errors, setErrors] = useState([])
  const [hourErrs, setHrErrs] = useState([])



  useEffect(() => {
    const getLogs = async () => {
      const headers = {
        Bearer: accessToken,
        Refresh: refreshToken,
      }

      const params = {
        appid: headers.Bearer,
      }

      try {
        const response = await axios.get(
          'https://pokeserver-m6v1.onrender.com/admin/logs/history',
          { params, headers },
        )


        setFreq(Array.from(response.data.mostFrequentUsers))
        setUsers(Array.from(response.data.uniqueReport))
        setDate(Array.from(response.data.date))
        setTop(response.data.topUser[0]._id.user)

        const getErrors = (arr) => {

          const errors = arr.map(err => {
            let url = String(err._id)
            return {
              endPoint: url.length >= 20 ? url.substring(0, 20) : url,
              count: err.statuses.length
            }
          })

          return errors

        }

        const errs = getErrors(response.data.statusCounts)
        setErrors(errs)

       
        const getHourlyErrs = (arr) => {
          const err4xx = arr.filter(num => num >= 400 && num < 500)
          const err5xx = arr.filter(num => num >= 500)
          return [err4xx.length, err5xx.length]
        }

        const hourReport = getHourlyErrs(response.data.hourErrs[0].statuses)

        setHrErrs(hourReport)
        return response
      } catch (error) {
    

        const isAdmin = localStorage.getItem('isAdmin')
        if (isAdmin)
          toast({
            title: 'Failed to get logs',
            description: 'Please contact an admin',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
      }
    }

    getLogs()
  }, [isOpen])

 



  return (
    <>
      <Button onClick={onOpen}>Admin Dashboard</Button>

      <Modal size={'full'} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="white" />
        <ModalContent>
          <ModalHeader>History of API Usage from {`${date[0]?.minDate}`} to {`${date[0]?.maxDate}`}    </ModalHeader>
          <ModalCloseButton />
          <ModalBody>




          <Box marginLeft={'5%'} backgroundColor={'lightgray'} width={"30%"}>
          
          <Text fontSize={'1rem'} margin={'1%'} >{`Top user of PokeApi: ${topUser}`}</Text>
                <Text fontSize={'1rem'} margin={'1%'}>In the last hour there were: </Text>
                <Text marginLeft={'1rem'}>{`${hourErrs[0]}`} status 400 and {`${hourErrs[1]}`} status 500 errors</Text>
       
              </Box>
          <HStack>
            <Box marginTop={'1%'}>
              <Text marginLeft={'1%'}>Users  and  Visits</Text>
              {users ? 
              <>
                <BarChart
                  width={150}
                  height={150}
                  data={[
                    {
                      numUsers: Number(users[0]?.uniqueUsers),
                      key: Number(users[0]?.uniqueUsers),
                    },
                    {
                      numVisits: Number(users[0]?.maxCount),
                      key: Number(users[0]?.maxCount),
                    },
                  ]}
                >
                  <Bar dataKey="key" fill="#8884d8"/>
                 
                </BarChart>
                <Text marginLeft={'1%'}>{`${users[0]?.uniqueUsers} users  ${users[0]?.maxCount} visits`}</Text>
                </>
               : 
                <>Sorry it seems there is an issue loading the graph</>
              }
            </Box>
            

              

            </HStack>
            <TableContainer marginTop={'1%'}>
              <Table size="sm" variant="striped">
                <Thead>
                  <Tr>
                    <Th fontSize={'1rem'}>Url</Th>
                    <Th fontSize={'1rem'}>Top User</Th>
                  </Tr>
                </Thead>

                {freqStats ? (
                  freqStats.map((stat, index) => {
                    return (
                      <Tbody key={index}>
                        <Tr>
                          <Td>{stat._id}</Td>
                          <Td>{stat.mostFrequentUser}</Td>
                        </Tr>
                      </Tbody>
                    )
                  })
                ) : (
                  <Tbody>
                    There was an error, please check the server status
                  </Tbody>
                )}
              </Table>
            </TableContainer>

           


            <TableContainer marginTop={'1%'}>
              <Table size="sm" variant="striped">
                <Thead>
                  <Tr>
                    <Th fontSize={'1rem'}>Url</Th>
                    <Th fontSize={'1rem'}>4XX Errors</Th>
                  </Tr>
                </Thead>

                {errors ? (
                  errors.map((err, index) => {
                    return (
                      <Tbody key={index}>
                        <Tr>
                          <Td>{err.endPoint}</Td>
                          <Td>{err.count}</Td>
                        </Tr>
                      </Tbody>
                    )
                  })
                ) : (
                  <Tbody>
                    There was an error, please check the server status
                  </Tbody>
                )}
              </Table>
            </TableContainer>

          
          
         
          </ModalBody>
          <ModalFooter>
            <Button
              backgroundColor={'teal.300'}
              variant="ghost"
              onClick={onClose}
              marginRight={'50%'}
              marginTop={'0.25%'}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
