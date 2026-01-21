fetch('http://localhost:3000/api/users')
  .then(res => res.json())
  .then(data => {
    console.log('Users from backend:', data);
  });