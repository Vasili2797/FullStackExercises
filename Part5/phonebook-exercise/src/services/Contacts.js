import axios from "axios";
// const baseUrl = "http://localhost:3001/persons";
// Integrating frontend with backend
const baseUrl = "http://localhost:3001/api/persons";

const getAllNumbers = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createContact = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const removeContact = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const updateContact = (id, newData) => {
  const request = axios.put(`${baseUrl}/${id}`, newData);
  return request.then((response) => response.data);
};

const deleteAllContacts = () => {
  return axios.delete(baseUrl);
};

export default {
  getAllNumbers,
  createContact,
  removeContact,
  updateContact,
  deleteAllContacts,
};
