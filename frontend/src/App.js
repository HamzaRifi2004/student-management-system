import React, { useState, useEffect } from 'react';
import api from './config/api';
import './App.css';
import Navbar from './components/Navbar';
import StudentTable from './components/StudentTable';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import StudentProfile from './components/StudentProfile';
import SubjectsList from './components/SubjectsList';
import TeacherLogin from './components/TeacherLogin';
import TeacherDashboard from './components/TeacherDashboard';
import Footer from './components/Footer';

function App() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [showTeacherLogin, setShowTeacherLogin] = useState(false);

  useEffect(() => {
    fetchStudentsAndSubjects();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const fetchStudentsAndSubjects = async () => {
    try {
      const [studentsRes, subjectsRes] = await Promise.all([
        api.get('/api/students'),
        api.get('/api/subjects')
      ]);
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = async (email, password) => {
    try {
      // Call login API
      const response = await api.post('/api/login', { email, password });
      setCurrentStudent(response.data);
      setIsLoggedIn(true);
      setCurrentPage('profile');
    } catch (error) {
      if (error.response?.status === 404) {
        alert('Étudiant non trouvé');
      } else if (error.response?.status === 401) {
        alert('Mot de passe incorrect');
      } else {
        alert('Erreur de connexion');
      }
    }
  };

  const handleRegister = async (formData) => {
    try {
      // Create new student account
      const response = await api.post('/api/students', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        notes: [],
        timeUsed: 0,
        isValidated: false
      });

      // Refresh students list
      await fetchStudentsAndSubjects();

      // Auto login after registration
      setCurrentStudent(response.data);
      setIsLoggedIn(true);
      setCurrentPage('profile');
      setShowRegister(false);
      
      alert('Compte créé avec succès !');
    } catch (error) {
      console.error('Error creating account:', error);
      throw new Error('Erreur lors de la création du compte. Cet email existe peut-être déjà.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentStudent(null);
    setCurrentPage('home');
    setShowRegister(false);
    setIsTeacher(false);
    setShowTeacherLogin(false);
  };

  const handleUpdateStudent = (updatedStudent) => {
    setCurrentStudent(updatedStudent);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  const handleTeacherLogin = async (email, password) => {
    // Simple teacher authentication (you can enhance this)
    if (email === 'teacher@atfp.tn' && password === 'teacher123') {
      setIsTeacher(true);
      setIsLoggedIn(true);
      setCurrentPage('teacher-dashboard');
    } else {
      alert('Email ou mot de passe incorrect');
    }
  };

  const handleShowTeacherLogin = () => {
    console.log('Teacher login button clicked');
    alert('Switching to teacher login!');
    setShowTeacherLogin(true);
    setShowRegister(false);
  };

  const handleBackToStudentLogin = () => {
    setShowTeacherLogin(false);
  };

  // Show teacher dashboard if teacher is logged in
  if (isTeacher && isLoggedIn) {
    return (
      <div className={`App ${darkMode ? 'dark-mode' : ''}`} style={{ position: 'relative', minHeight: '100vh' }}>
        <TeacherDashboard onLogout={handleLogout} />
      </div>
    );
  }

  // Show login or register page if not logged in (but allow access to public pages)
  if (!isLoggedIn && currentPage !== 'about') {
    console.log('Rendering login section. showTeacherLogin:', showTeacherLogin, 'showRegister:', showRegister);
    
    return (
      <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          isLoggedIn={false}
        />
        <main className="main-content">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : currentPage === 'about' ? (
            <About />
          ) : showTeacherLogin ? (
            <TeacherLogin 
              onLogin={handleTeacherLogin} 
              onBackToStudent={handleBackToStudentLogin}
            />
          ) : showRegister ? (
            <Register onRegister={handleRegister} onBackToLogin={handleBackToLogin} />
          ) : (
            <Login 
              onLogin={handleLogin} 
              onCreateAccount={handleShowRegister}
              onTeacherLogin={handleShowTeacherLogin}
            />
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        onNavigate={handleNavigation}
        currentPage={currentPage}
        isLoggedIn={isLoggedIn}
        studentName={currentStudent?.name}
        studentPicture={currentStudent?.profilePicture}
      />
      
      <main className="main-content">
        <div className="container">
          {currentPage === 'home' && (
            <>
              <h1>Gestion des Étudiants</h1>
              {loading ? (
                <div className="loading">Chargement des étudiants...</div>
              ) : (
                <StudentTable students={students} subjects={subjects} />
              )}
            </>
          )}
          
          {currentPage === 'about' && <About />}
          
          {currentPage === 'subjects' && <SubjectsList />}
          
          {currentPage === 'profile' && currentStudent && (
            <StudentProfile 
              student={currentStudent} 
              onLogout={handleLogout}
              onUpdateStudent={handleUpdateStudent}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
