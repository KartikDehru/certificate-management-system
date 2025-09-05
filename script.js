// Certificate Management System JavaScript

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'qwerty123'
};

// API base URL
const API_BASE = window.location.origin + '/api';

// Certificate storage (now using MongoDB via API)
let certificates = [];
let currentUser = null;

// DOM Elements
const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const verificationSection = document.getElementById('verificationSection');
const certificateModal = document.getElementById('certificateModal');
const loginForm = document.getElementById('loginForm');
const certificateForm = document.getElementById('certificateForm');
const verificationForm = document.getElementById('verificationForm');
const certificateList = document.getElementById('certificateList');
const certificateCanvas = document.getElementById('certificateCanvas');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show verification section by default
    showSection('verification');
    
    // Add event listeners
    loginForm.addEventListener('submit', handleLogin);
    certificateForm.addEventListener('submit', handleCertificateGeneration);
    verificationForm.addEventListener('submit', handleVerification);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('downloadBtn').addEventListener('click', downloadCertificate);
    
    // Navigation event listeners
    document.getElementById('verificationNavBtn').addEventListener('click', () => showSection('verification'));
    document.getElementById('adminNavBtn').addEventListener('click', () => showSection('login'));
    
    // Close modal when clicking outside
    certificateModal.addEventListener('click', function(e) {
        if (e.target === certificateModal) {
            closeModal();
        }
    });
}

// Section Management
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the requested section
    switch(sectionName) {
        case 'login':
            loginSection.classList.remove('hidden');
            break;
        case 'admin':
            adminSection.classList.remove('hidden');
            loadCertificateList();
            break;
        case 'verification':
            verificationSection.classList.remove('hidden');
            break;
    }
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        currentUser = { username, role: 'admin' };
        showSection('admin');
        errorDiv.style.display = 'none';
        loginForm.reset();
    } else {
        errorDiv.textContent = 'Invalid username or password';
        errorDiv.style.display = 'block';
    }
}

function handleLogout() {
    currentUser = null;
    showSection('login');
}

