import React from "react";
import { Button, HStack } from "@chakra-ui/react";

const PaginationControl = ({ changePage, page, total, limit }) => {
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      changePage(newPage);
    }
  };

  return (
    <HStack mt={4} spacing={2}>
      <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
        Previous
      </Button>
      {[...Array(totalPages)].map((_, index) => (
        <Button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          colorScheme={page === index + 1 ? "blue" : "gray"}
        >
          {index + 1}
        </Button>
      ))}
      <Button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </HStack>
  );
};

export default PaginationControl;
