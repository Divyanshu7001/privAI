# privAI Project Architecture & User Request Flow

This document details the architecture, request flow, and data routing of the **privAI** privacy monitor assistant, including details on image/video risk analysis powered by Qwen 2.5 Vision.

---

## 1. Project Overview

`privAI` is a client-side privacy assistant designed to protect users in two ways:
1. **Posting Leak Prevention**: Intercepts and screens content (text and media) that the user is about to publish to prevent accidental data leaks.
2. **Feed Filtering Protection**: Screens content appearing on the user's feed, applying visual blur overlays to high-risk posts so that the user does not have to consume harmful or sensitive content.

The system consists of four main sub-systems:
* **WXT Browser Extension (`extension/`)**: Injects content scripts into platforms (LinkedIn, Facebook, Instagram) to monitor post creation and feeds.
* **React Frontend Dashboard (`frontend/`)**: Renders metrics, risk charts, and configures user privacy settings.
* **Node.js Express Backend (`backend/`)**: Manages the PostgreSQL database and session authentication using JWT cookies.
* **ML Backend (`ml-backend/`)**: Hosts the deep learning models for classification:
  * **Fine-Tuned DistilBERT**: Checks and flags privacy risks inside text snippets.
  * **Qwen 2.5 VL (Vision-Language)**: Extracts visual PII and computes risk factors from images and video frames.
  * **Faster-Whisper**: Transcribes video audio tracks.

### Avoiding Re-Analysis (Caching)
To ensure optimal performance and low latency, flagged posts and their analysis details are permanently saved in the PostgreSQL database. On subsequent loads, the system refers to these cached results to avoid re-analyzing the same posts.

---

## 2. User Request Flow

The operational flow spans user setup, active monitoring, and analytical reporting:

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Social as Social Page (DOM)
    participant Ext as Extension (Content/Popup)
    participant BG as Background Script
    participant Node as Express Backend
    participant ML as ML Backend (FastAPI)

    %% Step 1: Authentication & Sync
    User->>Node: Register & Login on Dashboard
    Node-->>User: Set pm_cookie (JWT, Expires in 5 Days)
    BG->>BG: Detect cookie change (cookies.onChanged)
    BG->>Node: GET /api/auth (Validate cookie JWT)
    Node-->>BG: Returns User Profile (name, email)
    BG->>BG: Save "isAuthenticated = true" and profile to local storage

    %% Step 2: Content script initialization on load
    Ext->>BG: Read allowed state & isAuthenticated
    alt Is Authenticated
        Ext->>Social: 1. setupMonitors() (Posting privacy checks)
        Ext->>Social: 2. startBlurringSimulation() (Feed filtering)
    else Not Authenticated
        Ext->>Social: 1. setupMonitors() (Posting privacy checks only)
    end

    %% Step 3: Flagged post detection & logging
    User->>Social: Clicks "Post/Share/Publish"
    Social->>Ext: Intercepts click & grabs text + media
    Ext->>ML: Sends text & video frames for analysis (DistilBERT / Qwen VL)
    ML-->>Ext: Returns risk remarks & analysis results
    alt Risk Detected (Simulation)
        Ext->>Social: Blur post content and overlay warning card
        Ext->>BG: sendMessage (privai:logIncident)
        BG->>Node: POST /api/risks (Log flagged incident with user_id)
        Node-->>BG: Incident stored in PostgreSQL DB
    end
