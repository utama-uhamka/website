# Project Structure Overview

## Pages Directory Structure

```
src/pages/
├── Login.jsx                              # Login page (public)
├── Dashboard.jsx                          # Dashboard page
├── Settings.jsx                           # Settings page
├── BuildingManagement/
│   └── index.jsx                          # Building Management main page
│       (Campus → Building → Floor → Room navigation)
├── AssetManagement/
│   ├── Assets/
│   │   ├── index.jsx
│   │   ├── AssetList.jsx
│   │   └── AssetModal.jsx
│   ├── Employee/
│   │   ├── index.jsx
│   │   ├── EmployeeList.jsx
│   │   ├── EmployeeDetail.jsx (dengan calendar kehadiran)
│   │   └── EmployeeModal.jsx
│   ├── Campus/
│   │   ├── index.jsx
│   │   ├── CampusList.jsx
│   │   ├── CampusDetail.jsx
│   │   └── CampusModal.jsx
│   ├── Building/
│   │   ├── index.jsx
│   │   ├── BuildingList.jsx
│   │   ├── BuildingDetail.jsx
│   │   └── BuildingModal.jsx
│   ├── Floor/
│   │   └── FloorList.jsx
│   ├── Room/
│   │   ├── RoomList.jsx
│   │   └── RoomDetail.jsx (dengan asset management)
│   └── Event/
│       ├── index.jsx
│       ├── EventList.jsx
│       └── EventModal.jsx
└── Billing/
    ├── index.jsx
    ├── BillingIndex.jsx (tab PLN & PDAM)
    ├── PLN/
    │   ├── PLNBilling.jsx
    │   └── PLNModal.jsx
    └── PDAM/
        ├── PDAMBilling.jsx
        └── PDAMModal.jsx
```

## Sidebar Navigation Menu

```
Dashboard                    → /dashboard
Building Management          → /building-management
Asset Management             → /asset-management
Karyawan                     → /employee
Billing (PLN & PDAM)        → /billing
Settings                     → /settings
Sign Out                     (logout)
```

## Main Features

### 1. Building Management
- **Campus Management**: Tambah, edit, hapus kampus
- **Building Management**: Manage gedung per kampus
- **Floor Management**: Manage lantai per gedung
- **Room Management**: Manage ruangan dengan asset list

### 2. Asset Management
- **Asset List**: CRUD asset dengan filter kategori dan kondisi
- **Employee Management**: CRUD karyawan, view absensi calendar
- **Event Management**: CRUD event/acara

### 3. Billing Management
- **PLN Billing**: Manage tagihan listrik (kWh)
- **PDAM Billing**: Manage tagihan air (m³)
- Filter by status: Paid, Pending, Overdue

### 4. Settings
- User settings dan preferences

## Route Configuration (App.jsx)

```
/login                       → Login page (public)
/dashboard                   → Dashboard (protected)
/building-management/*       → Building Management (protected)
/asset-management            → Asset Management (protected)
/employee                    → Employee Management (protected)
/billing                     → Billing Management (protected)
/settings                    → Settings (protected)
/                            → Redirect to /dashboard
```

## Deleted Pages

✓ Ukm.jsx
✓ Event.jsx
✓ Inventory.jsx
✓ Issue.jsx
✓ Old Billing.jsx

## Component Hierarchy

```
MainLayout
├── Sidebar (dengan menu items baru)
├── Header
└── Main Content
    ├── Building Management
    │   └── (Campus → Building → Floor → Room)
    ├── Asset Management
    ├── Employee Management (dengan attendance calendar)
    ├── Billing Management (PLN & PDAM tabs)
    └── Settings
```
