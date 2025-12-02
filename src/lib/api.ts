import { authService } from './auth';

const LOANS_API_URL = 'https://functions.poehali.dev/f988b207-088e-4ea8-b22f-973a9f06acc9';
const REFERRALS_API_URL = 'https://functions.poehali.dev/7722ad06-a755-46eb-afe3-8cd3338d341c';
const CARD_API_URL = 'https://functions.poehali.dev/6b4c4b2a-e3ab-4a14-a254-adfab3583370';

export interface Loan {
  id: number;
  amount: number;
  term_days: number;
  interest_rate: number;
  interest_amount: number;
  total_repayment: number;
  paid_amount: number;
  purpose: string;
  status: string;
  created_at: string;
  due_date: string;
  approved_at?: string;
  disbursed_at?: string;
  repaid_at?: string;
}

export interface LoanStats {
  active_loans: number;
  active_amount: number;
  total_loans: number;
  completed_loans: number;
}

export interface ReferralStats {
  total_referrals: number;
  total_bonus: number;
  available_bonus: number;
}

export interface VirtualCard {
  id: number;
  card_number: string;
  card_number_masked: string;
  balance: number;
  status: string;
  created_at: string;
}

export interface CardTransaction {
  id: number;
  type: string;
  amount: number;
  phone?: string;
  comment?: string;
  status: string;
  created_at: string;
}

const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    'X-Auth-Token': token || '',
  };
};

export const loansAPI = {
  async create(amount: number, termDays: number, purpose: string) {
    const response = await fetch(LOANS_API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        action: 'create',
        amount,
        term_days: termDays,
        purpose,
      }),
    });
    return response.json();
  },

  async getAll(status?: string): Promise<{ success: boolean; loans: Loan[] }> {
    const url = status ? `${LOANS_API_URL}?status=${status}` : LOANS_API_URL;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async getById(loanId: number): Promise<{ success: boolean; loan: Loan }> {
    const response = await fetch(`${LOANS_API_URL}?loan_id=${loanId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async getStats(): Promise<{ success: boolean; stats: LoanStats }> {
    const response = await fetch(`${LOANS_API_URL}?stats=true`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

export const referralsAPI = {
  async getStats(): Promise<{
    success: boolean;
    referral_code: string;
    stats: ReferralStats;
  }> {
    const response = await fetch(`${REFERRALS_API_URL}?stats=true`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async getList() {
    const response = await fetch(`${REFERRALS_API_URL}?list=true`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async getBonusHistory() {
    const response = await fetch(`${REFERRALS_API_URL}?bonuses=true`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

export const cardAPI = {
  async getCard(): Promise<{ success: boolean; card: VirtualCard }> {
    const response = await fetch(CARD_API_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async getTransactions(): Promise<{
    success: boolean;
    transactions: CardTransaction[];
  }> {
    const response = await fetch(`${CARD_API_URL}?transactions=true`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async createSBPTransfer(phone: string, amount: number, comment: string) {
    const response = await fetch(CARD_API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        action: 'sbp_transfer',
        phone,
        amount,
        comment,
      }),
    });
    return response.json();
  },
};
