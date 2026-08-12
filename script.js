// ---- Configure the brand portfolio here. Add/remove entries to change the tabs. ----
const COMPANIES = [
  { id: "pride-global",     name: "Pride Global",                  accent: "#2F6F62" },
  { id: "russell-tobin",    name: "Russell Tobin and Associates",  accent: "#8B3A3A" },
  { id: "pride-one",        name: "Pride One",                     accent: "#3A5A8B" },
  { id: "pride-now",        name: "Pride Now",                     accent: "#C97A2B" },
  { id: "rocket-shippers",  name: "Rocket Shippers",               accent: "#6B4FA0" },
];

const DEFAULT_ADDRESS = "420 Lexington Avenue, 30th Floor\nNew York, NY 10170";
const TAGLINE = "Helping the world work";

// Per-company address memory, so each brand can carry its own address as you switch tabs.
const addressByCompany = {};
COMPANIES.forEach((c) => {
  addressByCompany[c.id] = DEFAULT_ADDRESS;
});

let activeCompanyId = COMPANIES[0].id;
let signatureMode = "type"; // "type" | "upload"
let uploadedSignatureDataUrl = null;

// ---- Element refs ----
const tabsEl = document.querySelector(".tab-row");

const employeeNameEl = document.getElementById("employeeName");
const clientNameEl = document.getElementById("clientName");
const roleEl = document.getElementById("role");
const letterDateEl = document.getElementById("letterDate");
const assignmentStartEl = document.getElementById("assignmentStart");
const assignmentEndEl = document.getElementById("assignmentEnd");

const engagementTypeEl = document.getElementById("engagementType");
const employmentTypeField = document.getElementById("employmentTypeField");
const employmentTypeEl = document.getElementById("employmentType");
const workLocationField = document.getElementById("workLocationField");
const workLocationEl = document.getElementById("workLocation");
const staffingPartnerField = document.getElementById("staffingPartnerField");
const staffingPartnerEl = document.getElementById("staffingPartner");
const contractingEntityField = document.getElementById("contractingEntityField");
const contractingEntityEl = document.getElementById("contractingEntity");

const payRateTypeEl = document.getElementById("payRateType");
const payRateAmountEl = document.getElementById("payRateAmount");
const scheduleRow = document.getElementById("scheduleRow");
const weeklyHoursEl = document.getElementById("weeklyHours");
const paymentFrequencyEl = document.getElementById("paymentFrequency");
const firstPaycheckField = document.getElementById("firstPaycheckField");
const firstPaycheckEl = document.getElementById("firstPaycheck");

const jobDescriptionEl = document.getElementById("jobDescription");
const benefitsInfoEl = document.getElementById("benefitsInfo");

const companyAddressEl = document.getElementById("companyAddress");

const signerNameEl = document.getElementById("signerName");
const signerTitleEl = document.getElementById("signerTitle");
const signerPhoneEl = document.getElementById("signerPhone");
const signerEmailEl = document.getElementById("signerEmail");
const sigFontEl = document.getElementById("sigFont");
const sigTypeField = document.getElementById("sigTypeField");
const sigUploadField = document.getElementById("sigUploadField");
const sigUploadEl = document.getElementById("sigUpload");
const segButtons = document.querySelectorAll(".seg-btn");

const previewMastheadName = document.getElementById("previewMastheadName");
const previewMastheadTagline = document.getElementById("previewMastheadTagline");
const previewDate = document.getElementById("previewDate");
const previewReturnCompany = document.getElementById("previewReturnCompany");
const previewReturnAddress = document.getElementById("previewReturnAddress");
const previewSubject = document.getElementById("previewSubject");
const previewBody = document.getElementById("previewBody");
const previewSignature = document.getElementById("previewSignature");
const previewSignerName = document.getElementById("previewSignerName");
const previewSignerContact = document.getElementById("previewSignerContact");
const previewSignerEmail = document.getElementById("previewSignerEmail");
const previewFooterCompany = document.getElementById("previewFooterCompany");
const previewFooterCity = document.getElementById("previewFooterCity");
const previewFooterStreet = document.getElementById("previewFooterStreet");

const printBtn = document.getElementById("printBtn");
const copyBtn = document.getElementById("copyBtn");
const copyStatus = document.getElementById("copyStatus");

// ---- Build tabs ----
function renderTabs() {
  tabsEl.innerHTML = "";
  COMPANIES.forEach((company) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tab";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", String(company.id === activeCompanyId));
    btn.dataset.companyId = company.id;
    btn.textContent = company.name;
    btn.title = company.name;
    btn.addEventListener("click", () => selectCompany(company.id));
    tabsEl.appendChild(btn);
  });
}

function getActiveCompany() {
  return COMPANIES.find((c) => c.id === activeCompanyId);
}

function selectCompany(id) {
  addressByCompany[activeCompanyId] = companyAddressEl.value;

  activeCompanyId = id;
  const company = getActiveCompany();

  companyAddressEl.value = addressByCompany[id];

  document.documentElement.style.setProperty("--accent", company.accent);
  document.documentElement.style.setProperty("--accent-soft", company.accent + "26");

  renderTabs();
  updatePreview();
}

