import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  Input,
  useToast,
  Box,
  Avatar,
  Flex,
  IconButton
} from '@chakra-ui/react';

import { DeleteIcon } from '@chakra-ui/icons';

const CommentsModal = ({ isOpen, onClose, comments, postId, user, onCommentAdded, onCommentDeleted }) => {
  const [newComment, setNewComment] = useState('');
  const toast = useToast();

  const handleAddComment = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para realizar esta acción',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:3001/api/comments`, {
        autor: user._id,
        contenido: newComment,
        publicacionId: postId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const newCommentData = {
        ...response.data,
        autor: {
          _id: user._id,
          nombre: user.nombre,
          apellido: user.apellido,
        }
      };

      onCommentAdded(newCommentData);
      setNewComment('');
      toast({
        title: 'Comentario agregado',
        description: 'Tu comentario ha sido agregado correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al agregar el comentario:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al agregar el comentario',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
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

      await axios.delete(`http://localhost:3001/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      onCommentDeleted(commentId);
      toast({
        title: 'Comentario eliminado',
        description: 'Tu comentario ha sido eliminado correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al eliminar el comentario',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Comentarios</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            {comments.length === 0 ? (
              <Text>No hay comentarios en esta publicación</Text>
            ) : (
              comments.map((comment) => (
                <Box key={comment._id} p={4} borderWidth={1} borderRadius="md">
                  <Flex justify="space-between">
                    <Flex>
                      <Avatar size='xs' name={comment ? comment.autor.nombre : ''} />
                      <Text paddingLeft={2} fontWeight="bold">{`${comment.autor.nombre} ${comment.autor.apellido}`}</Text>
                    </Flex>
                    {user && comment.autor._id === user._id ? (
                      <IconButton
                        aria-label="Eliminar comentario"
                        icon={<DeleteIcon />}
                        size="sm"
                        onClick={() => handleDeleteComment(comment._id)}
                      />
                    ) : null }
                  </Flex>
                  <Text>{comment.contenido}</Text>
                </Box>
              ))
            )}
          </VStack>
        </ModalBody>
        {user && (
          <ModalFooter>
            <HStack spacing={4} width="100%">
              <Input
                placeholder="Escribe tu comentario"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={handleAddComment} colorScheme="blue">
                Comentar
              </Button>
            </HStack>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CommentsModal;
