import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  useDisclosure, 
  HStack,
  Badge,
  Text
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import MuseumForm from '../components/museums/MuseumForm';
import { getMuseums, deleteMuseum } from '../utils/adminApi';

const MuseumsManagement = () => {
  const [museums, setMuseums] = useState([]);
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Fetch museums
  const fetchMuseums = async () => {
    try {
      setIsLoading(true);
      const data = await getMuseums();
      setMuseums(data);
    } catch (error) {
      console.error('Error fetching museums:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMuseums();
  }, []);
  
  // Handle edit museum
  const handleEdit = (museum) => {
    setSelectedMuseum(museum);
    onOpen();
  };
  
  // Handle delete museum
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this museum?')) {
      try {
        await deleteMuseum(id);
        fetchMuseums(); // Refresh list
      } catch (error) {
        console.error('Error deleting museum:', error);
      }
    }
  };
  
  // Handle form close and refresh
  const handleFormClose = (refreshData = false) => {
    setSelectedMuseum(null);
    onClose();
    if (refreshData) fetchMuseums();
  };
  
  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Museums Management</Heading>
        <Button 
          leftIcon={<FiPlus />} 
          colorScheme="blue" 
          onClick={() => {
            setSelectedMuseum(null);
            onOpen();
          }}
        >
          Add New Museum
        </Button>
      </HStack>
      
      {isLoading ? (
        <Text>Loading museums...</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Location</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {museums.map((museum) => (
              <Tr key={museum._id}>
                <Td>{museum.name}</Td>
                <Td>
                  {museum.location?.city}, {museum.location?.state}
                </Td>
                <Td>
                  <Badge colorScheme={museum.featured ? "green" : "gray"}>
                    {museum.featured ? "Featured" : "Standard"}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Button 
                      size="sm" 
                      leftIcon={<FiEdit2 />} 
                      onClick={() => handleEdit(museum)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      leftIcon={<FiTrash2 />} 
                      colorScheme="red"
                      onClick={() => handleDelete(museum._id)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      
      <MuseumForm 
        isOpen={isOpen} 
        onClose={handleFormClose} 
        museum={selectedMuseum} 
      />
    </Box>
  );
};

export default MuseumsManagement;