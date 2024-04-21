import React, { useState, useEffect, useRef } from "react";
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
  Text,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Button,
  FormLabel,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import axios from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useReactToPrint } from "react-to-print";

const BalanceReport = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [transaction, setTransaction] = useState([]);
  const [plotSatus, setPlotStatus] = useState([]);
  const [booking, setBooking] = useState([]);
  const [date, setDate] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [filteredPlots, setFilteredPlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatusDate, setSelectedStatusDate] = useState(null);

  const [statusOptions, setStatusOptions] = useState([]);

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
  const loadDate = async () => {
    let query = "SELECT registryDate FROM registry;";

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setDate(response.data.phpresult);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://lkgexcel.com/backend/getplot.php"
      );
      setPlotStatus(response.data);
      const statusOptions = response.data.map((plot) => plot.plotStatus);
      setStatusOptions([...new Set(statusOptions)]);
    } catch (error) {
      console.error("Error fetching plot data:", error);
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
          setBooking(response.data.phpresult);
        }
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  useEffect(() => {
    loadTransaction();
    fetchData();
    loadBooking();
    loadDate();
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
          selectedStatusDate)
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
  // console.log(plotSatus);
  // console.log(booking);
  // console.log(date);
  const calculateTotalReceived = (bookings) => {
    return bookings.reduce(
      (total, booking) => total + parseFloat(booking.totalReceived),
      0
    );
  };
  const calculateCashReceived = (bookings) => {
    return bookings.reduce(
      (total, booking) => total + parseFloat(booking.cashReceived),
      0
    );
  };
  const calculateBankReceived = (bookings) => {
    return bookings.reduce(
      (total, booking) => total + parseFloat(booking.bankReceived),
      0
    );
  };
  const tableRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    onBeforeGetContent: () => {
      setLoading(true);
      setButtonClicked(true); // Set button clicked to true when print is initiated
    },
    onAfterPrint: () => {
      setLoading(false);
      setButtonClicked(false); // Reset button clicked to false after print is done
    },
  });
  return (
    <>
      <Center>
        <Heading size={"md"}>Balance Report</Heading>
      </Center>
      <Box maxW={"100%"} overflowX={"scroll"} marginTop={"2rem"}>
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
              {statusOptions.map((status) => (
                <MenuItem key={status}>
                  <Checkbox
                    isChecked={selectedStatus === status}
                    onChange={() => handleStatusChange(status)}
                  >
                    {status}
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
          <Box display={"flex"}>
            <FormLabel
              textAlign={"center"}
              fontSize={"17px"}
              minWidth={"fit-content"}
              mt={"5px"}
            >
              Status Date:
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
          <Button ml={2} onClick={handlePrint} colorScheme="teal">
            Download Report
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
            <Table variant="simple" ref={tableRef}>
              <TableContainer>
                <Thead>
                  <Tr border="1px solid black" bg={"#121212"}>
                    <Th
                      border="1px solid black"
                      color={"white"}
                      p={"11px"}
                      textAlign={"center"}
                      lineHeight={"10px"}
                      className="print"
                    >
                      {" "}
                      SrNo
                    </Th>
                    <Th
                      border="1px solid black"
                      color={"white"}
                      p={"11px"}
                      className="print"
                      textAlign={"center"}
                    >
                      Project
                    </Th>
                    <Th
                      border="1px solid black"
                      color={"white"}
                      p={"5px "}
                      className="print"
                      textAlign={"center"}
                    >
                      Block
                    </Th>
                    <Th
                      border="1px solid black"
                      color={"white"}
                      className="print"
                      p={"11px"}
                      textAlign={"center"}
                    >
                      Plot
                    </Th>
                    <Th
                      border="1px solid black"
                      color={"white"}
                      className="print"
                      p={"11px"}
                      textAlign={"center"}
                    >
                      Cust
                    </Th>
                    <Th
                      border="1px solid black"
                      color={"white"}
                      className="print"
                      p={"11px"}
                      textAlign={"center"}
                    >
                      Cust Contact
                    </Th>
                    <Th
                      border="1px solid black"
                      color={"white"}
                      className="print"
                      p={"11px"}
                      textAlign={"center"}
                    >
                      Const App
                    </Th>
                    <Th
                      border="1px solid black"
                      color={"white"}
                      className="print"
                      p={"11px"}
                      textAlign={"center"}
                    >
                      Total Bal
                    </Th>
                    <Th
                      border="1px solid black"
                      color={"white"}
                      p={"11px"}
                      className="print"
                      textAlign={"center"}
                    >
                      Bank Bal
                    </Th>
                    <Th
                      border="1px solid black"
                      color={"white"}
                      className="print"
                      p={"11px"}
                      textAlign={"center"}
                    >
                      Cash Bal
                    </Th>
                    <Th
                      border="1px solid black"
                      color={"white"}
                      p={"11px"}
                      className="print"
                      textAlign={"center"}
                    >
                      Total Rec
                    </Th>{" "}
                    <Th
                      border="1px solid black"
                      color={"white"}
                      className="print"
                      p={"11px"}
                      textAlign={"center"}
                    >
                      Bank Rec
                    </Th>{" "}
                    <Th
                      border="1px solid black"
                      className="print"
                      color={"white"}
                      p={"11px"}
                      textAlign={"center"}
                    >
                      Cash Rec
                    </Th>{" "}
                    <Th
                      border="1px solid black"
                      className="print"
                      color={"white"}
                      p={"11px"}
                      textAlign={"center"}
                    >
                      Status Date
                    </Th>
                    <Th
                      border="1px solid black"
                      className="print"
                      color={"white"}
                      p={"11px"}
                      textAlign={"center"}
                    >
                      Status
                    </Th>
                    <Th
                      border="1px solid black"
                      color={"white"}
                      p={"11px"}
                      className="print"
                      textAlign={"center"}
                    >
                      Registry
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredBookings.map((data, index) => (
                    <Tr key={data.srNo}>
                      <Td
                        border="1px solid black"
                        p={"11px"}
                        className="print"
                        textAlign={"center"}
                      >
                        {index + 1}
                      </Td>
                      <Td
                        border="1px solid black"
                        className="print"
                        p={"11px"}
                        textAlign={"center"}
                      >
                        {data.projectName}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"11px"}
                        className="print"
                        textAlign={"center"}
                      >
                        {data.blockName}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"11px"}
                        className="print"
                        textAlign={"center"}
                      >
                        {data.plotno}
                      </Td>
                      {/* {plotSatus
                      .filter(
                        (stat) =>
                          stat.projectName === data.projectName &&
                          stat.blockName === data.blockName &&
                          stat.plotNo === data.plotno
                      )
                      .map((stat) => (
                        <React.Fragment key={stat.id}>
                          <Td border="1px solid black">{stat.plotStatus}</Td>
                          
                        </React.Fragment>
                      ))} */}
                      {booking
                        .filter(
                          (stat) =>
                            stat.projectName === data.projectName &&
                            stat.blockName === data.blockName &&
                            stat.plotNo === data.plotno
                        )
                        .map((stat) => (
                          <React.Fragment key={stat.id}>
                            <Td
                              border="1px solid black"
                              className="print"
                              p={"11px"}
                              textAlign={"center"}
                            >
                              {stat.customerName}
                            </Td>
                            <Td
                              border="1px solid black"
                              className="print"
                              p={"11px"}
                              textAlign={"center"}
                            >
                              {stat.customerContact}
                            </Td>
                            <Td
                              border="1px solid black"
                              className="print"
                              p={"11px"}
                              textAlign={"center"}
                            >
                              {stat.constructionApplicable}
                            </Td>
                          </React.Fragment>
                        ))}
                      <Td
                        border="1px solid black"
                        p={"11px"}
                        className="print"
                        textAlign={"center"}
                      >
                        {data.totalBalance}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"11px"}
                        className="print"
                        textAlign={"center"}
                      >
                        {data.bankBalance}
                      </Td>
                      <Td
                        border="1px solid black"
                        className="print"
                        p={"11px"}
                        textAlign={"center"}
                      >
                        {data.cashBalance}
                      </Td>

                      <Td
                        border="1px solid black"
                        className="print"
                        p={"11px"}
                        textAlign={"center"}
                      >
                        {data.totalReceived}
                      </Td>
                      <Td
                        border="1px solid black"
                        className="print"
                        p={"11px"}
                        textAlign={"center"}
                      >
                        {data.bankReceived}
                      </Td>
                      <Td
                        border="1px solid black"
                        className="print"
                        p={"11px"}
                        textAlign={"center"}
                      >
                        {data.cashReceived}
                      </Td>
                      <Td
                        border="1px solid black"
                        className="print"
                        p={"11px"}
                        textAlign={"center"}
                      >
                        {data.statusDate}
                      </Td>
                      {/* {date.map((d) => (
                      <React.Fragment key={d.id}>
                        {plotSatus.some(
                          (plot) => plot.plotStatus === "Registered"
                        ) && <Td border="1px solid black">{d.registryDate}</Td>}
                      </React.Fragment>
                    ))} */}

                      {/* {plotSatus.filter((stat)=>(
                      stat.plotStatus==="Registered" && {date.map((stat)=>(
                        <>
                        <Td>{stat.registryDate}</Td>
                        </>
                      ))}
                    ))} */}
                      {plotSatus
                        .filter(
                          (stat) =>
                            stat.projectName === data.projectName &&
                            stat.blockName === data.blockName &&
                            stat.plotNo === data.plotno
                        )
                        .map((stat) => (
                          <React.Fragment key={stat.id} textAlign={"center"}>
                            <Td border="1px solid black" className="print">
                              <Badge
                                colorScheme={
                                  stat.plotStatus === "Available"
                                    ? "yellow"
                                    : stat.plotStatus === "Booked"
                                    ? "red"
                                    : stat.plotStatus === "Registered"
                                    ? "green"
                                    : "gray"
                                }
                              >
                                {stat.plotStatus}
                              </Badge>
                            </Td>
                            {stat.plotStatus === "Registered" &&
                            date.length > 0 ? (
                              date.map((rd, index) => (
                                <Td
                                  key={index}
                                  border="1px solid black"
                                  p={"11px"}
                                  className="print"
                                  textAlign={"center"}
                                >
                                  {rd.registryDate}
                                </Td>
                              ))
                            ) : (
                              <Td
                                border="1px solid black"
                                textAlign={"center"}
                                className="print"
                              >
                                ----
                              </Td>
                            )}
                          </React.Fragment>
                        ))}
                    </Tr>
                  ))}
                  <Tr>
                    <Td colSpan={10}></Td>
                    <Td
                      textAlign="center"
                      border="1px solid black"
                      bg={"#121212"}
                      color={"white"}
                      fontWeight={"bold"}
                    >
                      Total : {calculateTotalReceived(filteredBookings)}
                    </Td>

                    <Td
                      textAlign="center"
                      border="1px solid black"
                      bg={"#121212"}
                      color={"white"}
                      fontWeight={"bold"}
                    >
                      Total : {calculateBankReceived(filteredBookings)}
                    </Td>

                    <Td
                      textAlign="center"
                      border="1px solid black"
                      bg={"#121212"}
                      color={"white"}
                      fontWeight={"bold"}
                    >
                      Total : {calculateCashReceived(filteredBookings)}
                    </Td>
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

export default BalanceReport;
