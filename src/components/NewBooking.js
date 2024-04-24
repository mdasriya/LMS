import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Grid,
  Center,
  HStack,
  Heading,
  GridItem,
  useToast,
} from "@chakra-ui/react";
//import { getFormSubmissionInfo } from "react-router-dom/dist/dom";

import axios from "axios";

const NewBooking = () => {
  const [projectName, setProjectName] = useState("");
  const [blockName, setBlockname] = useState("");
  const [plotName, setPlotName] = useState("");
  const [contractorName, setcontractorName] = useState("");
  const [plottype, setplottype] = useState("");
  const [registerygender, setregisterygender] = useState("");
  const [discountApplicable, setdiscountApplicable] = useState("");
  const [constructionapplicable, setconstructionapplicable] = useState("No");
  const [broker, setBroker] = useState("");
  const plotTypes = ["Normal", "EWS", "1BHK", "2BHK", "3BHK", "4BHK", "5BHK"]; // Replace with actual plot types
  const genders = ["Male", "Female", "Other"]; // Replace with actual gender options
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const [formData, setFormData] = useState({
    projectName: "",
    blockName: "",
    plotNo: "",
    plotType: "",
    customerName: "",
    customerAddress: "",
    customerContact: "",
    registryGender: "",
    areaSqft: "",
    rateAreaSqft: "",
    totalAmount: "",
    discountApplicable: "No",
    discountPercent: "",
    netAmount: "",
    registryAmount: "",
    serviceAmount: "",
    maintenanceAmount: "",
    miscAmount: "",
    grandTotal: "",
    constructionApplicable: "No",
    constructionContractor: "",
    totalAmountPayable: "",
    guidelineAmount: "",
    registryPercent: "",
    bankAmountPayable: "",
    cashAmountPayable: "",
    bookingDate: "",
    constructionAmount: "",
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onAddBook = async () => {
    setIsSubmitting(true);
    const url = "https://lkgexcel.com/backend/setQuery.php";
    let query =
      "INSERT INTO booking (id, projectName, blockName, plotNo, plotType, customerName, customerAddress, customerContact, registryGender, areaSqft, rateAreaSqft, totalAmount, discountApplicable, discountPercent, netAmount, registryAmount, serviceAmount, maintenanceAmount, miscAmount, grandTotal, constructionApplicable, constructionContractor, constructionAmount, totalAmountPayable, guidelineAmount, registryPercent, bankAmountPayable, bookingDate, cashAmountPayable, broker,remarks) VALUES (NULL, '" +
      document.getElementById("projectName").value +
      "', '" +
      document.getElementById("blockName").value +
      "', '" +
      document.getElementById("plotNo").value +
      "', '" +
      document.getElementById("plotType").value +
      "', '" +
      document.getElementById("customerName").value +
      "', '" +
      document.getElementById("customerAddress").value +
      "', '" +
      document.getElementById("customerContact").value +
      "', '" +
      document.getElementById("registryGender").value +
      "', '" +
      document.getElementById("areaSqft").value +
      "', '" +
      document.getElementById("rateAreaSqft").value +
      "', '" +
      document.getElementById("totalAmount").value +
      "', '" +
      document.getElementById("discountApplicable").value +
      "', '" +
      document.getElementById("discountPercent").value +
      "', '" +
      document.getElementById("netAmount").value +
      "', '" +
      document.getElementById("registryAmount").value +
      "', '" +
      document.getElementById("serviceAmount").value +
      "', '" +
      document.getElementById("maintenanceAmount").value +
      "', '" +
      document.getElementById("miscAmount").value +
      "', '" +
      document.getElementById("grandTotal").value +
      "', '" +
      document.getElementById("constructionApplicable").value +
      "', '" +
      document.getElementById("constructionContractor").value +
      "', '" +
      document.getElementById("constructionAmount").value +
      "', '" +
      document.getElementById("totalAmountPayable").value +
      "', '" +
      document.getElementById("guidelineAmount").value +
      "', '" +
      document.getElementById("registryPercent").value +
      "', '" +
      document.getElementById("bankAmountPayable").value +
      "', '" +
      document.getElementById("bookingDate").value +
      "', '" +
      document.getElementById("cashAmountPayable").value +
      "', '" +
      document.getElementById("broker").value +
      "', '" +
      document.getElementById("remarks").value +
      "')";

    console.log(query);
    let fData = new FormData();
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
      console.log(response);
      updatePlotStatus();
      toast({
        title: "Booking added successfully!",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      document.getElementById("projectName").value = "";
      document.getElementById("blockName").value = "";
      document.getElementById("plotNo").value = "";
      document.getElementById("plotType").value = "";
      document.getElementById("customerName").value = "";
      document.getElementById("customerAddress").value = "";
      document.getElementById("customerContact").value = "";
      document.getElementById("registryGender").value = "";
      document.getElementById("areaSqft").value = "";
      document.getElementById("rateAreaSqft").value = "";
      document.getElementById("totalAmount").value = "";
      document.getElementById("discountApplicable").value = "";
      document.getElementById("discountPercent").value = "";
      document.getElementById("netAmount").value = "";
      document.getElementById("registryAmount").value = "";
      document.getElementById("serviceAmount").value = "";
      document.getElementById("maintenanceAmount").value = "";
      document.getElementById("miscAmount").value = "";
      document.getElementById("grandTotal").value = "";
      document.getElementById("constructionApplicable").value = "";
      document.getElementById("constructionContractor").value = "";
      document.getElementById("constructionAmount").value = "";
      document.getElementById("totalAmountPayable").value = "";
      document.getElementById("guidelineAmount").value = "";
      document.getElementById("registryPercent").value = "";
      document.getElementById("bankAmountPayable").value = "";
      document.getElementById("bookingDate").value = "";
      document.getElementById("cashAmountPayable").value = "";
      document.getElementById("remarks").value = "";
      setIsSubmitting(false);
    } catch (error) {
      console.log(error.toJSON());
      setIsSubmitting(false);
    }
  };

  const updatePlotStatus = async () => {
    const url = "https://lkgexcel.com/backend/setQuery.php";
    let query =
      "UPDATE plot SET plotStatus = 'Booked' WHERE plotNo = '" +
      plotName +
      "';";

    let fData = new FormData();
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
    } catch (error) {
      console.log(error.toJSON());
    }
  };

  const [projectsData, setprojectsData] = useState([]);
  const [blockData, setblockData] = useState([]);
  const [plotData, setplotData] = useState([]);
  const [contractorData, setcontractorData] = useState([]);
  const [master, setMaster] = useState([]);
  const [brokerData, setBrokerData] = useState([]);
  const loadBlocks = async (pname) => {
    let query = "SELECT * FROM block where projectName = '" + pname + "' ;";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setblockData(response.data.phpresult);
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const loadContractor = async () => {
    let query = "SELECT * FROM contractor;";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setcontractorData(response.data.phpresult);
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };
  const loadBroker = async () => {
    let query = "SELECT * FROM broker;";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setBrokerData(response.data.phpresult);
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };
  const loadPlots = async (bname) => {
    let query =
      "SELECT * FROM plot where blockName = '" +
      bname +
      "' AND projectName ='" +
      projectName +
      "' AND plotStatus ='Available' ;";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setplotData(response.data.phpresult);
          console.log("Ploat DAta : ", response.data);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const loadProjects = async () => {
    let query = "SELECT * FROM project;";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setprojectsData(response.data.phpresult);
          console.log("project data", response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const onSelectPlot = async (pno) => {
    let query =
      "SELECT * FROM plot where blockName = '" +
      blockName +
      "' AND projectName ='" +
      projectName +
      "' AND plotStatus ='Available' AND plotNo='" +
      pno +
      "';";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          console.log("onselect phot No : ", response.data.phpresult);

          let query1 =
            "SELECT * FROM master where projectName ='" + projectName + "';";
          // alert(query);

          const url = "https://lkgexcel.com/backend/getQuery.php";
          let fData1 = new FormData();

          fData1.append("query", query1);

          const response1 = await axios.post(url, fData1);

          if (response1 && response1.data) {
            if (response1.data.phpresult) {
              setMaster("masterData : ", response1.data.phpresult);

              document.getElementById("registryGender").value = "Male";

              // document.getElementById('plotType').style.backgroundColor = 'gray';
              // document.getElementById('plotType').disabled = true;
              // document.getElementById("plotType").value =
              //   response.data.phpresult[0]["plotType"];
              document.getElementById("areaSqft").value =
                response.data.phpresult[0]["areaSqft"];
              document.getElementById("rateAreaSqft").value =
                response.data.phpresult[0]["ratePerSqft"];
              document.getElementById("totalAmount").value =
                document.getElementById("areaSqft").value *
                document.getElementById("rateAreaSqft").value;
              document.getElementById("discountApplicable").value = "No";
              document.getElementById("discountPercent").value = "0";
              document.getElementById("netAmount").value =
                document.getElementById("totalAmount").value;
              document.getElementById("guidelineAmount").value =
                // response.data.phpresult[0]["areaSqft"] *
                response.data.phpresult[0]["areaSqmt"] *
                response1.data.phpresult[0]["guideline"];

              if (document.getElementById("registryGender").value == "Male") {
                document.getElementById("registryPercent").value =
                  response1.data.phpresult[0]["registryMalePercent"];
              }
              if (document.getElementById("registryGender").value == "Female") {
                document.getElementById("registryPercent").value =
                  response1.data.phpresult[0]["registryFemalePercent"];
              }

              document.getElementById("registryAmount").value =
                (document.getElementById("guidelineAmount").value *
                  document.getElementById("registryPercent").value) /
                100;
              if (response1.data.phpresult[0]["serviceType"] == "Lumpsum") {
                document.getElementById("serviceAmount").value =
                  response1.data.phpresult[0]["serviceValue"];
              }
              if (response1.data.phpresult[0]["serviceType"] == "PerSqmt") {
                document.getElementById("serviceAmount").value =
                  response1.data.phpresult[0]["serviceValue"] *
                  response.data.phpresult[0]["areaSqft"];
              }

              if (response1.data.phpresult[0]["maintenanceType"] == "Lumpsum") {
                document.getElementById("maintenanceAmount").value =
                  response1.data.phpresult[0]["maintenanceValue"];
              }
              if (response1.data.phpresult[0]["maintenanceType"] == "PerSqmt") {
                document.getElementById("maintenanceAmount").value =
                  response1.data.phpresult[0]["maintenanceValue"] *
                  response.data.phpresult[0]["areaSqft"];
              }

              if (response1.data.phpresult[0]["miscType"] == "Lumpsum") {
                document.getElementById("miscAmount").value =
                  response1.data.phpresult[0]["miscValue"];
              }
              if (response1.data.phpresult[0]["miscType"] == "PerSqmt") {
                document.getElementById("miscAmount").value =
                  response1.data.phpresult[0]["miscValue"] *
                  response.data.phpresult[0]["areaSqft"];
              }

              document.getElementById("grandTotal").value =
                parseFloat(document.getElementById("netAmount").value) +
                parseFloat(document.getElementById("registryAmount").value) +
                parseFloat(document.getElementById("serviceAmount").value) +
                parseFloat(document.getElementById("maintenanceAmount").value) +
                parseFloat(document.getElementById("miscAmount").value);

              document.getElementById("constructionApplicable").value = "No";

              if (
                document.getElementById("constructionApplicable").value == "No"
              ) {
                document.getElementById(
                  "constructionContractor"
                ).disabled = true;
                //document.getElementById('constructionContractor').style.backgroundColor = 'gray';
                document.getElementById("constructionAmount").disabled = true;
                //document.getElementById('constructionAmount').style.backgroundColor = 'gray';

                document.getElementById("totalAmountPayable").value =
                  document.getElementById("grandTotal").value;
              }
              if (
                document.getElementById("constructionApplicable").value == "Yes"
              ) {
                document.getElementById(
                  "constructionContractor"
                ).disabled = false;
                //document.getElementById('constructionContractor').style.backgroundColor = 'white';
                document.getElementById("constructionAmount").disabled = false;
                //document.getElementById('constructionAmount').style.backgroundColor = 'white';

                document.getElementById("totalAmountPayable").value =
                  parseFloat(document.getElementById("grandTotal").value) +
                  parseFloat(
                    document.getElementById("constructionAmount").value
                  );
              }

              document.getElementById("bankAmountPayable").value =
                document.getElementById("guidelineAmount").value;
              document.getElementById("cashAmountPayable").value = 0;
              document.getElementById("registry").value = 100;
            }
          }
        }
      }
    } catch (error) {
      console.log("erorrrr");
    }
  };

  const updateOnChange = () => {
    document.getElementById("totalAmount").value =
      document.getElementById("areaSqft").value *
      document.getElementById("rateAreaSqft").value;
    document.getElementById("netAmount").value =
      document.getElementById("totalAmount").value;

    if (document.getElementById("discountApplicable").value == "Yes") {
      document.getElementById("netAmount").value =
        document.getElementById("totalAmount").value -
        (document.getElementById("totalAmount").value / 100) *
          document.getElementById("discountPercent").value;
    } else if (document.getElementById("discountApplicable").value == "No") {
      document.getElementById("discountPercent").value = 0;
      document.getElementById("netAmount").value =
        document.getElementById("totalAmount").value;
    }

    {
      // This is Previous
      // document.getElementById("guidelineAmount").value =
      //   plotData[0]["areaSqmt"] * master[0]["guideline"];
    }

    if (document.getElementById("registryGender").value == "Male") {
      document.getElementById("registryPercent").value =
        master[0]["registryMalePercent"];
    }
    if (document.getElementById("registryGender").value == "Female") {
      document.getElementById("registryPercent").value =
        master[0]["registryFemalePercent"];
    }

    // this is for previous
    //  { document.getElementById("registryAmount").value =
    //     (document.getElementById("guidelineAmount").value *
    //       document.getElementById("registryPercent").value) /
    //     100;}
    if (master[0]["serviceType"] == "Lumpsum") {
      document.getElementById("serviceAmount").value =
        master[0]["serviceValue"];
    }
    if (master[0]["serviceType"] == "PerSqmt") {
      document.getElementById("serviceAmount").value =
        master[0]["serviceValue"] * plotData[0]["areaSqft"];
    }

    if (master[0]["maintenanceType"] == "Lumpsum") {
      document.getElementById("maintenanceAmount").value =
        master[0]["maintenanceValue"];
    }
    if (master[0]["maintenanceType"] == "PerSqmt") {
      document.getElementById("maintenanceAmount").value =
        master[0]["maintenanceValue"] * plotData[0]["areaSqft"];
    }

    if (master[0]["miscType"] == "Lumpsum") {
      document.getElementById("miscAmount").value = master[0]["miscValue"];
    }
    if (master[0]["miscType"] == "PerSqmt") {
      document.getElementById("miscAmount").value =
        master[0]["miscValue"] * plotData[0]["areaSqft"];
    }

    document.getElementById("grandTotal").value =
      parseFloat(document.getElementById("netAmount").value) +
      parseFloat(document.getElementById("registryAmount").value) +
      parseFloat(document.getElementById("serviceAmount").value) +
      parseFloat(document.getElementById("maintenanceAmount").value) +
      parseFloat(document.getElementById("miscAmount").value);

    if (document.getElementById("constructionApplicable").value == "Yes") {
      document.getElementById("constructionContractor").disabled = false;
      //document.getElementById('constructionContractor').style.backgroundColor = 'white';
      document.getElementById("constructionAmount").disabled = false;
      //document.getElementById('constructionAmount').style.backgroundColor = 'white';

      document.getElementById("totalAmountPayable").value =
        Number(document.getElementById("grandTotal").value) +
        Number(document.getElementById("constructionAmount").value);
    }
    if (document.getElementById("constructionApplicable").value == "No") {
      document.getElementById("constructionContractor").disabled = true;
      //document.getElementById('constructionContractor').style.backgroundColor = 'gray';
      document.getElementById("constructionAmount").disabled = true;
      //document.getElementById('constructionAmount').style.backgroundColor = 'gray';

      document.getElementById("totalAmountPayable").value =
        document.getElementById("grandTotal").value;
    }

    {
      // This is Previous
      // document.getElementById("bankAmountPayable").value =
      //   (document.getElementById("guidelineAmount").value *
      //     document.getElementById("registry").value) /
      //   100;
    }

    // document.getElementById("cashAmountPayable").value =
    //   document.getElementById("totalAmountPayable").value -
    //   document.getElementById("bankAmountPayable").value;
  };

  useEffect(() => {
    // Call the loadContractor function when the component mounts
    loadProjects();
    loadContractor();
    loadBroker();
  }, []);

  return (
    <Box p={4} width="100%" position={"relative"} bottom={"0rem"} >
      <Center pb={2}>
        <Heading fontSize={"22px"} position={"relative"} bottom={"1rem"}>
          New Booking
        </Heading>
      </Center>
      <Box position={"relative"} bottom={"1rem"}>
        <form onSubmit={onAddBook}>
          <Grid templateColumns="repeat(4, 1fr)" gap={1}>
            <FormControl colSpan={1} isRequired>
              <FormLabel>Project Name</FormLabel>
              <Select
                id="projectName"
                name="state"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  loadBlocks(e.target.value);
                }}
                placeholder="Select Project"
              >
                {projectsData.map((project) => {
                  return (
                    <option
                      key={project.projectName}
                      value={project.projectName}
                    >
                      {project.projectName}
                    </option>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Block Name</FormLabel>
              <Select
                id="blockName"
                name="state"
                value={blockName}
                onChange={(e) => {
                  setBlockname(e.target.value);
                  loadPlots(e.target.value);
                }}
                placeholder="Select Block"
              >
                {blockData.map((block) => {
                  return (
                    <option key={block.blockName} value={block.blockName}>
                      {block.blockName}
                    </option>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Plot No</FormLabel>
              <Select
                id="plotNo"
                name="state"
                value={plotName}
                onChange={(e) => {
                  setPlotName(e.target.value);
                  onSelectPlot(e.target.value);
                }}
                placeholder="Select Plot No"
              >
                {plotData.map((plot) => {
                  return (
                    <option key={plot.plotNo} value={plot.plotNo}>
                      {plot.plotNo}
                    </option>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Plot Type</FormLabel>
              <Select
                id="plotType"
                name="plotType"
                value={plottype}
                onChange={(e) => {
                  setplottype(e.target.value);
                }}
                //onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Plot Type
                </option>

                <option key="Normal" value="Normal">
                  Normal
                </option>
                <option key="EWS" value="EWS">
                  EWS
                </option>
                <option key="1BHK" value="1BHK">
                  1BHK
                </option>
                <option key="2BHK" value="2BHK">
                  2BHK
                </option>
                <option key="3BHK" value="3BHK">
                  3BHK
                </option>
                <option key="4BHK" value="4BHK">
                  4BHK
                </option>
                <option key="5BHK" value="5BHK">
                  5BHK
                </option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Customer Name</FormLabel>
              <Input
                id="customerName"
                type="text"
                name="customerName"
                //onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Customer Address</FormLabel>
              <Input
                id="customerAddress"
                type="text"
                name="customerAddress"
                //onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Customer Contact</FormLabel>
              <Input
                id="customerContact"
                type="text"
                name="customerContact"
                //onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Registry Gender</FormLabel>
              <Select
                id="registryGender"
                name="registryGender"
                onChange={(e) => {
                  setregisterygender(e.target.value);
                  updateOnChange();
                }}
                //onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Area Sqft</FormLabel>
              <Input
                onChange={updateOnChange}
                id="areaSqft"
                type="text"
                name="areaSqft"
                //onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Rate Per Sqft</FormLabel>
              <Input
                onChange={updateOnChange}
                id="rateAreaSqft"
                type="text"
                name="rateAreaSqft"
                //onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Total Amount</FormLabel>
              <Input
                onChange={updateOnChange}
                id="totalAmount"
                type="text"
                name="totalAmount"
                //onChange={handleChange}
                required
                bg={"yellow"}
                color={"black"}
              />
            </FormControl>
            <Box gridColumn="span 1" />
            <FormControl>
              <FormLabel>Discount Applicable</FormLabel>
              <Select
                id="discountApplicable"
                name="discountApplicable"
                onChange={(e) => {
                  setdiscountApplicable(e.target.value);
                  updateOnChange();
                }}
                //onChange={handleChange}
                required
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Discount Percent</FormLabel>
              <Input
                onChange={updateOnChange}
                id="discountPercent"
                type="text"
                name="discountPercent"
                //onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Net Amount</FormLabel>
              <Input
                onChange={updateOnChange}
                id="netAmount"
                type="text"
                name="netAmount"
                //onChange={handleChange}
                required
                bg={"yellow"}
              />
            </FormControl>
            <Box gridColumn="span 1" />
            <FormControl>
              <FormLabel>Registry Amount</FormLabel>
              <Input
                onChange={updateOnChange}
                id="registryAmount"
                type="text"
                name="registryAmount"
                //onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Service Amount</FormLabel>
              <Input
                onChange={updateOnChange}
                id="serviceAmount"
                type="text"
                name="serviceAmount"
                //onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Maintenance Amount</FormLabel>
              <Input
                onChange={updateOnChange}
                id="maintenanceAmount"
                type="text"
                name="maintenanceAmount"

                //onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Misc Amount</FormLabel>
              <Input
                onChange={updateOnChange}
                id="miscAmount"
                type="text"
                name="miscAmount"

                //onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Grand Total</FormLabel>
              <Input
                onChange={updateOnChange}
                id="grandTotal"
                type="text"
                name="grandTotal"
                //onChange={handleChange}
                bg={"yellow"}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Construction Applicable</FormLabel>
              <Select
                id="constructionApplicable"
                value={constructionapplicable}
                onChange={(e) => {
                  setconstructionapplicable(e.target.value);
                  updateOnChange();
                }}
                name="constructionApplicable"
                //onChange={handleChange}
                required
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Construction Contractor</FormLabel>

              <Select
                id="constructionContractor"
                type="text"
                name="constructionContractor"
                value={contractorName}
                onChange={(e) => {
                  setcontractorName();
                }}
                placeholder="Select Contactor"
              >
                {contractorData.map((block) => {
                  return (
                    <option
                      key={block.contractorName}
                      value={block.contractorName}
                    >
                      {block.contractorName}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Construction Amount</FormLabel>
              <Input
                onChange={updateOnChange}
                id="constructionAmount"
                type="text"
                name="constructionAmount"

                //onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Total Amount Payable</FormLabel>
              <Input
                onChange={updateOnChange}
                id="totalAmountPayable"
                type="text"
                name="totalAmountPayable"
                //onChange={handleChange}
                bg={"yellow"}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Guideline Amount</FormLabel>
              <Input
                onChange={updateOnChange}
                id="guidelineAmount"
                type="text"
                name="guidelineAmount"

                //onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Registry Percent</FormLabel>
              <Input
                type="text"
                onChange={updateOnChange}
                id="registry"
                //onChange={handleChange}
              />
              <Input
                onChange={updateOnChange}
                id="registryPercent"
                type="text"
                name="registryPercent"
                style={{ display: "none" }}
                //onChange={handleChange}
              />
            </FormControl>
            <Box gridColumn="span 1" />
            <Box
              display="grid"
              gridAutoFlow="column"
              position={"absolute"}
              top={"100%"}
              gap={"2rem"}
            >
              <FormControl>
                <FormLabel>Bank Amount Payable</FormLabel>
                <Input
                  onChange={updateOnChange}
                  id="bankAmountPayable"
                  type="text"
                  name="bankAmountPayable"
                  //onChange={handleChange}
                  bg={"yellow"}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Cash Amount Payable</FormLabel>
                <Input
                  onChange={updateOnChange}
                  id="cashAmountPayable"
                  type="text"
                  name="cashAmountPayable"
                  //onChange={handleChange}
                  bg={"yellow"}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Booking Date</FormLabel>
                <Input
                  onChange={updateOnChange}
                  id="bookingDate"
                  type="date"
                  name="bookingDate"
                  //onChange={handleChange}
                  required
                  defaultValue={new Date().toISOString().substr(0, 10)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Broker</FormLabel>

                <Select
                  id="broker"
                  type="text"
                  name="broker"
                  value={broker}
                  onChange={(e) => {
                    setBroker();
                  }}
                  placeholder="Select "
                >
                  {brokerData.map((block) => {
                    return (
                      <option key={block.brokerName} value={block.brokerName}>
                        {block.brokerName}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Remarks</FormLabel>
                <Input
                  onChange={updateOnChange}
                  id="remarks"
                  type="text"
                  name="remarks"
                  //onChange={handleChange}
                  required
                  width={"320px"}
                />
              </FormControl>

           
                <Button
                  colorScheme="blue"
                  type="button"
                  mt={8}
                  onClick={onAddBook}
                  isDisabled = {isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            

           
            </Box>
          </Grid>
        </form>
      </Box>
      <br /><br />
    </Box>
  );
};

export default NewBooking;
