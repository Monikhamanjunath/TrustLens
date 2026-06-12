# Security Specification for TrustLens Firestore Collections

## Data Invariants
1. **Scope Separation**: Every `ScanRecord` MUST belong to a specific Firebase UID (`userId`). Signed-in operators are permitted to perform reads and writes solely on their own records.
2. **Preference Isolation**: A user's preference record exists under `/preferences/{userId}`, matching the operator's actual UID to prevent tampering.
3. **Write Control**: Forensic scans are treated as historic immutable audits after creation; updates to `ScanRecord` are strictly blocked.
4. **Validation Strictness**: Fields must adhere to proper types, scores must range from 0.0 to 1.0, and timestamps must match `request.time`.

---

## The "Dirty Dozen" Threat Payloads (Blocked Gates)

1. **Spoofed Owner Creation**: Creating a `ScanRecord` with a `userId` that does not match `request.auth.uid`.
2. **Cross-User Scan Read**: Querying or requesting list details of scan records belonging to another operator.
3. **Scan Alteration**: Attempting to edit, modify, or inject ghost fields (e.g., changing classification on an existing scan).
4. **Scan Record Deletion**: Deleting completed forensic scans to erase audit logs (scans are write-once historical records).
5. **Preference Hijacking**: Reading or writing a Preference document under `/preferences/{otherUid}`.
6. **Poisoned ID Injection**: Using an invalid, massive, or character-unsafe document ID for scans (e.g. 1.5KB of junk characters).
7. **Negative Probability**: Injecting `is_synthetic_probability` less than 0 or greater than 1.0.
8. **Shadow Field Injection**: Adding unspec'd keys ("Ghost fields") to scan documents during creation.
9. **Fake Client Timestamp**: Providing a pre-computed client-side `createdAt` timestamp instead of the server's `request.time`.
10. **Unverified Status Bypass**: Operators attempting standard writes while having an unverified email token.
11. **Bypassing Core Keys Matching**: Omitting required fields like `fileName`, `fileType`, or `primary_classification` on scan insertion.
12. **Anonymous Access Breach**: Attempting reads or writes when `request.auth` is null (anonymous calls).

---

## Test Scenario Blueprint
A standalone verification suite would ensure all "Dirty Dozen" payloads result in `PERMISSION_DENIED` under all circumstances.

- **Operator A** cannot read `/scans/{scanId_B}`.
- **Operator A** cannot create `/preferences/OperatorB`.
- **Operator A** cannot delete `/scans/{scanId_A}`.
- All writes require `request.auth.token.email_verified == true`.
