<!-- import React, { useState, useEffect, useCallback } from "react";
// import { store } from "storage-script";
import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  Center,
  Heading,
Stack,
  Table,
  Text,
  Thead,
  Tr,
  HStack,
  Td,
  Tbody,
  Th,
  Modal, Skeleton, SkeletonCircle, SkeletonText,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const AddBlock = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [tableLoading, setTableLoading] = useState(false);

  const [projects, setProjects] = useState([]);
  const [block, setBlock] = useState([]);
  const [formData, setFormData] = useState({
    projectName: "",
    blockName: "",
    areaSqft: "",
    areaSqmt: "",
    ratePerSqft: "",
  });


  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const [projectsResponse, blockResponse] = await Promise.all([
          axios.get("https://lkgexcel.com/backend/getprojects.php"),
          axios.get("https://lkgexcel.com/backend/getblock.php"),
        ]);
        if (projectsResponse.data && blockResponse.data) {
          setProjects(projectsResponse.data);
          setBlock(blockResponse.data);
         
        }
      } catch (error) {
        console.error("Error fetching data:", error);
     
      }
    };
    fetchData();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const onAddBlock = async (e) => {
    e.preventDefault();

    const url = "https://lkgexcel.com/backend/addblock.php";
    const fData = new FormData();
    fData.append("projectName", formData.projectName);
    fData.append("blockName", formData.blockName);
    fData.append("areaSqft", formData.areaSqft);
    fData.append("areaSqmt", formData.areaSqmt);
    fData.append("ratePerSqft", formData.ratePerSqft);

    try {
      const response = await axios.post(url, fData);
      setToastMessage("Block added successfully!");
      fetchData();
      clearFormData();
    } catch (error) {
      console.log(error.toJSON());
    }
  };

  const handleDelete = useCallback(async (projectId) => {
    setProjectIdToDelete(projectId);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      await axios.delete(
        `https://lkgexcel.com/backend/deleteblock.php?id=${projectIdToDelete}`
      );
      setBlock((prevBlock) =>
        prevBlock.filter((project) => project.id !== projectIdToDelete)
      );
      setToastMessage("Block deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectIdToDelete(null);
    }
  }, [projectIdToDelete]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    projectName: "",
    blockName: "",
    areaSqft: "",
    areaSqmt: "",
    ratePerSqft: "",
  });

  // const handleEditBlockChange = useCallback((e) => {
  //   const { name, value } = e.target;
  //   setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  // }, []);

  const handleEditBlockSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const url = "https://lkgexcel.com/backend/editblock.php";

      try {
        const formData = new FormData();
        formData.append("id", editFormData.id);
        formData.append("projectName", editFormData.projectName);
        formData.append("blockName", editFormData.blockName);
        formData.append("areaSqft", editFormData.areaSqft);
        formData.append("areaSqmt", editFormData.areaSqmt);
        formData.append("ratePerSqft", editFormData.ratePerSqft);

        const response = await axios.post(url, formData);

        if (response && response.data && response.data.status === "success") {
          setIsModalOpen(false);
          fetchData();
          setToastMessage("Block updated successfully!");
        } else {
          console.error("Error updating block. Response:", response);
          setToastMessage("Error updating block");
        }
      } catch (error) {
        console.error("Error in handleEditBlockSubmit:", error);
        setToastMessage("Error updating block");
      }
    },
    [editFormData]
  );

  const clearFormData = () => {
    setFormData({
      projectName: "",
      blockName: "",
      areaSqft: "",
      areaSqmt: "",
      ratePerSqft: "",
    });
  };

  const fetchData = useCallback(async () => {
    setTableLoading(true)
    try {
      const [projectsResponse, blockResponse] = await Promise.all([
        axios.get("https://lkgexcel.com/backend/getprojects.php"),
        axios.get("https://lkgexcel.com/backend/getblock.php"),
      ]);
      setProjects(projectsResponse.data);
      if(projectsResponse.data){
        setTableLoading(false) 
      }
      setBlock(blockResponse.data);
     
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableLoading(false) 
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
console.log("render comp")
  return (
    <>
      <Box p={4} width="100%">
        <Center pb={4}>
          <Heading fontSize={"25px"}>Add Block</Heading>
        </Center>
        <form onSubmit={onAddBlock}>
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
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
              <Input
                type="text"
                name="blockName"
                value={formData.blockName}
                onChange={handleChange}
                placeholder="Enter Block Name"
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Area (in sqft)</FormLabel>
              <Input
                type="number"
                name="areaSqft"
                value={formData.areaSqft}
                onChange={handleChange}
                placeholder="Enter Area (sqft)"
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Area (in sqmt)</FormLabel>
              <Input
                type="number"
                name="areaSqmt"
                value={formData.areaSqmt}
                onChange={handleChange}
                placeholder="Enter Area (sqmt)"
                required
              />
            </FormControl>

            <FormControl>
              <FormLabel>Rate (per sqft)</FormLabel>
              <Input
                type="number"
                name="ratePerSqft"
                value={formData.ratePerSqft}
                onChange={handleChange}
                placeholder="Enter Rate (per sqft)"
                required
              />
            </FormControl>
          </Grid>
        </form>
      </Box>
      <Box>
        <Center mb={"15px"}>
          <VStack>
            <Heading fontSize={"25px"}>Block Details</Heading>
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
                Area sqft
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Area sqmt
              </Th>
              <Th bg="blue.500" color="white" fontSize="13px">
                Rate PerSqft
              </Th>
              <Th bg="blue.500" color="white" fontSize="14px">
                Action
              </Th>
            </Tr>
          </Thead>
       
       {tableLoading ? <Tbody>
        {block.map((blockItem, index) => (
              <Tr key={blockItem.id}>
            <Td><Skeleton height='20px' /></Td>    
            <Td><Skeleton height='20px' /></Td>    
            <Td><Skeleton height='20px' /></Td>    
            <Td><Skeleton height='20px' /></Td>    
            <Td><Skeleton height='20px' /></Td>    
            <Td><Skeleton height='20px' /></Td>    
                
                <Td>
                <Skeleton height='20px' />
                </Td>
              </Tr>
            ))}
        </Tbody> : <Tbody>
         {block.map((blockItem, index) => (
              <Tr key={blockItem.id}>
                <Td>{index + 1}</Td>
                <Td>{blockItem.projectName}</Td>
                <Td>{blockItem.blockName}</Td>
                <Td>{blockItem.areaSqft}</Td>
                <Td>{blockItem.areaSqmt}</Td>
                <Td>{blockItem.ratePerSqft}</Td>
                <Td>
                  <HStack>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(blockItem.id)} // Pass projectId to handleDelete
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
                          id: blockItem.id,
                          projectName: blockItem.projectName,
                          blockName: blockItem.blockName,
                          areaSqft: blockItem.areaSqft,
                          areaSqmt: blockItem.areaSqmt,
                          ratePerSqft: blockItem.ratePerSqft,
                        });
                      }}
                    >
                      Edit
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>}
        </Table>
      </Box>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Block</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleEditBlockSubmit}>{/* Modal Body */}</form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddBlock; -->



{id: '4', projectName: 'Testing ', blockName: 'Block A', plotNo: '90', plotType: 'Normal', …}
