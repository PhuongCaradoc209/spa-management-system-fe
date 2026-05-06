# Swagger Annotations

## src/routes/appointments.routes.js

```yaml
tags:
  - name: Appointments
    description: Appointment booking and lifecycle
```

```yaml
/appointments:
  post:
    tags: [Appointments]
    summary: Create appointment (customer)
    description: Creates a new appointment for the authenticated customer with selected staff and services.
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [staffId, scheduledAt, serviceIds]
            properties:
              staffId:
                type: string
                description: Staff profile ID
              scheduledAt:
                type: string
                format: date-time
                example: "2026-04-20T10:00:00.000Z"
                description: Appointment start time in UTC
              serviceIds:
                type: array
                minItems: 1
                items:
                  type: string
                description: List of service IDs to include
              notes:
                type: string
                nullable: true
                description: Optional customer note
    responses:
      201:
        description: Appointment created
      400:
        description: Validation error
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Staff/service not found
      409:
        description: Conflict (overlap, out of working hours, or missing specialization)
```

```yaml
/appointments:
  get:
    tags: [Appointments]
    summary: List appointments (role-filtered)
    description: |
      Returns appointments scoped by role:
      - CUSTOMER: own appointments
      - STAFF: assigned appointments
      - ADMIN: all appointments
    security:
      - bearerAuth: []
    parameters:
      - in: query
        name: page
        schema:
          type: integer
          default: 1
        description: Page number (1-indexed)
      - in: query
        name: limit
        schema:
          type: integer
          default: 10
        description: Items per page (max 100)
      - in: query
        name: status
        schema:
          type: string
          enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW]
        description: Filter by appointment status
      - in: query
        name: date
        schema:
          type: string
          format: date
        example: "2026-04-20"
        description: Filter appointments by scheduled date (UTC day)
      - in: query
        name: staffId
        schema:
          type: string
        description: Admin-only filter by staff ID
      - in: query
        name: customerId
        schema:
          type: string
        description: Admin-only filter by customer ID
    responses:
      200:
        description: Appointment list
      400:
        description: Invalid query parameters
      401:
        description: Unauthorized
      403:
        description: Forbidden
```

```yaml
/appointments/{id}:
  get:
    tags: [Appointments]
    summary: Get appointment detail
    description: Returns appointment details if caller has permission (admin, assigned staff, or owner customer).
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: string
        description: Appointment ID
    responses:
      200:
        description: Appointment detail
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Appointment not found
```

```yaml
/appointments/{id}/status:
  patch:
    tags: [Appointments]
    summary: Update appointment status (staff/admin)
    description: Updates appointment workflow status with transition rules.
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: string
        description: Appointment ID
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [status]
            properties:
              status:
                type: string
                enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW]
                description: Next status according to allowed transitions
    responses:
      200:
        description: Appointment status updated
      400:
        description: Validation error
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Appointment not found
      409:
        description: Invalid transition or terminal status lock
```

```yaml
/appointments/{id}/cancel:
  patch:
    tags: [Appointments]
    summary: Cancel appointment (customer owner, assigned staff, or admin)
    description: Cancels an appointment with optional reason, if cancellation policy allows.
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: string
        description: Appointment ID
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              reason:
                type: string
                nullable: true
                description: Optional cancellation reason
    responses:
      200:
        description: Appointment cancelled
      400:
        description: Validation error
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Appointment not found
      409:
        description: Cancellation not allowed by status policy
```

```yaml
/appointments/{id}/invoice:
  post:
    tags: [Appointments, Invoices]
    summary: Generate (or fetch existing) invoice for a completed appointment
    description: |
      Idempotent. If an invoice already exists for the appointment, returns it with status 200.
      Otherwise creates a new invoice (status UNPAID) and returns 201. Appointment must be in COMPLETED state.
      Staff can only generate for appointments assigned to them; admins can generate any.
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema: { type: string }
        description: Appointment ID
    responses:
      200: { description: Existing invoice returned }
      201: { description: Invoice created }
      401: { description: Unauthorized }
      403: { description: Forbidden }
      404: { description: Appointment not found }
      409: { description: Appointment not yet completed }
```

## src/routes/auth.routes.js

```yaml
tags:
  - name: Auth
    description: Authentication endpoints
```

```yaml
/auth/register:
  post:
    tags: [Auth]
    summary: Register a customer user
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [email, password, firstName, lastName]
            properties:
              email: { type: string, format: email }
              password: { type: string, minLength: 8 }
              firstName: { type: string }
              lastName: { type: string }
              phone: { type: string }
    responses:
      201:
        description: Created
```

