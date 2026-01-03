@echo off
echo Importing data to MongoDB...
echo.

echo Importing students data...
mongoimport --db student_db --collection students --file students-data.json --jsonArray

echo.
echo Importing subjects data...
mongoimport --db student_db --collection subjects --file subjects-data.json --jsonArray

echo.
echo Import complete!
pause
