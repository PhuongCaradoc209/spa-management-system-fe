# Page API Mapping

> Comprehensive audit of all pages, their API integrations, and implementation status.
> Generated from: SWAGGER_ALL.md + code review of `src/`

---

## Authentication

### Page: `src/page/auth/login/index.tsx`

| API             | Method | Endpoint           | Status                                      |
| --------------- | ------ | ------------------ | ------------------------------------------- |
| Sign in         | POST   | `/auth/login`      | ✅ Integrated via `authService.login()`     |
| Register        | POST   | `/auth/register`   | ✅ Integrated via `authService.register()`  |
| Session refresh | POST   | `/auth/refresh`    | ✅ Integrated via `authService.refresh()`   |
| Sign out        | POST   | `/auth/logout`     | ✅ Integrated via `authService.logout()`    |
| Global sign out | POST   | `/auth/logout-all` | ✅ Integrated via `authService.logoutAll()` |

**Service:** [src/services/auth.service.ts](src/services/auth.service.ts) — `authService`

---

## Marketing / Discovery

### Page: `src/page/home/index.tsx`

| API               | Method | Endpoint              | Status                                                                               |
| ----------------- | ------ | --------------------- | ------------------------------------------------------------------------------------ |
| Featured services | GET    | `/services`           | ⚠️ Available in `serviceService.listServices()` — not yet integrated in UI           |
| Category browsing | GET    | `/service-categories` | ⚠️ Available in `serviceCategoryService.listCategories()` — not yet integrated in UI |

**Services:** [src/services/service.service.ts](src/services/service.service.ts) — `serviceService`, [src/services/service-category.service.ts](src/services/service-category.service.ts) — `serviceCategoryService`

---

## Customer Booking

### Page: `src/page/customer/booking/index.tsx`

| API                             | Method | Endpoint                        | Status                                                                         |
| ------------------------------- | ------ | ------------------------------- | ------------------------------------------------------------------------------ |
| Service types for dropdown      | GET    | `/services`                     | ⚠️ Available — not yet integrated                                              |
| Calendar events (role-filtered) | GET    | `/appointments`                 | ⚠️ Available — not yet integrated                                              |
| Book appointment                | POST   | `/appointments`                 | ⚠️ Available via `appointmentService.createAppointment()` — not yet integrated |
| Available slots for date        | GET    | `/staff/{staffId}/availability` | ⚠️ Available via `staffScheduleService.getAvailability()` — not yet integrated |

**Service:** [src/services/appointment.service.ts](src/services/appointment.service.ts) — `appointmentService`, [src/services/staff-schedule.service.ts](src/services/staff-schedule.service.ts) — `staffScheduleService`

---

## Customer Therapist Directory

### Page: `src/page/customer/therapist/index.tsx`

| API                       | Method | Endpoint                           | Status                                                                                            |
| ------------------------- | ------ | ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| Therapist specializations | GET    | `/staff/{staffId}/specializations` | ⚠️ Available via `staffSpecializationService.listSpecializations()` — not yet integrated          |
| Weekly schedule details   | GET    | `/staff/{staffId}/schedules`       | ⚠️ Available via `staffScheduleService.listSchedules()` — not yet integrated                      |
| Day availability          | GET    | `/staff/{staffId}/availability`    | ⚠️ Available via `staffScheduleService.getAvailability()` — not yet integrated                    |
| User list (admin-only)    | GET    | `/users`                           | 🚫 Not used — `userService.listUsers()` is admin-only, not suitable for customer-facing directory |

**Services:** [src/services/staff-specialization.service.ts](src/services/staff-specialization.service.ts) — `staffSpecializationService`, [src/services/staff-schedule.service.ts](src/services/staff-schedule.service.ts) — `staffScheduleService`

---

## Admin Dashboard

### Page: `src/page/admin/index.tsx`

#### Components & Hooks

| Component           | Hook                                                                                   | Purpose                                               |
| ------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `AdminStats`        | [useAdminStats](src/page/admin/hooks/useAdminStats.ts)                                 | Derives loyalty metrics from appointment/invoice data |
| `AdminChartSection` | [useAdminChartSection](src/page/admin/hooks/useAdminChartSection.ts) + `useAdminStats` | Member tier chart + revenue stats                     |
| `AdminHistoryTable` | [useAdminAppointments](src/page/admin/hooks/useAdminAppointments.ts)                   | Appointment list with filters, pagination, CRUD       |
| `AdminHistoryRow`   | (uses `useAdminAppointments` actions)                                                  | Row actions: view detail, complete, cancel, invoice   |