```yaml
/auth/login:
  post:
    tags: [Auth]
    summary: Login and get access token with refresh cookie
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [email, password]
            properties:
              email: { type: string, format: email }
              password: { type: string }
    responses:
      200:
        description: OK
        headers:
          Set-Cookie:
            schema:
              type: string
            description: HttpOnly refresh token cookie
```

```yaml
/auth/refresh:
  post:
    tags: [Auth]
    summary: Rotate refresh cookie and issue new access token
    description: Uses refresh token from HttpOnly cookie. Body refreshToken is optional fallback.
    responses:
      200:
        description: OK
        headers:
          Set-Cookie:
            schema:
              type: string
            description: Rotated HttpOnly refresh token cookie
```

```yaml
/auth/logout:
  post:
    tags: [Auth]
    summary: Revoke current refresh token and clear cookie
    description: Uses refresh token from HttpOnly cookie. Body refreshToken is optional fallback.
    responses:
      204:
        description: No Content
```

```yaml
/auth/logout-all:
  post:
    tags: [Auth]
    summary: Revoke all active sessions for current user
    security:
      - bearerAuth: []
    responses:
      204:
        description: No Content
      401:
        description: Unauthorized
```

## src/routes/invoices.routes.js

```yaml
tags:
  - name: Invoices
    description: Invoice + payment lifecycle (Stripe Checkout + cash)
```

```yaml
/invoices:
  get:
    tags: [Invoices]
    summary: List invoices (role-filtered)
    description: |
      Returns invoices scoped by role:
      - CUSTOMER: own invoices
      - STAFF: invoices for appointments assigned to them
      - ADMIN: all invoices
    security:
      - bearerAuth: []
    parameters:
      - in: query
        name: page
        schema: { type: integer, default: 1 }
      - in: query
        name: limit
        schema: { type: integer, default: 10 }
      - in: query
        name: status
        schema:
          type: string
          enum: [UNPAID, PARTIALLY_PAID, PAID, REFUNDED]
      - in: query
        name: appointmentId
        schema: { type: string }
    responses:
      200: { description: Invoice list }
      401: { description: Unauthorized }
      403: { description: Forbidden }
```

```yaml
/invoices/{id}:
  get:
    tags: [Invoices]
    summary: Get invoice detail
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema: { type: string }
    responses:
      200: { description: Invoice detail }
      401: { description: Unauthorized }
      403: { description: Forbidden }
      404: { description: Invoice not found }
```

```yaml
/invoices/{id}/checkout-session:
  post:
    tags: [Invoices]
    summary: Create a Stripe Checkout Session for this invoice
    description: |
      Creates a Stripe Checkout Session (mode=payment, VND by default) and returns the hosted checkout URL.
      Allowed for invoice owner (customer), assigned staff, or admin. 409 if invoice already PAID/REFUNDED.
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema: { type: string }
    requestBody:
      required: false
      content:
        application/json:
          schema:
            type: object
            properties:
              successUrl:
                type: string
                format: uri
              cancelUrl:
                type: string
                format: uri
    responses:
      201:
        description: Checkout session created
        content:
          application/json:
            schema:
              type: object
              properties:
                url: { type: string }
                sessionId: { type: string }
      401: { description: Unauthorized }
      403: { description: Forbidden }
      404: { description: Invoice not found }
      409: { description: Invoice not payable }
      500: { description: Stripe not configured }
```

```yaml
/invoices/{id}/mark-paid:
  patch:
    tags: [Invoices]
    summary: Mark invoice as paid offline (cash / bank transfer)
    description: |
      Staff/admin-only endpoint for offline payments. Adds the amount to `paidAmt` and flips status to
      PAID (when paidAmt >= totalAmt) or PARTIALLY_PAID. Mirrors status to the related appointment.
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema: { type: string }
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [amount]
            properties:
              amount:
                type: number
                description: Payment amount in VND (or the configured currency)
              paymentMethod:
                type: string
                enum: [CASH]
                default: CASH
              note:
                type: string
                nullable: true
    responses:
      200: { description: Invoice updated }
      400: { description: Validation error }
      401: { description: Unauthorized }
      403: { description: Forbidden }
      404: { description: Invoice not found }
      409: { description: Invoice not payable }
```

## src/routes/loyalty.routes.js

```yaml
tags:
  - name: Loyalty
    description: Loyalty score and tier endpoints
```

