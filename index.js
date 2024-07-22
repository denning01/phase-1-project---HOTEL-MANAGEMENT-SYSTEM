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
    const updateField = document.getElementById('updateField');
    const updateValue = document.getElementById('updateValue');

    updateField.value = 'name';
    updateValue.type = 'text';
    updateValue.value = guest.name;

    updateField.addEventListener('change', (e) => {
      const selectedField = e.target.value;
      if (selectedField === 'checkInDate' || selectedField === 'checkOutDate') {
        updateValue.type = 'date';
      } else {
        updateValue.type = 'text';
      }
      updateValue.value = guest[selectedField];
    });
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
