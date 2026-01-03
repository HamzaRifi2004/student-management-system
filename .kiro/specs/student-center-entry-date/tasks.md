# Implementation Plan

- [ ] 1. Enhance backend data model and calculation logic
  - Add center entry calculation function to server-json.js
  - Update student API endpoints to include center entry data
  - Implement automatic recalculation when student grades are updated
  - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [ ]* 1.1 Write property test for center entry calculation
  - **Property 1: Center entry date calculation for eligible students**
  - **Validates: Requirements 1.2**

- [ ]* 1.2 Write property test for grade update recalculation
  - **Property 3: Grade update triggers recalculation**
  - **Validates: Requirements 1.4**

- [ ] 2. Add center entry column to teacher dashboard
  - Modify TeacherStudentsTable component to display center entry information
  - Create CenterEntryStatusBadge component for visual status indicators
  - Update table headers and styling for new column
  - _Requirements: 1.1, 1.3, 1.5_

- [ ]* 2.1 Write property test for status display logic
  - **Property 2: Not eligible status for low-performing students**
  - **Validates: Requirements 1.3**

- [ ] 3. Implement filtering functionality
  - Add filter dropdown for center entry eligibility status
  - Implement filter logic for "Ready for center", "Not ready", and "All students"
  - Add filter state management and persistence during session
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 3.1 Write property test for filter functionality
  - **Property 4: Filter displays correct student subset**
  - **Validates: Requirements 2.2, 2.3, 2.4**

- [ ]* 3.2 Write property test for filter state persistence
  - **Property 5: Filter state persistence**
  - **Validates: Requirements 2.5**

- [ ] 4. Create export functionality for eligible students
  - Add export API endpoint for center-ready students
  - Implement CSV generation with required fields (name, email, entry date, average grade)
  - Create export button and download functionality in frontend
  - Handle edge case when no students are eligible
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 4.1 Write property test for export data completeness
  - **Property 6: Export contains required fields**
  - **Validates: Requirements 3.2**

- [ ]* 4.2 Write property test for CSV format compliance
  - **Property 7: CSV format compliance**
  - **Validates: Requirements 3.4**

- [ ] 5. Add error handling and edge cases
  - Implement error handling for students with no grades
  - Add appropriate messaging for various error states
  - Handle network errors gracefully in the UI
  - _Requirements: 1.5, 3.3_

- [ ] 6. Update styling and user experience
  - Style the new center entry column and status badges
  - Ensure responsive design for additional table column
  - Add loading states for export functionality
  - Improve visual hierarchy of filter controls
  - _Requirements: 1.1, 2.1, 3.5_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.