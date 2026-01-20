const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const port = 3000;

const userRoutes = require('./routes/user.route');
app.use('/api/users', userRoutes);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
