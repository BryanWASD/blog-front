import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, Textarea, useToast
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const EditPostModal = ({ isOpen, onClose, post, onUpdatePost }) => {
  const [editedPost, setEditedPost] = useState(post);
  const toast = useToast();

  useEffect(() => {
    setEditedPost(post);
  }, [post]);

  const onDrop = (acceptedFiles) => {
    setEditedPost({ ...editedPost, imagen: acceptedFiles[0] });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPost({ ...editedPost, [name]: value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para actualizar la publicación',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('titulo', editedPost.titulo);
    formData.append('contenido', editedPost.contenido);
    if (editedPost.imagen) formData.append('imagen', editedPost.imagen);

    try {
      await axios.put(`http://localhost:3001/api/publications/${editedPost._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast({
        title: 'Publicación actualizada',
        description: 'La publicación ha sido actualizada correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onUpdatePost();

      onClose();

    } catch (error) {
      console.error('Error al actualizar la publicación:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al actualizar la publicación',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!editedPost) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar publicación</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Título</FormLabel>
            <Input name="titulo" value={editedPost.titulo} onChange={handleInputChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Contenido</FormLabel>
            <Textarea name="contenido" value={editedPost.contenido} onChange={handleInputChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Imagen</FormLabel>
            <div {...getRootProps()} style={{ border: '1px dashed #ccc', padding: '10px', textAlign: 'center', cursor: 'pointer' }}>
              <input {...getInputProps()} />
              {editedPost.imagen ? <p>Seleccionar otra imagen</p> : <p>Seleccionar una imagen</p>}
            </div>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Guardar cambios
          </Button>
          <Button variant="ghost" onClick={handleCancel}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPostModal;
