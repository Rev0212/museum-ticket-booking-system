const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const calculateTotalPrice = (ticketPrice, quantity) => {
    return ticketPrice * quantity;
};

const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
};

const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export { formatDate, calculateTotalPrice, generateRandomId, isValidEmail };