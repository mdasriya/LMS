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
  Radio,
} from "@chakra-ui/react";
import axios, { all } from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { isDisabled } from "@testing-library/user-event/dist/utils";

const BookingList = () => {
  const [selectedBlock, setSelectedBlock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [filteredPlots, setFilteredPlots] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [plotsData, setPlotsData] = useState([]);
  const [constructionApplicable, setConstructionApplicable] = useState("All");
  const [constructors, setConstructors] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const [selectContructor, setSelectConstructor] = useState(["All"]);

  const [selectBroker, setSelectBroker] = useState(["All"]);
  const [brokers, setBrokers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [allTotle, setAllTotle] = useState({
    PlotCount: 0,
    NetAmount: 0,
    RegistryAmount: 0,
    ServiceAmount: 0,
    MaintenanceAmount: 0,
    MiscAmount: 0,
    GrandTotal: 0,
    ConstructionAmount: 0,
    TotalAmountPayable: 0,
    BankAmountPayable: 0,
    CashAmountPayable: 0,
  });

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
          console.log("plot Data : ", response.data.phpresult);
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
  const filteredBookings = plotsData
    .filter((item) => {
      let itemDate = null;
      if (item.bookingDate) {
        itemDate = new Date(item.bookingDate).toISOString().split("T")[0];
      }

      return (
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
        (!selectedDate || !item.bookingDate || itemDate >= selectedDate) &&
        (!selectedEndDate ||
          !item.bookingDate ||
          itemDate <= selectedEndDate) &&
        (constructionApplicable === "All" ||
          item.constructionApplicable === constructionApplicable) &&
        (selectContructor[0] === "All" ||
          selectContructor.includes(item.constructionContractor)) &&
        (selectBroker[0] == "All" || selectBroker.includes(item.broker))
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const clearFilters = () => {
    setSelectedProject([]);
    setSelectedBlock([]);
    setSelectedPlot([]);
    setSelectedDate(null);
    setSelectedType([]);
    setConstructionApplicable("All");
    setSelectConstructor(["All"]);
    setSelectBroker(["All"]);
    setCurrentPage(0);
  };

  const handalSelectConstructore = (name) => {
    if (selectContructor.includes(name) && selectContructor.length === 1) {
      setSelectConstructor(["All"]);
    } else if (selectContructor.includes(name) && name !== "All") {
      setSelectConstructor(selectContructor.filter((item) => item !== name));
    } else {
      if (selectContructor.includes("All")) {
        setSelectConstructor([name]);
      } else if (name === "All") {
        setSelectConstructor(["All"]);
      } else {
        setSelectConstructor([...selectContructor, name]);
      }
    }
  };
  const handalSelectBrokers = (name) => {
    if (selectBroker.includes(name) && selectBroker.length === 1) {
      setSelectBroker(["All"]);
    } else if (selectBroker.includes(name) && name !== "All") {
      setSelectBroker(selectBroker.filter((item) => item !== name));
    } else {
      if (selectBroker.includes("All")) {
        setSelectBroker([name]);
      } else if (name === "All") {
        setSelectBroker(["All"]);
      } else {
        setSelectBroker([...selectContructor, name]);
      }
    }
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

  useEffect(() => {
    const uniqueConstructors = new Set();

    plotsData.forEach((data) => {
      if (
        data.constructionContractor &&
        data.constructionContractor.trim() !== ""
      ) {
        uniqueConstructors.add(data.constructionContractor);
      }
    });

    setConstructors(Array.from(uniqueConstructors));

    const uniqueBrokers = new Set();

    plotsData.forEach((data) => {
      if (data.broker && data.broker.trim() !== "") {
        uniqueBrokers.add(data.broker);
      }
    });

    setBrokers(Array.from(uniqueBrokers));
  }, [plotsData]);

  let PlotCount = 0,
    netAmount = 0,
    registryAmount = 0,
    serviceAmount = 0,
    maintenanceAmount = 0,
    miscAmount = 0,
    grandTotal = 0,
    constructionAmount = 0,
    totalAmountPayable = 0,
    bankAmountPayable = 0,
    cashAmountPayable = 0;

  filteredBookings.map((data, index) => {
    PlotCount += 1;
    netAmount += Number(data.netAmount);
    registryAmount += Number(data.registryAmount);
    serviceAmount += Number(data.serviceAmount);
    maintenanceAmount += Number(data.maintenanceAmount);
    miscAmount += Number(data.miscAmount);
    grandTotal += Number(data.grandTotal);
    constructionAmount += Number(data.constructionAmount);
    totalAmountPayable += Number(data.totalAmountPayable);
    bankAmountPayable += Number(data.bankAmountPayable);
    cashAmountPayable += Number(data.cashAmountPayable);
  });
  allTotle.PlotCount = PlotCount;
  allTotle.NetAmount = netAmount;
  allTotle.RegistryAmount = registryAmount;
  allTotle.ServiceAmount = serviceAmount;
  allTotle.MaintenanceAmount = maintenanceAmount;
  allTotle.MiscAmount = miscAmount;
  allTotle.GrandTotal = grandTotal;
  allTotle.ConstructionAmount = constructionAmount;
  allTotle.TotalAmountPayable = totalAmountPayable;
  allTotle.BankAmountPayable = bankAmountPayable;
  allTotle.CashAmountPayable = cashAmountPayable;

  console.log("All Totle : ", allTotle);
  return (
    <>
      <Center>
        <Heading size={"lg"}>Booking List</Heading>
      </Center>
      <Box maxW={"100%"} overflowX={"scroll"} marginTop={"0.1rem"}>
        <Flex
          justifyContent={"space-evenly"}
          p={"30px"}
          pos={"sticky"}
          left={0}
          flexWrap="wrap"
        >
          <Box mb={4}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Select Projects
              </MenuButton>
              <MenuList zIndex={999}>
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
          </Box>
          <Box mb={4}>
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
          </Box>
          <Box mb={4}>
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
          </Box>
          {/* <Box mb={4}>
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
                        handleCheckboxChange(
                          plot,
                          selectedPlot,
                          setSelectedPlot
                        )
                      }
                    >
                      {plot}
                    </Checkbox>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box> */}
          <Box mb={4}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Select ConstructionApplicable
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Radio
                    isChecked={constructionApplicable === "All"}
                    onChange={() => setConstructionApplicable("All")}
                  >
                    All
                  </Radio>
                </MenuItem>
                <MenuItem>
                  <Radio
                    isChecked={constructionApplicable === "Yes"}
                    onChange={() => setConstructionApplicable("Yes")}
                  >
                    Yes
                  </Radio>
                </MenuItem>
                <MenuItem>
                  <Radio
                    isChecked={constructionApplicable === "No"}
                    onChange={() => setConstructionApplicable("No")}
                  >
                    No
                  </Radio>
                </MenuItem>
              </MenuList>
            </Menu>{" "}
          </Box>

          <Box mb={4}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Select Contractor
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Checkbox
                    isChecked={selectContructor.includes("All")}
                    onChange={() => handalSelectConstructore("All")}
                  >
                    Select All
                  </Checkbox>
                </MenuItem>
                {constructors.map((constructorname, index) => (
                  <MenuItem key={index}>
                    <Checkbox
                      isChecked={selectContructor.includes(constructorname)}
                      value={constructorname}
                      onChange={(e) => handalSelectConstructore(e.target.value)}
                    >
                      {constructorname}
                    </Checkbox>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>

          <Box mb={4}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Select Broker
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Checkbox
                    isChecked={selectBroker.includes("All")}
                    onChange={() => handalSelectBrokers("All")}
                  >
                    Select All
                  </Checkbox>
                </MenuItem>
                {brokers.map((constructorname, index) => (
                  <MenuItem key={index}>
                    <Checkbox
                      isChecked={selectBroker.includes(constructorname)}
                      value={constructorname}
                      onChange={(e) => handalSelectBrokers(e.target.value)}
                    >
                      {constructorname}
                    </Checkbox>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
          <Box display={"flex"} mb={4}>
            <FormLabel
              textAlign={"center"}
              fontSize={"17px"}
              minWidth={"fit-content"}
              mt={"5px"}
            >
              Booking Date:
            </FormLabel>
            <Box display="flex" alignItems="center">
              <Text marginRight="4px">From</Text>
              <Text marginRight="4px">:</Text>
            </Box>
            <Input
              type="date"
              id="date"
              value={selectedDate || ""}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <Box display={"flex"} alignItems={"center"}>
              <Text mr={"4px"}>To</Text>
              <Text mr={"4px"}>:</Text>
            </Box>
            <Input
              type="date"
              id="enddate"
              value={selectedEndDate || currentDate}
              onChange={(e) => setSelectedEndDate(e.target.value)}
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
            <Flex
              justifyContent={"space-evenly"}
              p={"30px"}
              left={0}
              flexWrap="wrap"
            >
              <Box pl={"20px"} pr={"20px"} pb={"20px"}>
                <Text fontWeight={"bold"}>Count - {allTotle.PlotCount}</Text>
              </Box>
              <Box pl={"20px"} pr={"20px"} pb={"20px"}>
                <Text fontWeight={"bold"}>
                  Net Amount - {allTotle.NetAmount}
                </Text>
              </Box>
              <Box pl={"20px"} pr={"20px"} pb={"20px"}>
                <Text fontWeight={"bold"}>
                  Registry Amount - {allTotle.RegistryAmount}
                </Text>
              </Box>
              <Box pl={"20px"} pr={"20px"} pb={"20px"}>
                <Text fontWeight={"bold"}>
                  Service Amount - {allTotle.ServiceAmount}
                </Text>
              </Box>
              <Box pl={"20px"} pr={"20px"} pb={"20px"}>
                <Text fontWeight={"bold"}>
                  Maintenance Amount - {allTotle.MaintenanceAmount}
                </Text>
              </Box>
              <Box pl={"20px"} pr={"20px"} pb={"20px"}>
                <Text fontWeight={"bold"}>
                  Misc Amount - {allTotle.MiscAmount}
                </Text>
              </Box>
              <Box pl={"20px"} pr={"20px"} pb={"20px"}>
                <Text fontWeight={"bold"}>
                  Grand Total - {allTotle.GrandTotal}
                </Text>
              </Box>
              <Box pl={"20px"} pr={"20px"} pb={"20px"}>
                <Text fontWeight={"bold"}>
                  Construction Amount - {allTotle.ConstructionAmount}
                </Text>
              </Box>
              <Box pl={"20px"} pr={"20px"} pb={"20px"}>
                <Text fontWeight={"bold"}>
                  Total Amount Payable - {allTotle.TotalAmountPayable}
                </Text>
              </Box>
              <Box pl={"20px"} pr={"20px"} pb={"20px"}>
                <Text fontWeight={"bold"}>
                  Bank Amount Payable - {allTotle.BankAmountPayable}
                </Text>
              </Box>
              <Box pl={"20px"} pr={"20px"} pb={"20px"}>
                <Text fontWeight={"bold"}>
                  Cash Amount Payable - {allTotle.CashAmountPayable}
                </Text>
              </Box>
            </Flex>
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
                      BrokerName
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
                  {filteredBookings.map((data, index) => {
                    if (index < currentPage || index >= currentPage + 10) {
                      return;
                    }
                    return (
                      <Tr
                        key={data.srNo}
                        onClick={() => setSelectedRowIndex(index)}
                        bg={
                          selectedRowIndex === index
                            ? "green.200"
                            : "transparent"
                        }
                      >
                        <Td border="1px solid black">{index + 1}</Td>
                        <Td border="1px solid black">{data.projectName}</Td>
                        <Td border="1px solid black">{data.blockName}</Td>
                        <Td border="1px solid black">{data.plotNo}</Td>
                        <Td border="1px solid black">{data.plotType}</Td>
                        <Td border="1px solid black">{data.customerName}</Td>
                        <Td border="1px solid black">{data.customerAddress}</Td>
                        <Td border="1px solid black">{data.customerContact}</Td>
                        <Td border="1px solid black">{data.registryGender}</Td>
                        <Td border="1px solid black">{data.broker}</Td>
                        <Td border="1px solid black">{data.areaSqft}</Td>
                        <Td border="1px solid black">{data.rateAreaSqft}</Td>
                        <Td border="1px solid black">{data.totalAmount}</Td>
                        <Td border="1px solid black">
                          {data.discountApplicable}
                        </Td>
                        <Td border="1px solid black">{data.discountPercent}</Td>
                        <Td border="1px solid black">{data.netAmount}</Td>
                        <Td border="1px solid black">{data.registryAmount}</Td>
                        <Td border="1px solid black">{data.serviceAmount}</Td>
                        <Td border="1px solid black">
                          {data.maintenanceAmount}
                        </Td>
                        <Td border="1px solid black">{data.miscAmount}</Td>
                        <Td border="1px solid black">{data.grandTotal}</Td>
                        <Td border="1px solid black">
                          {data.constructionApplicable}
                        </Td>
                        <Td border="1px solid black">
                          {data.constructionContractor}
                        </Td>
                        <Td border="1px solid black">
                          {data.constructionAmount}
                        </Td>
                        <Td border="1px solid black">
                          {data.totalAmountPayable}
                        </Td>
                        <Td border="1px solid black">{data.guidelineAmount}</Td>
                        <Td border="1px solid black">{data.registryPercent}</Td>
                        <Td border="1px solid black">
                          {data.bankAmountPayable}
                        </Td>
                        <Td border="1px solid black">
                          {data.bookingDate
                            ? new Date(data.bookingDate)
                                .toLocaleDateString("en-GB")
                                .replace(/\//g, "-")
                            : ""}
                        </Td>

                        <Td border="1px solid black">
                          {data.cashAmountPayable}
                        </Td>
                        <Td border="1px solid black">{data.remarks}</Td>
                        {/* <Td>{data.registryDate}</Td> */}
                        {/* <Td>
                    <Button colorScheme="teal">Tally</Button>
                  </Td>
                  <Td>{data.status}</Td> */}
                      </Tr>
                    );
                  })}
                </Tbody>
              </TableContainer>
            </Table>

            <Box display={"flex"} justifyContent={"center"} mt={10}>
              <Button
                onClick={() => setCurrentPage(currentPage - 10)}
                isDisabled={currentPage == 0}
                mr={10}
              >
                Prev
              </Button>

              <Button
                onClick={() => setCurrentPage(currentPage + 10)}
                isDisabled={filteredBookings.length - 10 < currentPage}
                ml={10}
              >
                Next
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default BookingList;
