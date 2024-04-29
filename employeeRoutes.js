import express from 'express';
const router = express.Router();
import employeeController from './employeeController.js';
// Add a new employee
router.post('/add', employeeController.addEmployee);

// Get all employees
router.get('/all', employeeController.getAllEmployees);

// Get an employee by ID
router.get('/:id', employeeController.getEmployeeById);

// Update an employee by ID
router.put('/:id', employeeController.updateEmployeeById);

// Delete an employee by ID
router.delete('/:id', employeeController.deleteEmployeeById);

export default router;
