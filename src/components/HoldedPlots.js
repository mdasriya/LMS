import React from 'react'
import Nav from '../Nav'

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    // Badge,
    // Box,
    // Flex,
    Center,
    Text,
    // Input,
    // Button,
    // Spinner,
    // Checkbox,
    // Menu,
    // MenuButton,
    // MenuList,
    // MenuItem,
    // Select,
    // FormLabel,
    // Heading,
  } from "@chakra-ui/react";
//   import { useEffect, useState } from "react";
//   import axios from "axios";
//   import { ChevronDownIcon } from "@chakra-ui/icons";

  
function HoldedPlots() {

    // const [data,setData] = useState([])
    // const [loading,setLoading] = useState(true)
    // const [error,setError] = useState(null)

    // useEffect(()=>{
    //     axios.get('http//jwefwjcbjwdf').then()
    // },[])

    
    return (
        <div>
            <Nav />
            <Center>

                <Text fontSize="30px" fontWeight="600" p="20px">
                    Holded Plots
                </Text>
            </Center>

            <Table variant="simple" w={"100%"} colorScheme="blue">
                <Thead>
                    <Tr bg="gray.800" >

                        <Th color="white">Sr No.</Th>
                        <Th color="white">ProjectName</Th>
                        <Th color="white">BlockName</Th>
                        <Th color="white">PlotNo.</Th>
                        <Th color="white">AreaSqft</Th>
                        <Th color="white">AreaSqmt</Th>
                        <Th color="white">PlotType</Th>
                        <Th color="white">PlotStatus</Th>
                        {/* <Th color="white">BookingDate</Th> */}
                        {/* <Th color="white">CustName</Th> */}
                        {/* <Th color="white">CustNo.</Th> */}
                        {/* <Th color="white">RegistryDate</Th> */}
                    </Tr>
                </Thead>

                <Tbody>
                   
                        <Tr>
                            <Td>a</Td>
                            <Td fontWeight={700}>b</Td>
                            <Td>c</Td>
                            <Td>d</Td>
                            <Td>e</Td>
                            <Td>f</Td>
                            <Td>g</Td>
                            <Td> h</Td>

                            
                        </Tr>
                   
                </Tbody>

            </Table>

        </div>
    )
}

export default HoldedPlots
