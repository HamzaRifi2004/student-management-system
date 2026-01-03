@echo off
echo Clearing MongoDB collections...
echo.

mongosh mongodb://localhost:27017/student_db --eval "db.students.deleteMany({})"
mongosh mongodb://localhost:27017/student_db --eval "db.subjects.deleteMany({})"

echo.
echo Collections cleared! Now you can import fresh data.
pause
