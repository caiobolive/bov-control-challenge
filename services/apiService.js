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
  return axios.get(`${API_URL}/v1/checklist`);
};

export const createObject = async (objectData) => {
  return axios.post(`${API_URL}/v1/checklist`, objectData);
};

export const updateObject = async (id, updatedData) => {
  return axios.put(`${API_URL}/v1/checklist/${id}`, updatedData);
};

export const deleteObject = async (id) => {
  return axios.delete(`${API_URL}/v1/checklist/${id}`);
};