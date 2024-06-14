import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, #0077b6, #00b4d8, #03045e)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Pagina no encontrada
      </Text>
      <Text color={'gray.500'} mb={6}>
    Que buscas, no hay nada aqui
      </Text>
      <Button
        as={Link}
        to="/"
        colorScheme="teal"
        bgGradient="linear(to-r, #0077b6, #00b4d8, #03045e)"
        color="white"
        variant="solid"
          _hover={{
    bgGradient: 'linear(to-r, #03045e, #00b4d8, #0077b6)',
  }}
      >
            Ir al inicio
      </Button>
    </Box>
  );
};

export default PageNotFound;
