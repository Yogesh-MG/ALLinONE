import random
import uuid
from faker import Faker
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import qrcode
from io import BytesIO
from django.core.files import File
import os
from hospitals.models import Hospital, Subscription
from employees.models import Employee
from device.models import Device, ServiceLog, Specification, Documentation, Calibration, IncidentReport
from inventory.models import Category, Unit, InventoryItem
from suppliers.models import Supplier, PurchaseOrder, PurchaseOrderItem
from tickets.models import Ticket, TicketComment
from compliance.models import ComplianceStandard, Audit, ComplianceDocument
from patient.models import Patient, EmergencyContact, Vital, MedicalHistory, Medication, Appointment
from django.conf import settings
from django.db import transaction

# Initialize Faker
fake = Faker('en_IN') # Using Indian locale for relevant addresses/phones if needed

# Ensure media directory exists
MEDIA_ROOT = getattr(settings, 'MEDIA_ROOT', 'media')
UPLOAD_DIR = os.path.join(MEDIA_ROOT, 'uploads', 'seed_files')
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ---------------------------------------------------------------------------
# REALISTIC MEDICAL DATA
# ---------------------------------------------------------------------------

# (These departments MUST match the 'department' choices in the Employee and Device models)
MEDICAL_DEPARTMENTS = ['cardiology', 'neurology', 'pediatrics', 'orthopedics', 'radiology', 'emergency', 'it', 'administration']

# (Device Name, Make/Model)
MEDICAL_DEVICES_BY_DEPT = {
    "radiology": [
        ("MRI Machine", "Siemens Magnetom Aera 1.5T"),
        ("CT Scanner", "GE Optima CT660"),
        ("Digital X-Ray Machine", "Philips DigitalDiagnost C90"),
        ("Ultrasound System", "Canon Aplio i800")
    ],
    "cardiology": [
        ("ECG Machine", "Philips PageWriter TC50"),
        ("Defibrillator", "Zoll R Series ALS"),
        ("Echocardiogram", "GE Vivid E95"),
        ("Stress Test System", "Mortara X-Scribe 5")
    ],
    "emergency": [
        ("Ventilator", "Dräger Evita V300"),
        ("Patient Monitor", "Philips IntelliVue MX700"),
        ("Infusion Pump", "B. Braun Infusomat"),
        ("Portable Defibrillator", "Zoll X Series"),
        ("Portable Ultrasound", "GE Vscan Air")
    ],
    "pediatrics": [
        ("Infant Incubator", "Dräger Babyleo TN500"),
        ("Phototherapy Unit", "Natus neoBLUE LED"),
        ("Pediatric Ventilator", "Hamilton-C1")
    ],
    "orthopedics": [
        ("C-Arm X-Ray", "Ziehm Vision RFD"),
        ("Surgical Drill System", "Stryker System 8"),
        ("Arthroscopy Tower", "Arthrex SynergyUHD4")
    ],
    "neurology": [
        ("EEG Machine", "Nihon Kohden Neurofax EEG-1200"),
        ("EMG Machine", "Cadwell Sierra Summit")
    ],
    # 'it' and 'administration' are left out as they have no medical devices
}

INVENTORY_CATEGORIES = [
    "Surgical Supplies", "Consumables", "Pharmaceuticals", "Lab Reagents", "PPE", "Implants", "Office Supplies"
]

INVENTORY_UNITS = [
    "Box (100 units)", "Each", "Pack (50 units)", "Vial", "Kit", "Case (12 units)", "Bottle"
]

