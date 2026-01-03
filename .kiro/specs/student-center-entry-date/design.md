# Design Document - Student Center Entry Date Feature

## Overview

This feature enhances the teacher dashboard by adding center entry eligibility tracking for students. The system will calculate when students become eligible to enter the training center based on their academic performance (80% average grade threshold) and display this information prominently in the teacher interface.

## Architecture

The feature integrates into the existing React frontend and JSON-based backend:

- **Frontend**: Extends `TeacherStudentsTable.js` component with new columns and filtering
- **Backend**: Enhances student data structure in `server-json.js` to include center entry calculations
- **Data Layer**: Updates student records to track entry eligibility and dates

## Components and Interfaces

### Frontend Components

1. **Enhanced TeacherStudentsTable Component**
   - New column: "Center Entry Date"
   - Filter dropdown for entry eligibility status
   - Export functionality for eligible students
   - Visual indicators for entry status (ready/not ready/no data)

2. **CenterEntryStatusBadge Component**
   - Displays entry status with appropriate styling
   - Shows date when eligible or status message when not

3. **StudentExportModal Component**
   - Handles CSV export of eligible students
   - Provides download functionality

### Backend Interfaces

1. **Enhanced Student API**
   - GET `/api/students` - includes calculated center entry data
   - PUT `/api/students/:id` - recalculates entry eligibility on update

2. **New Export API**
   - GET `/api/students/export/center-ready` - returns CSV of eligible students

## Data Models

### Enhanced Student Model
```javascript
{
  _id: String,
  name: String,
  email: String,
  notes: Array,
  isValidated: Boolean,
  centerEntry: {
    isEligible: Boolean,
    eligibilityDate: Date,
    averageGrade: Number,
    status: String // "eligible", "not_eligible", "no_data"
  },
  createdAt: Date
}
```

### Center Entry Calculation Logic
```javascript
function calculateCenterEntry(student) {
  if (!student.notes || student.notes.length === 0) {
    return {
      isEligible: false,
      eligibilityDate: null,
      averageGrade: 0,
      status: "no_data"
    };
  }
  
  const totalGrade = student.notes.reduce((sum, note) => sum + (note.finalGrade || note.grade), 0);
  const averageGrade = totalGrade / student.notes.length;
  
  if (averageGrade >= 80) {
    return {
      isEligible: true,
      eligibilityDate: new Date(),
      averageGrade: averageGrade,
      status: "eligible"
    };
  }
  
  return {
    isEligible: false,
    eligibilityDate: null,
    averageGrade: averageGrade,
    status: "not_eligible"
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Property 1: Center entry date calculation for eligible students**
*For any* student with an average grade >= 80%, the system should calculate their center entry date as the current date
**Validates: Requirements 1.2**

**Property 2: Not eligible status for low-performing students**
*For any* student with an average grade < 80%, the system should display "Not eligible yet" for center entry status
**Validates: Requirements 1.3**

**Property 3: Grade update triggers recalculation**
*For any* student, when their grades are updated, the system should immediately recalculate their center entry eligibility based on the new average
**Validates: Requirements 1.4**

**Property 4: Filter displays correct student subset**
*For any* filter selection ("Ready for center", "Not ready", "All students"), the displayed student list should contain only students matching that filter criteria
**Validates: Requirements 2.2, 2.3, 2.4**

**Property 5: Filter state persistence**
*For any* applied filter during a session, the filter state should be maintained until explicitly changed by the user
**Validates: Requirements 2.5**

**Property 6: Export contains required fields**
*For any* export of eligible students, the generated report should include student name, email, entry date, and average grade for each student
**Validates: Requirements 3.2**

**Property 7: CSV format compliance**
*For any* generated export, the data should be formatted as valid CSV that can be imported into other systems
**Validates: Requirements 3.4**

## Error Handling

1. **No Student Data**: Display appropriate messaging when no students exist
2. **Network Errors**: Show user-friendly error messages for API failures
3. **Export Failures**: Provide clear feedback when export operations fail
4. **Invalid Grade Data**: Handle corrupted or missing grade information gracefully

## Testing Strategy

### Unit Testing
- Test center entry calculation logic with various grade combinations
- Test filter functionality with different student datasets
- Test CSV export generation and format validation
- Test error handling for edge cases (no grades, invalid data)

### Property-Based Testing
Using a JavaScript property-based testing library (fast-check), each correctness property will be implemented as a separate test:
- Generate random student data with various grade combinations
- Verify calculation rules hold across all generated datasets
- Test filter behavior with randomized student collections
- Validate export functionality with diverse eligible student sets
- Each property-based test will run a minimum of 100 iterations
- Tests will be tagged with comments referencing the design document properties

### Integration Testing
- Test full workflow from grade update to center entry recalculation
- Test teacher dashboard display with real student data
- Test export download functionality end-to-end