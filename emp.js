const baseUrl = "http://localhost:3000"; 


const handleResponse = (response) => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}


const handleError =(error) =>{
  console.error('Fetch Error:', error);
  
}


const displayEmployee =(employee)=> {
  const listItem = document.createElement("li");
  listItem.textContent = `${employee.id} -${employee.name} - ${employee.position} (${employee.department})`;
  return listItem;
}

// --- Get All Employees ---
const getAllEmployees = async () => {
  try {
    const response = await fetch(baseUrl + "/all");
    const employees = await handleResponse(response);
    const employeeList = document.getElementById("employeeList"); 
    employeeList.innerHTML = ""; 
    employees.forEach(employee => {
      employeeList.appendChild(displayEmployee(employee));
    });
  } catch (error) {
    handleError(error);
  }
}

// --- Get Employee by ID ---
const getEmployeeById= async () => {
  const employeeId = document.getElementById("employeeIdInput").value; 
  try {
    const response = await fetch(`${baseUrl}/${employeeId}`);
    const employee = await handleResponse(response);
    const employeeInfo = document.getElementById("employeeInfo"); 
    employeeInfo.innerHTML = ""; 
    employeeInfo.appendChild(displayEmployee(employee));
  } catch (error) {
    handleError(error);
  }
}

// --- Add Employee ---
const addEmployee=async() =>{
  const name = document.getElementById("employeeNameInput").value;
  const position = document.getElementById("employeePositionInput").value;
  const department = document.getElementById("employeeDepartmentInput").value;
  const newEmployee = { name, position, department };
  try {
    const response = await fetch(baseUrl + "/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEmployee),
    });
    const addedEmployee = await handleResponse(response);
    console.log("Employee added:", addedEmployee);
    
    getAllEmployees(); 
  } catch (error) {
    handleError(error);
  }
}

// --- Update Employee ---
const updateEmployee=async()=> {
  const employeeId = document.getElementById("updateEmployeeIdInput").value; 
  const name = document.getElementById("updateEmployeeNameInput").value;
  const position = document.getElementById("updateEmployeePositionInput").value;
  const department = document.getElementById("updateEmployeeDepartmentInput").value;
  const updatedEmployee = { name, position, department };

  try {
    const response = await fetch(`${baseUrl}/${employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEmployee),
    });
    const updatedData = await handleResponse(response);
    console.log("Employee updated:", updatedData);
    
    getAllEmployees(); 
  } catch (error) {
    handleError(error);
  }
}

// --- Delete Employee ---
const deleteEmployee=async()=> {
  const employeeId = document.getElementById("deleteEmployeeIdInput").value; 
  try {
    const response = await fetch(`${baseUrl}/${employeeId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log("Employee deleted successfully");
      
      getAllEmployees(); 
    } else {
      throw new Error("Failed to delete employee");
    }
  } catch (error) {
    handleError(error);
  }
}


document.getElementById("getAllButton").addEventListener("click", getAllEmployees);
document.getElementById("getByIdButton").addEventListener("click", getEmployeeById);
document.getElementById("addButton").addEventListener("click", addEmployee); 
document.getElementById("updateButton").addEventListener("click", updateEmployee); 
document.getElementById("deleteButton").addEventListener("click", deleteEmployee);