---

### API Integration Detail

#### 1. `useAdminAppointments` — [src/page/admin/hooks/useAdminAppointments.ts](src/page/admin/hooks/useAdminAppointments.ts)

| Action                    | API                                               | Method | Endpoint                     | Integrated |
| ------------------------- | ------------------------------------------------- | ------ | ---------------------------- | ---------- |
| List appointments         | `appointmentService.listAppointments()`           | GET    | `/appointments`              | ✅         |
| Get appointment detail    | `appointmentService.getAppointmentDetail()`       | GET    | `/appointments/{id}`         | ✅         |
| Update appointment status | `appointmentService.updateAppointmentStatus()`    | PATCH  | `/appointments/{id}/status`  | ✅         |
| Cancel appointment        | `appointmentService.cancelAppointment()`          | PATCH  | `/appointments/{id}/cancel`  | ✅         |
| Generate invoice          | `appointmentService.generateAppointmentInvoice()` | POST   | `/appointments/{id}/invoice` | ✅         |

**Used by:** `AdminHistoryTable` (list + filters + pagination), `AdminHistoryRow` (row actions)

---

#### 2. `useAdminChartSection` — [src/page/admin/hooks/useAdminChartSection.ts](src/page/admin/hooks/useAdminChartSection.ts)

| Derived Metric                          | Source API                                 | Notes                                              |
| --------------------------------------- | ------------------------------------------ | -------------------------------------------------- |
| Monthly appointment counts (chart bars) | `GET /appointments` (paginated, all pages) | Bucketed by month (JAN–JUN current year)           |
| Weekly goal progress                    | `GET /appointments`                        | % of completed appointments vs 20-appointment goal |

**Used by:** `AdminChartSection` — left panel (Member Tier Distribution chart + Weekly Goal)

---

#### 3. `useAdminStats` — [src/page/admin/hooks/useAdminStats.ts](src/page/admin/hooks/useAdminStats.ts)

| Stat Card              | Derived From                      | API Source          |
| ---------------------- | --------------------------------- | ------------------- |
| Total Points Issued    | `completedCount × 500`            | `GET /appointments` |
| Active Loyalty Members | Unique customers this month       | `GET /appointments` |
| Points Redeemed        | `totalPointsIssued × 0.35`        | `GET /appointments` |
| New Enrollments        | Unique customers this week        | `GET /appointments` |
| Total Revenue          | Sum of all invoice amounts        | `GET /invoices`     |
| Collected (Paid)       | Sum where status = PAID/COMPLETED | `GET /invoices`     |
| Pending                | Sum where status = PENDING/UNPAID | `GET /invoices`     |

**Used by:**

- `AdminStats` (top 4 metric cards: Points Issued, Active Members, Points Redeemed, New Enrollments)
- `AdminChartSection` (revenue stats row: Total Revenue, Collected, Pending)

---

### Enum Dependencies

| Enum                | File                                                                           | Used In                                                                                |
| ------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `AppointmentStatus` | [src/constant/enum/appointment.enum.ts](src/constant/enum/appointment.enum.ts) | `useAdminAppointments`, `useAdminChartSection`, `AdminHistoryRow`, `AdminHistoryTable` |
| `InvoiceStatus`     | [src/constant/enum/invoice.enum.ts](src/constant/enum/invoice.enum.ts)         | `useAdminStats`, `invoiceService`                                                      |
| `PaymentMethod`     | [src/constant/enum/invoice.enum.ts](src/constant/enum/invoice.enum.ts)         | `invoiceService`                                                                       |
| `UserRole`          | [src/constant/enum/user.enum.ts](src/constant/enum/user.enum.ts)               | `userService`                                                                          |
| `BooleanString`     | [src/constant/enum/boolean.enum.ts](src/constant/enum/boolean.enum.ts)         | — (not currently used)                                                                 |

---

## Unused / Available Services

These services exist but are not yet integrated into any page UI:

| Service                      | File                                                                                         | APIs                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `loyaltyService`             | [src/services/loyalty.service.ts](src/services/loyalty.service.ts)                           | `GET /loyalty/me`, `GET /loyalty/customers/{customerId}` |
| `userService`                | [src/services/user.service.ts](src/services/user.service.ts)                                 | Full CRUD for user management                            |
| `staffScheduleService`       | [src/services/staff-schedule.service.ts](src/services/staff-schedule.service.ts)             | Schedule management, availability                        |
| `staffSpecializationService` | [src/services/staff-specialization.service.ts](src/services/staff-specialization.service.ts) | Specialization management                                |
| `serviceService`             | [src/services/service.service.ts](src/services/service.service.ts)                           | Service listing                                          |
| `serviceCategoryService`     | [src/services/service-category.service.ts](src/services/service-category.service.ts)         | Category listing                                         |