```

---

## 3. Data Flow Diagram (DFD) Level 0

```mermaid
graph TD
    %% External Entities
    User((User))
    SocialDOM[Social Media DOM]

    %% Processes
    P1[Auth & Sync Engine]
    P2[Posting Scraper & Click Interceptor]
    P3[Feed Blurring & Simulation Engine]
    P4[Backend Controller]
    P5[ML Analysis Pipeline]

    %% Data Stores
    DS1[(chrome.storage.local)]
    DS2[(PostgreSQL Database)]
    DS3[(Browser Cookies)]

    %% Connections & Flows
    User -- "Credentials / Form Details" --> P4
    P4 -- "Set pm_cookie (JWT)" --> DS3
    
    P1 -- "Read cookie changes" --> DS3
    P1 -- "Validate JWT" --> P4
    P1 -- "Save auth state" --> DS1
    
    SocialDOM -- "Intercept post click" --> P2
    P2 -- "Read Exclusions" --> DS1
    P2 -- "Send media/text" --> P5
    
    P5 -- "Whisper Audio / Qwen 2.5 Vision" --> P5
    P5 -- "PII Remarks & Risk score" --> P2
    
    P2 -- "Trigger Warning overlay" --> SocialDOM
    P2 -- "privai:logIncident message" --> P1
    P1 -- "POST /api/risks" --> P4
    P4 -- "INSERT incident log" --> DS2
    
    DS1 -- "Check isAuthenticated" --> P3
    P3 -- "Blur & Simulated Block feed posts" --> SocialDOM
    
    User -- "Manage Exclusions & Profile" --> P4
    P4 -- "Read / Write Exclusions & Incidents" --> DS2
```

### Data Flow Diagram Schematic (DFD Level 0 - B/W)
![privAI DFD Level 0 Schematic (Black and White)](/C:/Users/DIVYANSHU/.gemini/antigravity-ide/brain/9ea4e804-4965-487f-ac3a-aa53c058ccd9/dfd_level0_bw_1783864431905.png)

---

## 4. Data Flow Diagram (DFD) Level 1

```mermaid
graph TD
    %% External Entities
    User((User))
    SocialDOM[Social Media DOM]

    %% Processes breakdown
    subgraph P1_Auth_Sync_Engine [Process 1.0: Auth & Sync Engine]
        P11[1.1 Read Cookies]
        P12[1.2 Verify JWT]
        P13[1.3 Save Auth State]
    end

    subgraph P2_Posting_Scraper [Process 2.0: Posting Scraper]
        P21[2.1 Intercept Composer events]
        P22[2.2 Parse Exclusions]
        P23[2.3 Package Telemetry]
    end

    subgraph P3_Feed_Blurring [Process 3.0: Feed Blurring & Simulation]
        P31[3.1 DOM Observer]
        P32[3.2 Auth Guard check]
        P33[3.3 Inject Warning overlay]
    end

    subgraph P4_Backend_Controller [Process 4.0: Backend Controller]
        P41[4.1 Profile CRUD]
        P42[4.2 Exceptions config API]
        P43[4.3 Risks Logger API]
    end

    subgraph P5_ML_Analysis [Process 5.0: ML Analysis Pipeline]
        P51[5.1 DistilBERT text scanner]
        P52[5.2 Whisper transcriber]
        P53[5.3 Qwen VL frame scanner]
    end

    %% Data Stores
    DS1[(chrome.storage.local)]
    DS2[(PostgreSQL Database)]
    DS3[(Browser Cookies)]

    %% DFD Level 1 connections
    User -- "Login Credentials" --> P41
    P41 -- "Set JWT cookie" --> DS3
    
    DS3 -- "Read cookie changes" --> P11
    P11 -- "Raw Cookie Token" --> P12
    P12 -- "GET /api/auth" --> P41
    P12 -- "Verified Account Data" --> P13
    P13 -- "Save state" --> DS1

    SocialDOM -- "Keydown/Paste/Click" --> P21
    P21 -- "Grab input" --> P23
    P22 -- "Query exclusions" --> DS1
    P23 -- "Post Payload" --> P51
    P23 -- "Video blob" --> P52
    P23 -- "Image frame" --> P53

    P51 -- "Risk Flag/PII Remarks" --> P21
    P52 -- "Voice Transcript" --> P51
    P53 -- "Visual PII Remarks" --> P21

    P21 -- "Log incident" --> P13
    P13 -- "POST /api/risks" --> P43
    P43 -- "INSERT flagged_posts" --> DS2

    SocialDOM -- "Mutation events" --> P31
    P31 -- "Analyze scrolled posts" --> P32
    P32 -- "Check state" --> DS1
    P32 -- "If Authed -> Block & blur" --> P33
    P33 -- "Apply CSS filter & alert card" --> SocialDOM

    User -- "Toggle Exceptions" --> P42
    P42 -- "UPDATE exceptions table" --> DS2
    User -- "View Incidents & Profile" --> P41
    P41 -- "SELECT users / risks" --> DS2
