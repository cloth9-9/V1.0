# Janapriya Garments & Clothing Security Specification

## 1. Data Invariants
1. Products, Categories, Services, SiteSettings, and Reviews can ONLY be created, updated, or deleted by authorized admins (`isAdmin()`).
2. Public visitors can only READ published products (`resource.data.published == true`), published categories (`resource.data.published == true`), published services (`resource.data.published == true`), public site settings (`/siteSettings/public`), and authorized & published reviews (`resource.data.authorized == true && resource.data.published == true`).
3. Public visitors CANNOT read `/appointments`, `/enquiries`, or `/admins`. Customer personal data (name, phone, notes) is strictly protected from public inspection or scraping.
4. Public visitors can SUBMIT (create) an appointment request or enquiry, provided it validates strictly:
   - Initial status must strictly be `pending` for appointments and `new` for enquiries.
   - Public submissions cannot include admin fields (`internalNotes`).
   - Phone and name must meet string boundary constraints.
   - Document ID must meet `isValidId`.
5. Appointments and Enquiries can only be listed, read, updated, or deleted by authorized administrators.
6. The bootstrapped admin is `userhelpdesk9@gmail.com` with `email_verified == true`. Additional admins must exist in `/admins/{uid}` with `enabled == true`.

## 2. The "Dirty Dozen" Threat Payloads
1. **Public Product Tampering**: Anonymous client attempts `create` on `/products/p999` with price 0.
   - Expected: `PERMISSION_DENIED`
2. **Ghost Admin Escalation**: Normal user attempts `setDoc` on `/admins/{uid}` to make themselves admin.
   - Expected: `PERMISSION_DENIED`
3. **Public Appointment Scraping**: Anonymous client attempts `list` on `/appointments`.
   - Expected: `PERMISSION_DENIED`
4. **Enquiry PII Leak**: Anonymous client attempts `get` on `/enquiries/enq123`.
   - Expected: `PERMISSION_DENIED`
5. **Admin Email Spoofing**: User with unverified email `userhelpdesk9@gmail.com` attempts write to `/products`.
   - Expected: `PERMISSION_DENIED`
6. **Appointment Status Hijacking**: Anonymous client creates appointment with `status: "completed"`.
   - Expected: `PERMISSION_DENIED`
7. **Appointment Internal Notes Injection**: Anonymous client injects `internalNotes: "Bypassed"` during appointment creation.
   - Expected: `PERMISSION_DENIED`
8. **Draft Product Exposure**: Public visitor attempts `get` on `/products/draft_item` where `published == false`.
   - Expected: `PERMISSION_DENIED`
9. **Fake Review Injection**: Public visitor attempts `create` on `/reviews/fake1` with `authorized: true`.
   - Expected: `PERMISSION_DENIED`
10. **Site Settings Tampering**: Public visitor attempts `update` on `/siteSettings/public` to change WhatsApp number.
    - Expected: `PERMISSION_DENIED`
11. **Malicious Giant Payload (Denial of Wallet)**: Public visitor sends 1MB junk string as customerName.
    - Expected: `PERMISSION_DENIED`
12. **ID Poisoning Attack**: Public visitor attempts document creation with 500-character malicious path ID.
    - Expected: `PERMISSION_DENIED`
