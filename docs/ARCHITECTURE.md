# General idea of architecture
## With added instructors

```mermaid
graph TD
    subgraph Core["Core (Base)"]
        direction TB
        C1[Base Models]
        C2[Auth System]
        C3[Settings]
        C4[Middleware]
    end

    subgraph Accounts["Accounts"]
        A1[User Management]
        A2[Authentication]
        A3[Profile System]
    end

    subgraph Instructors["Instructors (New)"]
        I1[Profile Management]
        I2[Skill Marketplace]
        I3[Availability Calendar]
        I4[Independent Listings]
    end

    subgraph Schools["Schools"]
        S1[School Entities]
        S2[Staff Management]
        S3[Location Ownership]
        S4[Subscription Limits]
    end

    subgraph Classes["Classes"]
        CL1[Class Scheduling]
        CL2[Location Mapping]
        CL3[Search Engine]
    end

    subgraph Reviews["Reviews"]
        R1[Rating System]
        R2[Verification]
        R3[Analytics]
    end

    subgraph Billing["Billing"]
        B1[Subscription Plans]
        B2[Usage Tracking]
        B3[Payment Gateway]
    end

    Core --> Accounts
    Accounts --> Instructors
    Instructors --> Schools
    Instructors --> Classes
    Accounts --> Schools
    Schools --> Classes
    Classes --> Reviews
    Schools --> Billing
    Accounts --> Billing

    class Core core
    class Accounts,Instructors,Schools,Classes,Reviews,Billing app

    note1["<b>Core</b><br>Foundation for all apps"]:::notes
    note2["<b>Instructors</b><br>Professional management<br>- Marketplace profile<br>- Availability tracking<br>- Cross-school operations"]:::notes
    note3["<b>Schools</b><br>Organization management"]:::notes
```

# General idea of search service 

Example Search for "Salsa Classes Near Me with AC and 4.5★ Ratings":
1. Schools Service finds locations within 5km with AC (using PostGIS)
2. Classes Service finds salsa classes at intermediate level
3. Reviews Service gets classes with avg rating ≥4.5
4. Query Engine joins these datasets using class-location mapping
5. Results sorted by distance and rating

```mermaid

graph TD
    subgraph API_Layer["API Layer (GraphQL/REST)"]
        API[Search Endpoint]
        %% style API fill:#e1f5fe,stroke:#039be5
    end

    subgraph Query_Engine["Query Engine (Critical Path)"]
        QE[SearchService]
        QE_C[Cache]
        QE_I[Index Manager]
        %% style QE fill:#c8e6c9,stroke:#2e7d32
        %% style QE_C fill:#fff3e0,stroke:#fb8c00
    end

    subgraph Data_Sources["Data Sources"]
        DS1[(Classes DB)]
        DS2[(Locations DB)]
        DS3[(Reviews Aggregates)]
        %% style DS1 fill:#ffcdd2,stroke:#e53935
        %% style DS2 fill:#ffcdd2,stroke:#e53935
        %% style DS3 fill:#ffcdd2,stroke:#e53935
    end

    subgraph Services["Domain Services"]
        SCHOOLS[Schools Service]
        CLASSES[Classes Service]
        REVIEWS[Reviews Service]
        %% style SCHOOLS fill:#d1c4e9,stroke:#673ab7
        %% style CLASSES fill:#d1c4e9,stroke:#673ab7
        %% style REVIEWS fill:#d1c4e9,stroke:#673ab7
    end

    API -->|1 Search Request| QE
    QE -->|2a Location Data| SCHOOLS
    QE -->|2b Class Metadata| CLASSES
    QE -->|2c Review Stats| REVIEWS
    SCHOOLS -->|3 Geospatial Query| DS2
    CLASSES -->|4 Class Filtering| DS1
    REVIEWS -->|5 Aggregates| DS3
    QE -.->|6 Cache Lookup| QE_C
    QE -.->|7 Index Updates| QE_I

    %% classDef critical fill:#c8e6c9,stroke:#2e7d32;
    %% classDef storage fill:#ffcdd2,stroke:#e53935;
    %% classDef api fill:#e1f5fe,stroke:#039be5;
    %% classDef service fill:#d1c4e9,stroke:#673ab7;
    %% classDef cache fill:#fff3e0,stroke:#fb8c00;

    note1["Query Engine Responsibilities:<br>- Coordinate filtering across domains<br>- Merge results from multiple sources<br>- Apply caching strategies<br>- Maintain search indexes"]:::notes
    note2["Key Data Flows:<br>1. API receives search request<br>2. Query engine decomposes into domain queries<br>3. Services access optimized data sources<br>4. Results merged and returned"]:::notes

    QE -.- note1
    API -.- note2
```