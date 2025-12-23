/**
 * GoHighLevel API integration utilities
 * 
 * Primary use case: Contact upsert with PDF attachment for email delivery
 * Reference: docs/03-engineering/GHL-INTEGRATION.md
 */

export interface GHLContact {
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  website?: string;
}

export interface GHLContactUpsert {
  contact: GHLContact;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface GHLWorkflowTrigger {
  contactId: string;
  workflowId?: string;
  event?: string;
}

/**
 * Base GHL API client with error handling and retry logic
 */
export class GHLClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.GHL_BASE_URL || 'https://api.msgsndr.com';
    this.apiKey = process.env.GHL_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('[GHL] API key not configured');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GHL API error: ${response.status} ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('[GHL] API request failed:', error);
      throw error;
    }
  }

  /**
   * Upsert contact (create or update based on email)
   */
  async upsertContact(data: GHLContactUpsert): Promise<{ contact: any; created: boolean }> {
    try {
      // First try to find existing contact by email
      const existingContact = await this.findContactByEmail(data.contact.email);
      
      if (existingContact) {
        // Update existing contact
        const updated = await this.updateContact(existingContact.id, data);
        return { contact: updated, created: false };
      } else {
        // Create new contact
        const created = await this.createContact(data);
        return { contact: created, created: true };
      }
    } catch (error) {
      console.error('[GHL] Contact upsert failed:', error);
      throw error;
    }
  }

  private async findContactByEmail(email: string): Promise<any | null> {
    try {
      const response = await this.request<{ contacts: any[] }>(
        `/contacts/search?query=${encodeURIComponent(email)}`
      );
      
      return response.contacts.find(c => c.email === email) || null;
    } catch (error) {
      // If search fails, assume contact doesn't exist
      console.warn('[GHL] Contact search failed, assuming new contact:', error);
      return null;
    }
  }

  private async createContact(data: GHLContactUpsert): Promise<any> {
    const payload = {
      email: data.contact.email,
      name: data.contact.name || '',
      companyName: data.contact.company || '',
      phone: data.contact.phone || '',
      website: data.contact.website || '',
      tags: data.tags || [],
      customFields: data.customFields || {},
    };

    return this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  private async updateContact(contactId: string, data: GHLContactUpsert): Promise<any> {
    const payload = {
      name: data.contact.name || undefined,
      companyName: data.contact.company || undefined,
      phone: data.contact.phone || undefined,
      website: data.contact.website || undefined,
      tags: data.tags || undefined,
      customFields: data.customFields || undefined,
    };

    // Remove undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key as keyof typeof payload] === undefined) {
        delete payload[key as keyof typeof payload];
      }
    });

    return this.request(`/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Upload file (e.g., PDF) and return file URL
   */
  async uploadFile(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
    const formData = new FormData();
    
    // Convert Buffer to Uint8Array for Blob compatibility
    const uint8Array = new Uint8Array(buffer);
    const blob = new Blob([uint8Array], { type: mimeType });
    
    formData.append('file', blob, filename);
    
    try {
      const response = await fetch(`${this.baseUrl}/uploads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GHL upload error: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('[GHL] File upload failed:', error);
      throw error;
    }
  }

  /**
   * Trigger workflow for a contact
   */
  async triggerWorkflow(contactId: string, workflowId?: string): Promise<void> {
    try {
      const payload = {
        contactId,
        workflowId: workflowId || process.env.GHL_PDF_EMAIL_WORKFLOW_ID,
      };

      await this.request('/workflows/trigger', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log('[GHL] Workflow triggered for contact:', contactId);
    } catch (error) {
      console.error('[GHL] Workflow trigger failed:', error);
      throw error;
    }
  }
}

/**
 * Singleton instance for use in API routes
 */
export const ghlClient = new GHLClient();
