Build a full Next.js 14 (App Router) web application for a medical chest X-ray 
multi-label classification system. The app integrates with an existing FastAPI 
backend running at http://localhost:8000.

---

## BACKEND API CONTRACT

POST /api/analyze
- Request: multipart/form-data, field name "file" (PNG/JPG, max 10MB)
- Response JSON:
{
  "predictions": {
    "Atelectasis": bool, "Effusion": bool, "Fibrosis": bool,
    "Infiltration": bool, "Consolidation": bool, "Mass": bool,
    "Nodule": bool, "No_Finding": bool
  },
  "probabilities": {
    "Atelectasis": float, "Effusion": float, "Fibrosis": float,
    "Infiltration": float, "Consolidation": float, "Mass": float,
    "Nodule": float, "No_Finding": float
  },
  "gradcam_images": {
    "<label>": "data:image/png;base64,..."  // only for detected labels
  },
  "original_image": "data:image/png;base64,...",
  "roi_image": "data:image/png;base64,...",
  "report": "string (LLM-generated report in Bahasa Indonesia)",
  "processing_time_ms": int,
  "pipeline_steps": {
    "preprocess_ms": int, "segmentation_ms": int, "handcraft_ms": int,
    "deep_feature_ms": int, "fusion_ms": int, "classify_ms": int,
    "gradcam_ms": int, "report_ms": int
  },
  "coverage_pct": float
}

GET /api/health
- Response: { "status": "ready"|"loading", "models": { ... } }

GET /api/labels
- Response: { "labels": ["Atelectasis", ...] }

---

## FRONTEND LOGIC (compute on client from backend response)

Label groupings for disease summary cards:
  PNEUMONIA_LABELS = ["Infiltration", "Consolidation", "Nodule"]
  TB_LABELS = ["Infiltration", "Fibrosis", "Effusion", "Atelectasis", 
               "Consolidation", "Nodule", "Mass"]

For each group:
  - detected = any(predictions[label] === true for label in group)
  - Display as a summary card: "Possible Pneumonia" / "Possible TB" with
    detected/not-detected status only (no confidence percentage)
  - List which specific labels from the group were detected

---

## PAGES & LAYOUT

### Layout (all pages)
- Clean medical/clinical aesthetic: white background, subtle gray borders, 
  blue/teal accent (#0EA5E9 or similar)
- Navbar: logo "XRay AI" + tagline "Chest X-Ray Analysis System"
- Footer: disclaimer "This tool is for research purposes only. 
  Not a substitute for professional medical diagnosis."
- Responsive (mobile + desktop)

### Page 1: Home / Upload ( / )
- Hero section: title, short description of the system
- Upload area: drag-and-drop zone + click to browse
  - Accept: image/png, image/jpeg only
  - Show preview of uploaded image before submission
  - Show file name and size
- "Analyze" button: disabled until file selected
- While processing: full-screen overlay with step-by-step progress indicator
  showing pipeline stages (Preprocessing → Segmentation → Feature Extraction → 
  Classification → GradCAM → Report) with animated status
- On error: show toast notification with error message

### Page 2: Results ( /results )
State passed via URL or context (store result in sessionStorage).
Layout: two-column on desktop, single column on mobile.

LEFT COLUMN:
1. Image Viewer Panel
   - Tab switcher: "Original" | "ROI (Segmented)" 
   - Display selected base64 image, fit to container
   - Show lung coverage percentage below image

2. GradCAM Viewer Panel (only if gradcam_images not empty)
   - Title: "Activation Map (GradCAM)"
   - If multiple detected labels → show tab/pill selector per label
   - Display selected GradCAM heatmap image
   - Small legend explaining warm=high activation, cool=low activation

RIGHT COLUMN:
3. Disease Summary Cards (top)
   - Two large cards side by side: "Tuberculosis (TB)" and "Pneumonia"
   - Each card shows:
     - Disease name + icon
     - Status badge: "POSSIBLE" (orange/yellow) or "NOT DETECTED" (green)
     - List of contributing labels that were detected

4. Detailed Classification Results
   - Title: "Detailed Findings (8 Labels)"
   - For each of 8 labels, show a row with:
     - Label name
     - Horizontal probability bar (color: orange if detected, gray if not)
     - Probability percentage
     - Detected/Not detected badge
   - No_Finding shown last, separated with a divider

5. AI Report Panel
   - Title: "AI Generated Report" with robot/document icon
   - Display report text (formatted, preserve line breaks)
   - Disclaimer text below in small gray italic

6. Processing Info (collapsible/accordion)
   - Total processing time
   - Per-step breakdown as small stat chips

"Analyze Another Image" button → back to home, clear state

---

## TECHNICAL REQUIREMENTS

- Next.js 14 App Router (TypeScript)
- Tailwind CSS for styling
- No external UI component libraries (shadcn, MUI, etc.) — pure Tailwind only
- API calls via fetch() in a Next.js API route (/app/api/analyze/route.ts) 
  that proxies to FastAPI backend (to avoid CORS issues)
- Store result in sessionStorage on /results page load, 
  restore on refresh
- Loading states for all async operations
- TypeScript interfaces for all API response types
- Environment variable: NEXT_PUBLIC_API_URL=http://localhost:8000

---

## FILE STRUCTURE (suggested)
app/
  layout.tsx          — root layout with navbar + footer
  page.tsx            — upload page
  results/page.tsx    — results page
  api/analyze/route.ts — proxy to FastAPI
components/
  UploadZone.tsx
  ProgressOverlay.tsx
  ImageViewer.tsx
  GradCAMViewer.tsx
  DiseaseSummaryCard.tsx
  ClassificationTable.tsx
  ReportPanel.tsx
  ProcessingInfo.tsx
lib/
  types.ts            — TypeScript interfaces
  disease-groups.ts   — PNEUMONIA_LABELS, TB_LABELS, scoring logic
  api.ts              — fetch wrapper

---

## IMPORTANT NOTES
- All base64 images from backend are already complete data URIs 
  (prefixed with "data:image/png;base64,"), use directly in <img src>
- GradCAM images only exist for detected labels — handle empty object gracefully
- Report text is in Bahasa Indonesia — do not translate
- Backend runs on CPU, processing takes 8-15 seconds — 
  progress overlay must feel responsive even without real-time updates 
  (use timed/staged animation)
- Show medical disclaimer prominently on results page