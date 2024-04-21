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
  Text,
  Heading,
  Button,
  Flex,
  Spinner,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";

const BookingList = () => {
  const [selectedBlock, setSelectedBlock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [filteredPlots, setFilteredPlots] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [plotsData, setPlotsData] = useState([]);
  const handleCheckboxChange = (value, state, setter) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };
  const loadBooking = async () => {
    let query = "SELECT * FROM booking;";

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setPlotsData(response.data.phpresult);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };
  useEffect(() => {
    loadBooking();
  }, []);
  const getUniqueValues = (key) => {
    return [...new Set(plotsData.map((item) => item[key]))];
  };

  const projectOptions = getUniqueValues("projectName");
  // const blockOptions = getUniqueValues("blockName");
  // const plotOptions = getUniqueValues("plotno");
  const filteredBookings = plotsData.filter(
    (item) =>
      (!selectedProject.length ||
        selectedProject.includes("Select All") ||
        selectedProject.includes(item.projectName)) &&
      (!selectedType.length ||
        selectedType.includes("Select All") ||
        selectedType.includes(item.plotType)) &&
      (!selectedBlock.length ||
        selectedBlock.includes("Select All") ||
        selectedBlock.includes(item.blockName)) &&
      (!selectedPlot.length ||
        selectedPlot.includes("Select All") ||
        selectedPlot.includes(item.plotNo)) &&
      (!selectedDate ||
        new Date(item.bookingDate).toISOString().split("T")[0] === selectedDate)
  );

  const clearFilters = () => {
    setSelectedProject([]);
    setSelectedBlock([]);
    setSelectedPlot([]);
    setSelectedDate(null);
    setSelectedType([]);
  };
  useEffect(() => {
    const blocks = getUniqueValues("blockName").filter(
      (block) =>
        !selectedProject.length ||
        block === "Select All" ||
        plotsData.some(
          (item) =>
            item.projectName === selectedProject[0] && item.blockName === block
        )
    );
    setFilteredBlocks([...blocks]);

    const plots = getUniqueValues("plotNo").filter(
      (plot) =>
        !selectedProject.length ||
        plot === "Select All" ||
        plotsData.some(
          (item) =>
            item.projectName === selectedProject[0] && item.plotNo === plot
        )
    );
    setFilteredPlots([...plots]);
  }, [selectedProject, plotsData]);
  return (
    <>
      <Center>
        <Heading size={"lg"}>Booking List</Heading>
      </Center>
      <Box maxW={"100%"} overflowX={"scroll"} marginTop={"3rem"}>
        <Flex
          justifyContent={"space-evenly"}
          p={"30px"}
          pos={"sticky"}
          left={0}
        >
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
              Select Plot Type
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox
                  isChecked={selectedType.includes("Select All")}
                  onChange={() =>
                    handleCheckboxChange(
                      "Select All",
                      selectedType,
                      setSelectedType
                    )
                  }
                >
                  Select All
                </Checkbox>
              </MenuItem>
              {getUniqueValues("plotType").map((plotType) => (
                <MenuItem key={plotType}>
                  <Checkbox
                    isChecked={selectedType.includes(plotType)}
                    onChange={() =>
                      handleCheckboxChange(
                        plotType,
                        selectedType,
                        setSelectedType
                      )
                    }
                  >
                    {plotType}
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
          <Table variant="simple">
            <TableContainer>
              <Thead>
                <Tr border="1px solid black" bg={"#121212"}>
                  <Th border="1px solid black" color={"white"}>
                    SrNo
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    projectName
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    blockName
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    plotNo
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    plotType
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    custName
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    customerAddress
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    customerContact
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    registryGender
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    areaSqft
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    rateAreaSqft
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    totalAmount
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    discountApplicable
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    discountPercent
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    netAmount
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    registryAmount
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    serviceAmount
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    maintenanceAmount
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    miscAmount
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    grandTotal
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    constructionApplicable
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    constructionContractor
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    constructionAmount
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    totalAmountPayable
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    guidelineAmount
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    registryPercent
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    bankAmountPayable
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    bookingDate
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    cashAmountPayable
                  </Th>
                  <Th border="1px solid black" color={"white"}>
                    remarks
                  </Th>
                  {/* <Th>registryDate</Th>
                <Th>Action</Th>
                <Th>Status</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {filteredBookings.map((data, index) => (
                  <Tr key={data.srNo}>
                    <Td border="1px solid black">{index + 1}</Td>
                    <Td border="1px solid black">{data.projectName}</Td>
                    <Td border="1px solid black">{data.blockName}</Td>
                    <Td border="1px solid black">{data.plotNo}</Td>
                    <Td border="1px solid black">{data.plotType}</Td>
                    <Td border="1px solid black">{data.customerName}</Td>
                    <Td border="1px solid black">{data.customerAddress}</Td>
                    <Td border="1px solid black">{data.customerContact}</Td>
                    <Td border="1px solid black">{data.registryGender}</Td>
                    <Td border="1px solid black">{data.areaSqft}</Td>
                    <Td border="1px solid black">{data.rateAreaSqft}</Td>
                    <Td border="1px solid black">{data.totalAmount}</Td>
                    <Td border="1px solid black">{data.discountApplicable}</Td>
                    <Td border="1px solid black">{data.discountPercent}</Td>
                    <Td border="1px solid black">{data.netAmount}</Td>
                    <Td border="1px solid black">{data.registryAmount}</Td>
                    <Td border="1px solid black">{data.serviceAmount}</Td>
                    <Td border="1px solid black">{data.maintenanceAmount}</Td>
                    <Td border="1px solid black">{data.miscAmount}</Td>
                    <Td border="1px solid black">{data.grandTotal}</Td>
                    <Td border="1px solid black">
                      {data.constructionApplicable}
                    </Td>
                    <Td border="1px solid black">
                      {data.constructionContractor}
                    </Td>
                    <Td border="1px solid black">{data.constructionAmount}</Td>
                    <Td border="1px solid black">{data.totalAmountPayable}</Td>
                    <Td border="1px solid black">{data.guidelineAmount}</Td>
                    <Td border="1px solid black">{data.registryPercent}</Td>
                    <Td border="1px solid black">{data.bankAmountPayable}</Td>
                    <Td border="1px solid black">{data.bookingDate}</Td>
                    <Td border="1px solid black">{data.cashAmountPayable}</Td>
                    <Td border="1px solid black">{data.remarks}</Td>
                    {/* <Td>{data.registryDate}</Td> */}
                    {/* <Td>
                    <Button colorScheme="teal">Tally</Button>
                  </Td>
                  <Td>{data.status}</Td> */}
                  </Tr>
                ))}
              </Tbody>
            </TableContainer>
          </Table>
        )}
      </Box>
    </>
  );
};

export default BookingList;