```yaml
/loyalty/me:
  get:
    tags: [Loyalty]
    summary: Get current customer loyalty score
    security:
      - bearerAuth: []
    responses:
      200:
        description: Loyalty score
      401:
        description: Unauthorized
      403:
        description: Forbidden
```

```yaml
/loyalty/customers/{customerId}:
  get:
    tags: [Loyalty]
    summary: Get loyalty score by customer ID (admin only)
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: customerId
        required: true
        schema:
          type: string
    responses:
      200:
        description: Loyalty score
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Customer not found
```

## src/routes/service-categories.routes.js

```yaml
tags:
  - name: ServiceCategories
    description: Service catalog categories
```

```yaml
/service-categories:
  get:
    tags: [ServiceCategories]
    summary: List service categories
    description: Public list of active categories. Admins may send Bearer token and query includeInactive=true to list all.
    parameters:
      - in: query
        name: includeInactive
        schema:
          type: string
          enum: [true, false]
        description: Admin only — when true, includes inactive categories
    responses:
      200:
        description: OK
```

```yaml
/service-categories:
  post:
    tags: [ServiceCategories]
    summary: Create category (admin)
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [name]
            properties:
              name: { type: string }
              description: { type: string, nullable: true }
              imageUrl: { type: string, format: uri, nullable: true }
              sortOrder: { type: integer }
              isActive: { type: boolean }
    responses:
      201:
        description: Created
      400:
        description: Validation error
      401:
        description: Unauthorized
      403:
        description: Forbidden
      409:
        description: Duplicate name
```

```yaml
/service-categories/{id}:
  get:
    tags: [ServiceCategories]
    summary: Get category by ID
    description: Public; returns active category and active services. Admin with includeInactive=true sees inactive records.
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: string
      - in: query
        name: includeInactive
        schema:
          type: string
          enum: [true, false]
    responses:
      200:
        description: OK
      404:
        description: Not found
```

```yaml
/service-categories/{id}:
  patch:
    tags: [ServiceCategories]
    summary: Update category (admin)
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: string
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              name: { type: string }
              description: { type: string, nullable: true }
              imageUrl: { type: string, format: uri, nullable: true }
              sortOrder: { type: integer }
              isActive: { type: boolean }
    responses:
      200:
        description: OK
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Not found
      409:
        description: Duplicate name
```

```yaml
/service-categories/{id}:
  delete:
    tags: [ServiceCategories]
    summary: Delete category (admin)
    description: Fails with 409 if any services still reference this category.
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: string
    responses:
      204:
        description: Deleted
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Not found
      409:
        description: Category still has services
```

## src/routes/services.routes.js

```yaml
tags:
  - name: Services
    description: Spa services catalog
```

```yaml
/services:
  get:
    tags: [Services]
    summary: List services
    description: |
      Public list of active services. Admins may send Bearer token and query includeInactive=true to list all.
      Supports filtering by categoryId, searching by name (q), and pagination.
    parameters:
      - in: query
        name: page
        schema:
          type: integer
          default: 1
        description: Page number (1-indexed)
      - in: query
        name: limit
        schema:
          type: integer
          default: 10
        description: Items per page (max 100)
      - in: query
        name: categoryId
        schema:
          type: string
        description: Filter by service category ID
      - in: query
        name: q
        schema:
          type: string
        description: Search services by name (case-insensitive substring match)
      - in: query
        name: includeInactive
        schema:
          type: string
          enum: [true, false]
        description: Admin only — when true, includes inactive services
    responses:
      200:
        description: OK
      400:
        description: Invalid query parameters
```

```yaml
/services:
  post:
    tags: [Services]
    summary: Create service (admin)
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [categoryId, name, durationMin, price]
            properties:
              categoryId:
                type: string
                description: Service category ID (must exist)
              name:
                type: string
                description: Service name
              description:
                type: string
                nullable: true
                description: Service description
              durationMin:
                type: integer
                description: Duration in minutes (positive integer)
              price:
                type: string
                description: Price as string with up to 2 decimal places (e.g., "99.99")
              imageUrl:
                type: string
                format: uri
                nullable: true
                description: Service image URL
              isActive:
                type: boolean
                default: true
                description: Whether service is active
    responses:
      201:
        description: Created
      400:
        description: Validation error
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Category not found
      409:
        description: Duplicate service name
```

