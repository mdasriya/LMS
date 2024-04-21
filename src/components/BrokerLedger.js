import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Center,
  Heading,
  Flex,
  Spinner,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Button,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";

const BrokerLedger = () => {
  const [transaction, setTransaction] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [filteredPlots, setFilteredPlots] = useState([]);

  const handleCheckboxChange = (value, state, setter) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };

  const loadTransaction = async () => {
    let query = "SELECT * FROM brokerTransaction;";

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
      if (response && response.data) {
        if (response.data.phpresult) {
          setTransaction(response.data.phpresult);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  useEffect(() => {
    loadTransaction();
  }, []);

  const getUniqueValues = (key) => {
    return [...new Set(transaction.map((item) => item[key]))];
  };
  const getUniqueContractor = (key) => {
    return [...new Set(transaction.map((item) => item[key]))];
  };
  const projectOptions = getUniqueValues("projectName");
  const contractorOptions = getUniqueContractor("broker");

  const filteredBookings = transaction.filter(
    (item) =>
      (!selectedProject.length ||
        selectedProject.includes("Select All") ||
        selectedProject.includes(item.projectName)) &&
      (!selectedContractor.length ||
        selectedContractor.includes("Select All") ||
        selectedContractor.includes(item.broker)) &&
      (!selectedBlock.length ||
        selectedBlock.includes("Select All") ||
        selectedBlock.includes(item.blockName)) &&
      (!selectedPlot.length ||
        selectedPlot.includes("Select All") ||
        selectedPlot.includes(item.plotNo))
  );

  const clearFilters = () => {
    setSelectedProject([]);
    setSelectedContractor([]);
    setSelectedBlock([]);
    setSelectedPlot([]);
  };

  useEffect(() => {
    const blocks = getUniqueValues("blockName").filter(
      (block) =>
        !selectedProject.length ||
        block === "Select All" ||
        transaction.some(
          (item) =>
            item.projectName === selectedProject[0] && item.blockName === block
        )
    );
    setFilteredBlocks([...blocks]);

    const plots = getUniqueValues("plotNo").filter(
      (plot) =>
        !selectedProject.length ||
        plot === "Select All" ||
        transaction.some(
          (item) =>
            item.projectName === selectedProject[0] && item.plotNo === plot
        )
    );
    setFilteredPlots([...plots]);
  }, [selectedProject, transaction]);

  return (
    <>
      <Center>
        <Heading size={"md"}>Broker Ledger</Heading>
      </Center>
      <Box maxW={"100%"} overflowX={"scroll"} marginTop={"2rem"}>
        <Flex justifyContent={"space-evenly"}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Projects
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox
                  isChecked={selectedProject.includes("Select All")}
                  onChange={() =>
                    handleCheckboxChange(
                      "Select All",
                      selectedProject,
                      setSelectedProject
                    )
                  }
                >
                  Select All
                </Checkbox>
              </MenuItem>
              {projectOptions.map((project) => (
                <MenuItem key={project}>
                  <Checkbox
                    isChecked={selectedProject.includes(project)}
                    onChange={() =>
                      handleCheckboxChange(
                        project,
                        selectedProject,
                        setSelectedProject
                      )
                    }
                  >
                    {project}
                  </Checkbox>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Broker
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox
                  isChecked={selectedContractor.includes("Select All")}
                  onChange={() =>
                    handleCheckboxChange(
                      "Select All",
                      selectedContractor,
                      setSelectedContractor
                    )
                  }
                >
                  Select All
                </Checkbox>
              </MenuItem>
              {contractorOptions.map((contractor) => (
                <MenuItem key={contractor}>
                  <Checkbox
                    isChecked={selectedContractor.includes(contractor)}
                    onChange={() =>
                      handleCheckboxChange(
                        contractor,
                        selectedContractor,
                        setSelectedContractor
                      )
                    }
                  >
                    {contractor}
                  </Checkbox>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Blocks
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox
                  isChecked={selectedBlock.includes("Select All")}
                  onChange={() =>
                    handleCheckboxChange(
                      "Select All",
                      selectedBlock,
                      setSelectedBlock
                    )
                  }
                >
                  Select All
                </Checkbox>
              </MenuItem>
              {filteredBlocks.map((block) => (
                <MenuItem key={block}>
                  <Checkbox
                    isChecked={selectedBlock.includes(block)}
                    onChange={() =>
                      handleCheckboxChange(
                        block,
                        selectedBlock,
                        setSelectedBlock
                      )
                    }
                  >
                    {block}
                  </Checkbox>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Plots
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox
                  isChecked={selectedPlot.includes("Select All")}
                  onChange={() =>
                    handleCheckboxChange(
                      "Select All",
                      selectedPlot,
                      setSelectedPlot
                    )
                  }
                >
                  Select All
                </Checkbox>
              </MenuItem>
              {filteredPlots.map((plot) => (
                <MenuItem key={plot}>
                  <Checkbox
                    isChecked={selectedPlot.includes(plot)}
                    onChange={() =>
                      handleCheckboxChange(plot, selectedPlot, setSelectedPlot)
                    }
                  >
                    {plot}
                  </Checkbox>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Button ml={2} onClick={clearFilters} colorScheme="red">
            Clear Filters
          </Button>
        </Flex>
        {loading ? (
          <Flex align="center" justify="center" h="70vh">
            <Spinner
              size="xl"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
            />
          </Flex>
        ) : (
          <>
            <Text p={5} fontWeight={"bold"}>
              Count :- {filteredBookings.length}
            </Text>
            <Table variant="simple" size={"md"}>
              <TableContainer>
                <Thead>
                  <Tr border="1px solid black" bg={"#121212"}>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      {" "}
                      SrNo
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      Project
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      Block
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      Plot
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      Broker
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      Net Amt
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      Brokerage
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      Amt
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      Total Payable
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      {" "}
                      Total Paid
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      {" "}
                      Total Bal
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      Cheq
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      Date
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"26px"}>
                      {" "}
                      Remakrs
                    </Th>{" "}
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredBookings.map((data, index) => (
                    <Tr key={data.srNo}>
                      <Td border="1px solid black">{index + 1}</Td>
                      <Td border="1px solid black">{data.projectName}</Td>
                      <Td border="1px solid black">{data.blockName}</Td>
                      <Td border="1px solid black">{data.plotNo}</Td>
                      <Td border="1px solid black">{data.broker}</Td>

                      <Td border="1px solid black">{data.netAmount}</Td>
                      <Td border="1px solid black">{data.brokerage}</Td>

                      <Td border="1px solid black">{data.amount}</Td>
                      <Td border="1px solid black">{data.totalPayable}</Td>
                      <Td border="1px solid black">{data.totalPaid}</Td>
                      <Td border="1px solid black">{data.totalBalance}</Td>
                      <Td border="1px solid black">{data.cheq}</Td>
                      <Td border="1px solid black">{data.date}</Td>
                      <Td border="1px solid black">{data.remarks}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </TableContainer>
            </Table>
          </>
        )}
      </Box>
    </>
  );
};

export default BrokerLedger;
