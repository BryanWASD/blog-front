import * as React from 'react';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Button,
    Heading,
    Box,
    Center,
    Text,
    Flex,
    useToast,
  } from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const RegisterSchema = Yup.object().shape({
        email: Yup.string().email('Correo inválido').required('Requerido'),
        password: Yup.string().required('Requerido'),
        nombre: Yup.string().required('Requerido'),
        apellido: Yup.string().required('Requerido'),
    });
    
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (values, actions) => {
        try {
            const response = await axios.post('http://localhost:3001/api/register', values);
            navigate('/login');
            toast({
                title: 'Exito',
                description: "Cuenta creada",
                status: 'success',
                duration: 5000,
                isClosable: true,
              });
            console.log('Respuesta del servidor:', response.data);
        } catch (error) {
            console.error('Error al realizar la solicitud POST:', error);
            toast({
                title: 'Hubo un problema',
                description: 'Error al crear la cuenta',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            actions.setSubmitting(false);
        }
    };
    return (
        <Box p={4} maxWidth="400" mx="auto">
            <Center>
            <Heading as="h2" mb={6}>Crea tu cuenta</Heading>
            </Center>
            <Formik
                initialValues={{ email: '', password: '', nombre: '', apellido: '', }}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Center>
                        <Form>
                        <FormControl>
                            <FormLabel htmlFor='email'>Correo</FormLabel>
                            <Field as={Input} id="email" name="email" type="email" />
                            <FormErrorMessage name='email' component='div' style={{ color: 'red' }} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor='password'>Contraseña</FormLabel>
                            <Field as={Input} id="password" name="password" type="password" />
                            <FormErrorMessage name='password' component='div' style={{ color: 'red' }} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor='text'>Nombre</FormLabel>
                            <Field as={Input} id="nombre" name="nombre" type="text" />
                            <FormErrorMessage name='nombre' component='div' style={{ color: 'red' }} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor='password'>Apellido</FormLabel>
                            <Field as={Input} id="apellido" name="apellido" type="text" />
                            <FormErrorMessage name='apellido' component='div' style={{ color: 'red' }} />
                        </FormControl>
                        <Button mt={4} isLoading={isSubmitting} type='submit' width='400px'>
                        Crear cuenta
                        </Button>
                    </Form>
                    </Center>
                )}
            </Formik>
            <Flex>
            <Text mt={4}>
                Ya tienes cuenta?
            </Text>
            <Link to={'/login'}>
            <Heading size='xs' mt={5} ml={2}>
               Inicia sesion
            </Heading>
            </Link>
            </Flex>
        </Box>
    );
}
