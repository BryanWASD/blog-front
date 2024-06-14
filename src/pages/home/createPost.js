import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, Textarea, useToast
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const CreatePostModal = ({ isOpen, onClose, userId, onPostCreated }) => {
const initialState = { titulo: '', contenido: '', imagen: null, autor: userId };
  const [newPost, setNewPost] = useState({ initialState });
  const toast = useToast();

  const onDrop = (acceptedFiles) => {
    setNewPost({ ...newPost, imagen: acceptedFiles[0] });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para crear una publicación',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('titulo', newPost.titulo);
    formData.append('contenido', newPost.contenido);
    formData.append('autor', userId);
    if (newPost.imagen) formData.append('imagen', newPost.imagen);

    try {
      await axios.post('http://localhost:3001/api/publications', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast({
        title: 'Publicación creada',
        description: 'Tu publicación ha sido creada exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setNewPost({ initialState });
      onClose();
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error al crear la publicación:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al crear la publicación',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    console.log(formData.append('autor', userId));
  };

  const handleCancel = () => {
    setNewPost(initialState);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear nueva publicación</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Título</FormLabel>
            <Input name="titulo" value={newPost.titulo} onChange={handleInputChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Contenido</FormLabel>
            <Textarea name="contenido" value={newPost.contenido} onChange={handleInputChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Imagen</FormLabel>
            <div {...getRootProps()} style={{ border: '1px dashed #ccc', padding: '10px', textAlign: 'center', cursor: 'pointer' }}>
              <input {...getInputProps()} />
              {newPost.imagen ? <p>{newPost.imagen.name}</p> : <p>Seleccionar una imagen</p>}
            </div>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Publicar
          </Button>
          <Button variant="ghost" onClick={handleCancel}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreatePostModal;
