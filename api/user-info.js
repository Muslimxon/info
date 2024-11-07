export default async (req, res) => {
    if (req.method === 'POST') {
      const userInfo = req.body;
      console.log('Received user info:', userInfo);
  
      // Optionally, save this data to a database or storage service here
  
      res.status(200).json({ message: 'User info received' });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  };
  