// ---- Formatting helpers ----
function formatDateLong(value) {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatDateShort(value) {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  return `${m}/${d}/${y}`;
}

function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function firstNameOf(fullName) {
  const trimmed = (fullName || "").trim();
  return trimmed ? trimmed.split(/\s+/)[0] : "The employee";
}

function formatCurrency(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return null;
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ---- Sentence builders ----
function mainSentence(ctx) {
  const { engagement, employee, company, client, role, employmentType, workLocation, staffingPartner, contractingEntity } = ctx;
  const roleClause = role + (workLocation ? ` at ${workLocation}` : "");

  if (engagement === "c2c") {
    return `This letter is to confirm that ${employee} is employed by ${company.name} through our staffing partner, ${staffingPartner || "[Staffing Partner]"}, on assignment with one of our direct clients, ${client}, in the role of ${roleClause}.`;
  }

  if (engagement === "ic") {
    const first = firstNameOf(employee);
    return (
      `This letter is to confirm that ${employee} is working for one of our direct clients, ${client}, as a ${roleClause}. ` +
      `${first} has been working with ${company.name} as an Independent Contractor through ${contractingEntity || "[Contracting Entity]"}.`
    );
  }

  // W2
  return `This letter is to confirm that ${employee} is employed by ${company.name} as a ${employmentType} employee on assignment with one of our direct clients, ${client}, in the role of ${roleClause}.`;
}

function payScheduleParagraph(ctx) {
  const { engagement, payRateType, payRateAmount, weeklyHours, paymentFrequency, firstPaycheck } = ctx;
  const amt = formatCurrency(payRateAmount);
  if (!amt) return null; // omit entirely when no amount is entered

  let base;
  if (payRateType === "annual") base = `The annual salary paid for this role is ${amt}`;
  else if (payRateType === "daily") base = `The daily pay rate for this role is ${amt}`;
  else base = `The pay rate for this role is ${amt} per hour`;

  if (engagement === "w2" && weeklyHours && paymentFrequency) {
    base += `, with an anticipated work schedule of ${weeklyHours} hours per week and a ${paymentFrequency} payment frequency.`;
  } else {
    base += ".";
  }

  const sentences = [base];
  if (engagement === "w2" && firstPaycheck) {
    sentences.push(`The first paycheck will be processed on ${formatDateLong(firstPaycheck)}.`);
  }
  return sentences.join(" ");
}

function assignmentSentence(employee, startValue, endValue) {
  if (!startValue) return null;
  const first = firstNameOf(employee);
  const start = formatDateLong(startValue);
  if (endValue) {
    return `${first}'s assignment commenced on ${start}, and concluded on ${formatDateLong(endValue)}.`;
  }
  return `${first}'s assignment commenced on ${start}, and is currently active.`;
}

function gatherContext() {
  return {
    engagement: engagementTypeEl.value,
    company: getActiveCompany(),
    employee: employeeNameEl.value.trim() || "[Employee Name]",
    client: clientNameEl.value.trim() || "[Client Name]",
    role: roleEl.value.trim() || "[Role Title]",
    employmentType: employmentTypeEl.value,
    workLocation: workLocationEl.value.trim(),
    staffingPartner: staffingPartnerEl.value.trim(),
    contractingEntity: contractingEntityEl.value.trim(),
    payRateType: payRateTypeEl.value,
    payRateAmount: payRateAmountEl.value,
    weeklyHours: weeklyHoursEl.value,
    paymentFrequency: paymentFrequencyEl.value,
    firstPaycheck: firstPaycheckEl.value,
  };
}

// ---- Field visibility based on engagement type ----
function updateFieldVisibility() {
  const engagement = engagementTypeEl.value;
  employmentTypeField.hidden = engagement !== "w2";
  staffingPartnerField.hidden = engagement !== "c2c";
  contractingEntityField.hidden = engagement !== "ic";
  scheduleRow.hidden = engagement !== "w2";
  firstPaycheckField.hidden = engagement !== "w2";
}

// ---- Signature ----
function setSignatureMode(mode) {
  signatureMode = mode;
  segButtons.forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.sigMode === mode)));
  sigTypeField.hidden = mode !== "type";
  sigUploadField.hidden = mode !== "upload";
  updatePreview();
}

segButtons.forEach((btn) => btn.addEventListener("click", () => setSignatureMode(btn.dataset.sigMode)));

sigUploadEl.addEventListener("change", () => {
  const file = sigUploadEl.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    uploadedSignatureDataUrl = reader.result;
    updatePreview();
  };
  reader.readAsDataURL(file);
});

function renderSignature() {
  previewSignature.innerHTML = "";
  if (signatureMode === "upload" && uploadedSignatureDataUrl) {
    const img = document.createElement("img");
    img.src = uploadedSignatureDataUrl;
    img.alt = "Signature";
    previewSignature.appendChild(img);
  } else {
    const span = document.createElement("span");
    span.className = "typed-sig";
    span.style.fontFamily = sigFontEl.value;
    span.textContent = signerNameEl.value.trim() || "Signature";
    previewSignature.appendChild(span);
  }
}

