import axios from 'axios';

const API_URL = 'http://challenge-front-end.bovcontrol.com';

export const healthCheck = async () => {
  try {
    const response = await axios.get(`${API_URL}/healthCheck`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const getObjects = async () => {
  return await axios.get(`${API_URL}/v1/checklist`);
};

// New function to check if a checklist exists by _id
export const checkIfChecklistExists = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/v1/checklist/${id}`);
    return response.status === 200; // If found, the checklist exists
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false; // Not found
    }
    console.error(`Error checking if checklist exists:`, error);
    return false;
  }
};

export const createObject = async (objectData) => {
  return axios.post(`${API_URL}/v1/checklist`, objectData); // Send objectData directly
};

export const updateObject = async (id, updatedData) => {
  return axios.put(`${API_URL}/v1/checklist/${id}`, updatedData);
};

export const deleteObject = async (id) => {
  return axios.delete(`${API_URL}/v1/checklist/${id}`);
};