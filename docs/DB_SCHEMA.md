

Compatible with dbdiagram.io
```
Table users {
  id VARCHAR(36) [pk]
  email VARCHAR(255) [not null, unique]
  role VARCHAR(20)
  first_name VARCHAR(150)
  last_name VARCHAR(150)
  phone VARCHAR(30)
  bio TEXT
  profile_picture_url VARCHAR(1000)
  date_of_birth DATE
  created_at DATETIME
  updated_at DATETIME
}

Table locations {
  id VARCHAR(36) [pk]
  google_place_id VARCHAR(255)
  name VARCHAR(255)
  address VARCHAR(500)
  latitude DECIMAL(9,6)
  longitude DECIMAL(9,6)
  facilities VARCHAR(1000)
  sports_card VARCHAR(1000)
  created_at DATETIME
  updated_at DATETIME
}

Table dance_classes {
  id VARCHAR(36) [pk]
  name VARCHAR(100)
  description TEXT
  instructor_id VARCHAR(36) [ref: > users.id]
  level VARCHAR(20)
  style VARCHAR(100)
  formation_type VARCHAR(100)
  duration INTEGER
  price DECIMAL(10,2)
  start_date DATE
  end_date DATE
  location_id VARCHAR(36) [ref: > locations.id]
  created_at DATETIME
  updated_at DATETIME
}

Table dance_class_reviews {
  id VARCHAR(36) [pk]
  dance_class_id VARCHAR(36) [ref: > dance_classes.id]
  user_id VARCHAR(36) [ref: > users.id, null]
  anonymous_name VARCHAR(100)
  group_size DECIMAL
  level DECIMAL
  engagement DECIMAL
  teaching_pace DECIMAL
  overall_rating INTEGER
  comment TEXT
  is_verified BOOLEAN
  created_at DATETIME
  updated_at DATETIME
}

Table instructor_reviews {
  id VARCHAR(36) [pk]
  instructor_id VARCHAR(36) [ref: > users.id]
  user_id VARCHAR(36) [ref: > users.id, null]
  anonymous_name VARCHAR(100)
  move_breakdown DECIMAL
  individual_approach DECIMAL
  posture_correction_ability DECIMAL
  communication_and_feedback DECIMAL
  patience_and_encouragement DECIMAL
  motivation_and_energy DECIMAL
  overall_rating INTEGER
  comment TEXT
  is_verified BOOLEAN
  created_at DATETIME
  updated_at DATETIME
}

Table location_reviews {
  id VARCHAR(36) [pk]
  location_id VARCHAR(36) [ref: > locations.id]
  user_id VARCHAR(36) [ref: > users.id, null]
  anonymous_name VARCHAR(100)
  cleanness DECIMAL
  general_look DECIMAL
  acustic_quality DECIMAL
  additional_facilities DECIMAL
  temperature DECIMAL
  lighting DECIMAL
  overall_rating INTEGER
  comment TEXT
  is_verified BOOLEAN
  created_at DATETIME
  updated_at DATETIME
}
```