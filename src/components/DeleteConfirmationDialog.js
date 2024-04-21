import React from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Spinner,
} from "@chakra-ui/react";

const DeleteConfirmationDialog = ({ isOpen,loadingDel, onClose, onConfirm }) => {
  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay bg={"transparent"}>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Warning !!
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete this ? You can't undo this action
            afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
     {loadingDel ?    <Button
    isLoading
    loadingText='deleting'
    colorScheme='teal'
    variant='outline'
  >
    Submit
  </Button>
 : <Button colorScheme="red" onClick={onConfirm} ml={3}>
              Delete
            </Button> }      
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
