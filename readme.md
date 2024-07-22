body {
    font-family: Arial, sans-serif;
    
  }
  
  .container {
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
  
  .form-container, .history-container {
    width: 45%;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  label {
    margin-top: 10px;
  }
  
  button {
    margin-top: 20px;
  }
  
  #availability {
    margin-top: 20px;
  }
  
  #guestList {
    margin-top: 20px;
    list-style-type: none;
    padding: 0;
  }
  
  #guestList li {
    padding: 5px 0;
    border-bottom: 1px solid #ccc;
  }
     

######################backup json




document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookingForm');
    const availableRoomsSpan = document.getElementById('availableRooms');
    const guestList = document.getElementById('guestList');
    const fetchHistoryButton = document.getElementById('fetchHistory');
    const updateContainer = document.getElementById('updateContainer');
    const updateForm = document.getElementById('updateForm');
    const cancelUpdateButton = document.getElementById('cancelUpdate');
    const maxRooms = 20;
    let availableRooms = maxRooms;
  
    // Fetch existing bookings from the JSON server on page load
    fetch('http://localhost:3000/guests')
      .then(response => response.json())
      .then(data => {
        availableRooms -= data.length;
        availableRoomsSpan.textContent = availableRooms;
      });
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const name = document.getElementById('name').value;
      const checkInDate = document.getElementById('checkInDate').value;
      const checkOutDate = document.getElementById('checkOutDate').value;
      const numRooms = parseInt(document.getElementById('numRooms').value);
  
      if (numRooms > availableRooms) {
        alert('Not enough rooms available');
        return;
      }
  
      const newGuest = {
        name,
        checkInDate,
        checkOutDate,
        room: availableRooms + 1,
        phoneNumber: '123-456-7890'
      };
  
      fetch('http://localhost:3000/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGuest)
      })
      .then(response => response.json())
      .then(data => {
        availableRooms -= numRooms;
        availableRoomsSpan.textContent = availableRooms;
        form.reset();
        fetchHistoryButton.click(); // Refresh the guest list
      });
    });
  
    fetchHistoryButton.addEventListener('click', () => {
      fetch('http://localhost:3000/guests')
        .then(response => response.json())
        .then(data => {
          updateGuestList(data);
        });
    });
  
    function updateGuestList(guests) {
      guestList.innerHTML = '';
      guests.forEach(guest => {
        const li = document.createElement('li');
        li.textContent = `${guest.name} (Check-in: ${guest.checkInDate}, Check-out: ${guest.checkOutDate})`;
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => openUpdateForm(guest));
        li.appendChild(updateButton);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteGuest(guest.id));
        li.appendChild(deleteButton);
        guestList.appendChild(li);
      });
    }
  
    function openUpdateForm(guest) {
      updateContainer.classList.remove('hidden');
      document.getElementById('updateId').value = guest.id;
    }
  
    updateForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const id = document.getElementById('updateId').value;
      const field = document.getElementById('updateField').value;
      const value = document.getElementById('updateValue').value;
  
      fetch(`http://localhost:3000/guests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [field]: value })
      })
      .then(response => response.json())
      .then(data => {
        updateContainer.classList.add('hidden');
        fetchHistoryButton.click(); // Refresh the guest list
      });
    });
  
    cancelUpdateButton.addEventListener('click', () => {
      updateContainer.classList.add('hidden');
    });
  
    function deleteGuest(id) {
      fetch(`http://localhost:3000/guests/${id}`, {
        method: 'DELETE'
      })
      .then(() => {
        fetchHistoryButton.click(); // Refresh the guest list
      });
    }
  });
  

  ###########base html code


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hotel Booking</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
  <div class="container">
    <div class="form-container">
      <h1>DENNING SUITES</h1>
      <p>Put your details below</p>
      <form id="bookingForm">
        <label for="name">Name:</label>
        <input type="text" id="name" required>
        
        <label for="checkInDate">Check-in Date:</label>
        <input type="date" id="checkInDate" required>
        
        <label for="checkOutDate">Check-out Date:</label>
        <input type="date" id="checkOutDate" required>
        
        <label for="numRooms">Number of Rooms:</label>
        <input type="number" id="numRooms" min="1" max="20" required>
        
        <button type="submit">Book Now</button>
      </form>

      <div id="availability">
        <h2>Available Rooms: <span id="availableRooms">20</span></h2>
      </div>
    </div>

    <div class="history-container">
      <h2>Booking History</h2>
      <button id="fetchHistory">Check Booking History</button>
      <ul id="guestList"></ul>
    </div>
  </div>

  <div id="updateContainer" class="hidden">
    <h2>Update Booking</h2>
    <form id="updateForm">
      <input type="hidden" id="updateId">
      <label for="updateField">Select Field to Update:</label>
      <select id="updateField">
        <option value="name">Name</option>
        <option value="checkInDate">Check-in Date</option>
        <option value="checkOutDate">Check-out Date</option>
      </select>
      
      <label for="updateValue">New Value:</label>
      <input type="date" id="updateValue" required>
      
      <button type="submit">Update</button>
      <button type="button" id="cancelUpdate" >
        <i class="fas fa-trash-alt"></i> Cancel
    </button>
    </form>
  </div>

  <script src="index.js"></script>
</body>
</html>


json-server --watch guests.json --port 3000