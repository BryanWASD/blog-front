import * as React from 'react'
import axios from 'axios';
import { 
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter, 
    Flex, 
    Box, 
    Heading, 
    Text, 
    IconButton, 
    Button, 
    Image,
    Center,
    Menu,
    MenuButton, 
    MenuList,
    MenuItem,
    useToast,
} from '@chakra-ui/react'

import { ChatIcon, HamburgerIcon } from '@chakra-ui/icons'

const CustomCard = ({ title, content, autor, autorId, date, onEdit, image, userId, postId, onUpdate, onComments }) => {
  const toast = useToast();

  const handleEditClick = () => {
    onEdit();
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Error',
          description: 'Debes iniciar sesión para realizar esta acción',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      await axios.delete(`http://localhost:3001/api/publications/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      toast({
        title: 'Publicación eliminada',
        description: 'La publicación ha sido eliminada correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onUpdate();

    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al eliminar la publicación',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCommentsClick = () => {
    onComments();
  };
  
return(
<Card width='500px' maxWidth='1000px' minWidth='200px'>
  <CardHeader>
    <Flex spacing='4'>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Box>
          <Heading size='sm'>{autor}</Heading>
          <Text>{date}</Text>
        </Box>
      </Flex>
      {autorId === userId ? (
            <Menu>
              <MenuButton
                as={IconButton}
                variant='ghost'
                colorScheme='gray'
                aria-label='Menu'
                icon={<HamburgerIcon />}
              />
              <MenuList>
                <MenuItem onClick={handleEditClick}>Editar</MenuItem>
                <MenuItem onClick={handleDelete}>Borrar</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
            </>
          )}
    </Flex>
    <Heading size='sm' padding={4} paddingLeft={0} paddingBottom={0}>
      {title}
    </Heading>
  </CardHeader>
  <CardBody paddingTop={0} >
    <Text>
     {content}
    </Text>
  </CardBody>
  <Center>
  <Image
  boxSize='500px'
    height='230px'
    objectFit='fit'
    src={image == null ? 'https://dummyimage.com/600x400/000/fff&text=No+Image' : image}
    alt='Imagen'
  />
  </Center>
  <CardFooter
    justify='space-between'
    flexWrap='wrap'
    sx={{
      '& > button': {
        minW: '136px',
      },
    }}
  >
    <Button flex='1' variant='ghost' leftIcon={<ChatIcon />} onClick={handleCommentsClick}>
      Comentarios
    </Button>
  </CardFooter>
</Card>
    )
}

export default CustomCard;