# (Category, Item Name, Approx Cost)
MEDICAL_INVENTORY_ITEMS = {
    "Surgical Supplies": [("Sutures (Vicryl 3-0, Box 12)", 1800.00), ("Scalpel Blades (No. 10, Box 100)", 500.00), ("Bone Wax (Pack 12)", 3600.00)],
    "Consumables": [("Syringes (10ml, Box 100)", 500.00), ("IV Cannula (20G, Box 50)", 1250.00), ("ECG Electrodes (Pack 50)", 200.00)],
    "Pharmaceuticals": [("Paracetamol 500mg (Strip 10)", 30.00), ("Atorvastatin 20mg (Strip 10)", 100.00), ("Saline Solution (500ml Bottle)", 60.00)],
    "Lab Reagents": [("Hematology Reagent Kit", 5000.00), ("Blood Glucose Strips (Vial 50)", 800.00)],
    "PPE": [("N95 Masks (Box 50)", 1200.00), ("Sterile Gloves (Box 100 pairs)", 2000.00), ("Face Shields (Each)", 70.00)],
    "Implants": [("Hip Prosthesis (Titanium, Each)", 80000.00), ("Spinal Screw (Set)", 25000.00)],
    "Office Supplies": [("A4 Paper Ream", 350.00), ("Ballpoint Pens (Box 50)", 250.00)]
}

SERVICE_DETAILS_PM = [
    "Annual preventive maintenance completed. All checks passed.", "Performed functional checks and tests as per OEM protocol.",
    "Cleaned filters, checked all connections, and verified power levels.", "Calibrated sensors and updated device software to latest patch.", "Replaced standard PM kit components."
]
SERVICE_DETAILS_CORRECTIVE = [
    "Replaced faulty power supply unit (PSU-101).", "Repaired broken screen assembly. Part #SC-20A ordered.",
    "Resolved 'Error 501' by rebooting system and clearing cache.", "Replaced worn-out O2 sensor.", "Fixed fluid leak from main pump assembly."
]
INCIDENT_DESCRIPTIONS = [
    "Device failed to power on during morning checks.", "Unit displaying 'Error 203: Sensor Failure' intermittently.",
    "Screen is non-responsive to touch after cleaning.", "Loud grinding noise reported by staff during operation.", "Device performance reported as 'sluggish' by user."
]
COMPLIANCE_STANDARDS_LIST = [
    ("NABH Accreditation", "Compliant", 95),
    ("HIPAA Compliance (IT)", "Pending Review", 70),
    ("AERB Guidelines (Radiology)", "Require Attention", 45),
    ("Bio-Medical Waste Mgmt Rules", "Compliant", 100)
]

# ---------------------------------------------------------------------------
# HELPER FUNCTIONS
# ---------------------------------------------------------------------------

def create_dummy_file(filename):
    """Create a dummy file for FileField."""
    file_path = os.path.join(UPLOAD_DIR, filename)
    try:
        with open(file_path, 'w') as f:
            f.write(f"Dummy content for {filename}\nTimestamp: {timezone.now()}")
        
        # Re-open in 'rb' mode for Django File object
        f_rb = open(file_path, 'rb')
        return File(f_rb, name=filename)
    except Exception as e:
        print(f"Error creating dummy file {filename}: {e}")
        return None

# ---------------------------------------------------------------------------
# MAIN SEEDING FUNCTION
# ---------------------------------------------------------------------------

