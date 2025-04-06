import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  SimpleGrid,
  Switch,
  Box,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import { createMuseum, updateMuseum } from '../../utils/adminApi';

const defaultMuseum = {
  name: '',
  description: '',
  location: {
    address: '',
    city: '',
    state: '',
    country: '',
  },
  ticketPrices: {
    adult: 50,
    child: 0,
    senior: 20,
  },
  openingHours: {
    open: '09:00',
    close: '17:00',
  },
  contactInfo: {
    phone: '',
    email: '',
    website: '',
  },
  featured: false,
};

const MuseumForm = ({ isOpen, onClose, museum }) => {
  const [formData, setFormData] = useState(defaultMuseum);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  
  const isEditMode = !!museum;
  
  useEffect(() => {
    if (museum) {
      setFormData(museum);
    } else {
      setFormData(defaultMuseum);
    }
  }, [museum]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested objects (e.g., location.address)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleSwitchChange = () => {
    setFormData({
      ...formData,
      featured: !formData.featured,
    });
  };
  
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      
      const formDataToSend = new FormData();
      
      // Append museum data
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object' && formData[key] !== null && !Array.isArray(formData[key])) {
          // Handle nested objects
          Object.keys(formData[key]).forEach(nestedKey => {
            formDataToSend.append(`${key}.${nestedKey}`, formData[key][nestedKey]);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append images if any
      if (images.length > 0) {
        images.forEach(image => {
          formDataToSend.append('images', image);
        });
      }
      
      if (isEditMode) {
        await updateMuseum(formData._id, formDataToSend);
      } else {
        await createMuseum(formDataToSend);
      }
      
      onClose(true); // Close and refresh data
    } catch (error) {
      console.error('Error saving museum:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={() => onClose()} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditMode ? 'Edit Museum' : 'Add New Museum'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={1} spacing={4}>
            <FormControl isRequired isInvalid={errors.name}>
              <FormLabel>Museum Name</FormLabel>
              <Input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
            
            <FormControl isRequired isInvalid={errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={4}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>
            
            <FormControl>
              <FormLabel>Location</FormLabel>
              <SimpleGrid columns={2} spacing={3}>
                <Input 
                  placeholder="Address" 
                  name="location.address" 
                  value={formData.location.address} 
                  onChange={handleChange} 
                />
                <Input 
                  placeholder="City" 
                  name="location.city" 
                  value={formData.location.city} 
                  onChange={handleChange} 
                />
                <Input 
                  placeholder="State" 
                  name="location.state" 
                  value={formData.location.state} 
                  onChange={handleChange} 
                />
                <Input 
                  placeholder="Country" 
                  name="location.country" 
                  value={formData.location.country} 
                  onChange={handleChange} 
                />
              </SimpleGrid>
            </FormControl>
            
            <FormControl>
              <FormLabel>Ticket Prices</FormLabel>
              <SimpleGrid columns={3} spacing={3}>
                <InputGroup>
                  <InputLeftAddon>Adult</InputLeftAddon>
                  <Input 
                    type="number" 
                    name="ticketPrices.adult" 
                    value={formData.ticketPrices.adult} 
                    onChange={handleChange} 
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Child</InputLeftAddon>
                  <Input 
                    type="number" 
                    name="ticketPrices.child" 
                    value={formData.ticketPrices.child} 
                    onChange={handleChange} 
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon>Senior</InputLeftAddon>
                  <Input 
                    type="number" 
                    name="ticketPrices.senior" 
                    value={formData.ticketPrices.senior} 
                    onChange={handleChange} 
                  />
                </InputGroup>
              </SimpleGrid>
            </FormControl>
            
            <FormControl>
              <FormLabel>Opening Hours</FormLabel>
              <SimpleGrid columns={2} spacing={3}>
                <Input 
                  type="time" 
                  name="openingHours.open" 
                  value={formData.openingHours.open} 
                  onChange={handleChange} 
                />
                <Input 
                  type="time" 
                  name="openingHours.close" 
                  value={formData.openingHours.close} 
                  onChange={handleChange} 
                />
              </SimpleGrid>
            </FormControl>
            
            <FormControl>
              <FormLabel>Contact Information</FormLabel>
              <SimpleGrid columns={1} spacing={3}>
                <Input 
                  placeholder="Phone" 
                  name="contactInfo.phone" 
                  value={formData.contactInfo.phone} 
                  onChange={handleChange} 
                />
                <Input 
                  placeholder="Email" 
                  name="contactInfo.email" 
                  value={formData.contactInfo.email} 
                  onChange={handleChange} 
                />
                <Input 
                  placeholder="Website" 
                  name="contactInfo.website" 
                  value={formData.contactInfo.website} 
                  onChange={handleChange} 
                />
              </SimpleGrid>
            </FormControl>
            
            <FormControl>
              <FormLabel>Museum Images</FormLabel>
              <Input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange}
                p={1}
              />
            </FormControl>
            
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="featured" mb="0">
                Featured Museum
              </FormLabel>
              <Switch 
                id="featured" 
                isChecked={formData.featured} 
                onChange={handleSwitchChange} 
              />
            </FormControl>
          </SimpleGrid>
        </ModalBody>
        
        <ModalFooter>
          <Button 
            colorScheme="blue" 
            mr={3} 
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {isEditMode ? 'Update' : 'Create'}
          </Button>
          <Button variant="ghost" onClick={() => onClose()}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MuseumForm;