// ---- Core render ----
function updatePreview() {
  const company = getActiveCompany();
  const ctx = gatherContext();

  document.documentElement.style.setProperty("--accent", company.accent);

  previewMastheadName.textContent = company.name;
  previewMastheadTagline.textContent = TAGLINE;

  previewDate.textContent = formatDateShort(letterDateEl.value);

  previewReturnCompany.textContent = company.name;
  previewReturnAddress.textContent = companyAddressEl.value.trim();

  previewSubject.textContent = `RE: ${ctx.employee}`;

  const paragraphs = [mainSentence(ctx), payScheduleParagraph(ctx), assignmentSentence(ctx.employee, assignmentStartEl.value, assignmentEndEl.value)].filter(
    Boolean
  );

  let bodyHtml = paragraphs.map((p) => `<p>${p}</p>`).join("");

  const jobDescriptionText = jobDescriptionEl.value.trim();
  if (jobDescriptionText) {
    bodyHtml += `<p class="sheet-section-title">Job Description</p><p>${jobDescriptionText}</p>`;
  }

  const benefitsText = benefitsInfoEl.value.trim();
  if (benefitsText) {
    bodyHtml += `<p>${benefitsText}</p>`;
  }

  previewBody.innerHTML = bodyHtml;

  renderSignature();
  previewSignerName.textContent = `${signerNameEl.value.trim() || "[Name]"} | ${signerTitleEl.value.trim() || "[Title]"}`;
  previewSignerContact.textContent = `Contact | ${signerPhoneEl.value.trim()}`;
  previewSignerEmail.textContent = `Email | ${signerEmailEl.value.trim()}`;

  const addressLines = companyAddressEl.value.trim().split("\n");
  previewFooterCompany.textContent = company.name;
  previewFooterCity.textContent = addressLines.slice(1).join(", ");
  previewFooterStreet.textContent = addressLines[0] || "";

  copyStatus.textContent = "";
}

// ---- Copy plain text ----
function buildPlainTextLetter() {
  const company = getActiveCompany();
  const ctx = gatherContext();

  const paragraphs = [mainSentence(ctx), payScheduleParagraph(ctx), assignmentSentence(ctx.employee, assignmentStartEl.value, assignmentEndEl.value)].filter(
    Boolean
  );

  let bodyText = paragraphs.join("\n\n");

  const jobDescriptionText = jobDescriptionEl.value.trim();
  if (jobDescriptionText) bodyText += `\n\nJob Description\n${jobDescriptionText}`;

  const benefitsText = benefitsInfoEl.value.trim();
  if (benefitsText) bodyText += `\n\n${benefitsText}`;

  const address = companyAddressEl.value.trim();
  const signatureLine = signatureMode === "type" ? (signerNameEl.value.trim() || "[Name]") : "[Signature image]";

  return [
    formatDateShort(letterDateEl.value),
    "",
    company.name,
    address,
    "",
    `RE: ${ctx.employee}`,
    "",
    bodyText,
    "",
    "Should you require any additional information, please feel free to contact the undersigned.",
    "",
    "Sincerely,",
    signatureLine,
    `${signerNameEl.value.trim() || "[Name]"} | ${signerTitleEl.value.trim() || "[Title]"}`,
    `Contact | ${signerPhoneEl.value.trim()}`,
    `Email | ${signerEmailEl.value.trim()}`,
  ].join("\n");
}

// ---- Wire up events ----
[
  employeeNameEl,
  clientNameEl,
  roleEl,
  letterDateEl,
  assignmentStartEl,
  assignmentEndEl,
  engagementTypeEl,
  employmentTypeEl,
  workLocationEl,
  staffingPartnerEl,
  contractingEntityEl,
  payRateTypeEl,
  payRateAmountEl,
  weeklyHoursEl,
  paymentFrequencyEl,
  firstPaycheckEl,
  jobDescriptionEl,
  benefitsInfoEl,
  companyAddressEl,
  signerNameEl,
  signerTitleEl,
  signerPhoneEl,
  signerEmailEl,
  sigFontEl,
].forEach((el) => el.addEventListener("input", updatePreview));

engagementTypeEl.addEventListener("input", () => {
  updateFieldVisibility();
  updatePreview();
});

printBtn.addEventListener("click", () => window.print());

copyBtn.addEventListener("click", async () => {
  const text = buildPlainTextLetter();
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = "Letter copied to clipboard.";
  } catch (err) {
    copyStatus.textContent = "Couldn't copy automatically — select and copy the preview manually.";
  }
  setTimeout(() => (copyStatus.textContent = ""), 3000);
});

// ---- Init ----
letterDateEl.value = todayISO();
document.documentElement.style.setProperty("--accent", getActiveCompany().accent);
updateFieldVisibility();
renderTabs();
updatePreview();