```yaml
/services/{id}:
  get:
    tags: [Services]
    summary: Get service by ID
    description: Public; returns active service. Admin with includeInactive=true sees inactive services.
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: string
        description: Service ID
      - in: query
        name: includeInactive
        schema:
          type: string
          enum: [true, false]
        description: Admin only — when true, includes inactive services
    responses:
      200:
        description: OK
      404:
        description: Service not found
```

```yaml
/services/{id}:
  patch:
    tags: [Services]
    summary: Update service (admin)
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: string
        description: Service ID
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              categoryId:
                type: string
                description: Service category ID (must exist if provided)
              name:
                type: string
              description:
                type: string
                nullable: true
              durationMin:
                type: integer
              price:
                type: string
              imageUrl:
                type: string
                format: uri
                nullable: true
              isActive:
                type: boolean
    responses:
      200:
        description: OK
      400:
        description: Validation error or no fields to update
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Service or category not found
      409:
        description: Duplicate service name
```

```yaml
/services/{id}:
  delete:
    tags: [Services]
    summary: Delete service (admin)
    description: Fails with 403 if service is referenced by existing appointments.
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: string
        description: Service ID
    responses:
      204:
        description: Deleted
      401:
        description: Unauthorized
      403:
        description: Forbidden
      409:
        description: Service is referenced by appointments
      404:
        description: Service not found
```

## src/routes/staff-schedules.routes.js

```yaml
tags:
  - name: Staff Schedules
    description: Staff weekly schedule and availability
```

```yaml
/staff/{staffId}/schedules:
  get:
    tags: [Staff Schedules]
    summary: List weekly schedules for a staff member
    description: Admin can view any staff schedules. Staff can view only their own schedules.
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: staffId
        required: true
        schema:
          type: string
        description: Staff profile ID
    responses:
      200:
        description: Schedule list
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Staff not found
```

```yaml
/staff/{staffId}/schedules:
  post:
    tags: [Staff Schedules]
    summary: Create a staff schedule entry
    description: Admin can create schedules for any staff. Staff can create schedules only for themselves.
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: staffId
        required: true
        schema:
          type: string
        description: Staff profile ID
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [dayOfWeek, startTime, endTime]
            properties:
              dayOfWeek:
                type: integer
                minimum: 0
                maximum: 6
                description: Day of week in UTC (0=Sunday, 6=Saturday)
              startTime:
                type: string
                example: "09:00"
                description: Start time in HH:mm or HH:mm:ss
              endTime:
                type: string
                example: "18:00"
                description: End time in HH:mm or HH:mm:ss
              isWorkingDay:
                type: boolean
                default: true
                description: Marks this day as working/non-working
    responses:
      201:
        description: Schedule created
      400:
        description: Validation error
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Staff not found
      409:
        description: Duplicate schedule for same day
```

```yaml
/staff/{staffId}/schedules/{scheduleId}:
  patch:
    tags: [Staff Schedules]
    summary: Update a schedule entry
    description: Admin can update any staff schedule. Staff can update only their own schedule.
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: staffId
        required: true
        schema:
          type: string
        description: Staff profile ID
      - in: path
        name: scheduleId
        required: true
        schema:
          type: string
        description: Staff schedule ID
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              dayOfWeek:
                type: integer
                minimum: 0
                maximum: 6
              startTime:
                type: string
                example: "10:00"
              endTime:
                type: string
                example: "19:00"
              isWorkingDay:
                type: boolean
    responses:
      200:
        description: Schedule updated
      400:
        description: Validation error
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Schedule not found
      409:
        description: Duplicate schedule day
```

```yaml
/staff/{staffId}/schedules/{scheduleId}:
  delete:
    tags: [Staff Schedules]
    summary: Delete a schedule entry
    description: Admin can delete any schedule. Staff can delete only their own schedule.
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: staffId
        required: true
        schema:
          type: string
      - in: path
        name: scheduleId
        required: true
        schema:
          type: string
    responses:
      204:
        description: Schedule deleted
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Schedule not found
```

```yaml
/staff/{staffId}/availability:
  get:
    tags: [Staff Schedules]
    summary: Get staff availability for a date
    description: Returns whether staff works on that date and booked slots for the day.
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: staffId
        required: true
        schema:
          type: string
      - in: query
        name: date
        required: true
        schema:
          type: string
          format: date
        example: "2026-04-20"
        description: Target date in YYYY-MM-DD
    responses:
      200:
        description: Availability result
      400:
        description: Invalid date query
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: Staff not found
```

## src/routes/staff-specializations.routes.js

