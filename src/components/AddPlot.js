import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Center,
  Heading,
  useToast,
  Table,
  Thead,
  Tr,
  HStack,
  Td,
  Tbody,
  Th,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

import PaginationControl from "./PaginationControl";
const AddPlot = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMaster, setFilteredMaster] = useState([]);
  const [projects, setProjects] = useState([]);
  const [getblock, setBlock] = useState([]);
  const [plot, setPlot] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const [formData, setFormData] = useState({
    projectName: "",
    blockName: "",
    plotNo: "",
    areaSqft: "",
    areaSqmt: "",
    ratePerSqft: "",
    plotType: "",
    plotStatus: "Available",
  });

  const [editableAreaSqft, setEditableAreaSqft] = useState("");
  const [editableAreaSqmt, setEditableAreaSqmt] = useState("");
  const [editableRatePerSqft, setEditableRatePerSqft] = useState("");
  const [matchCase, setMatchCase] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();
  const [editFormData, setEditFormData] = useState({
    id: "",
    projectName: "",
    blockName: "",
    plotNo: "",
    areaSqft: "",
    areaSqmt: "",
    ratePerSqft: "",
    plotType: "",
    plotStatus: "Available",
  });

  const fetchDataProject = async () => {
    try {
      const response = await axios.get(
        "https://lkgexcel.com/backend/getprojects.php"
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  const fetchDataBlock = async () => {
    try {
      const response = await axios.get(
        "https://lkgexcel.com/backend/getblock.php"
      );
      setBlock(response.data);
    } catch (error) {
      console.error("Error fetching block data:", error);
    }
  };

  const fetchDataPlot = async () => {
    try {
      const response = await axios.get(
        "https://lkgexcel.com/backend/getplot.php"
      );
      setPlot(response.data);
    } catch (error) {
      console.error("Error fetching plot data:", error);
    }
  };

  useEffect(() => {
    fetchDataProject();
    fetchDataPlot();
    fetchDataBlock();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "projectName") {
      setSelectedProject(value);
    }

    switch (name) {
      case "areaSqft":
        setEditableAreaSqft(value);
        break;
      case "areaSqmt":
        setEditableAreaSqmt(value);
        break;
      case "ratePerSqft":
        setEditableRatePerSqft(value);
        break;
      default:
        break;
    }

    if (name === "blockName" && matchCase) {
      setEditableAreaSqft(matchCase.areaSqft || "");
      setEditableAreaSqmt(matchCase.areaSqmt || "");
      setEditableRatePerSqft(matchCase.ratePerSqft || "");
    }
  };

  const onAddPlot = async (e) => {
    e.preventDefault();

    const url = "https://lkgexcel.com/backend/addplot.php";
    const fData = new FormData();
    fData.append("projectName", formData.projectName);
    fData.append("blockName", formData.blockName);
    fData.append("plotNo", formData.plotNo);
    fData.append("areaSqft", formData.areaSqft);
    fData.append("areaSqmt", formData.areaSqmt);
    fData.append("ratePerSqft", formData.ratePerSqft);
    fData.append("plotType", formData.plotType);
    fData.append("plotStatus", formData.plotStatus);

    try {
      await axios.post(url, fData);
      toast({
        title: "Plot added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setFormData({
        projectName: "",
        blockName: "",
        plotNo: "",
        areaSqft: "",
        areaSqmt: "",
        ratePerSqft: "",
        plotType: "",
        plotStatus: "Available",
      });

      fetchDataPlot();
    } catch (error) {
      console.log("Error adding plot:", error);
    }
  };

  useEffect(() => {
    const filteredData = plot.filter((item) =>
      item.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => b.id - a.id);

    setFilteredMaster(sortedData);
    setTotalItems(sortedData.length);
  }, [plot, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMaster.slice(indexOfFirstItem, indexOfLastItem);

  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = (projectId) => {
    setProjectIdToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `https://lkgexcel.com/backend/deleteplot.php?id=${projectIdToDelete}`
      );

      setPlot(plot.filter((project) => project.id !== projectIdToDelete));

      toast({
        title: "Plot deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting plot:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectIdToDelete(null);
    }
  };

  const handleEditPlotChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    let valueMatch = getblock.find(
      (i) =>
        i.blockName === formData.blockName &&
        i.projectName === formData.projectName
    );
    setMatchCase(valueMatch);

    setFormData((prevData) => ({
      ...prevData,
      areaSqft: valueMatch ? valueMatch.areaSqft : "",
      areaSqmt: valueMatch ? valueMatch.areaSqmt : "",
      ratePerSqft: valueMatch ? valueMatch.ratePerSqft : "",
    }));
  }, [formData.blockName, formData.projectName, getblock]);

  const handleEditPlotSubmit = async (e) => {
    e.preventDefault();

    const url = "https://lkgexcel.com/backend/editplot.php";
    const formData = new FormData();

    formData.append("id", editFormData.id);
    formData.append("projectName", editFormData.projectName);
    formData.append("blockName", editFormData.blockName);
    formData.append("plotNo", editFormData.plotNo);
    formData.append("areaSqft", editFormData.areaSqft);
    formData.append("areaSqmt", editFormData.areaSqmt);
    formData.append("ratePerSqft", editFormData.ratePerSqft);
    formData.append("plotType", editFormData.plotType);
    formData.append("plotStatus", editFormData.plotStatus);

    try {
      const response = await axios.post(url, formData);

      if (response && response.data && response.data.status === "success") {
        console.log("Plot updated successfully:", response.data.message);

        toast({
          title: "Plot updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setIsModalOpen(false);
        fetchDataPlot();
      } else {
        console.error("Error updating plot:", response.data.message);

        toast({
          title: "Error updating plot",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error in handleEditPlotSubmit:", error);

      toast({
        title: "Error updating plot",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Box p={4} width="100%">
        <Center pb={4}>
          <Heading fontSize={"25px"}>Add Plot </Heading>
        </Center>
        <form onSubmit={onAddPlot}>
          <Grid templateColumns="repeat(5, 1fr)" gap={4}>
            <FormControl>
              <FormLabel>Project Name</FormLabel>
              <Select
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Select Project"
                required
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.projectName}>
                    {project.projectName}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Block Name</FormLabel>
              <Select
                name="blockName"
                value={formData.blockName}
                onChange={handleChange}
                placeholder="Select Block"
                required
              >
                {getblock
                  .filter((block) => block.projectName === selectedProject)
                  .map((block) => (
                    <option key={block.id} value={block.blockName}>
                      {block.blockName}
                    </option>
                  ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Plot No</FormLabel>
              <Input
                type="text"
                name="plotNo"
                value={formData.plotNo}
                onChange={handleChange}
                placeholder="Enter Plot No"
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Area (in sqft)</FormLabel>
              <Input
                type="number"
                name="areaSqft"
                value={
                  editableAreaSqft !== "" ? editableAreaSqft : formData.areaSqft
                }
                onChange={handleChange}
                placeholder="Enter Area (sqft)"
                required
                border={matchCase ? "2px solid green" : "1px solid #E5EAEF"}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Area (in sqmt)</FormLabel>
              <Input
                type="number"
                name="areaSqmt"
                value={
                  editableAreaSqmt !== "" ? editableAreaSqmt : formData.areaSqmt
                }
                onChange={handleChange}
                placeholder="Enter Area (sqmt)"
                required
                border={matchCase ? "2px solid green" : "1px solid #E5EAEF"}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Rate (per sqft)</FormLabel>
              <Input
                type="number"
                name="ratePerSqft"
                value={
                  editableRatePerSqft !== ""
                    ? editableRatePerSqft
                    : formData.ratePerSqft
                }
                onChange={handleChange}
                placeholder="Enter Rate (per sqft)"
                required
                border={matchCase ? "2px solid green" : "1px solid #E5EAEF"}
              />
            </FormControl>

            <FormControl gridColumn="span 1">
              <FormLabel>Plot Type</FormLabel>
              <Select
                name="plotType"
                value={formData.plotType}
                onChange={handleChange}
                placeholder="Select Plot Type"
                required
              >
                {/* Populate the dropdown with plot types */}
                <option value="Normal">Normal</option>
                <option value="EWS">EWS</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="4BHK">4BHK</option>
                <option value="5BHK">5BHK</option>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Plot Status</FormLabel>
              <Select
                name="plotStatus"
                value={formData.plotStatus}
                onChange={handleChange}
                placeholder="Select Plot Status"
                required
              >
                <option value="Available">Available</option>
              </Select>
            </FormControl>
            <Button colorScheme="blue" type="submit" mt={8}>
              Add Plot
            </Button>
          </Grid>
          <Center></Center>
        </form>
      </Box>
      <Box>
        <Center mb={"15px"}>
          <VStack>
            <Heading fontSize={"25px"}>Plot Details</Heading>
            <Input
              type="text"
              w={"100%"}
              placeholder="Search by Project Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <PaginationControl
              changePage={changePage}
              page={currentPage}
              total={totalItems}
              limit={itemsPerPage}
            />
          </VStack>
        </Center>
        <Table variant="simple" colorScheme="blue">
          <Thead>
            <Tr>
              <Th bg="blue.500" color="white" fontSize="13px">
                Sr No.
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Project Name
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Block Name
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Plot No.
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Area sqft
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Area sqmt
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Rate PerSqft
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Plot Type
              </Th>{" "}
              <Th bg="blue.500" color="white" fontSize="14px">
                Action
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((plotItem, index) => (
              <Tr key={plotItem.id}>
                <Td>{index + 1}</Td>
                <Td>{plotItem.projectName}</Td>
                <Td>{plotItem.blockName}</Td>
                <Td>{plotItem.plotNo}</Td>

                <Td>{plotItem.areaSqft}</Td>
                <Td>{plotItem.areaSqmt}</Td>
                <Td>{plotItem.ratePerSqft}</Td>
                <Td>{plotItem.plotType}</Td>

                <Td>
                  <HStack>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(plotItem.id)}
                    >
                      Delete
                    </Button>
                    <DeleteConfirmationDialog
                      isOpen={isDeleteDialogOpen}
                      onClose={() => setIsDeleteDialogOpen(false)}
                      onConfirm={confirmDelete}
                    />
                    <Button
                      colorScheme="teal"
                      onClick={() => {
                        setIsModalOpen(true);
                        setEditFormData({
                          id: plotItem.id,
                          projectName: plotItem.projectName,
                          blockName: plotItem.blockName,
                          areaSqft: plotItem.areaSqft,
                          areaSqmt: plotItem.areaSqmt,
                          ratePerSqft: plotItem.ratePerSqft,
                          plotType: plotItem.plotType,
                          plotStatus: plotItem.plotStatus,
                        });
                      }}
                    >
                      Edit
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Block</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleEditPlotSubmit}>
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Project Name</FormLabel>
                <Select
                  name="projectName"
                  value={editFormData.projectName || ""}
                  onChange={handleEditPlotChange}
                  placeholder="Select Project"
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.projectName}>
                      {project.projectName}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Block Name</FormLabel>
                <Select
                  name="blockName"
                  value={editFormData.blockName}
                  onChange={handleEditPlotChange}
                  placeholder="Select Block"
                  required
                >
                  {getblock.map((block) => (
                    <option key={block.id} value={block.blockName}>
                      {block.blockName}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Plot No.</FormLabel>
                <Input
                  type="text"
                  name="plotNo"
                  value={editFormData.plotNo || ""}
                  onChange={handleEditPlotChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Area (in sqft)</FormLabel>
                <Input
                  type="number"
                  name="areaSqft"
                  value={editFormData.areaSqft || ""}
                  onChange={handleEditPlotChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Area (in sqmt)</FormLabel>
                <Input
                  type="number"
                  name="areaSqmt"
                  value={editFormData.areaSqmt || ""}
                  onChange={handleEditPlotChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Rate (per sqft)</FormLabel>
                <Input
                  type="number"
                  name="ratePerSqft"
                  value={editFormData.ratePerSqft || ""}
                  onChange={handleEditPlotChange}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Plot Type</FormLabel>
                <Select
                  name="plotType"
                  value={editFormData.plotType}
                  onChange={handleEditPlotChange}
                  placeholder="Select Plot Type"
                  required
                >
                  {/* Populate the dropdown with plot types */}
                  <option value="Normal">Normal</option>
                  <option value="EWS">EWS</option>
                  {/* Add more options as needed */}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Plot Status</FormLabel>
                <Select
                  name="plotStatus"
                  value={editFormData.plotStatus}
                  onChange={handleEditPlotChange}
                  placeholder="Select Plot Status"
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Save Changes
              </Button>
              <Button onClick={() => setIsModalOpen(false)} ml={4}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddPlot;
