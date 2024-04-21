import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import {
  Input,
  FormControl,
  FormLabel,
  Box,
  Flex,
  useToast,
  VStack,
  Textarea,
  HStack,
  Divider,
  Text,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  TableContainer,
} from "@chakra-ui/react";
import { useData } from "../Context";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { Link } from "react-router-dom";
const PaymentTransaction = () => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const { constructionData, setConstructionData } = useData();
  const [displa, setdisplay] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionIdToDelete, setTransactionIdToDelete] = useState(null);
  const toast = useToast();
  const [projectsData, setprojectsData] = useState([]);
  const [blockData, setblockData] = useState([]);
  const [plotData, setplotData] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [blockName, setBlockname] = useState("");
  const [plotName, setPlotName] = useState("");
  const [contractorName, setcontractorName] = useState("");
  const [brokerName, setbrokerName] = useState(" ");
  const [brokerData, setbrokerData] = useState([]);
  const [showButtons, setShowButtons] = useState(true);
  const [showPayment, setShowPayment] = useState(true);
  const [showAction, setShowAction] = useState(true);

  const [currentPlot, setCurrentPlot] = useState([]);
  const [contractorData, setcontractorData] = useState([]);
  const [tPlot, setPlot] = useState([]);
  const [transactionData, setTransactionData] = useState([]);

  const componentRef = useRef();
  const [transferProjectName, setTransferProjectName] = useState("");
  const [transferBlockName, setTransferBlockName] = useState("");
  const [transferPlotName, setTransferPlotName] = useState("");

  const [transferProject, setTransferProject] = useState([]);
  const [transferBlock, setTransferBlock] = useState([]);
  const [transferPlot, setTransferPlot] = useState([]);
  const [transferData, setTransferData] = useState({});
  const [transferredRows, setTransferredRows] = useState([]);
  // transfer all states
  const [isTransferAllModalOpen, setIsTransferAllModalOpen] = useState(false);
  const [transferAllProjectName, setTransferAllProjectName] = useState("");
  const [transferAllBlockName, setTransferAllBlockName] = useState("");
  const [transferAllPlotName, setTransferAllPlotName] = useState("");

  const [transferAllProject, setTransferAllProject] = useState([]);
  const [transferAllBlock, setTransferAllBlock] = useState([]);
  const [transferAllPlot, setTransferAllPlot] = useState([]);
  const [AllPlot, setAllPlot] = useState([]);
  useEffect(() => {
    const updatedTransactionData = transactionData.map((res, index) => {
      if (transferredRows.includes(index)) {
        return { ...res, Status: "Transferred" };
      }
      return res;
    });
    setTransactionData(updatedTransactionData);
  }, [transferredRows]);
  const transferTransactions = () => {
    const transferredTransactions = transactionData.filter((transaction) => {
      return (
        transaction.projectName === projectName &&
        transaction.blockName === blockName &&
        transaction.plotno === plotName
      );
    });

    setTransactionData((prevData) => [
      ...prevData,
      ...transferredTransactions.map((transaction) => ({
        ...transaction,
        project: transferAllProjectName,
        block: transferAllBlockName,
        plot: transferAllPlotName,
      })),
    ]);

    // Log the transfer message to the console
    console.log(
      `Transactions from ${projectName}, ${blockName}, ${plotName} have been transferred to ${transferAllProjectName}, ${transferAllBlockName}, ${transferAllPlotName}`
    );
  };
  const confirmTransferAll = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to transfer all transactions?"
    );

    if (isConfirmed) {
      transferTransactions();

      toast({
        title: "Transactions Transferred",
        description: `Transactions from ${projectName}, ${blockName}, ${plotName} have been transferred to ${transferAllProjectName}, ${transferAllBlockName}, ${transferAllPlotName}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
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
          setbrokerData(response.data.phpresult);
          console.log("Broker data");
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setShowButtons(false); // Hide the buttons before printing
      setShowPayment(false);
      setShowAction(false);
    },
    onAfterPrint: () => {
      setShowButtons(true); // Show the buttons after printing
      setShowPayment(true);
      setShowAction(true); // Show the buttons after printing
      // Show the buttons after printing
    },
  });
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
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };
  const loadTransferProjects = async () => {
    let query = "SELECT * FROM project;";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransferProject(response.data.phpresult);
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const loadTransferAllProjects = async () => {
    let query = "SELECT * FROM project;";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransferAllProject(response.data.phpresult);
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

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

  const loadTransferBlock = async (pname) => {
    let query = "SELECT * FROM block where projectName = '" + pname + "' ;";

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransferBlock(response.data.phpresult);
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };
  const loadTransferAllBlock = async (pname) => {
    let query = "SELECT * FROM block where projectName = '" + pname + "' ;";

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransferAllBlock(response.data.phpresult);
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
      "';";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setplotData(response.data.phpresult);
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };
  const loadTransferPlot = async (bname) => {
    let query =
      "SELECT * FROM plot where blockName = '" +
      bname +
      "' AND projectName ='" +
      transferProjectName +
      "';";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransferPlot(response.data.phpresult);
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const loadTransferAllPlot = async (bname) => {
    let query =
      "SELECT * FROM plot where blockName = '" +
      bname +
      "' AND projectName ='" +
      transferAllProjectName +
      "';";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransferAllPlot(response.data.phpresult);
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };
  const dataTransfer = async (plotName) => {
    let query =
      "SELECT * FROM booking where blockName = '" +
      transferBlockName +
      "' AND projectName ='" +
      transferProjectName +
      "' AND plotNo ='" +
      plotName +
      "'  ;";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setPlot(response.data.phpresult);
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const dataTransferAll = async (plotName) => {
    let query =
      "SELECT * FROM booking where blockName = '" +
      transferAllBlockName +
      "' AND projectName ='" +
      transferAllProjectName +
      "' AND plotNo ='" +
      plotName +
      "'  ;";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setAllPlot(response.data.phpresult);
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };
  const onRegistry = async () => {
    const userConfirmed = window.confirm(
      "Do you really want to registry this plot?"
    );

    if (!userConfirmed) {
      return;
    }
    const url = "https://lkgexcel.com/backend/setQuery.php";
    let query =
      "INSERT INTO registry (id, projectName, blockName, plotNo, plotType, customerName, customerAddress, customerContact, registryGender, areaSqft, rateAreaSqft, totalAmount, discountApplicable, discountPercent, netAmount, registryAmount, serviceAmount, maintenanceAmount, miscAmount, grandTotal, constructionApplicable, constructionContractor, constructionAmount, totalAmountPayable, guidelineAmount, registryPercent, bankAmountPayable,  cashAmountPayable,  registryDate) VALUES (NULL, '" +
      document.getElementById("projectName").value +
      "', '" +
      document.getElementById("blockName").value +
      "', '" +
      document.getElementById("plotNo").value +
      "', '" +
      document.getElementById("plotType").value +
      "', '" +
      document.getElementById("custName").value +
      "', '" +
      document.getElementById("custAddress").value +
      "', '" +
      currentPlot[0]["customerContact"] +
      "', '" +
      document.getElementById("registryGender").value +
      "', '" +
      document.getElementById("areaSqmt").value +
      "', '" +
      document.getElementById("ratePerSqmt").value +
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
      document.getElementById("cashAmountPayable").value +
      "', '" +
      // document.getElementById("remarks").value +
      // "', '" +
      document.getElementById("registryD").value +
      "');";

    console.log(query);
    let fData = new FormData();
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
      updatePlotStatusRegistry();
      toast({
        title: "Registry added successfully!",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      console.log(error.toJSON());
    }
  };
  const updatePlotStatusRegistry = async () => {
    const url = "https://lkgexcel.com/backend/setQuery.php";
    let query =
      "UPDATE plot SET plotStatus = 'Registered' WHERE plotNo = '" +
      plotName +
      "';";

    let fData = new FormData();
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
      console.log("Plot status updated to Registered.");
    } catch (error) {
      console.log(error.toJSON());
    }
  };
  const loadTransaction = async (plotData) => {
    let query =
      "SELECT * FROM transaction where blockName = '" +
      document.getElementById("blockName").value +
      "' AND projectName ='" +
      document.getElementById("projectName").value +
      "'AND plotno ='" +
      document.getElementById("plotNo").value +
      "';";
    // alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          setTransactionData(response.data.phpresult);
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const loadAmounts = async () => {
    let query =
      "SELECT sum(Amount) as asum FROM transaction where blockName = '" +
      document.getElementById("blockName").value +
      "' AND projectName ='" +
      document.getElementById("projectName").value +
      "'AND plotno ='" +
      document.getElementById("plotNo").value +
      "'  AND transactionStatus IN ('Provisional', 'PDC', 'Clear', 'Pending');";

    //alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          document.getElementById("totalReceived").innerHTML =
            response.data.phpresult[0]["asum"];
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const loadAmountsBAR = async () => {
    let query =
      "SELECT sum(Amount) as asum FROM transaction where blockName = '" +
      document.getElementById("blockName").value +
      "' AND projectName ='" +
      document.getElementById("projectName").value +
      "'AND plotno ='" +
      document.getElementById("plotNo").value +
      "' AND paymentType ='bank'  AND transactionStatus IN ('Provisional', 'PDC', 'Clear', 'Pending');";

    //alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          document.getElementById("bankReceived").innerHTML =
            response.data.phpresult[0]["asum"];
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const loadAmountsCAR = async () => {
    let query =
      "SELECT sum(Amount) as asum FROM transaction where blockName = '" +
      document.getElementById("blockName").value +
      "' AND projectName ='" +
      document.getElementById("projectName").value +
      "'AND plotno ='" +
      document.getElementById("plotNo").value +
      "' AND paymentType ='cash'  AND transactionStatus IN ('Provisional', 'PDC', 'Clear', 'Pending');";

    //alert(query);

    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          document.getElementById("cashReceived").innerHTML =
            response.data.phpresult[0]["asum"];
          console.log(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };
  const calcAmounts = () => {
    const totalReceivedElem = document.getElementById("totalReceived");
    const bankReceivedElem = document.getElementById("bankReceived");
    const cashReceivedElem = document.getElementById("cashReceived");
    const totalPayableElem = document.getElementById("totalPayable");
    const bankPayableElem = document.getElementById("bankPayable");
    const cashPayableElem = document.getElementById("cashPayable");

    if (
      totalReceivedElem &&
      bankReceivedElem &&
      cashReceivedElem &&
      totalPayableElem &&
      bankPayableElem &&
      cashPayableElem
    ) {
      const totalReceived = parseInt(totalReceivedElem.innerHTML) || 0;
      const bankReceived = parseInt(bankReceivedElem.innerHTML) || 0;
      const cashReceived = parseInt(cashReceivedElem.innerHTML) || 0;
      const totalPayable = parseInt(totalPayableElem.innerHTML) || 0;
      const bankPayable = parseInt(bankPayableElem.innerHTML) || 0;
      const cashPayable = parseInt(cashPayableElem.innerHTML) || 0;

      document.getElementById("totalBalance").innerHTML =
        totalPayable - totalReceived;
      document.getElementById("bankBalance").innerHTML =
        bankPayable - bankReceived;
      document.getElementById("cashBalance").innerHTML = parseInt(
        cashPayable - cashReceived
      );
    } else {
      console.log("One or more elements not found");
    }
  };

  const setData = async (plotName) => {
    let query =
      "SELECT * FROM booking where blockName = '" +
      blockName +
      "' AND projectName ='" +
      projectName +
      "' AND plotNo ='" +
      plotName +
      "'  ;";
    // alert(query);
    const url = "https://lkgexcel.com/backend/getQuery.php";
    let fData = new FormData();

    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);

      if (response && response.data) {
        if (response.data.phpresult) {
          const constructionData = {
            contractor: response.data.phpresult[0]["constructionContractor"],
            amount: response.data.phpresult[0]["constructionAmount"],
            projectName: projectName,
            blockName: blockName,
            plotNo: plotName,
            brokerName: response.data.phpresult[0]["broker"],
          };

          setConstructionData(constructionData);

          setCurrentPlot(response.data.phpresult);
          console.log(response.data.phpresult);
          document.getElementById("plotType").value =
            response.data.phpresult[0]["plotType"];
          document.getElementById("custName").value =
            response.data.phpresult[0]["customerName"];
          document.getElementById("custAddress").value =
            response.data.phpresult[0]["customerAddress"];
          //    document.getElementById("customerContact").value = response.data.phpresult[0]['customerContact'];
          document.getElementById("registryGender").value =
            response.data.phpresult[0]["registryGender"];
          document.getElementById("areaSqmt").value =
            response.data.phpresult[0]["areaSqft"];
          document.getElementById("ratePerSqmt").value =
            response.data.phpresult[0]["rateAreaSqft"];
          document.getElementById("totalAmount").value =
            response.data.phpresult[0]["totalAmount"];
          document.getElementById("discountApplicable").value =
            response.data.phpresult[0]["discountApplicable"];
          document.getElementById("discountPercent").value =
            response.data.phpresult[0]["discountPercent"];
          document.getElementById("netAmount").value =
            response.data.phpresult[0]["netAmount"];
          document.getElementById("registryAmount").value =
            response.data.phpresult[0]["registryAmount"];
          document.getElementById("serviceAmount").value =
            response.data.phpresult[0]["serviceAmount"];
          document.getElementById("maintenanceAmount").value =
            response.data.phpresult[0]["maintenanceAmount"];
          document.getElementById("miscAmount").value =
            response.data.phpresult[0]["miscAmount"];
          document.getElementById("grandTotal").value =
            response.data.phpresult[0]["grandTotal"];
          document.getElementById("constructionApplicable").value =
            response.data.phpresult[0]["constructionApplicable"];
          setcontractorName(
            response.data.phpresult[0]["constructionContractor"]
          );
          setbrokerName(response.data.phpresult[0]["broker"]);
          document.getElementById("totalAmountPayable").value =
            response.data.phpresult[0]["totalAmountPayable"];
          document.getElementById("guidelineAmount").value =
            response.data.phpresult[0]["guidelineAmount"];
          document.getElementById("registryPercent").value =
            response.data.phpresult[0]["registryPercent"];
          document.getElementById("bankAmountPayable").value =
            response.data.phpresult[0]["bankAmountPayable"];
          document.getElementById("cashAmountPayable").value =
            response.data.phpresult[0]["cashAmountPayable"];
          document.getElementById("bookingDate").value =
            response.data.phpresult[0]["bookingDate"];
          document.getElementById("constructionAmount").value =
            response.data.phpresult[0]["constructionAmount"];

          document.getElementById("bankPayable").innerHTML =
            response.data.phpresult[0]["bankAmountPayable"];
          document.getElementById("cashPayable").innerHTML =
            response.data.phpresult[0]["cashAmountPayable"];
          document.getElementById("totalPayable").innerHTML =
            response.data.phpresult[0]["totalAmountPayable"];

          document.getElementById("plotStatus").value =
            plotData[0]["plotStatus"];

          loadAmounts(response.data.phpresult);
          loadAmountsBAR();
          loadAmountsCAR();
          setTimeout(function () {
            calcAmounts();
          }, 3000);
          loadTransaction(response.data.phpresult);
        }
      }
    } catch (error) {
      console.log("Please Select Proper Input");
    }
  };

  const addPayment = async () => {
    const url = "https://lkgexcel.com/backend/setQuery.php";
    const date = document.getElementById("date").value;
    const paymentType = document.getElementById("paymentType").value;
    const amount = parseInt(document.getElementById("amount").value);
    const bankMode = document.getElementById("bankMode").value;
    const cheqNo = document.getElementById("cheqNo").value;
    const bankName = document.getElementById("bankName").value;
    const transactionStatus =
      document.getElementById("transactionStatus").value;
    const statusDate = document.getElementById("statusDate").value;
    const remarks = document.getElementById("remarks").value;

    if (
      !date ||
      !paymentType ||
      isNaN(amount) ||
      !bankMode ||
      !cheqNo ||
      !bankName ||
      !transactionStatus ||
      !statusDate ||
      !remarks
    ) {
      alert("Please fill in all required fields.");
      return; // Don't submit if any field is empty
    }

    try {
      // Subtract payment amount from total balance
      const totalBalanceElem = document.getElementById("totalBalance");
      let totalBalance = parseInt(totalBalanceElem.innerHTML) || 0;
      totalBalance -= amount;
      totalBalanceElem.innerHTML = totalBalance;
      console.log(`Total Balance: ${totalBalance}`);

      // Subtract payment amount from bank balance if payment type is Bank
      const bankBalanceElem = document.getElementById("bankBalance");
      let bankBalance = parseInt(bankBalanceElem.innerHTML) || 0;
      if (paymentType === "Bank") {
        bankBalance -= amount;
        bankBalanceElem.innerHTML = bankBalance;
        console.log(`Bank Balance: ${bankBalance}`);
      }

      // Subtract payment amount from cash balance if payment type is Cash
      const cashBalanceElem = document.getElementById("cashBalance");
      let cashBalance = parseInt(cashBalanceElem.innerHTML) || 0;
      if (paymentType === "Cash") {
        cashBalance -= amount;
        cashBalanceElem.innerHTML = cashBalance;
        console.log(`Cash Balance: ${cashBalance}`);
      }

      // Update total received and bank received
      let totalReceivedElem = document.getElementById("totalReceived");
      let bankReceivedElem = document.getElementById("bankReceived");
      let cashReceivedElem = document.getElementById("cashReceived");
      let totalReceived = parseInt(totalReceivedElem.innerHTML) || 0;
      let bankReceived = parseInt(bankReceivedElem.innerHTML) || 0;
      let cashReceived = parseInt(cashReceivedElem.innerHTML) || 0;

      totalReceived += amount;
      totalReceivedElem.innerHTML = totalReceived;
      console.log(`Total Received: ${totalReceived}`);

      if (paymentType === "Bank") {
        bankReceived += amount;
        bankReceivedElem.innerHTML = bankReceived;
        // cashReceived = 0;
        console.log(`Bank Received: ${bankReceived}`);
      } else if (paymentType === "Cash") {
        cashReceived += amount;
        cashReceivedElem.innerHTML = cashReceived;
        // bankReceived = 0;
        console.log(`Cash Received: ${cashReceived}`);
      }

      const query = `INSERT INTO transaction (id, projectName, blockName, plotno, date, paymentType, amount, bankMode, cheqNo, bankName, transactionStatus, statusDate, remarks, totalBalance, bankBalance, cashBalance, totalReceived, bankReceived, cashReceived) VALUES (NULL, '${plotData[0]["projectName"]}', '${plotData[0]["blockName"]}', '${plotData[0]["plotNo"]}', '${date}', '${paymentType}', '${amount}', '${bankMode}', '${cheqNo}', '${bankName}', '${transactionStatus}', '${statusDate}', '${remarks}', '${totalBalance}', '${bankBalance}', '${cashBalance}', '${totalReceived}', '${bankReceived}', '${cashReceived}');`;

      const formData = new FormData();
      formData.append("query", query);

      const response = await axios.post(url, formData);

      toast({
        title: "Payment added successfully!",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });

      loadAmounts();
      loadTransaction();
      loadAmountsBAR();
      loadAmountsCAR();

      setTimeout(function () {
        calcAmounts();
      }, 500);

      // Reset form fields
      document.getElementById("date").value = "";
      document.getElementById("paymentType").value = "";
      document.getElementById("amount").value = "";
      document.getElementById("bankMode").value = "";
      document.getElementById("cheqNo").value = "";
      document.getElementById("bankName").value = "";
      document.getElementById("transactionStatus").value = "";
      document.getElementById("statusDate").value = "";
      document.getElementById("remarks").value = "";
    } catch (error) {
      console.log(error.toJSON());
    }
  };

  useEffect(() => {
    loadProjects();
    loadTransferProjects();
    loadTransferAllProjects();
    loadBroker();
    loadContractor();
  }, []);
  const deletePayment = async () => {
    const url = "https://lkgexcel.com/backend/setQuery.php";
    let query =
      "DELETE FROM transaction WHERE id = " + transactionIdToDelete + ";";

    let fData = new FormData();
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
      console.log(fData);
      toast({
        title: "Payment deleted successfully!",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });

      // Call your load functions after deletion
      loadAmounts();
      loadTransaction();
      loadAmountsBAR();
      loadAmountsCAR();
      setTimeout(function () {
        calcAmounts();
      }, 3000);
    } catch (error) {
      console.log(error.toJSON());
    } finally {
      // Reset the state after handling delete
      setIsDeleteDialogOpen(false);
      setTransactionIdToDelete(null);
    }
  };

  const handleDeletePayment = (transactionId) => {
    setTransactionIdToDelete(transactionId);
    setIsDeleteDialogOpen(true);
  };

  const updateTransactionStatus = async () => {
    const url = "https://lkgexcel.com/backend/setQuery.php";
    const query =
      "UPDATE transaction SET Status = 'Cancelled' WHERE plotNo = '" +
      plotName +
      "';";

    const fData = new FormData();
    fData.append("query", query);

    try {
      const response = await axios.post(url, fData);
      return true; // Indicate success
    } catch (error) {
      console.log(error.toJSON());
      return false; // Indicate failure
    }
  };
  const cancelPlot = async () => {
    // Display a confirmation dialog
    const userConfirmed = window.confirm(
      "Do you really want to cancel the plot?"
    );

    // Check if the user confirmed
    if (userConfirmed) {
      const url = "https://lkgexcel.com/backend/setQuery.php";
      let query =
        "UPDATE plot SET plotStatus = 'Available' WHERE plotNo = '" +
        plotName +
        "';";

      const fData = new FormData();
      fData.append("query", query);

      try {
        const response = await axios.post(url, fData);

        // Update transaction status
        const transactionStatusUpdated = await updateTransactionStatus(
          plotName
        );

        if (transactionStatusUpdated) {
          // Show success toast
          toast({
            title: "Plot canceled successfully!",
            status: "success",
            duration: 3000,
            position: "top",
            isClosable: true,
          });
          window.location.reload();
        } else {
          // Show error toast if transaction status update fails
          toast({
            title: "Failed to cancel plot. Please try again.",
            status: "error",
            duration: 3000,
            position: "top",
            isClosable: true,
          });
        }
      } catch (error) {
        console.log(error.toJSON());

        // Show error toast
        toast({
          title: "Failed to cancel plot. Please try again.",
          status: "error",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
      }
    }
  };
  const editPlot = async () => {
    // Display a confirmation dialog
    const userConfirmed = window.confirm(
      "Do you really want to edit the plot?"
    );

    // Check if the user confirmed
    if (userConfirmed) {
      const url = "https://lkgexcel.com/backend/setQuery.php";
      var updateQuery = "UPDATE booking SET ";
      updateQuery +=
        "projectName = '" +
        document.getElementById("projectName").value +
        "', ";
      updateQuery +=
        "blockName = '" + document.getElementById("blockName").value + "', ";
      updateQuery +=
        "plotNo = '" + document.getElementById("plotNo").value + "', ";
      updateQuery +=
        "plotType = '" + document.getElementById("plotType").value + "', ";
      updateQuery +=
        "customerName = '" + document.getElementById("custName").value + "', ";
      updateQuery +=
        "customerAddress = '" +
        document.getElementById("custAddress").value +
        "', ";
      updateQuery +=
        "areaSqft = '" + document.getElementById("areaSqmt").value + "', ";
      updateQuery +=
        "rateAreaSqft = '" +
        document.getElementById("ratePerSqmt").value +
        "', ";
      updateQuery +=
        "totalAmount = '" +
        document.getElementById("totalAmount").value +
        "', ";
      updateQuery +=
        "discountApplicable = '" +
        document.getElementById("discountApplicable").value +
        "', ";
      updateQuery +=
        "discountPercent = '" +
        document.getElementById("discountPercent").value +
        "', ";
      updateQuery +=
        "netAmount = '" + document.getElementById("netAmount").value + "', ";
      updateQuery +=
        "registryAmount = '" +
        document.getElementById("registryAmount").value +
        "', ";
      updateQuery +=
        "serviceAmount = '" +
        document.getElementById("serviceAmount").value +
        "', ";
      updateQuery +=
        "maintenanceAmount = '" +
        document.getElementById("maintenanceAmount").value +
        "', ";
      updateQuery +=
        "miscAmount = '" + document.getElementById("miscAmount").value + "', ";
      updateQuery +=
        "grandTotal = '" + document.getElementById("grandTotal").value + "', ";
      updateQuery +=
        "constructionApplicable = '" +
        document.getElementById("constructionApplicable").value +
        "', ";
      updateQuery +=
        "constructionContractor = '" +
        document.getElementById("constructionContractor").value +
        "', ";
      updateQuery +=
        "constructionAmount = '" +
        document.getElementById("constructionAmount").value +
        "', ";
      updateQuery +=
        "totalAmountPayable = '" +
        document.getElementById("totalAmountPayable").value +
        "', ";
      updateQuery +=
        "guidelineAmount = '" +
        document.getElementById("guidelineAmount").value +
        "', ";
      updateQuery +=
        "registryPercent = '" +
        document.getElementById("registryPercent").value +
        "', ";
      updateQuery +=
        "bankAmountPayable = '" +
        document.getElementById("bankAmountPayable").value +
        "', ";
      updateQuery +=
        "bookingDate = '" +
        document.getElementById("bookingDate").value +
        "', ";
      updateQuery +=
        "cashAmountPayable = '" +
        document.getElementById("cashAmountPayable").value +
        "', ";
      updateQuery +=
        "remarks = '" + document.getElementById("remarks").value + "' ";
      updateQuery += "WHERE id = '" + currentPlot[0]["id"] + "';";

      let fData = new FormData();
      fData.append("query", updateQuery);

      try {
        const response = await axios.post(url, fData);

        // Show success toast
        toast({
          title: "Plot Edited Successfully!",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        window.location.reload();
      } catch (error) {
        console.log(error.toJSON());

        // Show error toast
        toast({
          title: "Failed to cancel plot. Please try again.",
          status: "error",

          duration: 3000,
          position: "top",
          isClosable: true,
        });
      }
    }
  };

  const deletePlot = async () => {
    const userConfirmed = window.confirm(
      "Do you really want to delete the plot?"
    );

    if (userConfirmed) {
      const url = "https://lkgexcel.com/backend/setQuery.php";
      let query = "DELETE FROM plot WHERE plotNo = '" + plotName + "';";

      let fData = new FormData();
      fData.append("query", query);

      try {
        const response = await axios.post(url, fData);

        // Show success toast
        toast({
          title: "Plot deleted successfully!",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });

        // Reload the page
        window.location.reload();
      } catch (error) {
        console.log(error.toJSON());

        // Show error toast
        toast({
          title: "Failed to delete plot. Please try again.",
          status: "error",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
      }
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    date: "",
    paymentType: "",
    amount: "",
    bankMode: "",
    cheqNo: "",
    bankName: "",
    transactionStatus: "",
    statusDate: "",
    remarks: "",
  });
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = (project) => {
    setIsModalOpen(true);
    setEditFormData({
      id: project.id,
      date: project.date,
      paymentType: project.paymentType,
      amount: project.amount,
      bankMode: project.bankMode,
      cheqNo: project.cheqNo,
      bankName: project.bankName,
      transactionStatus: project.transactionStatus,
      statusDate: project.statusDate,
      remarks: project.remarks,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const url = "https://lkgexcel.com/backend/editpayment.php";
    const paymentType = document.getElementById("paymentType").value;
    const amount = parseInt(document.getElementById("amount").value);
    try {
      const formData = new FormData();
      formData.append("id", editFormData.id);
      formData.append("date", editFormData.date);
      formData.append("paymentType", editFormData.paymentType);
      formData.append("amount", editFormData.amount);
      formData.append("bankMode", editFormData.bankMode);
      formData.append("cheqNo", editFormData.cheqNo);
      formData.append("bankName", editFormData.bankName);
      formData.append("transactionStatus", editFormData.transactionStatus);
      formData.append("statusDate", editFormData.statusDate);
      formData.append("remarks", editFormData.remarks);

      const response = await axios.post(url, formData);

      if (response && response.data && response.data.status === "success") {
        // Close the modal after successful submission
        setIsModalOpen(false);
        const updatedAmount = parseFloat(editFormData.amount);
        const updatedPaymentType = editFormData.paymentType;

        // After updating balances, call calculation logic
        updateBalances(paymentType, amount, updatedPaymentType, updatedAmount);

        // Trigger recalculation logic
        recalculate();

        // Show a success toast message
        toast({
          title: "Project updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Other necessary updates...
        loadAmounts();
        loadTransaction();
        loadAmountsBAR();
        loadAmountsCAR();
        calcAmounts();
      } else {
        // Handle error response
        console.error("Error updating project. Response:", response);

        // Show an error toast message
        toast({
          title: "Error updating project",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error in handleEditSubmit:", error);

      // Show an error toast message
      toast({
        title: "Error updating project",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const recalculate = () => {
    loadAmounts();
    loadTransaction();
    loadAmountsBAR();
    loadAmountsCAR();
    calcAmounts();
  };

  const updateBalances = (
    paymentType,
    amount,
    updatedPaymentType,
    updatedAmount
  ) => {
    const totalBalanceElem = document.getElementById("totalBalance");
    let totalBalance = parseInt(totalBalanceElem.innerHTML) || 0;
    totalBalance -= amount;
    totalBalance += updatedAmount; // Add the updated amount
    totalBalanceElem.innerHTML = totalBalance;
    console.log(`Total Balance: ${totalBalance}`);

    const bankBalanceElem = document.getElementById("bankBalance");
    let bankBalance = parseInt(bankBalanceElem.innerHTML) || 0;
    if (paymentType === "Bank") {
      bankBalance -= amount;
    }
    if (updatedPaymentType === "Bank") {
      bankBalance += updatedAmount; // Add the updated amount
      bankBalanceElem.innerHTML = bankBalance;
      console.log(`Bank Balance: ${bankBalance}`);
    }

    const cashBalanceElem = document.getElementById("cashBalance");
    let cashBalance = parseInt(cashBalanceElem.innerHTML) || 0;
    if (paymentType === "Cash") {
      // Handle cash balance update
    }
    if (updatedPaymentType === "Cash") {
      cashBalance += updatedAmount; // Add the updated amount
      cashBalanceElem.innerHTML = cashBalance;
      console.log(`Cash Balance: ${cashBalance}`);
    }
  };
  const handleTransferButtonClick = (props, index) => {
    let finalTransferData = { ...props, index: index };
    setTransferData(finalTransferData);
    setIsTransferModalOpen(true);
  };

  const trasnferTransactionStatus = async (id, selectedRow) => {
    // Initialize the properties in selectedRow if they are undefined
    selectedRow.cashReceived = selectedRow.cashReceived || 0;
    selectedRow.cashBalance = selectedRow.cashBalance || 0;
    selectedRow.bankReceived = selectedRow.bankReceived || 0;
    selectedRow.bankBalance = selectedRow.bankBalance || 0;
    selectedRow.totalBalance = selectedRow.totalBalance || 0;
    selectedRow.totalReceived = selectedRow.totalReceived || 0;

    // Convert values to numbers
    let cashReceived = Number(selectedRow.cashReceived);
    let cashBalance = Number(selectedRow.cashBalance);
    let bankReceived = Number(selectedRow.bankReceived);
    let bankBalance = Number(selectedRow.bankBalance);
    let totalBalance = Number(selectedRow.totalBalance);
    let totalReceived = Number(selectedRow.totalReceived);

    // Calculate new values based on payment type
    const amount = Number(selectedRow.amount);

    if (selectedRow.paymentType === "Cash") {
      cashReceived -= amount;
      cashBalance += amount;
    } else if (selectedRow.paymentType === "Bank") {
      bankReceived -= amount;
      bankBalance += amount;
    }

    // Update total balance and total received
    totalBalance += amount;
    totalReceived -= amount;

    // Update UI with the new values
    updateUI({
      cashReceived,
      cashBalance,
      bankReceived,
      bankBalance,
      totalBalance,
      totalReceived,
    });
    console.log("Updated Cash Received:", cashReceived);
    console.log("Updated Cash Balance:", cashBalance);
    console.log("Updated Bank Received:", bankReceived);
    console.log("Updated Bank Balance:", bankBalance);
    console.log("Updated Total Balance:", totalBalance);
    console.log("Updated Total Received:", totalReceived);
    // Return the updated values
    return {
      cashReceived,
      cashBalance,
      bankReceived,
      bankBalance,
      totalBalance,
      totalReceived,
    };
  };

  // Function to update the UI
  const updateUI = (updatedValues) => {
    // Update the UI elements with the new values
    if (updatedValues.cashReceived !== undefined) {
      document.getElementById("cashReceived").innerHTML =
        updatedValues.cashReceived;
    }
    if (updatedValues.cashBalance !== undefined) {
      document.getElementById("cashBalance").innerHTML =
        updatedValues.cashBalance;
    }
    if (updatedValues.bankReceived !== undefined) {
      document.getElementById("bankReceived").innerHTML =
        updatedValues.bankReceived;
    }
    if (updatedValues.bankBalance !== undefined) {
      document.getElementById("bankBalance").innerHTML =
        updatedValues.bankBalance;
    }
    if (updatedValues.totalBalance !== undefined) {
      document.getElementById("totalBalance").innerHTML =
        updatedValues.totalBalance;
    }
    if (updatedValues.totalReceived !== undefined) {
      document.getElementById("totalReceived").innerHTML =
        updatedValues.totalReceived;
    }
  };
  const insertTransaction = async (
    projectName,
    blockName,
    plotNo,
    date,
    paymentType,
    amount,
    bankMode,
    cheqNo,
    bankName,
    transactionStatus,
    statusDate,
    remarks
  ) => {
    const url = "https://lkgexcel.com/backend/setQuery.php";

    // Construct the query to insert the transaction
    const query = `
      INSERT INTO transaction (projectName, blockName, plotno, date, paymentType, amount, bankMode, cheqNo, bankName, transactionStatus, statusDate, remarks) 
      VALUES ('${projectName}', '${blockName}', '${plotNo}', '${date}', '${paymentType}', ${amount}, '${bankMode}', '${cheqNo}', '${bankName}', '${transactionStatus}', '${statusDate}', '${remarks}')
    `;

    // Construct the update query to subtract the amount from balances
    const updateQuery = `
      UPDATE transaction
      SET totalReceived = totalReceived + ${amount},
          cashReceived = cashReceived + ${paymentType === "Cash" ? amount : 0},
          bankReceived = bankReceived + ${paymentType === "Bank" ? amount : 0},
          cashBalance = cashBalance - ${paymentType === "Cash" ? amount : 0},
          bankBalance = bankBalance - ${paymentType === "Bank" ? amount : 0},
          totalBalance = totalBalance - ${amount}
      WHERE projectName = '${projectName}' AND blockName = '${blockName}' AND plotno = '${plotNo}'
      ORDER BY date DESC
      LIMIT 1
    `;

    const formData = new FormData();
    formData.append("query", query);

    try {
      // Send the query to insert the transaction
      const response = await axios.post(url, formData);

      // Send the update query to adjust balances
      formData.set("query", updateQuery);
      await axios.post(url, formData);

      return response.data; // Return the inserted data or success status
    } catch (error) {
      console.error("Error inserting transaction:", error);
      throw error; // Throw the error for handling in the calling code
    }
  };

  // Function to handle transfer
  // Function to handle transfer
  // Function to handle transfer
  const handleTransfer = async () => {
    if (transferData && transactionData[transferData.index]) {
      const selectedRow = transactionData[transferData.index];
      const fromProject = selectedRow.projectName;
      const fromBlock = selectedRow.blockName;
      const fromPlot = selectedRow.plotno;

      setTransferProjectName(selectedRow.projectName);
      setTransferBlockName(selectedRow.blockName);
      setTransferPlotName(selectedRow.plotno);

      const transferRemark = `Transfer to ${transferProjectName} ${transferBlockName} ${transferPlotName}`;
      const receivedRemark = `Received from ${fromProject} ${fromBlock} ${fromPlot}`;

      // Show confirmation dialog
      const confirmed = window.confirm(
        `Do you want to transfer this transaction from ${fromProject} ${fromBlock} ${fromPlot} to ${transferProjectName} ${transferBlockName} ${transferPlotName}?`
      );

      if (confirmed) {
        if (fromProject !== transferProjectName) {
          selectedRow.remarks = transferRemark;

          const transferredRow = {
            ...selectedRow,
            projectName: transferProjectName,
            blockName: transferBlockName,
            plotno: transferPlotName,
            remarks: receivedRemark,
          };

          try {
            await insertTransaction(
              transferProjectName,
              transferBlockName,
              transferPlotName,
              transferredRow.date,
              transferredRow.paymentType,
              transferredRow.amount,
              transferredRow.bankMode,
              transferredRow.cheqNo,
              transferredRow.bankName,
              transferredRow.transactionStatus,
              transferredRow.statusDate,
              transferredRow.remarks
            );
          } catch (error) {
            console.error("Error inserting transferred transaction:", error);
            return;
          }
        }

        const updatedTransactionData = [...transactionData];
        updatedTransactionData[transferData.index] = selectedRow;

        setTransactionData(updatedTransactionData);

        const tableRow = document.getElementById(`row-${transferData.index}`);
        const remarksCell = tableRow.cells[tableRow.cells.length - 1];
        remarksCell.textContent = selectedRow.remarks;

        const logMessage = `Payment transaction for row ${
          transferData.index + 1
        } has been transferred from ${fromProject} ${fromBlock} ${fromPlot} to ${transferProjectName} ${transferBlockName} ${transferPlotName} with payment type: ${
          selectedRow.paymentType
        }, amount: ${selectedRow.amount}, bank mode: ${
          selectedRow.bankMode
        }, CHQ/REF NO: ${selectedRow.cheqNo}, bank name: ${
          selectedRow.bankName
        }`;
        console.log(logMessage);

        try {
          const statusUpdateSuccess = await trasnferTransactionStatus(
            selectedRow.id,
            selectedRow
          );
          if (!statusUpdateSuccess) {
            console.error("Failed to update transaction status.");
            return;
          }
        } catch (error) {
          console.error("Error updating transaction status:", error);
          return;
        }

        setTransferredRows([...transferredRows, transferData.index]);

        toast({
          title: "Transfer Successful",
          description: `Payment transaction has been transferred from ${fromProject} ${fromBlock} ${fromPlot} to ${transferProjectName} ${transferBlockName} ${transferPlotName}.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        // Reload the page
        window.location.reload();

        setIsTransferModalOpen(false);
      }
    } else {
      console.error("Error: Selected row data is undefined.");
    }
  };

  const handleContractorButtonClick = () => {
    navigate("/contractortransaction", { state: { constructionData } });
  };
  const handleBrokerButtonClick = () => {
    navigate("/brokertransaction", { state: { constructionData } });
  };
  const navigate = useNavigate();
  return (
    <Box display={"flex"} height={"100vh"} maxW={"100vw"} ref={componentRef}>
      <Box flex={"20%"} borderRight={"1px solid grey"}>
        <VStack alignItems={"flex-start"} gap={0}>
          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="projectName" fontSize={"12px"}>
                Project Name
              </FormLabel>
              <Select
                id="projectName"
                placeholder="Select Project"
                onChange={(e) => {
                  setProjectName(e.target.value);
                  loadBlocks(e.target.value);
                }}
                w={"60%"}
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
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="blockName" fontSize={"12px"}>
                Block Name
              </FormLabel>
              <Select
                id="blockName"
                placeholder="Select Block"
                onChange={(e) => {
                  setBlockname(e.target.value);
                  loadPlots(e.target.value);
                }}
                w={"60%"}
              >
                {blockData.map((block) => {
                  return (
                    <option key={block.blockName} value={block.blockName}>
                      {block.blockName}
                    </option>
                  );
                })}
              </Select>
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="plotNo" fontSize={"12px"}>
                Plot No
              </FormLabel>
              <Select
                id="plotNo"
                placeholder="Select Plot No"
                onChange={(e) => {
                  setPlotName(e.target.value);
                  setData(e.target.value);
                }}
                w={"60%"}
              >
                {plotData.map((plot) => {
                  return (
                    <option key={plot.plotNo} value={plot.plotNo}>
                      {plot.plotNo}
                    </option>
                  );
                })}
              </Select>
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="plotType" fontSize={"12px"}>
                Plot Type
              </FormLabel>
              <Select id="plotType" w={"60%"} placeholder="Select ">
                <option value="Normal">Normal</option>
                <option value="EWS">EWS</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="4BHK">4BHK</option>
                <option value="5BHK">5BHK</option>
                {/* Add more options as needed */}
              </Select>
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="custName" fontSize={"12px"}>
                Cust Name
              </FormLabel>
              <Input
                id="custName"
                type="text"
                placeholder="Enter Cust name"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="custAddress" fontSize={"12px"}>
                Cust Add
              </FormLabel>
              <Textarea
                id="custAddress"
                resize={"horizontal"}
                placeholder="Enter Address"
                w={"60%"}
                minH={"2.5rem"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="areaSqft" fontSize={"12px"}>
                Ares Sqft
              </FormLabel>
              <Input
                id="areaSqmt"
                type="text"
                placeholder="Enter Area Sqft"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="ratePerSqft" fontSize={"12px"}>
                Rate Per Sqft
              </FormLabel>
              <Input
                id="ratePerSqmt"
                type="text"
                placeholder="Enter Rate Sqft"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="totalAmount" fontSize={"12px"}>
                Total Amt
              </FormLabel>
              <Input
                id="totalAmount"
                type="text"
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="discount" fontSize={"12px"}>
                Discount
              </FormLabel>
              <Select
                id="discountApplicable"
                placeholder="Select Discount"
                w={"60%"}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                {/* Add more options as needed */}
              </Select>
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="discountPercent" fontSize={"12px"}>
                Discount%
              </FormLabel>
              <Input
                id="discountPercent"
                type="text"
                placeholder="Enter Discount%"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="netAmount" fontSize={"12px"}>
                Net Amt
              </FormLabel>
              <Input
                id="netAmount"
                type="text"
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="registryAmount" fontSize={"12px"}>
                Registry Amt
              </FormLabel>
              <Input
                id="registryAmount"
                type="text"
                placeholder="Enter Registry"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="serviceAmount" fontSize={"12px"}>
                Service Amt
              </FormLabel>
              <Input
                id="serviceAmount"
                type="text"
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="maintenanceAmount" fontSize={"12px"}>
                Maintenace Amt
              </FormLabel>
              <Input
                id="maintenanceAmount"
                type="text"
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="miscAmount" fontSize={"12px"}>
                Misc Amt
              </FormLabel>
              <Input
                id="miscAmount"
                type="text"
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="grandTotal" fontSize={"12px"}>
                Grand Total
              </FormLabel>
              <Input
                id="grandTotal"
                type="text"
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="construction" fontSize={"12px"}>
                Const Yes/No
              </FormLabel>
              <Select
                id="constructionApplicable"
                placeholder="Select"
                w={"60%"}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                {/* Add more options as needed */}
              </Select>
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="contractor" fontSize={"12px"}>
                Contractor
              </FormLabel>
              <Select
                id="constructionContractor"
                placeholder="Select"
                value={contractorName}
                onChange={(e) => {
                  setcontractorName();
                }}
                w={"60%"}
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
            </Flex>
          </FormControl>
          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="broker" fontSize={"12px"}>
                Broker
              </FormLabel>
              <Select
                id="broker"
                placeholder="Select"
                value={brokerName}
                onChange={(e) => {
                  setbrokerName(e.target.value); // Pass the selected value to setbrokerName
                }}
                w={"60%"}
              >
                {brokerData.map((block) => {
                  return (
                    <option key={block.brokerName} value={block.brokerName}>
                      {block.brokerName}
                    </option>
                  );
                })}
              </Select>
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="constructionAmount" fontSize={"12px"}>
                Const Amt
              </FormLabel>
              <Input
                id="constructionAmount"
                type="text"
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="totalAmountPayable" fontSize={"12px"}>
                Total Amt Payable
              </FormLabel>
              <Input
                id="totalAmountPayable"
                type="text"
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="guidelineAmount" fontSize={"12px"}>
                Guideline Amt
              </FormLabel>
              <Input
                id="guidelineAmount"
                type="text"
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="registryPercent" fontSize={"12px"}>
                Registry%
              </FormLabel>
              <Input
                id="registryPercent"
                type="text"
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="bankAmountPayable" fontSize={"12px"}>
                Bank Amt Payable
              </FormLabel>
              <Input
                id="bankAmountPayable"
                type="text"
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex
              align="center"
              justifyContent={"space-between"}
              padding={"0px 4px 0px 4px"}
            >
              <FormLabel htmlFor="cashAmountPayable" fontSize={"12px"}>
                Cash Amt Payable
              </FormLabel>
              <Input
                id="cashAmountPayable"
                type="text"
                placeholder="Enter Amount"
                w={"60%"}
              />
            </Flex>
          </FormControl>

          <Flex padding={"0px 4px 0px 4px"} alignSelf={"end"}>
            {showAction && (
              <>
                <HStack>
                  <Button
                    as={Link}
                    to="/contractortransaction"
                    onClick={handleContractorButtonClick}
                  >
                    Contractor
                  </Button>
                  <Button
                    as={Link}
                    to="/brokertransaction"
                    onClick={handleBrokerButtonClick}
                  >
                    Broker
                  </Button>
                  <Button colorScheme="blue" onClick={editPlot}>
                    {" "}
                    Save
                  </Button>
                </HStack>
              </>
            )}
          </Flex>
          {/* <Center>
            <hr style={{ width: "80%", marginTop: "10px" }} />
          </Center> */}
        </VStack>
      </Box>

      <Box flex={"80%"} maxW={"80%"}>
        <Box borderBottom={"1px solid black"} w={"100%"} p={2} pb={4}>
          <HStack justifyContent={"space-between"}>
            <Box maxW={"85%"}>
              <HStack marginLeft={2}>
                <FormControl>
                  <Flex
                    align="center"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                  >
                    <FormLabel fontSize={"sm"}>Plot Status</FormLabel>
                    <Input type="text" id="plotStatus" w={"60%"} />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="center"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                  >
                    <FormLabel fontSize={"sm"}> Gender</FormLabel>
                    <Input type="text" id="registryGender" w={"60%"} />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="center"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                  >
                    <FormLabel fontSize={"sm"}>Booking </FormLabel>
                    <Input type="date" id="bookingDate" w={"60%"} />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="center"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                  >
                    <FormLabel fontSize={"sm"}>Registry Date</FormLabel>
                    <Input type="date" id="registryD" w={"60%"} />
                  </Flex>
                </FormControl>
              </HStack>
              <Divider mt={4} />
              <HStack
                alignContent={"flex-start"}
                justifyContent={"space-between"}
                mt={4}
                mb={4}
              >
                <VStack>
                  <Text>
                    Total Payable = <span id="totalPayable">0</span>
                  </Text>
                  <Text>
                    Bank Payable = <span id="bankPayable">0</span>
                  </Text>
                  <Text>
                    Cash Payable = <span id="cashPayable">0</span>
                  </Text>
                </VStack>
                <VStack>
                  <Text>
                    Total Received = <span id="totalReceived">0</span>
                  </Text>
                  <Text>
                    Bank Received = <span id="bankReceived">0</span>
                  </Text>
                  <Text>
                    Cash Received = <span id="cashReceived">0</span>
                  </Text>
                </VStack>
                <VStack>
                  <Text>
                    Total Balance = <span id="totalBalance">0</span>
                  </Text>
                  <Text>
                    Bank Balance = <span id="bankBalance">0</span>
                  </Text>
                  <Text>
                    Cash Balance = <span id="cashBalance">0</span>
                  </Text>
                </VStack>
              </HStack>
            </Box>
            <VStack>
              {showButtons && (
                <>
                  <Button
                    colorScheme="gray"
                    size={"sm"}
                    onClick={onRegistry}
                    className="hide-on-print"
                  >
                    Registry
                  </Button>
                  <Button
                    size={"sm"}
                    onClick={cancelPlot}
                    colorScheme="gray"
                    className="hide-on-print"
                  >
                    Cancel Plot
                  </Button>
                  <Button
                    size={"sm"}
                    colorScheme="gray"
                    onClick={deletePlot}
                    className="hide-on-print"
                  >
                    Delete Plot
                  </Button>
                  <Button
                    size={"sm"}
                    colorScheme="gray"
                    className="hide-on-print"
                    onClick={() => {
                      setIsTransferAllModalOpen(true);
                    }}
                  >
                    Transfer All
                  </Button>
                  <Button
                    size={"sm"}
                    colorScheme="gray"
                    className="hide-on-print"
                  >
                    History
                  </Button>
                </>
              )}
            </VStack>
          </HStack>
          <Divider w={"100%"} bg={"#121212"} />
          <HStack
            alignContent={"flex-start"}
            justifyContent={"space-between"}
            mt={4}
          >
            <Text>Payment Transaction</Text>
            {showPayment && (
              <>
                <Button
                  className="hide-on-print"
                  colorScheme="gray"
                  size="sm"
                  onClick={() => {
                    setdisplay(!displa);
                  }}
                >
                  Add Payment
                </Button>
              </>
            )}
          </HStack>
          <Divider w={"100%"} bg={"#121212"} mt={4} />
          <Box display={displa == true ? "flex" : "none"}>
            <VStack alignItems={"flex-start"}>
              <HStack gap={"15px"} p={3}>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Date
                    </FormLabel>
                    <Input
                      id="date"
                      required
                      type="date"
                      // w={"60%"}
                    />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Payment Type
                    </FormLabel>
                    <Select placeholder="Select" id="paymentType" required>
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank</option>
                      {/* Add more projects as needed */}
                    </Select>
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Amount
                    </FormLabel>
                    <Input
                      id="amount"
                      type="number"
                      required
                      // w={"60%"}
                    />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      bank Mode
                    </FormLabel>
                    <Select placeholder="Select " id="bankMode">
                      <option value="none">None</option>
                      <option value="cheque">Cheque/DD</option>
                      <option value="rtgs">RTGS/NEFT</option>
                      <option value="loan">Loan</option>
                      <option value="upi">UPI</option>

                      {/* Add more projects as needed */}
                    </Select>
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Chq/Ref No
                    </FormLabel>
                    <Input
                      id="cheqNo"
                      type="text"
                      required
                      // w={"60%"}
                    />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      bank Name
                    </FormLabel>
                    <Input
                      id="bankName"
                      required
                      type="text"
                      // w={"60%"}
                    />
                  </Flex>
                </FormControl>
              </HStack>
              <HStack gap={"15px"} p={3} pt={0}>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Trasaction Stat
                    </FormLabel>
                    <Select id="transactionStatus" placeholder="Select">
                      <option value="Pending">Pending</option>
                      <option value="Clear">Clear</option>
                      <option value="PDC">PDC</option>
                      <option value="Provisional">Provisional</option>
                      <option value="Bounced">Bounced</option>
                      <option value="Return">Returned</option>

                      {/* Add more projects as needed */}
                    </Select>
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Status Date
                    </FormLabel>
                    <Input
                      id="statusDate"
                      type="Date"
                      required
                      // w={"60%"}
                    />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    align="flex-start"
                    // justifyContent={"space-between"}
                    // padding={"0px 4px 0px 4px"}
                    flexDirection={"column"}
                  >
                    <FormLabel fontSize={"sm"} margin={0}>
                      Remarks
                    </FormLabel>
                    <Input id="remarks" type="text" w={"250%"} required />
                  </Flex>
                </FormControl>
              </HStack>

              <Button
                colorScheme="telegram"
                alignSelf={"flex-end"}
                size={"md"}
                m={3}
                mt={0}
                onClick={addPayment}
              >
                Submit
              </Button>
            </VStack>
          </Box>
          <Divider w={"100%"} bg={"#121212"} />
          <Box display={""}>
            <TableContainer>
              <Table size={"sm"}>
                <Thead color={"white"}>
                  <Tr bg={"#121212"}>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      SrNo.
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Date
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Type
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Amount
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      bank Mode
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Chq/Ref No
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      bank Name
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Trans Stat
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Stat Date
                    </Th>
                    <Th color={"white"} border="1px solid black" p={"8px"}>
                      Remarks
                    </Th>
                    {showAction && (
                      <>
                        <Th
                          color={"white"}
                          border="1px solid black"
                          p={"8px"}
                          textAlign={"center"}
                          className="hide-on-print"
                        >
                          Action
                        </Th>
                      </>
                    )}
                  </Tr>
                </Thead>
                <Tbody>
                  {transactionData.map((res, index) => (
                    <tr key={res.date} id={`row-${index}`}>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color:
                            res.Status === "Transferred"
                              ? "#E53E3E"
                              : "inherit",
                          textDecoration:
                            res.Status === "Transferred"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {index + 1}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color:
                            res.Status === "Transferred"
                              ? "#E53E3E"
                              : "inherit",
                          textDecoration:
                            res.Status === "Transferred"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {res.date}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color:
                            res.Status === "Transferred"
                              ? "#E53E3E"
                              : "inherit",
                          textDecoration:
                            res.Status === "Transferred"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {res.paymentType}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color:
                            res.Status === "Transferred"
                              ? "#E53E3E"
                              : "inherit",
                          textDecoration:
                            res.Status === "Transferred"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {res.amount}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color:
                            res.Status === "Transferred"
                              ? "#E53E3E"
                              : "inherit",
                          textDecoration:
                            res.Status === "Transferred"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {res.bankMode}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color:
                            res.Status === "Transferred"
                              ? "#E53E3E"
                              : "inherit",
                          textDecoration:
                            res.Status === "Transferred"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {res.cheqNo}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color:
                            res.Status === "Transferred"
                              ? "#E53E3E"
                              : "inherit",
                          textDecoration:
                            res.Status === "Transferred"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {res.bankName}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color:
                            res.Status === "Transferred"
                              ? "#E53E3E"
                              : res.transactionStatus === "Clear"
                              ? "#22c35e"
                              : res.transactionStatus === "Provisional"
                              ? "#ECC94B"
                              : res.transactionStatus === "Pending" ||
                                res.transactionStatus === "PDC"
                              ? "#ECC94B"
                              : "inherit",
                          textDecoration:
                            res.transactionStatus === "Bounced" ||
                            res.Status === "Transferred"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {res.transactionStatus}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color:
                            res.Status === "Transferred"
                              ? "#E53E3E"
                              : "inherit",
                          textDecoration:
                            res.Status === "Transferred"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {res.statusDate}
                      </Td>
                      <Td
                        border="1px solid black"
                        p={"8px"}
                        style={{
                          backgroundColor:
                            res.Status === "Transferred" ? "white" : "inherit",
                          color:
                            res.Status === "Transferred"
                              ? "#E53E3E"
                              : "inherit",
                          textDecoration:
                            res.Status === "Transferred"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {res.remarks}
                      </Td>
                      {/* Action Cell */}
                      {showAction && (
                        <Td
                          display={"flex"}
                          gap={"10px"}
                          border="1px solid black"
                          p={"8px"}
                          className="hide-on-print"
                        >
                          <Button
                            onClick={() =>
                              handleTransferButtonClick(res, index)
                            }
                            size={"sm"}
                            isDisabled={res.Status === "Transferred"}
                          >
                            Transfer
                          </Button>
                          <Button
                            colorScheme="green"
                            size={"sm"}
                            onClick={() => handleEditClick(res)}
                            isDisabled={res.Status === "Transferred"}
                          >
                            Edit
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={() => handleDeletePayment(res.id)}
                            size={"sm"}
                            isDisabled={res.Status === "Transferred"}
                          >
                            Delete
                          </Button>
                          <DeleteConfirmationDialog
                            isOpen={isDeleteDialogOpen}
                            onClose={() => setIsDeleteDialogOpen(false)}
                            onConfirm={deletePayment}
                          />
                        </Td>
                      )}
                    </tr>
                  ))}

                  {/* edit modal */}
                  <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    size={"xl"}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit Payment</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div
                            style={{ display: "flex", marginBottom: "16px" }}
                          >
                            <FormControl style={{ marginRight: "16px" }}>
                              <FormLabel>Date</FormLabel>
                              <Input
                                id="date"
                                name="date"
                                value={editFormData.date}
                                onChange={handleEditChange}
                                type="date"
                              />
                            </FormControl>
                            <FormControl style={{ marginRight: "16px" }}>
                              <FormLabel>Payment Type</FormLabel>
                              <Select
                                id="paymentType"
                                name="paymentType"
                                value={editFormData.paymentType}
                                onChange={handleEditChange}
                                required
                              >
                                <option value="Cash">Cash</option>
                                <option value="Bank">Bank</option>
                              </Select>
                            </FormControl>
                            <FormControl>
                              <FormLabel>Amount</FormLabel>
                              <Input
                                id="amount"
                                name="amount"
                                value={editFormData.amount}
                                onChange={handleEditChange}
                                type="text"
                                required
                              />
                            </FormControl>
                          </div>
                          <div
                            style={{ display: "flex", marginBottom: "16px" }}
                          >
                            <FormControl style={{ marginRight: "16px" }}>
                              <FormLabel>Bank Mode</FormLabel>
                              <Select
                                id="bankMode"
                                name="bankMode"
                                value={editFormData.bankMode}
                                onChange={handleEditChange}
                              >
                                <option value="none">None</option>
                                <option value="cheque">Cheque/DD</option>
                                <option value="rtgs">RTGS/NEFT</option>
                                <option value="loan">Loan</option>
                                <option value="upi">UPI</option>
                              </Select>
                            </FormControl>
                            <FormControl style={{ marginRight: "16px" }}>
                              <FormLabel>Chq/Ref No</FormLabel>
                              <Input
                                id="cheqNo"
                                name="cheqNo"
                                value={editFormData.cheqNo}
                                onChange={handleEditChange}
                                type="text"
                                required
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Bank Name</FormLabel>
                              <Input
                                id="bankName"
                                name="bankName"
                                value={editFormData.bankName}
                                onChange={handleEditChange}
                                required
                                type="text"
                              />
                            </FormControl>
                          </div>
                          <div
                            style={{ display: "flex", marginBottom: "16px" }}
                          >
                            <FormControl style={{ marginRight: "16px" }}>
                              <FormLabel>Transaction Status</FormLabel>
                              <Select
                                id="transactionStatus"
                                name="transactionStatus"
                                value={editFormData.transactionStatus}
                                onChange={handleEditChange}
                                required
                              >
                                <option value="Pending">Pending</option>
                                <option value="Clear">Clear</option>
                                <option value="PDC">PDC</option>
                                <option value="Provisional">Provisional</option>
                                <option value="Bounced">Bounced</option>
                                <option value="Return">Returned</option>
                              </Select>
                            </FormControl>
                            <FormControl style={{ marginRight: "16px" }}>
                              <FormLabel>Status Date</FormLabel>
                              <Input
                                id="statusDate"
                                name="statusDate"
                                value={editFormData.statusDate}
                                onChange={handleEditChange}
                                type="Date"
                                required
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Remarks</FormLabel>
                              <Input
                                id="remarks"
                                name="remarks"
                                value={editFormData.remarks}
                                onChange={handleEditChange}
                                type="text"
                                required
                              />
                            </FormControl>
                          </div>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button colorScheme="blue" onClick={handleEditSubmit}>
                          Save Changes
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Cancel
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                  {/* tranfer modal */}
                  <Modal
                    isOpen={isTransferModalOpen}
                    onClose={() => setIsTransferModalOpen(false)}
                    size="xl"
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>
                        Transfer Transactions: {transferData.index + 1}
                      </ModalHeader>
                      <ModalCloseButton />
                      <ModalBody display={"flex"}>
                        {/* Input for 'From' */}
                        <FormControl>
                          <Text>From</Text>
                          <Flex flexDirection={"column"} gap={"7px"}>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Project Name :-
                              </FormLabel>
                              <Text>{projectName}</Text>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Block Name :-
                              </FormLabel>
                              <Text>{blockName}</Text>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Plot No:-
                              </FormLabel>
                              <Text>{plotName}</Text>
                            </Box>
                          </Flex>
                        </FormControl>

                        <FormControl>
                          <Text>To</Text>
                          <Flex flexDirection={"column"} gap={"7px"}>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Project Name
                              </FormLabel>
                              <Select
                                id="projectName"
                                placeholder="Select Project"
                                onChange={(e) => {
                                  setTransferProjectName(e.target.value);
                                  loadTransferBlock(e.target.value);
                                }}
                                w={"60%"}
                              >
                                {transferProject.map((project) => {
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
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Block Name
                              </FormLabel>
                              <Select
                                id="blockName"
                                placeholder="Select Block"
                                onChange={(e) => {
                                  setTransferBlockName(e.target.value);
                                  loadTransferPlot(e.target.value);
                                }}
                                w={"60%"}
                              >
                                {transferBlock.map((block) => {
                                  return (
                                    <option
                                      key={block.blockName}
                                      value={block.blockName}
                                    >
                                      {block.blockName}
                                    </option>
                                  );
                                })}
                              </Select>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Plot No
                              </FormLabel>
                              <Select
                                id="plotNo"
                                placeholder="Select Plot No"
                                onChange={(e) => {
                                  setTransferPlotName(e.target.value);
                                  dataTransfer(e.target.value);
                                }}
                                w={"60%"}
                              >
                                {transferPlot.map((plot) => {
                                  return (
                                    <option
                                      key={plot.plotNo}
                                      value={plot.plotNo}
                                    >
                                      {plot.plotNo}
                                    </option>
                                  );
                                })}
                              </Select>
                            </Box>
                          </Flex>
                        </FormControl>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          colorScheme="blue"
                          mr={3}
                          onClick={handleTransfer}
                        >
                          Transfer Transaction
                        </Button>
                        <Button onClick={() => setIsTransferModalOpen(false)}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>

                  {/* tranfer all modal */}
                  <Modal
                    isOpen={isTransferAllModalOpen}
                    onClose={() => setIsTransferAllModalOpen(false)}
                    size="xl"
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Transfer All Transactions</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody display={"flex"}>
                        {/* Input for 'From' */}
                        <FormControl>
                          <Text>From</Text>
                          <Flex flexDirection={"column"} gap={"7px"}>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Project Name :-
                              </FormLabel>
                              <Text>{projectName}</Text>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Block Name :-
                              </FormLabel>
                              <Text>{blockName}</Text>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Plot No:-
                              </FormLabel>
                              <Text>{plotName}</Text>
                            </Box>
                          </Flex>
                        </FormControl>

                        <FormControl>
                          <Text>To</Text>
                          <Flex flexDirection={"column"} gap={"7px"}>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Project Name
                              </FormLabel>
                              <Select
                                id="projectName"
                                placeholder="Select Project"
                                onChange={(e) => {
                                  setTransferAllProjectName(e.target.value);
                                  loadTransferAllBlock(e.target.value);
                                }}
                                w={"60%"}
                              >
                                {transferAllProject.map((project) => {
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
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Block Name
                              </FormLabel>
                              <Select
                                id="blockName"
                                placeholder="Select Block"
                                onChange={(e) => {
                                  setTransferAllBlockName(e.target.value);
                                  loadTransferAllPlot(e.target.value);
                                }}
                                w={"60%"}
                              >
                                {transferAllBlock.map((block) => {
                                  return (
                                    <option
                                      key={block.blockName}
                                      value={block.blockName}
                                    >
                                      {block.blockName}
                                    </option>
                                  );
                                })}
                              </Select>
                            </Box>
                            <Box display={"flex"} flexDirection={"row"}>
                              <FormLabel
                                htmlFor="projectName"
                                fontSize={"small"}
                                alignSelf={"center"}
                              >
                                Plot No
                              </FormLabel>
                              <Select
                                id="plotNo"
                                placeholder="Select Plot No"
                                onChange={(e) => {
                                  setTransferAllPlotName(e.target.value);
                                  dataTransferAll(e.target.value);
                                }}
                                w={"60%"}
                              >
                                {transferAllPlot.map((plot) => {
                                  return (
                                    <option
                                      key={plot.plotNo}
                                      value={plot.plotNo}
                                    >
                                      {plot.plotNo}
                                    </option>
                                  );
                                })}
                              </Select>
                            </Box>
                          </Flex>
                        </FormControl>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          colorScheme="blue"
                          mr={3}
                          onClick={confirmTransferAll}
                        >
                          Transfer Transaction
                        </Button>
                        <Button onClick={() => setIsTransferModalOpen(false)}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          {showAction && (
            <>
              <Button onClick={handlePrint} className="hide-on-print">
                Print
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentTransaction;
