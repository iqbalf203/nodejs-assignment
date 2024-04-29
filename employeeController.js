import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import Employee from './employee.js';

// Use a constant array for employees to ensure data consistency
const employees = []; 
const addEmployee = (req, res) => {
  const { name, position, department } = req.body;
  const newEmployee = new Employee(uuidv4(), name, position, department);

  // 1. Read existing data from the file (if any)
  let existingData = [];
  try {
    const data = fs.readFileSync('employees.json');
    existingData = JSON.parse(data);
  } catch (err) {
    // Ignore error if file doesn't exist (first time running)
  }

  // 2. Add the new employee to the data
  existingData.push(newEmployee);

  // 3. Write the updated data back to the file
  fs.writeFileSync('employees.json', JSON.stringify(existingData, null, 2)); // 2 spaces for indentation

  res.status(201).json(newEmployee);
};

const getAllEmployees = (req, res) => {
  try {
    const data = fs.readFileSync('employees.json');
    const employees = JSON.parse(data);
    res.json(employees);
  } catch (err) {
    // Handle error if file doesn't exist or data is invalid
    res.status(500).json({ error: 'Error retrieving employees' });
  }
};

const getEmployeeById = (req, res) => {
  const employeeId = req.params.id;

  fs.readFile('employees.json', 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error reading employee data' });
    }

    try {
      const employees = JSON.parse(data);
      const employee = employees.find(emp => emp.id === employeeId);

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      res.json(employee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error parsing employee data' });
    }
  });
};

const updateEmployeeById = (req, res) => {
  const employeeId = req.params.id;
  const { name, position, department } = req.body;

  try {
    const data = fs.readFileSync('employees.json');
    const employees = JSON.parse(data);
    const employeeIndex = employees.findIndex(emp => emp.id === employeeId);

    if (employeeIndex === -1) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Update employee properties
    employees[employeeIndex].name = name || employees[employeeIndex].name;
    employees[employeeIndex].position = position || employees[employeeIndex].position;
    employees[employeeIndex].department = department || employees[employeeIndex].department;

    // Write updated data back to the file
    fs.writeFileSync('employees.json', JSON.stringify(employees, null, 2)); 

    res.json(employees[employeeIndex]);
  } catch (err) {
    res.status(500).json({ error: 'Error updating employee' });
  }
};


const deleteEmployeeById = (req, res) => {
  const employeeId = req.params.id;

  try {
    const data = fs.readFileSync('employees.json');
    const employees = JSON.parse(data);
    const initialLength = employees.length;

    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);

    if (updatedEmployees.length === initialLength) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Write the updated data (without the deleted employee) back to the file
    fs.writeFileSync('employees.json', JSON.stringify(updatedEmployees, null, 2));

    res.status(204).send(); // Send 204 No Content response on successful deletion
  } catch (err) {
    res.status(500).json({ error: 'Error deleting employee' });
  }
};

export default  {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById
};