@transaction.atomic
def seed_data():
    print("Starting database seeding...")
    now = timezone.now()
    now_date = timezone.now().date()
    
    # Clear existing data in reverse dependency order
    models_to_clear = [
        ComplianceDocument, Audit, ComplianceStandard,
        TicketComment, Ticket,
        PurchaseOrderItem, PurchaseOrder, Supplier,
        InventoryItem, Unit, Category,
        IncidentReport, Calibration, Documentation, Specification, ServiceLog, Device,
        Appointment, Medication, MedicalHistory, Vital, EmergencyContact, Patient,
        Employee, Subscription, Hospital,
        User
    ]
    for model in models_to_clear:
        print(f"Clearing model: {model.__name__}...")
        if model == User:
            model.objects.exclude(is_superuser=True).delete()
        else:
            model.objects.all().delete()
    print("Existing data cleared.")

    # Clean up dummy files directory
    for f in os.listdir(UPLOAD_DIR):
        os.remove(os.path.join(UPLOAD_DIR, f))
    print("Cleared dummy files directory.")

    # Handle superuser creation/fetching
    if User.objects.filter(username='admin').exists():
        superuser = User.objects.get(username='admin')
        print("Superuser 'admin' already exists. Fetching.")
    else:
        superuser = User.objects.create_superuser(
            username='admin',
            email='admin@meditrackpro.com',
            password='admin123',
            first_name='Super',
            last_name='Admin'
        )
        print("Superuser created (admin / admin123).")

    # Lists to store created objects for relationships
    hospitals = []
    
    # Create 5 Hospitals
    for i in range(5):
        try:
            hospital = Hospital.objects.create(
                name=fake.company() + f" Hospital",
                hospital_type=random.choice(['General', 'Specialty', 'Clinic']),
                address=fake.address(),
                city=fake.city(),
                state=fake.state(),
                zipcode=fake.postcode(),
                phone_number=fake.phone_number()[:15],
                email=f"info@hospital{i+1}.com",
                admin=superuser,
                plan=random.choice(['basic', 'pro', 'premium']),
                payment_method=random.choice(['prepaid', 'cod', 'direct']),
                is_active=True,
                gstin=fake.bothify(text='??#####????#?#') # Format: 22AAAAA0000A1Z5
            )
            hospitals.append(hospital)
            print(f"Created hospital: {hospital.name}")

            # --- Create Subscription ---
            base_amt = random.uniform(4999, 19999)
            gst_amt = base_amt * 0.18
            Subscription.objects.create(
                hospital=hospital,
                plan=hospital.plan,
                start_date=timezone.now(),
                end_date=timezone.now() + timedelta(days=365),
                payment_status='paid',
                base_amount=round(base_amt, 2),
                gst_amount=round(gst_amt, 2),
                total_amount=round(base_amt + gst_amt, 2)
            )

            # --- Local lists for this hospital's objects ---
            hospital_employees = []
            hospital_engineers = []
            hospital_doctors = []
            hospital_patients = []
            hospital_categories = {} # Use dict for easy lookup
            hospital_units = []
            hospital_inventory_items = []
            hospital_suppliers = []
            hospital_devices = []

            # --- Create 10 Employees ---
            roles = ['doctor', 'nurse', 'staff', 'receptionist', 'other']
            for j in range(10):
                role = 'engineer' if j == 0 else random.choice(roles)
                username = f"{role}{j+1}.h{hospital.id}@{fake.domain_name()}"
                user = User.objects.create_user(
                    username=username,
                    email=username,
                    password='password123',
                    first_name=fake.first_name(),
                    last_name=fake.last_name()
                )
                employee = Employee.objects.create(
                    user=user,
                    hospital=hospital,
                    role=role,
                    department=random.choice(MEDICAL_DEPARTMENTS),
                    phone_number=fake.phone_number()[:15],
                    access_level=random.choice(['admin', 'full', 'standard', 'limited']),
                    status='active',
                    date_of_birth=fake.date_of_birth(minimum_age=22, maximum_age=65),
                    employee_id=f"H{hospital.id}-EMP{j+1:03d}"
                )
                hospital_employees.append(employee)
                if role == 'engineer':
                    hospital_engineers.append(employee)
                if role == 'doctor':
                    hospital_doctors.append(employee)
            
            print(f"Created {len(hospital_employees)} employees ({len(hospital_engineers)} engineers) for {hospital.name}")
            
            # --- Create 10 Patients (Kept your detailed logic) ---
            if not hospital_doctors:
                print(f"Warning: No doctors for {hospital.name}, patients will have no primary physician.")
            
            for j in range(10):
                include_insurance = random.choice([True, False])
                patient = Patient.objects.create(
                    hospital=hospital,
                    first_name=fake.first_name(),
                    last_name=fake.last_name(),
                    date_of_birth=fake.date_of_birth(minimum_age=1, maximum_age=80),
                    gender=random.choice(['male', 'female', 'other']),
                    email=fake.email(),
                    phone_number=fake.phone_number()[:15],
                    address=fake.street_address(),
                    city=fake.city(),
                    state=fake.state(),
                    postal_code=fake.postcode(),
                    country='India',
                    blood_type=random.choice(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
                    height=random.uniform(150, 200),
                    weight=random.uniform(50, 120),
                    primary_physician=random.choice(hospital_doctors) if hospital_doctors else None,
                    allergies=', '.join(fake.words(nb=random.randint(0, 2), ext_word_list=['Peanuts', 'Pollen', 'Dust', 'Penicillin'], unique=True)) or None,
                    medical_conditions=', '.join(fake.words(nb=random.randint(0, 2), ext_word_list=['Hypertension', 'Diabetes', 'Asthma'], unique=True)) or None,
                    insurance_provider=fake.company() + " Health" if include_insurance else None,
                    policy_number=fake.bothify(text='POL-#########') if include_insurance else None,
                    status='Active',
                    last_visit=fake.date_between(start_date=now_date - timedelta(days=365), end_date=now_date)
                )
                hospital_patients.append(patient)

                # Create 1-2 Emergency Contacts
                for _ in range(random.randint(1, 2)):
                    EmergencyContact.objects.create(
                        patient=patient, name=fake.name(), 
                        relationship=random.choice(['spouse', 'parent', 'sibling', 'friend']), 
                        phone=fake.phone_number()[:15])
                # Create 1-3 Vitals
                for _ in range(random.randint(1, 3)):
                    Vital.objects.create(patient=patient, 
                                         heart_rate=random.randint(60, 100), 
                                         blood_pressure=f"{random.randint(100, 140)}/{random.randint(60, 90)}", 
                                         temperature=round(random.uniform(97.0, 99.5), 1), 
                                         respiratory_rate=random.randint(12, 20), 
                                         oxygen_saturation=random.randint(95, 100), 
                                         recorded_at=timezone.make_aware(fake.date_time_between(start_date=now - timedelta(days=365), end_date=now)))
                # Create 1-3 Medical History Records
                for _ in range(random.randint(1, 3)):
                    MedicalHistory.objects.create(patient=patient, 
                                                  condition=random.choice(['Appendectomy', 'Tonsillitis', 'Broken Arm']), 
                                                  diagnosed_date=fake.date_between(start_date='-5y', end_date=now_date), 
                                                  status=random.choice(['Active', 'Resolved']), 
                                                  notes=fake.text(max_nb_chars=100))
                # Create 1-3 Medications
                for _ in range(random.randint(1, 3)):
                    Medication.objects.create(patient=patient, 
                                              name=random.choice(['Metformin', 'Amlodipine', 'Aspirin']), 
                                              dosage="500mg", frequency=random.choice(['Once daily', 'Twice daily']), 
                                              prescribed_by=random.choice(hospital_doctors) if hospital_doctors else None, 
                                              start_date=fake.date_between(start_date=now_date - timedelta(days=365), end_date=now_date)
                    )
                # Create 1-3 Appointments
                for _ in range(random.randint(1, 3)):
                    Appointment.objects.create(patient=patient, 
                                               doctor=random.choice(hospital_doctors) if hospital_doctors else None, 
                                               appointment_date=fake.date_between(start_date=now_date - timedelta(days=30), end_date=now_date + timedelta(days=30)), 
                                               appointment_time=fake.time(), 
                                               type=random.choice(['Consultation', 'Follow-up', 'Procedure']), 
                                               status=random.choice(['Scheduled', 'Completed', 'Canceled']))
            print(f"Created {len(hospital_patients)} patients with full medical records for {hospital.name}")

            # --- Create Categories ---
            for cat_name in INVENTORY_CATEGORIES:
                category = Category.objects.create(hospital=hospital, name=cat_name)
                # categories.append(category) # Global list not used, but ok
                hospital_categories[cat_name] = category # Local dict
            print(f"Created {len(hospital_categories)} inventory categories.")

            # --- Create Units ---
            hospital_units = []  # Ensure this is initialized as an empty list per hospital
            for unit_name in INVENTORY_UNITS:
                unit_name_unique = f"{unit_name} (H{hospital.id})"
                # Check if unit with this name already exists for this hospital
                existing_unit = Unit.objects.filter(hospital=hospital, name=unit_name_unique).first()
                if existing_unit:
                    unit = existing_unit  # Reuse existing
                    print(f"Reusing existing unit '{unit_name_unique}' for {hospital.name}")
                else:
                    unit = Unit.objects.create(hospital=hospital, name=unit_name_unique)  # Create new
                    print(f"Created new unit '{unit_name_unique}' for {hospital.name}")
                
                # Append to local list (safe even if reused, as it's unique by name)
                if unit not in hospital_units:  # Avoid accidental duplicates in the list
                    hospital_units.append(unit)
            print(f"Processed {len(hospital_units)} inventory units for {hospital.name} (duplicates skipped).")

            # --- Create Inventory Items ---
            for cat_name, items in MEDICAL_INVENTORY_ITEMS.items():
                if cat_name not in hospital_categories: continue
                for item_name, cost in items * 2: # Create 2 of each
                    item = InventoryItem.objects.create(
                        hospital=hospital,
                        name=item_name,
                        category=hospital_categories[cat_name],
                        quantity=random.randint(50, 200),
                        unit=random.choice(hospital_units),
                        reorder_level=random.randint(20, 50),
                        expiry_date=fake.date_between(start_date='today', end_date='+2y'),
                        location=f"{hospital_categories[cat_name].name[:4].upper()} Wing Storage",
                        sku=f"SKU-{fake.unique.ean(length=8)}",
                        barcode=fake.unique.ean13(),
                        cost=cost,
                        tax=18.0,
                        batch=fake.bothify(text='BAT-####??'),
                        description=f"Standard supply of {item_name}."
                    )
                    hospital_inventory_items.append(item)
            print(f"Created {len(hospital_inventory_items)} medical inventory items.")
            
            # --- Create 10 Suppliers ---
            for j in range(10):
                supplier_cats = random.sample(list(hospital_categories.values()), random.randint(1, 3))
                supplier = Supplier.objects.create(
                    hospital=hospital,
                    name=fake.company() + f" Medical Supplies",
                    contact_name=fake.name(),
                    contact_email=fake.email(),
                    contact_phone=fake.phone_number()[:20],
                    address=fake.address(),
                    reliability_score=random.randint(80, 100),
                    status='Active',
                    tax_id=fake.bothify(text='??#####????#?#'),
                    website=fake.url(),
                    supplier_type=supplier_cats[0].name,
                    payment_terms=random.choice(['Net 30', 'Net 60', 'COD']),
                    currency='INR',
                    approved=True
                )
                supplier.categories.set(supplier_cats)
                hospital_suppliers.append(supplier)
            print(f"Created {len(hospital_suppliers)} suppliers.")

            # --- Create Devices ---
            if not hospital_engineers:
                print(f"CRITICAL WARNING: No engineers for {hospital.name}. Assigning maintenance to random staff.")
                hospital_engineers = hospital_employees
            
            print(f"Creating medical devices for {hospital.name}...")
            for dept_name, device_list in MEDICAL_DEVICES_BY_DEPT.items():
                if dept_name not in MEDICAL_DEPARTMENTS:
                    continue 
                
                for device_name, make_model in device_list * 2: # Create 2 of each
                    nfc_uuid = str(uuid.uuid4())
                    install_date = fake.date_between(start_date='-5y', end_date='-1y')
                    
                    device = Device.objects.create(
                        hospital=hospital,
                        name=device_name,
                        make_model=make_model,
                        manufacture=make_model.split(' ')[0], # e.g., "Siemens"
                        serial_number=f"SER-{fake.unique.ean(length=13)}",
                        nfc_uuid=nfc_uuid,
                        date_of_installation=install_date,
                        warranty_until=install_date + timedelta(days=random.randint(365, 365*3)),
                        asset_number=f"ASSET-{fake.unique.bban()[:8]}",
                        asset_details=random.choice(['Excellent', 'Good', 'Fair']),
                        is_active=random.choice(['Operational', 'Operational', 'Needs_Calibration', 'Under_Maintenance']),
                        department=dept_name,
                        Room=f"{dept_name[:3].upper()}-{random.randint(101, 120)}",
                        next_calibration=fake.date_between(start_date='-30d', end_date='+180d')
                    )
                    hospital_devices.append(device)

                    # --- Create Device Sub-records ---
                    
                    # ServiceLog (PM)
                    ServiceLog.objects.create(
                        device=device,
                        service_date=fake.date_between(start_date=install_date, end_date='today'),
                        service_type="Preventive Maintenance",
                        engineer=random.choice(hospital_engineers),
                        service_details=random.choice(SERVICE_DETAILS_PM),
                        status='completed',
                        document=create_dummy_file(f"pm_log_{device.id}.txt")
                    )
                    if device.is_active == 'Under_Maintenance': # Corrective
                        ServiceLog.objects.create(
                            device=device,
                            service_date=timezone.now() - timedelta(days=random.randint(1,5)),
                            service_type="Corrective Maintenance",
                            engineer=random.choice(hospital_engineers),
                            service_details=random.choice(SERVICE_DETAILS_CORRECTIVE),
                            status='scheduled',
                            document=create_dummy_file(f"cm_log_{device.id}.txt")
                        )

                    # Specification
                    Specification.objects.create(
                        device=device,
                        power_supply=random.choice(["110V AC", "240V AC", "Internal Battery"]),
                        battery_type=random.choice(["Li-ion", "Lead-Acid", "N/A"]),
                        battery_life=f"{random.randint(1, 8)} hours" if "Portable" in device.name or "Pump" in device.name else "N/A",
                        weight=f"{random.uniform(5, 400):.1f} kg",
                        dimensions=f"{random.randint(30, 150)}x{random.randint(30, 100)}x{random.randint(30, 80)} cm",
                        conncetivity_options="DICOM, Wi-Fi, Ethernet" if dept_name == 'radiology' else "Wi-Fi, Bluetooth, USB",
                        certifications="CE, FDA, AERB" if dept_name == 'radiology' else "CE, FDA, ISO 13485"
                    )

                    # Documentation
                    Documentation.objects.create(
                        device=device,
                        document=f"{device.name} User Manual",
                        types="Manual",
                        storage_location=f"/docs/manuals/{device.id}_user.pdf" # Placeholder path
                    )
                    Documentation.objects.create(
                        device=device,
                        document=f"{device.name} Service Manual",
                        types="Service",
                        storage_location=f"/docs/service/{device.id}_service.pdf" # Placeholder path
                    )

                    # Calibration
                    Calibration.objects.create(
                        device=device,
                        calibration_date=timezone.now() - timedelta(days=random.randint(30, 180)),
                        next_calibration=device.next_calibration,
                        result="Pass" if device.is_active != 'Needs_Calibration' else "Fail",
                        notes="Performed annual calibration. All values within tolerance.",
                        engineer=random.choice(hospital_engineers),
                        status='completed',
                        document=create_dummy_file(f"cal_{device.id}.pdf")
                    )

                    # IncidentReport
                    for _ in range(random.randint(0, 2)):
                        IncidentReport.objects.create(
                            device=device,
                            incident_type=random.choice([t[0] for t in IncidentReport.INCIDENT_TYPES]),
                            description=random.choice(INCIDENT_DESCRIPTIONS),
                            reported_by=random.choice(hospital_employees),
                            related_employee=random.choice(hospital_engineers)
                        )
            print(f"Created {len(hospital_devices)} medical devices with full sub-records.")

            # --- Create 10 Purchase Orders ---
            if not hospital_suppliers:
                 print(f"Warning: No suppliers for {hospital.name}, skipping PO creation.")
            elif not hospital_inventory_items:
                print(f"Warning: No inventory items for {hospital.name}, skipping PO creation.")
            else:
                for j in range(10):
                    po = PurchaseOrder.objects.create(
                        hospital=hospital,
                        supplier=random.choice(hospital_suppliers),
                        status=random.choice(['DRAFT', 'SUBMITTED', 'RECEIVED', 'CANCELLED']),
                        order_date=fake.date_between(start_date='-60d', end_date='today'),
                        expected_delivery=fake.date_between(start_date='today', end_date='+30d'),
                        notes=fake.text(max_nb_chars=100)
                    )
                    for _ in range(random.randint(1, 5)):
                        item_to_order = random.choice(hospital_inventory_items)
                        qty = random.randint(1, 20)
                        PurchaseOrderItem.objects.create(
                            purchase_order=po,
                            inventory_item=item_to_order,
                            quantity=qty,
                            unit_price=item_to_order.cost,
                            received_quantity=random.randint(0, qty) if po.status != 'DRAFT' else 0
                        )
                print(f"Created 10 Purchase Orders.")

            # --- Create 20 Tickets ---
            if not hospital_devices:
                print(f"Warning: No devices for {hospital.name}, skipping Ticket creation.")
            else:
                for j in range(20):
                    try:
                        ticket_device = random.choice(hospital_devices)
                        ticket = Ticket.objects.create(
                            hospital=hospital,
                            title=f"Issue with {ticket_device.name}",
                            device=ticket_device,
                            category=random.choice([c[0] for c in Ticket.CATEGORY_CHOICES]),
                            priority=random.choice([p[0] for p in Ticket.PRIORITY_CHOICES]),
                            status=random.choice([s[0] for s in Ticket.STATUS_CHOICES]),
                            location=ticket_device.Room,
                            created_by=random.choice(hospital_employees),
                            assigned_to=random.choice(hospital_engineers),
                            description=random.choice(INCIDENT_DESCRIPTIONS)
                        )
                        # Add 1-3 comments
                        for _ in range(random.randint(1, 3)):
                            TicketComment.objects.create(
                                ticket=ticket,
                                author=random.choice(hospital_employees),
                                content=fake.text(max_nb_chars=150),
                                file=create_dummy_file(f"ticket_comment_{ticket.id}.txt") if random.choice([True, False]) else None
                            )
                    except Exception as e:
                        print(f"Error creating ticket: {e}")
                print(f"Created 20 Tickets with comments.")

            # --- Create Compliance Standards ---
            for name, status, progress in COMPLIANCE_STANDARDS_LIST:
                if "Radiology" in name and "radiology" not in [d.department for d in hospital_devices]:
                    continue # Don't add AERB if no radiology devices
                
                standard = ComplianceStandard.objects.create(
                    hospital=hospital,
                    name=name,
                    status=status,
                    progress=progress,
                    last_audit_date=timezone.make_aware(fake.date_time_between(start_date=now - timedelta(days=365), end_date=now - timedelta(days=30))),
                    next_audit_date=timezone.make_aware(fake.date_time_between(start_date=now, end_date=now + timedelta(days=365)))
                )
                # Create 1-2 Audits for this standard
                for _ in range(random.randint(1, 2)):
                    Audit.objects.create(
                        hospital=hospital,
                        Compliance_standard=standard,
                        title=f"{name} Audit - {fake.date()}",
                        audit_date=fake.date_between(start_date='-1y', end_date='+1y'),
                        status=random.choice(['Scheduled', 'Pending', 'Completed']),
                        auditor=fake.name(),
                        notes=fake.text(max_nb_chars=100)
                    )
                # Create 1-3 Docs for this standard
                for _ in range(random.randint(1, 3)):
                    ComplianceDocument.objects.create(
                        hospital=hospital,
                        Compliance_standard=standard,
                        name=f"{name} Policy Document",
                        file=create_dummy_file(f"compliance_doc_{standard.id}.pdf"),
                        status=random.choice(['Complete', 'In Progress', 'Require Attention'])
                    )
            print(f"Created Compliance Standards with audits and documents.")

        except Exception as e:
            print(f"\n---!!! ERROR processing hospital {i+1}: {e} !!!---\n")
            # This will roll back the transaction for this hospital
            raise e 

    print("Database seeded successfully!")

# ---------------------------------------------------------------------------
# MANAGEMENT COMMAND BOILERPLATE
# ---------------------------------------------------------------------------

from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Seed the database with dummy data for a medical ERM'

    def handle(self, *args, **kwargs):
        seed_data()
        self.stdout.write(self.style.SUCCESS('Successfully seeded the database'))