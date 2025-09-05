const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// MongoDB Schema
const certificateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  courseName: { type: String, required: true },
  completionDate: { type: String, required: true },
  issuedDate: { type: String, required: true },
  issuedBy: { type: String, required: true }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('MONGODB_URI not found, using in-memory storage');
}

// API Routes

// In-memory fallback storage
let inMemoryCertificates = [];

// Get all certificates
app.get('/api/certificates', async (req, res) => {
  try {
    if (process.env.MONGODB_URI) {
      const certificates = await Certificate.find().sort({ issuedDate: -1 });
      res.json(certificates);
    } else {
      res.json(inMemoryCertificates);
    }
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Get certificate by ID
app.get('/api/certificates/:id', async (req, res) => {
  try {
    if (process.env.MONGODB_URI) {
      const certificate = await Certificate.findOne({ id: req.params.id });
      if (!certificate) {
        return res.status(404).json({ error: 'Certificate not found' });
      }
      res.json(certificate);
    } else {
      const certificate = inMemoryCertificates.find(cert => cert.id === req.params.id);
      if (!certificate) {
        return res.status(404).json({ error: 'Certificate not found' });
      }
      res.json(certificate);
    }
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
});

// Create new certificate
app.post('/api/certificates', async (req, res) => {
  try {
    const { studentName, courseName, completionDate, issuedBy } = req.body;
    
    // Generate unique certificate ID
    const certificateId = generateCertificateId();
    
    const certificateData = {
      id: certificateId,
      studentName,
      courseName,
      completionDate,
      issuedDate: new Date().toISOString().split('T')[0],
      issuedBy
    };
    
    if (process.env.MONGODB_URI) {
      const certificate = new Certificate(certificateData);
      await certificate.save();
      res.status(201).json(certificate);
    } else {
      inMemoryCertificates.push(certificateData);
      res.status(201).json(certificateData);
    }
  } catch (error) {
    console.error('Error creating certificate:', error);
    if (error.code === 11000) {
      // Duplicate key error - try again with new ID
      const certificateId = generateCertificateId();
      const certificateData = {
        id: certificateId,
        studentName: req.body.studentName,
        courseName: req.body.courseName,
        completionDate: req.body.completionDate,
        issuedDate: new Date().toISOString().split('T')[0],
        issuedBy: req.body.issuedBy
      };
      
      if (process.env.MONGODB_URI) {
        const certificate = new Certificate(certificateData);
        await certificate.save();
        res.status(201).json(certificate);
      } else {
        inMemoryCertificates.push(certificateData);
        res.status(201).json(certificateData);
      }
    } else {
      res.status(500).json({ error: 'Failed to create certificate' });
    }
  }
});

// Delete certificate
app.delete('/api/certificates/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findOneAndDelete({ id: req.params.id });
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

// Generate unique certificate ID
function generateCertificateId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `CERT-${timestamp}-${random}`.toUpperCase();
}

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
