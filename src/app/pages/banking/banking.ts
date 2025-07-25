import { Component, effect, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'page-banking',
  templateUrl: 'banking.html',
  styleUrls: ['banking.scss'],
  imports: [
    IonContent,
    IonToolbar,
    IonHeader,
    FormsModule,
    CommonModule
  ]
})
export class BankingPage {
  protected readonly title = signal('arthsetu');
  currentPage = signal('home');
  isListening = signal(false);
  spokenText = signal('');
  contacts = signal<any[]>([]);
  contactsLoading = signal(false);
  balance = signal(0);
  balanceLoading = signal(false);
  apiResponse = signal('');
  apiLoading = signal(false);
  selectedLang = signal('en-IN');
  langOptions = [
    { value: 'en-IN', label: 'English' },
    { value: 'hi-IN', label: 'Hindi' },
    { value: 'mr-IN', label: 'Marathi' }
  ];
  selectedContact = signal<any | null>(null);
  amount = signal<number>(0);
  transaction = signal<any | null>(null);
  transactions = signal<any[]>([]);

  constructor() {
    effect(() => {
      if (this.currentPage() === 'send-money') {
        this.fetchContacts();
      }
      if (this.currentPage() === 'check-balance') {
        this.fetchBalance();
      }
    });
  }

  fetchContacts() {
    this.contactsLoading.set(true);
    fetch('https://arthasetunode-282482783617.asia-south1.run.app/api/contacts')
      .then(res => res.json())
      .then(data => {
        this.contacts.set(data);
        this.contactsLoading.set(false);
      })
      .catch(() => {
        this.contacts.set([]);
        this.contactsLoading.set(false);
      });
  }

  fetchBalance() {
    this.balanceLoading.set(true);
    fetch('https://arthasetunode-282482783617.asia-south1.run.app/api/balance')
      .then(res => res.json())
      .then(data => {
        this.balance.set(data.balance);
        this.balanceLoading.set(false);
      })
      .catch(() => {
        this.balance.set(0);
        this.balanceLoading.set(false);
      });
  }

  startListening() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = this.selectedLang();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    this.isListening.set(true);
    this.spokenText.set('');
    this.apiResponse.set('');
    this.apiLoading.set(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.spokenText.set(transcript);
      this.isListening.set(false);
      this.sendToExternalApi(transcript);
    };
    recognition.onerror = (event: any) => {
      this.isListening.set(false);
      this.spokenText.set('');
      alert('Speech recognition error: ' + event.error);
    };
    recognition.onend = () => {
      this.isListening.set(false);
    };
    recognition.start();
  }

  sendToExternalApi(text: string) {
    this.apiLoading.set(true);
    const encoded = encodeURIComponent(text);
    const url = `https://arthasetunode-282482783617.asia-south1.run.app/api/voice-proxy?prompt=${encoded}`;
    fetch(url)
      .then(res => res.text())
      .then(data => {
        const cleaned = data
          .split('\n')
          .map(line => line.replace(/^data:/, '').trim())
          .filter(line => line.length > 0)
          .join(' ');
        this.apiResponse.set(cleaned);
        this.apiLoading.set(false);
        this.speakResponse(cleaned);
      })
      .catch(() => {
        this.apiResponse.set('Error contacting external API.');
        this.apiLoading.set(false);
      });
  }

  speakResponse(text: string) {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices);
      let utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = this.selectedLang();
      // Try to select a matching voice for the selected language
      const match = voices.find(v => v.lang === this.selectedLang());
      if (match) {
        utterance.voice = match;
      }
      window.speechSynthesis.speak(utterance);
    }
  }

  onLangChange(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    if (select) {
      this.selectedLang.set(select.value);
    }
  }

  onContactClick(contact: any) {
    this.selectedContact.set(contact);
    this.currentPage.set('send-money-detail');
  }

  onAmountInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.amount.set(Number(input.value) || 0);
    }
  }

  addAmount(val: number) {
    this.amount.set((this.amount() || 0) + val);
  }

  sendMoney() {
    const contact = this.selectedContact();
    const amount = this.amount();
    fetch('https://arthasetunode-282482783617.asia-south1.run.app/api/send-money', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, name: contact?.name, photo: contact?.photo })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          alert(data.error || 'Transaction failed');
          return;
        }
        this.transaction.set({
          id: data.transactionId,
          name: contact?.name,
          photo: contact?.photo,
          amount
        });
        this.balance.set(data.newBalance);
        this.currentPage.set('transaction-success');
      })
      .catch(() => {
        alert('Failed to send money. Please try again.');
      });
  }

  goHome() {
    this.currentPage.set('home');
    this.selectedContact.set(null);
    this.amount.set(0);
    this.transaction.set(null);
  }

  showTransactions() {
    fetch('https://arthasetunode-282482783617.asia-south1.run.app/api/transactions')
      .then(res => res.json())
      .then(data => {
        this.transactions.set(data);
        this.currentPage.set('transactions');
      })
      .catch(() => {
        alert('Failed to fetch transactions.');
      });
  }

  getTxnDate(txn: any): Date | null {
    if (!txn.timestamp) return null;
    if (typeof txn.timestamp.toDate === 'function') {
      return txn.timestamp.toDate();
    }
    if (txn.timestamp._seconds) {
      return new Date(txn.timestamp._seconds * 1000);
    }
    return null;
  }
}
