# 3D Review Feature Documentation

The **3D Review** feature provides a detailed, multidimensional review system that allows students to rate their dance classes and instructors across several key aspects. This documentation outlines the data structure, parameters, UI components, and user interactions involved in the feature.

---

## Overview

The 3D Review feature breaks down a review into several dimensions:

- **Teaching Approach**
- **Environment**
- **Music**
- **Facilities**

Each review is structured to give both a quick overall impression (using an overall star rating and summary comment) and detailed insights when expanded.

---

## Review Data Structure

The review data is defined by the `ReviewData` interface. Below are the parameters along with their types, descriptions, and any specific constraints:

### General Review Information

- **id** (`string`):
    
    Unique identifier for the review.
    
- **created_at** (`datetime`):
    
    The timestamp when the review was created.
    
- **updated_at** (`datetime`):
    
    The timestamp when the review was last updated.
    
- **author_name** (`string`):
    
    The name of the reviewer (either user's full name or anonymous name).
    
- **overall_rating** (`number`):
    
    Overall rating of the review (1–5 stars).
    
- **comment** (`string`):
    
    The main review text provided by the user.

- **verified** (`boolean`):
    
    Indicates whether the review has been verified by staff.

### Verification Information

- **verification_method** (`string`):
    
    Method used to verify the review:
    - `attendance`: Class Attendance
    - `purchase`: Purchase History
    - `manual`: Manual Verification
    
- **verification_date** (`datetime`):
    
    When the review was verified.
    
- **verified_by** (`string`, optional):
    
    Name of the staff member who verified the review.
    
- **verification_notes** (`string`, optional):
    
    Additional notes about the verification process.

---

### Teaching Approach

- **teachingStyle** (`number`):
    
    A percentage-based rating (0–100) indicating the balance between structured and casual teaching.
    
- **feedbackApproach** (`number`):
    
    A percentage-based rating (0–100) indicating the style of feedback (verbal vs. hands-on).
    
- **paceOfTeaching** (`number`):
    
    A percentage-based rating (0–100) reflecting the pace of instruction (methodical vs. fast-paced).
    
- **breakdownQuality** (`number`):
    
    A star rating (1–5) representing the quality of move breakdowns.
    

---

### Environment

The environment object captures details about the physical class setting:

- **floorQuality** (`number`):
    
    A star rating (1–5) assessing the quality of the floor.
    
- **crowdedness** (`number`):
    
    A star rating (1–5) indicating the space comfort (interpreted as the level of crowdedness).
    
- **ventilation** (`number`):
    
    A star rating (1–5) evaluating the quality of ventilation.
    
- **temperature** (`'cool' | 'moderate' | 'warm'`):
    
    A descriptive label for the temperature of the environment.
    

---

### Music

The music object provides details about the in-class music:

- **volumeLevel** (`number`):
    
    A star rating (1–5) reflecting the volume of the music.
    
- **genres** (`string[]`):
    
    An array of music genres (e.g., `["Latin", "Pop"]`) featured in the class.
    
- **style** (`number`):
    
    A percentage-based rating (0–100) showing the music style balance (e.g., classical vs. modern).
    

---

### Facilities

Facilities information is grouped into several sub-objects:

### Changing Room

- **available** (`boolean`):
    
    Indicates if a changing room is available.
    
- **quality** (`number`, optional):
    
    A star rating (1–5) for the changing room quality, provided if available.
    
- **notes** (`string`, optional):
    
    Additional details about the changing room (e.g., cleanliness, space).
    

### Waiting Area

- **available** (`boolean`):
    
    Indicates if a waiting area is available.
    
- **type** (`'indoor' | 'outdoor' | 'both'`, optional):
    
    Specifies the type of waiting area.
    
- **seating** (`boolean`, optional):
    
    Indicates whether seating is available.
    
- **notes** (`string`, optional):
    
    Additional remarks regarding the waiting area.
    

### Accepted Cards

- **acceptedCards** (`string[]`):
A list of accepted sports cards (e.g., `["MultiSport", "Medicover Sport", "OK System"]`).

### Review Verification Component

- **Verification Badge:**
    - Shows verification status
    - Displays verification method when verified
- **Verification Details:**
    - Staff member who performed verification
    - Date of verification
    - Method used
    - Additional notes

---

## UI Components

The 3D Review page is composed of several React components that visualize the data:

### ReviewCard

- Displays the summary of a review:
    - **Header:** Shows the reviewer's name, date, and overall star rating.
    - **Main Comment:** A brief text snippet of the review.
    - **Toggle Button:** Allows users to expand or collapse the detailed review.

### Detailed Review (Expanded View)

When expanded, additional sections are revealed:

### Teaching Approach Section

- **Sliders:**
    - **Teaching Style Slider:** Visualizes the percentage between "Structured" and "Casual".
    - **Feedback Approach Slider:** Visualizes the percentage between "Verbal" and "Hands-on".
    - **Pace of Teaching Slider:** Visualizes the percentage between "Methodical" and "Fast-paced".
- **Star Rating:**
    - **Move Breakdown:** Displays a 1–5 star rating for the quality of breakdowns.

### Environment Section

- **Star Ratings:**
    - **Floor Quality, Space Comfort (Crowdedness), Ventilation:** Each displayed with star ratings.
- **Badge:**
    - **Temperature:** Displays the environment temperature as a badge.

### Music Section

- **Star Rating:**
    - **Volume Level:** Shown as a 1–5 star rating.
- **Slider:**
    - **Music Style:** Visualizes the balance between "Classical" and "Modern".
- **Badges:**
    - **Genres:** Each genre is displayed as a badge, managed through a dedicated Genre model.

### Facilities Section

- **FacilityInfo Component:**
Displays detailed information for:
    - **Changing Room:**
        - Availability (boolean)
        - Quality rating (1-5, if available)
        - Additional notes (optional)
    - **Waiting Area:**
        - Availability (boolean)
        - Type (indoor/outdoor/both, if available)
        - Seating availability (boolean, if waiting area is available)
        - Additional notes (optional)
- **Accepted Sports Cards:**
    - List of accepted sports cards from predefined options:
        - MultiSport
        - Medicover Sport
        - OK System
        - Benefit Systems
        - FitProfit

### Supporting Components

- **Slider Component:**
Renders a visual slider with percentage values and descriptive labels.
- **StarRating Component:**
Renders star icons (using the `StarIcon` component) based on a 1–5 scale.
- **Badge Component:**
Visual labels used for indicating availability, temperature, waiting area type, and accepted cards.