```yaml
tags:
  - name: Staff Specializations
    description: Manage staff-service relationships
```

```yaml
/staff/{staffId}/specializations:
  get:
    summary: Get all service specializations for a staff member
    tags: [Staff Specializations]
    parameters:
      - in: path
        name: staffId
        required: true
        schema:
          type: string
    responses:
      200:
        description: List of specializations
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  serviceId:
                    type: string
                  name:
                    type: string
                  price:
                    type: string
```

```yaml
/staff/{staffId}/specializations:
  post:
    summary: Add a service specialization to a staff member
    tags: [Staff Specializations]
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: staffId
        required: true
        schema:
          type: string
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [serviceId]
            properties:
              serviceId:
                type: string
    responses:
      201:
        description: Specialization added
      400:
        description: Validation error
      404:
        description: Staff or service not found
      409:
        description: Staff already has this specialization
```

```yaml
/staff/{staffId}/specializations/{serviceId}:
  delete:
    summary: Remove a service specialization from a staff member
    tags: [Staff Specializations]
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: staffId
        required: true
        schema:
          type: string
      - in: path
        name: serviceId
        required: true
        schema:
          type: string
    responses:
      204:
        description: Specialization successfully removed
      404:
        description: Staff or specialization not found
```

## src/routes/users.routes.js

```yaml
tags:
  - name: Users
    description: User endpoints
```

```yaml
/users/me:
  get:
    tags: [Users]
    summary: Get current user profile
    security:
      - bearerAuth: []
    responses:
      200:
        description: OK
      401:
        description: Unauthorized
```

```yaml
/users/me/profile:
  patch:
    tags: [Users]
    summary: Update current user profile by role
    description: Customer can update firstName, lastName, phone, dateOfBirth, notes. Staff can update firstName, lastName, phone, bio, isAvailable.
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              firstName: { type: string }
              lastName: { type: string }
              phone: { type: string }
              dateOfBirth: { type: string, format: date-time }
              notes: { type: string }
              bio: { type: string }
              isAvailable: { type: boolean }
    responses:
      200:
        description: Profile updated
      401:
        description: Unauthorized
      403:
        description: Forbidden
```

```yaml
/users:
  get:
    tags: [Users]
    summary: List users (admin only)
    security:
      - bearerAuth: []
    responses:
      200:
        description: Users list
      401:
        description: Unauthorized
      403:
        description: Forbidden
```

```yaml
/users:
  post:
    tags: [Users]
    summary: Create staff/admin user (admin only)
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [email, password, role]
            properties:
              email: { type: string, format: email }
              password: { type: string, minLength: 8 }
              role: { type: string, enum: [ADMIN, STAFF] }
              firstName: { type: string }
              lastName: { type: string }
              phone: { type: string }
              bio: { type: string }
              isAvailable: { type: boolean }
    responses:
      201:
        description: User created
      401:
        description: Unauthorized
      403:
        description: Forbidden
      409:
        description: Email already exists
```

```yaml
/users/{userId}:
  patch:
    tags: [Users]
    summary: Update user role or active status (admin only)
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: userId
        required: true
        schema:
          type: string
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              role: { type: string, enum: [ADMIN, STAFF, CUSTOMER] }
              isActive: { type: boolean }
    responses:
      200:
        description: User updated
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: User not found
```

```yaml
/users/{userId}:
  get:
    tags: [Users]
    summary: Get user by ID (self or admin)
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: userId
        required: true
        schema:
          type: string
    responses:
      200:
        description: User detail
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: User not found
```

```yaml
/users/{userId}:
  delete:
    tags: [Users]
    summary: Delete user account (admin only)
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: userId
        required: true
        schema:
          type: string
    responses:
      204:
        description: User deleted
      400:
        description: Cannot delete own account
      401:
        description: Unauthorized
      403:
        description: Forbidden
      404:
        description: User not found
```

## src/routes/webhooks.routes.js

```yaml
tags:
  - name: Webhooks
    description: External webhooks (Stripe)
```

```yaml
/webhooks/stripe:
  post:
    tags: [Webhooks]
    summary: Stripe webhook endpoint
    description: |
      Receives Stripe events. Expects the raw request body and a `stripe-signature` header.
      Handles `checkout.session.completed` to mark the invoice as PAID and sync the appointment.
      Stripe calls this endpoint directly; no bearer token is required.
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
    responses:
      200: { description: Event received }
      400: { description: Signature verification failed }
      500: { description: Stripe not configured or handler error }
```
