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
  Tfoot,
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
const TransactionReport = () => {
  const [transaction, setTransaction] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [filteredPlots, setFilteredPlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatusDate, setSelectedStatusDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const handleCheckboxChange = (value, state, setter) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const loadTransaction = async () => {
    let query = "SELECT * FROM transaction;";

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

  const projectOptions = getUniqueValues("projectName");

  const filteredBookings = transaction.filter(
    (item) =>
      (!selectedProject.length ||
        selectedProject.includes("Select All") ||
        selectedProject.includes(item.projectName)) &&
      (!selectedBlock.length ||
        selectedBlock.includes("Select All") ||
        selectedBlock.includes(item.blockName)) &&
      (!selectedPlot.length ||
        selectedPlot.includes("Select All") ||
        selectedPlot.includes(item.plotno)) &&
      (!selectedDate ||
        new Date(item.date).toISOString().split("T")[0] === selectedDate) &&
      (!selectedStatusDate ||
        new Date(item.statusDate).toISOString().split("T")[0] ===
          selectedStatusDate) &&
      (selectedStatus === "All" || item.transactionStatus === selectedStatus)
  );

  const clearFilters = () => {
    setSelectedProject([]);
    setSelectedBlock([]);
    setSelectedPlot([]);
    setSelectedDate(null);
    setSelectedStatusDate(null);
    setSelectedStatus("All");
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

    const plots = getUniqueValues("plotno").filter(
      (plot) =>
        !selectedProject.length ||
        plot === "Select All" ||
        transaction.some(
          (item) =>
            item.projectName === selectedProject[0] && item.plotno === plot
        )
    );
    setFilteredPlots([...plots]);
  }, [selectedProject, transaction]);
  const totalAmount = filteredBookings.reduce(
    (total, booking) => total + parseFloat(booking.amount),
    0
  );

  return (
    <>
      <Center>
        <Heading size={"md"}>Transaction Report</Heading>
      </Center>
      <Box maxW={"100%"} overflowX={"scroll"} marginTop={"2rem"}>
        <Flex justifyContent={"space-evenly"} p={"30px"}>
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
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Status
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox
                  isChecked={selectedStatus === "All"}
                  onChange={() => handleStatusChange("All")}
                >
                  All
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  isChecked={selectedStatus === "Pending"}
                  onChange={() => handleStatusChange("Pending")}
                >
                  Pending
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  isChecked={selectedStatus === "Clear"}
                  onChange={() => handleStatusChange("Clear")}
                >
                  Clear
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  isChecked={selectedStatus === "PDC"}
                  onChange={() => handleStatusChange("PDC")}
                >
                  PDC
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  isChecked={selectedStatus === "Provisional"}
                  onChange={() => handleStatusChange("Provisional")}
                >
                  Provisional
                </Checkbox>
              </MenuItem>
              <MenuItem>
                <Checkbox
                  isChecked={selectedStatus === "Bounced"}
                  onChange={() => handleStatusChange("Bounced")}
                >
                  Bounced
                </Checkbox>
              </MenuItem>
            </MenuList>
          </Menu>
          <Box display={"flex"}>
            <FormLabel
              textAlign={"center"}
              fontSize={"17px"}
              minWidth={"fit-content"}
              mt={"5px"}
            >
              Select Date:
            </FormLabel>
            <Input
              type="date"
              id="date"
              value={selectedDate || ""}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Box>
          <Box display={"flex"}>
            <FormLabel
              textAlign={"center"}
              fontSize={"17px"}
              minWidth={"fit-content"}
              mt={"5px"}
            >
              Select Status Date:
            </FormLabel>
            <Input
              type="date"
              id="statusDate"
              value={selectedStatusDate || ""}
              onChange={(e) => setSelectedStatusDate(e.target.value)}
            />
          </Box>
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
            <Table variant="simple">
              <TableContainer>
                <Thead>
                  <Tr border="1px solid black" bg={"#121212"}>
                    <Th border="1px solid black" color={"white"}>
                      {" "}
                      SrNo
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"18px"}>
                      Project Name
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"18px"}>
                      Block Name
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"18px"}>
                      Plot No
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"18px"}>
                      Date
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"18px"}>
                      Payment Type
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"18px"}>
                      Amount
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"18px"}>
                      Bank Mode
                    </Th>

                    <Th border="1px solid black" color={"white"} p={"18px"}>
                      Cheq No
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"18px"}>
                      Bank Name
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"18px"}>
                      Transaction Status
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"18px"}>
                      Status Date
                    </Th>
                    <Th border="1px solid black" color={"white"} p={"18px"}>
                      Remakrs
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredBookings.map((data, index) => (
                    <Tr key={data.srNo}>
                      <Td border="1px solid black">{index + 1}</Td>
                      <Td border="1px solid black">{data.projectName}</Td>
                      <Td border="1px solid black">{data.blockName}</Td>
                      <Td border="1px solid black">{data.plotno}</Td>
                      <Td border="1px solid black">{data.date}</Td>
                      <Td border="1px solid black">{data.paymentType}</Td>
                      <Td border="1px solid black">{data.amount}</Td>
                      <Td border="1px solid black">{data.bankMode}</Td>
                      <Td border="1px solid black">{data.cheqNo}</Td>
                      <Td border="1px solid black">{data.bankName}</Td>
                      <Td
                        border="1px solid black"
                        style={{
                          backgroundColor:
                            data.transactionStatus === "Clear"
                              ? "#22c35e"
                              : data.transactionStatus === "Provisional" ||
                                data.transactionStatus === "Pending" ||
                                data.transactionStatus === "PDC"
                              ? "#ECC94B"
                              : "inherit",
                          color:
                            data.transactionStatus === "Clear"
                              ? "white"
                              : data.transactionStatus === "Provisional" ||
                                data.transactionStatus === "Pending" ||
                                data.transactionStatus === "PDC"
                              ? "black"
                              : data.transactionStatus === "Bounced"
                              ? "red" // Set text color to red when status is "Bounced"
                              : "inherit",
                          textDecoration:
                            data.transactionStatus === "Bounced"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {data.transactionStatus}
                      </Td>

                      <Td border="1px solid black">{data.statusDate}</Td>
                      <Td border="1px solid black">{data.remarks}</Td>
                    </Tr>
                  ))}
                  <Tr>
                    <Td colSpan={6}></Td>
                    <Td
                      textAlign="right"
                      border="1px solid black"
                      bg={"#121212"}
                      color={"white"}
                      fontWeight={"bold"}
                    >
                      Total: {totalAmount}
                    </Td>

                    <Td colSpan={5}></Td>
                  </Tr>
                </Tbody>
              </TableContainer>
            </Table>
          </>
        )}
      </Box>
    </>
  );
};

export default TransactionReport;
