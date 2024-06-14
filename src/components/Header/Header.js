import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar, Menu, MenuButton, MenuList, MenuItem, Button, WrapItem, IconButton,
  Center,
  Heading,
  Text,
  Flex
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const Header = ({ user, onLogout, onOpenModal }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  return (
    <Flex justifyContent="space-between" p={4}>
        <WrapItem>
          <Menu>
            <MenuButton as={Button} variant="unstyled">
              <Avatar margin={4} marginBottom={0} size="md" name={user ? user.nombre : ''}/>
            </MenuButton>
            <MenuList>
            {user ? (
                  <>
                    <MenuItem>{user.nombre + ' ' + user.apellido}</MenuItem>
                    <MenuItem>{user.email}</MenuItem>
                    <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                  </>
                     ) : (
                    <Link to="/login">
                    <MenuItem>Iniciar sesion</MenuItem>
                    </Link>
                          )
            }
            </MenuList>
          </Menu>
        </WrapItem>
        <Center>
          <Heading>
            <Text>Quemados MID 🔥</Text>
          </Heading>
        </Center>
        {
          user ? (
            <IconButton icon={<AddIcon />} margin={4} onClick={onOpenModal} />
          ) : null
        }
      </Flex>
  );
};

export default Header;