---

## Missing API (Backend Needed)

- **`GET /admin/stats`** — Aggregate admin dashboard stats (total points, active members, points redeemed, enrollments) — currently derived client-side from paginated appointment data, which is inefficient
- **`GET /loyalty/stats`** — Aggregate loyalty program stats (total points, redemption rate, tier distribution) — currently estimated from appointment counts

---

## Admin Operation Management

### Page: `src/page/admin/operation-mng/index.tsx`

#### 1) Staff management — `StaffTable`

| Action                  | API                         | Method | Endpoint      | Integrated |
| ----------------------- | --------------------------- | ------ | ------------- | ---------- |
| List users              | `userService.listUsers()`   | GET    | `/users`      | ✅         |
| Create staff/admin user | `userService.createUser()`  | POST   | `/users`      | ✅         |
| Get user detail         | `userService.getUserById()` | GET    | `/users/{id}` | ✅         |
| Update role/active      | `userService.updateUser()`  | PATCH  | `/users/{id}` | ✅         |
| Delete user             | `userService.deleteUser()`  | DELETE | `/users/{id}` | ✅         |

**UI file:** [src/page/admin/operation-mng/components/StaffTable.tsx](src/page/admin/operation-mng/components/StaffTable.tsx)

#### 2) Service categories — `CategoriesTable`

| Action              | API                                          | Method | Endpoint                   | Integrated |
| ------------------- | -------------------------------------------- | ------ | -------------------------- | ---------- |
| List categories     | `serviceCategoryService.listCategories()`    | GET    | `/service-categories`      | ✅         |
| Create category     | `serviceCategoryService.createCategory()`    | POST   | `/service-categories`      | ✅         |
| Get category detail | `serviceCategoryService.getCategoryDetail()` | GET    | `/service-categories/{id}` | ✅         |
| Update category     | `serviceCategoryService.updateCategory()`    | PATCH  | `/service-categories/{id}` | ✅         |
| Delete category     | `serviceCategoryService.deleteCategory()`    | DELETE | `/service-categories/{id}` | ✅         |

**UI file:** [src/page/admin/operation-mng/components/CategoriesTable.tsx](src/page/admin/operation-mng/components/CategoriesTable.tsx)

#### 3) Services — `ServicesTable`

| Action             | API                                 | Method | Endpoint         | Integrated |
| ------------------ | ----------------------------------- | ------ | ---------------- | ---------- |
| List services      | `serviceService.listServices()`     | GET    | `/services`      | ✅         |
| Create service     | `serviceService.createService()`    | POST   | `/services`      | ✅         |
| Get service detail | `serviceService.getServiceDetail()` | GET    | `/services/{id}` | ✅         |
| Update service     | `serviceService.updateService()`    | PATCH  | `/services/{id}` | ✅         |
| Delete service     | `serviceService.deleteService()`    | DELETE | `/services/{id}` | ✅         |

**UI file:** [src/page/admin/operation-mng/components/ServicesTable.tsx](src/page/admin/operation-mng/components/ServicesTable.tsx)

#### 4) Staff schedules — `SchedulesTable`

| Action              | API                                     | Method | Endpoint                                  | Integrated |
| ------------------- | --------------------------------------- | ------ | ----------------------------------------- | ---------- |
| List staff (picker) | `staffService.listStaff()`              | GET    | `/staff`                                  | ✅         |
| List schedules      | `staffScheduleService.listSchedules()`  | GET    | `/staff/{staffId}/schedules`              | ✅         |
| Create schedule     | `staffScheduleService.createSchedule()` | POST   | `/staff/{staffId}/schedules`              | ✅         |
| Update schedule     | `staffScheduleService.updateSchedule()` | PATCH  | `/staff/{staffId}/schedules/{scheduleId}` | ✅         |
| Delete schedule     | `staffScheduleService.deleteSchedule()` | DELETE | `/staff/{staffId}/schedules/{scheduleId}` | ✅         |

**UI file:** [src/page/admin/operation-mng/components/SchedulesTable.tsx](src/page/admin/operation-mng/components/SchedulesTable.tsx)

**New service:** [src/services/staff.service.ts](src/services/staff.service.ts) — `staffService`
