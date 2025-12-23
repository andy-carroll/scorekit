# GoHighLevel Setup Guide for PDF Email Delivery

This guide walks you through configuring GoHighLevel to automatically send PDF reports to users who complete the assessment.

## Overview

The ScoreKit app will:

1. Generate a PDF report when a user completes the assessment
2. Upload the PDF to GHL
3. Create/update a contact in GHL with assessment data
4. Trigger a GHL workflow to email the PDF

## Step 1: Get GHL API Credentials

### 1.1 Find Your GHL Subdomain

1. Log into your GoHighLevel account
2. Look at your browser URL - it will be something like `your-company.gohighlevel.com`
3. Your subdomain is the part before `.gohighlevel.com` (e.g., `your-company`)

### 1.2 Generate API Key

1. In GHL, go to **Settings** → **API Settings**
2. Click **Generate API Key**
3. Copy the API key (you'll only see it once)
4. Save it somewhere secure for now

## Step 2: Configure Environment Variables

### 2.1 Create or Update .env.local

In your ScoreKit project root, create or edit `.env.local`:

```bash
# GoHighLevel Configuration
GHL_BASE_URL=https://api.msgsndr.com
GHL_API_KEY=your-api-key-here
GHL_PDF_EMAIL_WORKFLOW_ID=workflow-id-here
```

### 2.2 Replace with Your Values

- `GHL_API_KEY`: Paste the API key from Step 1.2
- `GHL_PDF_EMAIL_WORKFLOW_ID`: Leave empty for now, we'll get this in Step 4

### 2.3 Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
pnpm dev
```

## Step 3: Create Custom Fields in GHL

The ScoreKit app sends assessment data to GHL. You need to create custom fields to store this data.

### 3.1 Navigate to Custom Fields

1. In GHL, go to **Settings** → **Custom Fields**
2. Click **Add Custom Field**

### 3.2 Create the Following Fields

#### Field 1: Template ID

- **Field Type**: Text
- **Field Name**: `scorekit_template_id`
- **Display Name**: `ScoreKit Template ID`
- **Description**: Internal template identifier

#### Field 2: Overall Score

- **Field Type**: Number
- **Field Name**: `scorekit_overall_score`
- **Display Name**: `ScoreKit Overall Score`
- **Description**: Overall assessment percentage (0-100)

#### Field 3: Band

- **Field Type**: Text
- **Field Name**: `scorekit_band`
- **Display Name**: `ScoreKit Band`
- **Description**: Assessment band (Starting, Developing, Advancing, Leading)

#### Field 4: Primary Constraint

- **Field Type**: Text
- **Field Name**: `scorekit_primary_constraint`
- **Display Name**: `ScoreKit Primary Constraint`
- **Description**: Lowest scoring pillar area

#### Field 5: Pillar Scores

- **Field Type**: Text
- **Field Name**: `scorekit_pillar_scores`
- **Display Name**: `ScoreKit Pillar Scores`
- **Description**: JSON string of all pillar scores

#### Field 6: Report Token

- **Field Type**: Text
- **Field Name**: `scorekit_report_token`
- **Display Name**: `ScoreKit Report Token`
- **Description**: Unique report identifier

#### Field 7: PDF URL

- **Field Type**: Text
- **Field Name**: `scorekit_pdf_url`
- **Display Name**: `ScoreKit PDF URL`
- **Description**: Link to uploaded PDF file

#### Field 8: Completion Date

- **Field Type**: Date
- **Field Name**: `completed_at`
- **Display Name**: `Assessment Completion Date`
- **Description**: When the user completed the assessment

## Step 4: Create Email Workflow

### 4.1 Create New Workflow

1. In GHL, go to **Workflows** → **Create Workflow**
2. Choose **Start from Scratch**
3. Name it: `ScoreKit PDF Email Delivery`

### 4.2 Set Trigger

1. Click **Add Trigger**
2. Select **Webhook**
3. Copy the **Workflow ID** from the URL or workflow settings
4. Add this ID to your `.env.local` file:

   ```bash
   GHL_PDF_EMAIL_WORKFLOW_ID=paste-workflow-id-here
   ```

### 4.3 Add Email Action

1. Click **+ Add Action**
2. Select **Send Email**
3. Configure the email:

#### Email Settings

- **From**: Your business email
- **To**: Contact Email
- **Subject**: `Your AI Readiness Report from ScoreKit`

#### Email Content

```text
Hi {{contact.name}},

Thank you for completing the AI Readiness assessment!

Your personalized report is ready. I've attached a PDF copy for your records.

Key highlights:
- Overall Score: {{contact.scorekit_overall_score}}%
- Current Stage: {{contact.scorekit_band}}
- Primary Focus Area: {{contact.scorekit_primary_constraint}}

You can view your full report anytime at: https://your-domain.com/report/{{contact.scorekit_report_token}}

Next steps:
1. Review your top priority areas in the report
2. Download the PDF for future reference
3. Consider booking a strategy session to dive deeper

Best regards,
The ScoreKit Team
```

### 4.4 Add PDF Attachment

1. In the email action, click **Add Attachment**
2. Select **Custom Field**
3. Choose `scorekit_pdf_url`
4. Set attachment name: `AI-Readiness-Report-{{contact.name}}.pdf`

### 4.5 Activate Workflow

1. Click **Save** in the top right
2. Toggle the workflow to **Active**

## Step 5: Test the Integration

### 5.1 Complete the Assessment

1. Go to your ScoreKit app
2. Complete the full assessment flow
3. Enter your email at the email gate
4. Submit to view your report

### 5.2 Check GHL

1. In GHL, go to **Contacts**
2. Search for the email you used
3. Verify the contact was created/updated with:
   - All custom fields populated
   - Tags applied (score-band-x, primary-constraint-y, scorekit-assessment-completed)

### 5.3 Check Email

1. Check your email inbox
2. Verify you received the email with PDF attachment
3. Check that the PDF opens correctly

## Step 6: Troubleshooting

### Common Issues

#### Issue: "GHL API key not configured"

**Solution**: Check your `.env.local` file and restart the dev server

#### Issue: Contact created but no email sent

**Solution**:

1. Verify workflow is active
2. Check workflow ID in `.env.local` matches GHL workflow
3. Check GHL workflow logs for errors

#### Issue: PDF attachment missing

**Solution**:

1. Verify `scorekit_pdf_url` field is populated
2. Check email action attachment settings
3. Verify PDF uploaded successfully to GHL

#### Issue: Custom fields empty

**Solution**:

1. Verify field names exactly match what's in the code
2. Check custom fields are created in GHL
3. Check field permissions allow API updates

### Debugging Tips

- Check browser console for JavaScript errors
- Check server logs for API call errors
- Test with a fresh email address
- Verify all environment variables are set correctly

## Step 7: Go Live

Once testing is complete:

1. **Update Production Environment Variables**
   - Add the same GHL environment variables to your production hosting
   - For Vercel: Go to Settings → Environment Variables
   - For other hosting: Follow their environment variable setup

2. **Test Production**
   - Deploy your changes
   - Test the full flow on the production site
   - Verify emails are sent from production

3. **Monitor**
   - Check GHL contact creation for a few days
   - Monitor email delivery rates
   - Watch for any error patterns

## Quick Reference

### Environment Variables Needed

```bash
GHL_BASE_URL=https://api.msgsndr.com
GHL_API_KEY=your-api-key
GHL_PDF_EMAIL_WORKFLOW_ID=your-workflow-id
```

### Custom Fields to Create

- `scorekit_template_id` (Text)
- `scorekit_overall_score` (Number)
- `scorekit_band` (Text)
- `scorekit_primary_constraint` (Text)
- `scorekit_pillar_scores` (Text)
- `scorekit_report_token` (Text)
- `scorekit_pdf_url` (Text)
- `completed_at` (Date)

### Workflow Setup

- Trigger: Webhook
- Action: Send Email with PDF attachment
- Status: Active

That's it! Your ScoreKit app will now automatically send PDF reports via GHL whenever users complete the assessment.
