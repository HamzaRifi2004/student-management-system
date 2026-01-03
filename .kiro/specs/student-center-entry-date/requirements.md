# Requirements Document

## Introduction

This feature adds the capability for teachers to view and manage when students are eligible to enter the training center based on their academic progress and validation status.

## Glossary

- **Student_Management_System**: The web application for managing student records and academic progress
- **Teacher_Dashboard**: The interface where teachers view and manage student information
- **Center_Entry_Date**: The calculated date when a student becomes eligible to enter the training center
- **Validation_Status**: Boolean indicator of whether a student has met academic requirements
- **Academic_Progress**: Student's completion percentage and grades across subjects

## Requirements

### Requirement 1

**User Story:** As a teacher, I want to see when each student can enter the training center, so that I can plan center capacity and student scheduling.

#### Acceptance Criteria

1. WHEN a teacher views the student dashboard THEN the System SHALL display the center entry date for each student
2. WHEN a student achieves 80% average grade THEN the System SHALL calculate their center entry date as the current date
3. WHEN a student has not achieved 80% average THEN the System SHALL display "Not eligible yet" for center entry
4. WHEN a student's grades are updated THEN the System SHALL recalculate their center entry eligibility immediately
5. WHERE a student has no grades THEN the System SHALL display "No evaluation data" for center entry status

### Requirement 2

**User Story:** As a teacher, I want to filter students by their center entry eligibility, so that I can quickly identify who is ready for center-based training.

#### Acceptance Criteria

1. WHEN a teacher accesses the filter options THEN the System SHALL provide center entry status filter options
2. WHEN "Ready for center" filter is selected THEN the System SHALL display only students eligible for center entry
3. WHEN "Not ready" filter is selected THEN the System SHALL display only students not yet eligible
4. WHEN "All students" filter is selected THEN the System SHALL display all students regardless of eligibility
5. WHEN filters are applied THEN the System SHALL maintain the filter state during the session

### Requirement 3

**User Story:** As a teacher, I want to export a list of students ready for center entry, so that I can coordinate with center management for scheduling.

#### Acceptance Criteria

1. WHEN a teacher clicks the export button THEN the System SHALL generate a downloadable report of eligible students
2. WHEN generating the report THEN the System SHALL include student name, email, entry date, and average grade
3. WHEN no students are eligible THEN the System SHALL display an appropriate message instead of an empty export
4. WHEN the export is generated THEN the System SHALL format the data as CSV for easy import into other systems
5. WHEN the export completes THEN the System SHALL provide user feedback confirming successful download