import * as React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Center, VStack, useDisclosure } from '@chakra-ui/react';
import CustomCard from '../../components/Card/Card';
import Header from '../../components/Header/Header';
import CreatePostModal from './createPost';
import EditPostModal from './updatePost';
import CommentsModal from './comments';



export default function Home() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [updateCounter, setUpdateCounter] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isCommentsOpen, onOpen: onCommentsOpen, onClose: onCommentsClose } = useDisclosure();
    const [selectedPost, setSelectedPost] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [editedPost, setEditedPost] = useState(posts);
    const [selectedComments, setSelectedComments] = useState([]);

    useEffect(() => {
      const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try{
            const response = await axios.get('http://localhost:3001/api/user', {
              headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          }catch(e){
            console.error('Error fetching user data:', e);
          };
        }
      }
      const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/publications');
            const data = response.data;
            const formattedData = data.map(post => ({
                ...post,
                fechaFormateada: new Date(post.fechaCreacion).toLocaleString('es-MX', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                })
            }));
            setPosts(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchUserData();
    fetchPosts();
},[updateCounter]);

useEffect(() => {
  if (posts) {
    setEditedPost(posts);
  }}, [posts]);

const handlePostCreated = () => {
  setUpdateCounter(prev => prev + 1); 
};

const handlePostDeleted = () => {
  setUpdateCounter(prev => prev + 1); 
};

const handleEditPost = (posts) => {
  setSelectedPost(posts);
  onEditOpen();
};

const handleCloseModal = () => {
  setSelectedPost(null);
  onEditClose();
};

const handleUpdate = () => {
  onEditClose();
  setUpdateCounter(prev => prev + 1); 
};

const handleComments = (posts) => {
  setSelectedComments(posts.comentarios || []); // Asegúrate de que selectedComments siempre sea un arreglo
  setSelectedPost(posts);
  onCommentsOpen();
};

const handleCommentAdded = (newComment) => {
  setSelectedComments(prevComments => [...prevComments, newComment]);
  setPosts(prevPosts => prevPosts.map(post => 
    post._id === selectedPost._id ? { ...post, comentarios: [...post.comentarios, newComment] } : post
  ));
};

const handleCommentDeleted = (commentId) => {
  setSelectedComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
  setPosts(prevPosts => prevPosts.map(post =>
      post._id === selectedPost._id ? { ...post, comentarios: post.comentarios.filter(comment => comment._id !== commentId) } : post
  ));
};
  return (
    <div>
    <Header user={user} onLogout={() => setUser(null)} onOpenModal={onOpen} />
      <Center padding={6}>
      <VStack spacing={6} align="stretch">
      {
            posts.map(posts => (
                <CustomCard             
                key={posts._id}
                title={posts.titulo}
                content={posts.contenido}
                autor={`${posts.autor.nombre} ${posts.autor.apellido}`}
                date={posts.fechaFormateada}
                image={posts.imagen}
                autorId={posts.autor?._id}
                userId={user?._id}
                postId={posts?._id}
                onEdit={() => handleEditPost(posts)}
                onUpdate={handlePostDeleted}
                onComments={() => handleComments(posts)}
                />
            ))
        }
      </VStack>
      </Center>
      <CreatePostModal isOpen={isOpen} onClose={onClose} userId={user?._id} onPostCreated={handlePostCreated}/>
      <EditPostModal isOpen={isEditOpen} onClose={handleCloseModal} post={selectedPost} onUpdatePost={handleUpdate} />
      <CommentsModal isOpen={isCommentsOpen} onClose={onCommentsClose} comments={selectedComments} postId={selectedPost?._id} user={user} onCommentAdded={handleCommentAdded} onCommentDeleted={handleCommentDeleted}
 />
    </div>
  );
}
