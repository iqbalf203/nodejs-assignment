import express from "express";
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import Employee from './employee.js';


const app = express();
const PORT = 3000;
app.use(cors()); 

app.use(bodyParser.json()); 

// ==============================================


const employees = []; 
app.post('/add',(req, res) => {
  const { name, position, department } = req.body;

  if (!name || !position || !department) {
    return res.status(400).send({ error: 'Name, position and department are required.' });
}

  let existingData = [];

  try {
    const data = fs.readFileSync('employees.json');
    existingData = JSON.parse(data);
  } catch (err) {
    console.log(err)
  }
  const newEmployee = new Employee(existingData.length+1, name, position, department);
  existingData.push(newEmployee);

  fs.writeFileSync('employees.json', JSON.stringify(existingData));

  res.send(newEmployee);
});

app.get('/all',(req, res) => {
  try {
    const data = fs.readFileSync('employees.json');
    const employees = JSON.parse(data);
    res.send(employees);
  } catch (err) {
    res.status(500).send({ error: 'Error retrieving employees' });
  }
});

app.get('/:id',(req, res) => {
  const employeeId = parseInt(req.params.id);

  fs.readFile('employees.json', 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: 'Error reading employee data' });
    }

      const employees = JSON.parse(data);
      const employee = employees.find(emp => emp.id === employeeId);

      if (!employee) {
        return res.status(404).send({ error: 'Employee not found' });
      }

      res.send(employee);
  })
});

app.put('/:id',(req, res) => {
  const employeeId = parseInt(req.params.id);
  const { name, position, department } = req.body;

  try {
    const data = fs.readFileSync('employees.json');
    const employees = JSON.parse(data);
    const employeeIndex = employees.findIndex(emp => emp.id === employeeId);

    if (employeeIndex === -1) {
      return res.status(404).send({ error: 'Employee not found' });
    }


    if (name) employees[employeeIndex].name = name 
    if (position) employees[employeeIndex].position = position
    if (department) employees[employeeIndex].department = department

    fs.writeFileSync('employees.json', JSON.stringify(employees)); 

    res.send(employees[employeeIndex]);
  } catch (err) {
    res.status(500).send({ error: 'Error updating employee' });
  }
});


app.delete('/:id',(req, res) => {
  const employeeId = parseInt(req.params.id);

  try {
    const data = fs.readFileSync('employees.json');
    const employees = JSON.parse(data);
    const initialLength = employees.length;

    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);

    if (updatedEmployees.length === initialLength) {
      return res.status(404).send({ error: 'Employee not found' });
    }

    fs.writeFileSync('employees.json', JSON.stringify(updatedEmployees));

    res.send("Deleted")
  } catch (err) {
    res.status(500).send({ error: 'Error deleting employee' });
  }
});


// ==============================================


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