```

### Process Flow Schematic (DFD Level 1)
![privAI DFD Level 1 Schematic (Black and White)](/C:/Users/DIVYANSHU/.gemini/antigravity-ide/brain/9ea4e804-4965-487f-ac3a-aa53c058ccd9/dfd_level1_bw_1783863813347.png)

---

## 5. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    users {
        int id PK
        varchar username
        varchar work_email
        varchar password_hash
        text_array personal_emails
        text_array phones
        jsonb personal_address
        jsonb work_address
        timestamp created_at
    }
    exceptions {
        int user_id PK, FK
        boolean name
        boolean personal_email
        boolean work_email
        boolean phone
        boolean work_address
        text_array custom
    }
    flagged_posts {
        int id PK
        int user_id FK
        varchar type
        varchar platform
        text pii_remarks
        text post_title
        varchar user_action
        timestamp created_at
    }

    users ||--|| exceptions : "has preferences"
    users ||--o{ flagged_posts : "logs"
```

### Entity-Relationship Diagram Schematic (ERD - B/W)
![privAI ER Diagram Schematic (Black and White)](/C:/Users/DIVYANSHU/.gemini/antigravity-ide/brain/9ea4e804-4965-487f-ac3a-aa53c058ccd9/er_diagram_bw_1783864460847.png)

---

## 6. Black & White Architectural Diagrams

The database schemas, tech stacks, component architecture, and overall request flows are visually represented below in print-quality black and white schematics:

### 1. High-Level Architecture
![privAI High-Level Architecture (Black and White)](/C:/Users/DIVYANSHU/.gemini/antigravity-ide/brain/9ea4e804-4965-487f-ac3a-aa53c058ccd9/high_level_architecture_bw_1783865000794.png)

### 2. Tech Stack Block Diagram
![privAI Technology Stack (Black and White)](/C:/Users/DIVYANSHU/.gemini/antigravity-ide/brain/9ea4e804-4965-487f-ac3a-aa53c058ccd9/tech_stack_bw_1783865039208.png)

### 3. Frontend, Backend & Database Architecture
![privAI Component Architecture (Black and White)](/C:/Users/DIVYANSHU/.gemini/antigravity-ide/brain/9ea4e804-4965-487f-ac3a-aa53c058ccd9/frontend_backend_db_arch_bw_1783865069283.png)

### 4. Overall User POV Request Flow
![privAI User POV Request Flow (Black and White)](/C:/Users/DIVYANSHU/.gemini/antigravity-ide/brain/9ea4e804-4965-487f-ac3a-aa53c058ccd9/request_flow_user_pov_bw_1783865111259.png)

---

## 7. Model Verification & Pipeline

### Text Screening (DistilBERT)
* Draft captions, texts, and comments are passed to a fine-tuned **DistilBERT** classification model.
* It checks text content for sensitive keywords, security passcodes, project codenames, and private markers.

### Media Scanning (Qwen 2.5 VL & Whisper)
* **Audio Track**: Video audio is extracted and transcribed via **Faster-Whisper**.
* **Visual Frame Capture**: Images and video keyframes are sent to **Qwen 2.5 VL (Vision-Language)**.
* **PII Extraction**: The vision model extracts text and visual tags to flag badges, whiteboards, shipping labels, nameplates, and screens in the background showing sensitive documents.
* **Risk Severity**: A risk level is calculated dynamically and cached in PostgreSQL (`flagged_posts`) to avoid duplicate scans.