// Certificate Generation
async function handleCertificateGeneration(e) {
    e.preventDefault();
    
    const studentName = document.getElementById('studentName').value;
    const courseName = document.getElementById('courseName').value;
    const completionDate = document.getElementById('completionDate').value;
    
    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Generating...';
        submitBtn.disabled = true;
        
        // Create certificate via API
        const response = await fetch(`${API_BASE}/certificates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentName,
                courseName,
                completionDate,
                issuedBy: currentUser.username
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to create certificate');
        }
        
        const certificate = await response.json();
        
        // Generate and display certificate
        generateCertificate(certificate);
        
        // Reset form
        certificateForm.reset();
        
        // Update certificate list
        await loadCertificateList();
        
    } catch (error) {
        console.error('Error creating certificate:', error);
        alert('Failed to create certificate. Please try again.');
    } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Generate Certificate';
        submitBtn.disabled = false;
    }
}

function generateCertificateId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `CERT-${timestamp}-${random}`.toUpperCase();
}

function generateCertificate(certificate) {
    const canvas = certificateCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Inner border
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Title
    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 120);
    
    // Subtitle
    ctx.fillStyle = '#333333';
    ctx.font = '24px Arial';
    ctx.fillText('This is to certify that', canvas.width / 2, 180);
    
    // Student name
    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(certificate.studentName, canvas.width / 2, 250);
    
    // Course completion text
    ctx.fillStyle = '#333333';
    ctx.font = '20px Arial';
    ctx.fillText('has successfully completed the course', canvas.width / 2, 300);
    
    // Course name
    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 28px Arial';
    ctx.fillText(certificate.courseName, canvas.width / 2, 350);
    
    // Completion date
    ctx.fillStyle = '#333333';
    ctx.font = '18px Arial';
    ctx.fillText(`Completed on: ${formatDate(certificate.completionDate)}`, canvas.width / 2, 400);
    
    // Certificate ID
    ctx.fillStyle = '#666666';
    ctx.font = '14px Arial';
    ctx.fillText(`Certificate ID: ${certificate.id}`, canvas.width / 2, 450);
    
    // Issued date
    ctx.fillStyle = '#666666';
    ctx.font = '14px Arial';
    ctx.fillText(`Issued on: ${formatDate(certificate.issuedDate)}`, canvas.width / 2, 470);
    
    // Signature line
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 520);
    ctx.lineTo(300, 520);
    ctx.stroke();
    
    ctx.fillStyle = '#333333';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Authorized Signature', 225, 540);
    
    // Show modal
    certificateModal.classList.remove('hidden');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Certificate List Management
async function loadCertificateList() {
    try {
        certificateList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Loading certificates...</p>';
        
        const response = await fetch(`${API_BASE}/certificates`);
        if (!response.ok) {
            throw new Error('Failed to fetch certificates');
        }
        
        certificates = await response.json();
        
        certificateList.innerHTML = '';
        
        if (certificates.length === 0) {
            certificateList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No certificates issued yet.</p>';
            return;
        }
        
        certificates.forEach(certificate => {
            const certificateItem = document.createElement('div');
            certificateItem.className = 'certificate-item';
            
            certificateItem.innerHTML = `
                <div class="certificate-info">
                    <h4>${certificate.studentName}</h4>
                    <p><strong>Course:</strong> ${certificate.courseName}</p>
                    <p><strong>Completed:</strong> ${formatDate(certificate.completionDate)}</p>
                    <p><strong>ID:</strong> ${certificate.id}</p>
                </div>
                <div class="certificate-actions">
                    <button class="btn btn-primary btn-small" onclick="viewCertificate('${certificate.id}')">View</button>
                    <button class="btn btn-secondary btn-small" onclick="copyCertificateId('${certificate.id}')">Copy ID</button>
                </div>
            `;
            
            certificateList.appendChild(certificateItem);
        });
    } catch (error) {
        console.error('Error loading certificates:', error);
        certificateList.innerHTML = '<p style="text-align: center; color: #dc3545; padding: 20px;">Failed to load certificates. Please refresh the page.</p>';
    }
}

function viewCertificate(certificateId) {
    const certificate = certificates.find(cert => cert.id === certificateId);
    if (certificate) {
        generateCertificate(certificate);
    }
}

function copyCertificateId(certificateId) {
    navigator.clipboard.writeText(certificateId).then(() => {
        alert('Certificate ID copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = certificateId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Certificate ID copied to clipboard!');
    });
}

// Certificate Verification
async function handleVerification(e) {
    e.preventDefault();
    
    const certificateId = document.getElementById('certificateId').value.trim();
    const resultDiv = document.getElementById('verificationResult');
    
    if (!certificateId) {
        showVerificationResult('Please enter a certificate ID.', 'error');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Verifying...';
        submitBtn.disabled = true;
        
        const response = await fetch(`${API_BASE}/certificates/${certificateId}`);
        
        if (response.ok) {
            const certificate = await response.json();
            const resultHTML = `
                <h3>✅ Certificate Verified</h3>
                <p><strong>Student Name:</strong> ${certificate.studentName}</p>
                <p><strong>Course:</strong> ${certificate.courseName}</p>
                <p><strong>Completion Date:</strong> ${formatDate(certificate.completionDate)}</p>
                <p><strong>Issued Date:</strong> ${formatDate(certificate.issuedDate)}</p>
                <p><strong>Issued By:</strong> ${certificate.issuedBy}</p>
                <p><strong>Certificate ID:</strong> ${certificate.id}</p>
            `;
            showVerificationResult(resultHTML, 'success');
        } else if (response.status === 404) {
            showVerificationResult('❌ Certificate not found. Please check the certificate ID and try again.', 'error');
        } else {
            throw new Error('Verification failed');
        }
    } catch (error) {
        console.error('Error verifying certificate:', error);
        showVerificationResult('❌ Failed to verify certificate. Please try again.', 'error');
    } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Verify Certificate';
        submitBtn.disabled = false;
    }
}

function showVerificationResult(message, type) {
    const resultDiv = document.getElementById('verificationResult');
    resultDiv.innerHTML = message;
    resultDiv.className = `verification-result ${type}`;
    resultDiv.style.display = 'block';
}

// Modal Management
function closeModal() {
    certificateModal.classList.add('hidden');
}

function downloadCertificate() {
    const canvas = certificateCanvas;
    const link = document.createElement('a');
    link.download = `certificate-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

// Utility Functions
function generateSampleData() {
    // Add some sample certificates for demonstration
    if (certificates.length === 0) {
        const sampleCertificates = [
            {
                id: 'CERT-SAMPLE-001',
                studentName: 'John Doe',
                courseName: 'Web Development Fundamentals',
                completionDate: '2024-01-15',
                issuedDate: '2024-01-15',
                issuedBy: 'admin'
            },
            {
                id: 'CERT-SAMPLE-002',
                studentName: 'Jane Smith',
                courseName: 'JavaScript Advanced',
                completionDate: '2024-01-20',
                issuedDate: '2024-01-20',
                issuedBy: 'admin'
            }
        ];
        
        certificates.push(...sampleCertificates);
    }
}

// Initialize with sample data (optional)
// generateSampleData();
